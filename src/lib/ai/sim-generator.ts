import Anthropic from "@anthropic-ai/sdk";
import { ollamaChat, isOllamaAvailable, OLLAMA_MODELS } from "./ollama";

function getAnthropic() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
}

function buildSimPrompt(topic: string, context: string, engineInstructions: string): string {
  return `Generate a PREMIUM-QUALITY, self-contained HTML file for an interactive educational simulation about: "${topic}"

Context: ${context}

${engineInstructions}

== DESIGN PHILOSOPHY ==
Think of this as a PhET simulation meets a Bloomberg terminal — professional, data-rich, and deeply interactive.
The student should feel like a SCIENTIST running experiments, not a passive viewer watching an animation.

== LAYOUT (use CSS Grid or Flexbox) ==
┌────────────────────────────────┬──────────────────┐
│                                │  CONTROLS PANEL  │
│      MAIN CANVAS/SIMULATION    │  - Sliders       │
│      (65% width, full height)  │  - Buttons       │
│                                │  - Value displays │
├────────────────────────────────┤  - Mini graph    │
│      REAL-TIME DATA BAR        │                  │
│      (computed values ticker)  │                  │
└────────────────────────────────┴──────────────────┘

== VISUAL DESIGN ==
- Background: #0f172a (dark navy)
- Panel backgrounds: #1e293b with border: 1px solid #334155
- Primary accent: #38bdf8 (sky blue) — for active elements, selected states
- Secondary: #4ade80 (green) — for positive values, success states
- Tertiary: #fb923c (orange) — for warnings, high values
- Danger: #f87171 (red) — for forces, critical states
- Text: #f8fafc (primary), #94a3b8 (secondary/labels)
- Border radius: 12px on panels, 8px on buttons, 4px on inputs
- Font: system-ui, -apple-system
- Sliders: custom styled with colored thumb matching the quantity color
- Buttons: gradient backgrounds with hover glow effects
- Add subtle box-shadow: 0 4px 20px rgba(0,0,0,0.3) on panels

== INTERACTIVE CONTROLS (minimum 4) ==
Each slider MUST have:
- A descriptive label (e.g., "Launch Angle")
- Real-time value display with UNITS (e.g., "45°", "9.8 m/s²")
- A colored thumb that matches the quantity's color coding
- Min/max/step attributes with physically meaningful ranges
Also include:
- ▶ Play / ⏸ Pause toggle button
- 🔄 Reset button (resets all parameters to default)
- Optional: ⏩ Speed control (0.5x, 1x, 2x)

== CANVAS REQUIREMENTS ==
- Draw coordinate axes with labeled tick marks and units
- Show vector arrows (force, velocity, acceleration) with magnitude labels
- Draw trajectory paths/traces with fading trail effect
- Add grid lines (subtle, #1e293b color)
- Animate smoothly at 60fps using requestAnimationFrame or p5.js draw()
- Include a real-time mini-graph (bottom-right corner or in controls panel) showing one plotted quantity vs time
- Color-code vectors: RED = force/acceleration, BLUE = velocity, GREEN = displacement/position, ORANGE = energy

== DATA DISPLAY ==
Show a "Live Data" section in the controls panel with:
- Current time (with elapsed timer during animation)
- Key computed values updating each frame (with units)
- Energy bar (kinetic vs potential) where applicable
- Use monospace font for numbers for clean alignment

== EDUCATIONAL FEATURES ==
- Show the governing equation prominently (e.g., F = ma)
- When paused, show annotation arrows explaining what's happening
- Include a "hint" or "did you know?" tooltip that appears on hover
- Label important points (max height, equilibrium, etc.) directly on canvas

== CODE QUALITY ==
- Use const/let (never var)
- Organize code into clear sections: // === SETUP === // === PHYSICS === // === RENDERING === // === UI ===
- Use requestAnimationFrame for smooth animation (or p5.js draw loop)
- Handle edge cases (values going off-screen, division by zero)
- Make canvas responsive with resize handlers

Output ONLY the complete HTML code. Start with <!DOCTYPE html> and end with </html>.
Do NOT wrap in markdown code blocks.`;
}

function validateAndCleanHtml(html: string): string {
  let cleaned = html.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```html?\n?/, "").replace(/\n?```$/, "");
  }
  if (!cleaned.includes("<!DOCTYPE html>") && !cleaned.includes("<html")) {
    throw new Error("Generated content is not valid HTML");
  }
  return cleaned;
}

async function generateWithClaude(prompt: string): Promise<string> {
  const message = await getAnthropic().messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 12000,
    messages: [{ role: "user", content: prompt }],
  });
  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type from Claude");
  return validateAndCleanHtml(content.text);
}

async function generateWithOpenAI(prompt: string): Promise<string> {
  const OpenAI = (await import("openai")).default;
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 12000,
    messages: [
      {
        role: "system",
        content: "You are a WORLD-CLASS educational simulation developer who builds PhET-quality interactive simulations. Generate complete, self-contained HTML files with stunning dark-themed UIs, smooth 60fps animations, and scientifically accurate physics. Output ONLY raw HTML — no markdown, no explanation.",
      },
      { role: "user", content: prompt },
    ],
  });
  const text = response.choices[0].message.content || "";
  return validateAndCleanHtml(text);
}

export async function generateSimulation(
  topic: string,
  context: string,
  engine: "p5js" | "threejs" | "d3" = "p5js"
): Promise<string> {
  const engineInstructions = getEngineInstructions(engine);
  const prompt = buildSimPrompt(topic, context, engineInstructions);

  // 1️⃣ Try Ollama coder (free, local) — give it 45s for premium quality
  if (await isOllamaAvailable()) {
    try {
      const raw = await ollamaChat(
        OLLAMA_MODELS.coder,
        [
          {
            role: "system",
            content: "You are a WORLD-CLASS educational simulation developer who builds PhET-quality interactive simulations. You produce stunning, professional HTML files with buttery-smooth animations, beautiful dark UIs, and scientifically accurate physics. Output ONLY raw HTML starting with <!DOCTYPE html>. No markdown, no code blocks, no explanation. Every simulation you build is a masterpiece.",
          },
          { role: "user", content: prompt },
        ],
        { temperature: 0.4, timeout: 45_000 }
      );
      return validateAndCleanHtml(raw);
    } catch (err) {
      console.warn("Ollama sim failed, trying Claude/GPT-4o:", (err as Error).message);
    }
  }

  // 2️⃣ Try Claude
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      return await generateWithClaude(prompt);
    } catch (err) {
      console.warn("Claude sim generation failed, falling back to GPT-4o:", (err as Error).message);
    }
  }

  // 3️⃣ GPT-4o fallback
  return await generateWithOpenAI(prompt);
}

function getEngineInstructions(engine: "p5js" | "threejs" | "d3"): string {
  switch (engine) {
    case "p5js":
      return `Use p5.js library (CDN: https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js)
REQUIRED p5.js patterns:
- Use setup() with createCanvas(container.offsetWidth, container.offsetHeight) inside a specific div
- Use draw() loop with background() to clear each frame
- Implement windowResized() { resizeCanvas(container.offsetWidth, container.offsetHeight); }
- Use HTML sliders/buttons OUTSIDE the canvas (in a styled panel div), NOT p5.js createSlider()
- Use push()/pop() for isolated transformations
- Use map() for scaling values to pixel coordinates
- Use lerp() for smooth transitions
- For trails: store array of past positions, draw with decreasing alpha
- For vectors: use line() + custom arrowhead with triangle()
- For graphs: use a secondary area (either a canvas region or a mini-canvas)
- IMPORTANT: Put the canvas in a div with id="sim-container", controls in div with id="controls-panel"`;

    case "threejs":
      return `Use Three.js library (CDN: https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js)
Also include OrbitControls: https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js
REQUIRED Three.js patterns:
- Create scene, camera (PerspectiveCamera), renderer (WebGLRenderer with antialias:true)
- Add OrbitControls for mouse interaction (rotate, zoom, pan)
- Lighting: AmbientLight(0x404040) + DirectionalLight(0xffffff, 1) at position(5,10,5)
- Use MeshPhongMaterial or MeshStandardMaterial (never MeshBasicMaterial for 3D objects)
- Add AxesHelper(5) and GridHelper(20, 20) for orientation
- Animate with requestAnimationFrame
- Add HTML overlay div for controls panel (position: absolute, right: 0)
- Handle window resize: update camera.aspect, renderer.setSize`;

    case "d3":
      return `Use D3.js library (CDN: https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js)
REQUIRED D3.js patterns:
- Create responsive SVG with viewBox and preserveAspectRatio
- Use scales (d3.scaleLinear) for proper data-to-pixel mapping
- Add axes with d3.axisBottom/axisLeft with tick formatting
- Use transitions (d3.transition().duration(300)) for smooth updates
- Implement drag behavior (d3.drag()) for direct manipulation
- Use d3.line() with curve interpolation for smooth paths
- Add tooltips on mouseover with foreignObject or positioned divs
- Color scales: d3.scaleSequential(d3.interpolateViridis) for continuous data
- Group elements with <g> tags and transform for organization`;
  }
}

export async function generateSimulationForMechanism(
  device: string,
  principle: string,
  complexity: number
): Promise<string> {
  const detailLevel = complexity <= 2 ? "simple, visual, minimal math" :
                      complexity <= 4 ? "moderate detail, include key equations" :
                      "advanced, full mathematical model, professional-grade";

  return generateSimulation(
    `How ${device} works — ${principle}`,
    `This simulation explains the working principle of a ${device}, specifically focusing on ${principle}. 
Detail level: ${detailLevel}.
The student should be able to adjust parameters and see how the system responds in real-time.
Include realistic values and units where applicable.`,
    "p5js"
  );
}

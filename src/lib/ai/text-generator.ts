import OpenAI from "openai";
import { Difficulty } from "@/types";
import { ollamaChat, ollamaStream, isOllamaAvailable, OLLAMA_MODELS } from "./ollama";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
}

export interface GeneratedExplanation {
  hook: string;          // Real-world connection opener
  explanation: string;   // Core concept in markdown
  math_section?: string; // LaTeX formulas if applicable
  summary: string;       // Key takeaways
  analogy: string;       // Simple analogy
}

export async function generateExplanation(
  query: string,
  subject: string,
  topics: string[],
  complexity: Difficulty
): Promise<GeneratedExplanation> {
  const systemPrompt = `You are a LEGENDARY professor creating the most comprehensive, textbook-quality content for Indian students preparing for JEE Advanced, NEET, and GATE. Your content rivals HC Verma, Irodov, Resnick-Halliday, Morrison & Boyd, and coaching institute materials from Allen, FIITJEE, Resonance, and Physics Wallah.

ABSOLUTE REQUIREMENTS — FOLLOW EVERY SINGLE ONE:

1. HOOK (3-5 sentences): A jaw-dropping real-world connection with SPECIFIC numbers/facts. Not generic — cite actual research, engineering applications, or historical discoveries. Example: "When Felix Baumgartner jumped from 39km altitude in 2012, he reached 1,357.64 km/h — breaking the sound barrier with just his body. The air resistance he experienced followed a quadratic drag model where $F_d = \\frac{1}{2}\\rho v^2 C_d A$, and at that altitude $\\rho$ was only 0.004 kg/m³ compared to 1.225 at sea level."

2. EXPLANATION (1500-2500 words MINIMUM — this is NON-NEGOTIABLE):
   Write like a comprehensive textbook chapter. Include ALL of the following:
   
   ## Historical Context & Discovery
   - Who discovered/formulated this? When? What problem were they solving?
   - Key experiments that led to this understanding
   
   ## Fundamental Concepts (First Principles)
   - Start from the absolute basics — define every term precisely
   - Build up conceptually step by step
   - Use numbered reasoning chains
   
   ## Detailed Theory
   - Complete theoretical framework with all conditions and assumptions stated
   - Multiple worked examples with actual numbers (JEE Advanced difficulty)
   - Limiting cases and boundary conditions
   - Connection to other topics (cross-referencing)
   
   ## Applications & Problem-Solving Strategies
   - Standard problem types encountered in JEE/GATE
   - Step-by-step solving methodology
   - Shortcuts and tricks used by toppers
   - Common traps set by examiners
   
   ## Advanced Extensions
   - What happens at extreme values?
   - Relativistic/quantum corrections if applicable
   - Research frontiers and unsolved problems
   
   ## Common Mistakes & Misconceptions
   - Top 5 mistakes students make (with explanations of WHY they're wrong)
   - Tricky conceptual questions that test deep understanding
   
   FORMAT: Use **bold** for key terms, ## and ### for sub-sections, numbered lists for steps, $LaTeX$ for all math inline, $$LaTeX$$ for display equations. Include derivations INLINE in the explanation.

3. MATH_SECTION (Complete mathematical treatment):
   - State all assumptions and conditions
   - Complete step-by-step derivation — EVERY step shown with justification
   - Use proper LaTeX: $$F = ma$$, $\\frac{d^2x}{dt^2}$, $\\vec{F} = m\\vec{a}$
   - Show dimensional analysis
   - Include at least 2 alternate derivation approaches if they exist
   - Box the final key results: $$\\boxed{E = mc^2}$$
   - Include important special cases and limits
   - Numerical example with full working

4. SUMMARY: 8-10 bullet points covering key takeaways, important formulas, and exam tips

5. ANALOGY: A vivid, multi-layered analogy (not just one sentence — develop it with 3-4 specific parallels between the analogy and the physics)

SUBJECT: ${subject}
TOPICS: ${topics.join(", ")}
COMPLEXITY: ${complexity}/10 (1=school basics, 5=JEE Mains, 7=JEE Advanced, 9=GATE/Olympiad, 10=Research-level)

IMPORTANT: For complexity >= 5, include JEE Previous Year style problems within the explanation. For complexity >= 7, include Irodov/Krotov level conceptual challenges. NEVER be superficial — every statement must be backed by reasoning.

Return ONLY valid JSON (no markdown fences):
{
  "hook": "3-5 sentences with specific numbers, experiments, or applications",
  "explanation": "1500-2500 word comprehensive textbook-quality markdown with ## headings, derivations, examples, misconceptions",
  "math_section": "Complete mathematical framework with $$LaTeX$$ derivations, multiple approaches, worked examples. null if purely conceptual",
  "summary": "8-10 bullet point key takeaways with formulas and exam tips",
  "analogy": "Multi-layered vivid analogy with 3-4 specific parallels developed in detail"
}`;

  let rawJson = "";

  // Primary: Ollama (free, private) — use smart model for quality
  if (await isOllamaAvailable()) {
    try {
      rawJson = await ollamaChat(
        OLLAMA_MODELS.smart,
        [{ role: "system", content: systemPrompt }, { role: "user", content: `Generate an extremely detailed, textbook-quality lesson on: ${query}` }],
        { format: "json", temperature: 0.7, timeout: 60_000 }
      );
    } catch (err) {
      console.warn("Ollama explanation failed, using OpenAI:", (err as Error).message);
    }

    // Validate Ollama output — if explanation is too short, discard and fall through
    if (rawJson) {
      try {
        const parsed = JSON.parse(rawJson);
        if (!parsed.explanation || parsed.explanation.length < 500) {
          console.warn("Ollama returned shallow content, falling through to OpenAI");
          rawJson = "";
        }
      } catch {
        rawJson = "";
      }
    }
  }

  // Fallback: OpenAI
  if (!rawJson) {
    const model = complexity >= 5 ? "gpt-4o" : "gpt-4o-mini";
    const response = await getOpenAI().chat.completions.create({
      model,
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: `Generate an extremely detailed, textbook-quality lesson on: ${query}` }],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 8000,
    });
    rawJson = response.choices[0].message.content || "{}";
  }

  const result = JSON.parse(rawJson);
  return {
    hook: result.hook || "",
    explanation: result.explanation || "",
    math_section: result.math_section || undefined,
    summary: result.summary || "",
    analogy: result.analogy || "",
  };
}

export async function generateTutorResponse(
  message: string,
  context: { topic: string; history: { role: string; content: string }[] }
): Promise<ReadableStream> {
  const systemContent = `You are a patient, encouraging AI tutor for Indian students. You're helping with: ${context.topic}.

Rules:
- Use Socratic questioning — ask leading questions instead of giving direct answers
- If the student is stuck, give hints progressively (don't reveal full answer immediately)
- Use real-world examples the student can relate to
- If math is involved, show step-by-step working
- Celebrate correct reasoning ("Great thinking!")
- Keep responses concise (2-4 paragraphs max)
- Use markdown formatting with LaTeX for math ($...$ for inline, $$...$$ for display)`;

  const messages = [
    { role: "system" as const, content: systemContent },
    ...context.history.map((h) => ({ role: h.role as "user" | "assistant", content: h.content })),
    { role: "user" as const, content: message },
  ];

  // Primary: Ollama streaming (free)
  if (await isOllamaAvailable()) {
    try {
      return await ollamaStream(OLLAMA_MODELS.smart, messages, { temperature: 0.8 });
    } catch (err) {
      console.warn("Ollama tutor stream failed, using OpenAI:", (err as Error).message);
    }
  }

  // Fallback: OpenAI streaming
  const stream = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    stream: true,
    messages,
    temperature: 0.8,
    max_tokens: 1000,
  });

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || "";
        if (text) {
          controller.enqueue(new TextEncoder().encode(text));
        }
      }
      controller.close();
    },
  });
}


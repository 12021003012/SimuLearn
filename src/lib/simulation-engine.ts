/**
 * Rule-Based Simulation Engine
 * 
 * Generates interactive HTML simulations from structured parameters
 * WITHOUT requiring any AI calls. Uses physics equations and templates
 * to produce deterministic, high-quality simulations instantly.
 */

export interface SimulationParams {
  type: string;
  title: string;
  variables: SimVariable[];
  equations: SimEquation[];
  visualization: "canvas2d" | "graph" | "particles" | "vectors";
  colorScheme?: string;
}

export interface SimVariable {
  id: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  default: number;
  step: number;
  color: string;
}

export interface SimEquation {
  id: string;
  label: string;
  formula: string; // JS expression using variable ids
  unit: string;
  display: boolean;
}

// Pre-defined simulation templates for common physics/math scenarios
export const SIMULATION_TEMPLATES: Record<string, SimulationParams> = {
  "projectile-motion": {
    type: "projectile-motion",
    title: "Projectile Motion Lab",
    variables: [
      { id: "angle", label: "Launch Angle", unit: "°", min: 5, max: 85, default: 45, step: 1, color: "#818cf8" },
      { id: "velocity", label: "Initial Velocity", unit: "m/s", min: 5, max: 120, default: 50, step: 1, color: "#4ade80" },
      { id: "gravity", label: "Gravity", unit: "m/s²", min: 1, max: 25, default: 9.8, step: 0.1, color: "#fb923c" },
      { id: "mass", label: "Mass", unit: "kg", min: 0.1, max: 10, default: 1, step: 0.1, color: "#f472b6" },
    ],
    equations: [
      { id: "range", label: "Range", formula: "(velocity*velocity*Math.sin(2*angle*Math.PI/180))/gravity", unit: "m", display: true },
      { id: "maxHeight", label: "Max Height", formula: "(velocity*velocity*Math.pow(Math.sin(angle*Math.PI/180),2))/(2*gravity)", unit: "m", display: true },
      { id: "timeOfFlight", label: "Time of Flight", formula: "(2*velocity*Math.sin(angle*Math.PI/180))/gravity", unit: "s", display: true },
      { id: "kineticEnergy", label: "Kinetic Energy", formula: "0.5*mass*velocity*velocity", unit: "J", display: true },
    ],
    visualization: "canvas2d",
  },
  "simple-harmonic-motion": {
    type: "simple-harmonic-motion",
    title: "Simple Harmonic Motion",
    variables: [
      { id: "amplitude", label: "Amplitude", unit: "m", min: 0.1, max: 5, default: 2, step: 0.1, color: "#38bdf8" },
      { id: "springK", label: "Spring Constant", unit: "N/m", min: 1, max: 100, default: 20, step: 1, color: "#4ade80" },
      { id: "mass", label: "Mass", unit: "kg", min: 0.1, max: 10, default: 1, step: 0.1, color: "#f472b6" },
      { id: "damping", label: "Damping", unit: "Ns/m", min: 0, max: 5, default: 0, step: 0.1, color: "#fbbf24" },
    ],
    equations: [
      { id: "period", label: "Period", formula: "2*Math.PI*Math.sqrt(mass/springK)", unit: "s", display: true },
      { id: "frequency", label: "Frequency", formula: "1/(2*Math.PI*Math.sqrt(mass/springK))", unit: "Hz", display: true },
      { id: "omega", label: "Angular Freq", formula: "Math.sqrt(springK/mass)", unit: "rad/s", display: true },
      { id: "maxVelocity", label: "Max Velocity", formula: "amplitude*Math.sqrt(springK/mass)", unit: "m/s", display: true },
      { id: "totalEnergy", label: "Total Energy", formula: "0.5*springK*amplitude*amplitude", unit: "J", display: true },
    ],
    visualization: "canvas2d",
  },
  "ohms-law": {
    type: "ohms-law",
    title: "Ohm's Law Circuit",
    variables: [
      { id: "voltage", label: "Voltage", unit: "V", min: 0, max: 24, default: 12, step: 0.5, color: "#ef4444" },
      { id: "resistance", label: "Resistance", unit: "Ω", min: 1, max: 100, default: 10, step: 1, color: "#fbbf24" },
    ],
    equations: [
      { id: "current", label: "Current", formula: "voltage/resistance", unit: "A", display: true },
      { id: "power", label: "Power", formula: "voltage*voltage/resistance", unit: "W", display: true },
    ],
    visualization: "canvas2d",
  },
  "pendulum": {
    type: "pendulum",
    title: "Simple Pendulum",
    variables: [
      { id: "length", label: "String Length", unit: "m", min: 0.1, max: 5, default: 1, step: 0.1, color: "#38bdf8" },
      { id: "gravity", label: "Gravity", unit: "m/s²", min: 1, max: 25, default: 9.8, step: 0.1, color: "#fb923c" },
      { id: "initAngle", label: "Initial Angle", unit: "°", min: 5, max: 80, default: 30, step: 1, color: "#818cf8" },
      { id: "mass", label: "Bob Mass", unit: "kg", min: 0.1, max: 10, default: 1, step: 0.1, color: "#f472b6" },
    ],
    equations: [
      { id: "period", label: "Period", formula: "2*Math.PI*Math.sqrt(length/gravity)", unit: "s", display: true },
      { id: "frequency", label: "Frequency", formula: "1/(2*Math.PI*Math.sqrt(length/gravity))", unit: "Hz", display: true },
      { id: "maxVelocity", label: "Max Speed", formula: "Math.sqrt(2*gravity*length*(1-Math.cos(initAngle*Math.PI/180)))", unit: "m/s", display: true },
    ],
    visualization: "canvas2d",
  },
  "wave-motion": {
    type: "wave-motion",
    title: "Transverse Wave",
    variables: [
      { id: "amplitude", label: "Amplitude", unit: "m", min: 0.1, max: 3, default: 1, step: 0.1, color: "#38bdf8" },
      { id: "wavelength", label: "Wavelength", unit: "m", min: 0.5, max: 10, default: 4, step: 0.5, color: "#4ade80" },
      { id: "frequency", label: "Frequency", unit: "Hz", min: 0.1, max: 5, default: 1, step: 0.1, color: "#f472b6" },
    ],
    equations: [
      { id: "velocity", label: "Wave Speed", formula: "wavelength*frequency", unit: "m/s", display: true },
      { id: "period", label: "Period", formula: "1/frequency", unit: "s", display: true },
      { id: "angFreq", label: "Angular Freq", formula: "2*Math.PI*frequency", unit: "rad/s", display: true },
      { id: "waveNumber", label: "Wave Number", formula: "2*Math.PI/wavelength", unit: "1/m", display: true },
    ],
    visualization: "canvas2d",
  },
  "lens-optics": {
    type: "lens-optics",
    title: "Thin Lens Optics",
    variables: [
      { id: "focalLength", label: "Focal Length", unit: "cm", min: -30, max: 30, default: 10, step: 1, color: "#38bdf8" },
      { id: "objectDist", label: "Object Distance", unit: "cm", min: 5, max: 50, default: 20, step: 1, color: "#4ade80" },
      { id: "objectHeight", label: "Object Height", unit: "cm", min: 1, max: 10, default: 5, step: 0.5, color: "#f472b6" },
    ],
    equations: [
      { id: "imageDist", label: "Image Distance", formula: "(focalLength*objectDist)/(objectDist-focalLength)", unit: "cm", display: true },
      { id: "magnification", label: "Magnification", formula: "-((focalLength*objectDist)/(objectDist-focalLength))/objectDist", unit: "×", display: true },
      { id: "imageHeight", label: "Image Height", formula: "objectHeight*(-((focalLength*objectDist)/(objectDist-focalLength))/objectDist)", unit: "cm", display: true },
    ],
    visualization: "canvas2d",
  },
};

/**
 * Generate a complete HTML simulation from a template.
 * This is INSTANT — no AI calls, no network requests.
 * Uses deterministic physics equations and canvas rendering.
 */
export function generateSimulationHTML(templateId: string): string {
  const template = SIMULATION_TEMPLATES[templateId];
  if (!template) return "";

  const varDeclarations = template.variables.map((v) => `let ${v.id} = ${v.default};`).join("\n");
  const sliderHTML = template.variables.map((v) => `
    <div class="control">
      <div class="control-header">
        <span class="control-label">${v.label}</span>
        <span class="control-value" style="color:${v.color}"><span id="${v.id}-val">${v.default}</span> ${v.unit}</span>
      </div>
      <input type="range" id="${v.id}-slider" min="${v.min}" max="${v.max}" value="${v.default}" step="${v.step}" style="accent-color:${v.color}">
    </div>`).join("\n");

  const sliderJS = template.variables.map((v) => `
    document.getElementById('${v.id}-slider').addEventListener('input', e => {
      ${v.id} = parseFloat(e.target.value);
      document.getElementById('${v.id}-val').textContent = ${v.step < 1 ? `${v.id}.toFixed(1)` : v.id};
      update();
    });`).join("\n");

  const equationDisplayHTML = template.equations.filter((e) => e.display).map((e) => `
    <div class="data-cell">
      <div class="label">${e.label}</div>
      <div class="value" id="eq-${e.id}">0 ${e.unit}</div>
    </div>`).join("\n");

  const equationUpdateJS = template.equations.filter((e) => e.display).map((e) => `
    try { const val = ${e.formula}; document.getElementById('eq-${e.id}').textContent = (isFinite(val) ? val.toFixed(2) : '∞') + ' ${e.unit}'; } catch(e) {}`).join("\n");

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>${template.title}</title>
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { background:#0f172a; color:#f8fafc; font-family:system-ui,sans-serif; overflow:hidden; }
canvas { display:block; }
#ui { position:absolute; top:12px; right:12px; width:240px; background:rgba(15,23,42,0.92); backdrop-filter:blur(12px); border:1px solid #334155; border-radius:14px; padding:14px; }
.panel-title { font-size:11px; text-transform:uppercase; letter-spacing:1px; color:#64748b; margin-bottom:10px; font-weight:700; }
.control { margin-bottom:10px; }
.control-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; }
.control-label { font-size:11px; color:#94a3b8; }
.control-value { font-size:12px; font-weight:700; font-family:monospace; }
input[type="range"] { width:100%; height:6px; -webkit-appearance:none; background:#1e293b; border-radius:3px; outline:none; }
input[type="range"]::-webkit-slider-thumb { -webkit-appearance:none; width:14px; height:14px; border-radius:50%; cursor:grab; }
.data-grid { display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-top:12px; padding-top:12px; border-top:1px solid #334155; }
.data-cell { background:#1e293b; border-radius:8px; padding:8px; }
.data-cell .label { font-size:9px; color:#64748b; text-transform:uppercase; }
.data-cell .value { font-size:13px; font-weight:800; font-family:monospace; color:#38bdf8; margin-top:2px; }
#title-bar { position:absolute; top:12px; left:12px; background:rgba(15,23,42,0.92); backdrop-filter:blur(12px); border:1px solid #334155; border-radius:10px; padding:8px 14px; }
#title-bar h2 { font-size:13px; color:white; font-weight:700; }
#title-bar p { font-size:10px; color:#64748b; margin-top:2px; }
</style></head><body>
<canvas id="c"></canvas>
<div id="title-bar"><h2>⚡ ${template.title}</h2><p>Adjust sliders to explore</p></div>
<div id="ui">
  <div class="panel-title">Controls</div>
  ${sliderHTML}
  <div class="data-grid">
    ${equationDisplayHTML}
  </div>
</div>
<script>
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
let W, H;
function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; update(); }
addEventListener('resize', resize);

${varDeclarations}
let t = 0;

${sliderJS}

function update() {
  ${equationUpdateJS}
}

function draw() {
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, W, H);
  t += 0.016;
  // Template-specific drawing will be injected based on type
  ${getVisualizationCode(template)}
  requestAnimationFrame(draw);
}

resize();
update();
requestAnimationFrame(draw);
</script></body></html>`;
}

function getVisualizationCode(template: SimulationParams): string {
  switch (template.type) {
    case "simple-harmonic-motion":
      return `
  const omega = Math.sqrt(springK / mass);
  const dampFactor = damping / (2 * mass);
  const x = amplitude * Math.exp(-dampFactor * t) * Math.cos(omega * t);
  const centerX = W / 2, centerY = H / 2;
  // Spring
  ctx.strokeStyle = '#475569'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(100, centerY);
  const coils = 15; const springLen = centerX - 100 + x * 60;
  for (let i = 0; i <= coils; i++) {
    const px = 100 + (i / coils) * springLen;
    const py = centerY + (i % 2 === 0 ? -15 : 15);
    ctx.lineTo(px, py);
  }
  ctx.stroke();
  // Mass
  const bx = centerX + x * 60;
  ctx.fillStyle = '#38bdf8'; ctx.fillRect(bx - 25, centerY - 25, 50, 50);
  ctx.fillStyle = '#0f172a'; ctx.font = 'bold 12px monospace'; ctx.textAlign = 'center';
  ctx.fillText(mass.toFixed(1) + ' kg', bx, centerY + 5);
  // Trail
  ctx.fillStyle = 'rgba(56,189,248,0.1)';
  ctx.fillRect(bx - 1, centerY - 30, 2, 60);
  // Equilibrium line
  ctx.setLineDash([5, 5]); ctx.strokeStyle = '#334155'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(centerX, 50); ctx.lineTo(centerX, H - 50); ctx.stroke();
  ctx.setLineDash([]); 
  // Wall
  ctx.fillStyle = '#334155'; ctx.fillRect(80, centerY - 60, 20, 120);
  // Labels
  ctx.fillStyle = '#94a3b8'; ctx.font = '11px system-ui'; ctx.textAlign = 'left';
  ctx.fillText('x = ' + x.toFixed(3) + ' m', 20, 30);
  ctx.fillText('t = ' + t.toFixed(1) + ' s', 20, 50);`;

    case "pendulum":
      return `
  const omega = Math.sqrt(gravity / length);
  const theta = initAngle * Math.PI / 180 * Math.cos(omega * t);
  const pivotX = W / 2, pivotY = 100;
  const scale = Math.min(W, H) / 8;
  const bobX = pivotX + length * scale * Math.sin(theta);
  const bobY = pivotY + length * scale * Math.cos(theta);
  // Pivot
  ctx.fillStyle = '#475569'; ctx.fillRect(pivotX - 30, pivotY - 5, 60, 10);
  // String
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(pivotX, pivotY); ctx.lineTo(bobX, bobY); ctx.stroke();
  // Bob
  const bobRadius = 10 + mass * 3;
  ctx.fillStyle = '#f472b6'; ctx.beginPath(); ctx.arc(bobX, bobY, bobRadius, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fce7f3'; ctx.beginPath(); ctx.arc(bobX - bobRadius * 0.3, bobY - bobRadius * 0.3, bobRadius * 0.3, 0, Math.PI * 2); ctx.fill();
  // Angle arc
  ctx.strokeStyle = 'rgba(129,140,248,0.5)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(pivotX, pivotY, 40, Math.PI / 2 - Math.abs(theta), Math.PI / 2); ctx.stroke();
  ctx.fillStyle = '#818cf8'; ctx.font = '11px system-ui'; ctx.textAlign = 'center';
  ctx.fillText((theta * 180 / Math.PI).toFixed(1) + '°', pivotX + 55, pivotY + 30);`;

    case "wave-motion":
      return `
  const k = 2 * Math.PI / wavelength;
  const omega = 2 * Math.PI * frequency;
  const centerY = H / 2;
  const scaleX = W / 12;
  const scaleY = H / 8;
  // Draw wave
  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 3; ctx.beginPath();
  for (let px = 0; px < W; px++) {
    const x = px / scaleX;
    const y = amplitude * Math.sin(k * x - omega * t);
    const sy = centerY - y * scaleY;
    px === 0 ? ctx.moveTo(px, sy) : ctx.lineTo(px, sy);
  }
  ctx.stroke();
  // Axis
  ctx.strokeStyle = '#334155'; ctx.lineWidth = 1; ctx.setLineDash([5, 5]);
  ctx.beginPath(); ctx.moveTo(0, centerY); ctx.lineTo(W, centerY); ctx.stroke();
  ctx.setLineDash([]);
  // Amplitude markers
  ctx.strokeStyle = 'rgba(74,222,128,0.3)'; ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.moveTo(0, centerY - amplitude * scaleY); ctx.lineTo(W, centerY - amplitude * scaleY); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, centerY + amplitude * scaleY); ctx.lineTo(W, centerY + amplitude * scaleY); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#4ade80'; ctx.font = '10px system-ui'; ctx.textAlign = 'right';
  ctx.fillText('A = ' + amplitude + ' m', W - 10, centerY - amplitude * scaleY - 5);
  ctx.fillText('-A', W - 10, centerY + amplitude * scaleY + 15);`;

    case "ohms-law":
      return `
  const current = voltage / resistance;
  const power = voltage * current;
  const centerX = W / 2, centerY = H / 2;
  // Circuit drawing
  ctx.strokeStyle = '#475569'; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(centerX - 150, centerY - 80); ctx.lineTo(centerX + 150, centerY - 80);
  ctx.lineTo(centerX + 150, centerY + 80); ctx.lineTo(centerX - 150, centerY + 80);
  ctx.closePath(); ctx.stroke();
  // Battery
  ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(centerX - 150, centerY - 20); ctx.lineTo(centerX - 150, centerY + 20); ctx.stroke();
  ctx.fillStyle = '#ef4444'; ctx.font = 'bold 14px monospace'; ctx.textAlign = 'center';
  ctx.fillText(voltage + ' V', centerX - 150 - 40, centerY + 5);
  // Resistor
  ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 3;
  const rx = centerX + 100;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) { ctx.lineTo(rx + (i % 2 === 0 ? -10 : 10), centerY - 80 + i * 20 + 10); }
  ctx.stroke();
  ctx.fillStyle = '#fbbf24'; ctx.font = 'bold 14px monospace';
  ctx.fillText(resistance + ' Ω', rx + 40, centerY);
  // Current arrows
  ctx.fillStyle = '#4ade80'; ctx.font = 'bold 16px monospace';
  ctx.fillText('I = ' + current.toFixed(2) + ' A', centerX, centerY - 100);
  ctx.fillText('P = ' + power.toFixed(1) + ' W', centerX, centerY + 110);
  // Electron flow animation
  const numElectrons = Math.min(20, Math.floor(current * 5));
  for (let i = 0; i < numElectrons; i++) {
    const phase = (t * current * 2 + i / numElectrons) % 1;
    let ex, ey;
    if (phase < 0.25) { ex = centerX - 150 + phase * 4 * 300; ey = centerY - 80; }
    else if (phase < 0.5) { ex = centerX + 150; ey = centerY - 80 + (phase - 0.25) * 4 * 160; }
    else if (phase < 0.75) { ex = centerX + 150 - (phase - 0.5) * 4 * 300; ey = centerY + 80; }
    else { ex = centerX - 150; ey = centerY + 80 - (phase - 0.75) * 4 * 160; }
    ctx.fillStyle = 'rgba(74,222,128,0.6)'; ctx.beginPath(); ctx.arc(ex, ey, 4, 0, Math.PI * 2); ctx.fill();
  }`;

    case "lens-optics":
      return `
  const centerX = W / 2, centerY = H / 2;
  const scale = 8;
  const v = (focalLength * objectDist) / (objectDist - focalLength);
  const m = -v / objectDist;
  const imgH = objectHeight * m;
  // Lens
  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(centerX, centerY - 120); ctx.lineTo(centerX, centerY + 120); ctx.stroke();
  // Focal points
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath(); ctx.arc(centerX - focalLength * scale, centerY, 5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(centerX + focalLength * scale, centerY, 5, 0, Math.PI * 2); ctx.fill();
  ctx.font = '10px system-ui'; ctx.textAlign = 'center';
  ctx.fillText('F', centerX - focalLength * scale, centerY + 18);
  ctx.fillText("F'", centerX + focalLength * scale, centerY + 18);
  // Optical axis
  ctx.strokeStyle = '#334155'; ctx.lineWidth = 1; ctx.setLineDash([5, 5]);
  ctx.beginPath(); ctx.moveTo(50, centerY); ctx.lineTo(W - 50, centerY); ctx.stroke(); ctx.setLineDash([]);
  // Object
  const objX = centerX - objectDist * scale;
  ctx.strokeStyle = '#4ade80'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(objX, centerY); ctx.lineTo(objX, centerY - objectHeight * scale); ctx.stroke();
  ctx.fillStyle = '#4ade80'; ctx.beginPath();
  ctx.moveTo(objX, centerY - objectHeight * scale); ctx.lineTo(objX - 5, centerY - objectHeight * scale + 10); ctx.lineTo(objX + 5, centerY - objectHeight * scale + 10); ctx.closePath(); ctx.fill();
  // Image
  if (isFinite(v)) {
    const imgX = centerX + v * scale;
    ctx.strokeStyle = v > 0 ? '#f472b6' : 'rgba(244,114,182,0.4)'; ctx.lineWidth = 3;
    ctx.setLineDash(v < 0 ? [5, 5] : []);
    ctx.beginPath(); ctx.moveTo(imgX, centerY); ctx.lineTo(imgX, centerY - imgH * scale); ctx.stroke(); ctx.setLineDash([]);
  }
  ctx.fillStyle = '#94a3b8'; ctx.font = '11px system-ui'; ctx.textAlign = 'left';
  ctx.fillText('Object: ' + objectDist + ' cm from lens', 20, 30);
  ctx.fillText('Image: ' + (isFinite(v) ? v.toFixed(1) : '∞') + ' cm', 20, 50);
  ctx.fillText('Magnification: ' + (isFinite(m) ? m.toFixed(2) : '∞') + '×', 20, 70);`;

    default:
      return `
  ctx.fillStyle = '#94a3b8'; ctx.font = '16px system-ui'; ctx.textAlign = 'center';
  ctx.fillText('Simulation: ' + '${template.title}', W/2, H/2);`;
  }
}

/**
 * Get list of available rule-based simulation templates
 */
export function getAvailableTemplates(): { id: string; title: string; variables: number; equations: number }[] {
  return Object.entries(SIMULATION_TEMPLATES).map(([id, t]) => ({
    id,
    title: t.title,
    variables: t.variables.length,
    equations: t.equations.length,
  }));
}

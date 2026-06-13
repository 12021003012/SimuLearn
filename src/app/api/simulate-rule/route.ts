import { NextRequest, NextResponse } from "next/server";
import { generateSimulationHTML, getAvailableTemplates, SIMULATION_TEMPLATES } from "@/lib/simulation-engine";

/**
 * Rule-based simulation API — generates simulations INSTANTLY from templates.
 * No AI dependency. Deterministic. Uses physics equations + canvas rendering.
 * 
 * GET /api/simulate-rule?template=simple-harmonic-motion — returns HTML
 * GET /api/simulate-rule?list=true — returns available templates
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // List available templates
  if (searchParams.get("list") === "true") {
    return NextResponse.json({
      templates: getAvailableTemplates(),
      count: Object.keys(SIMULATION_TEMPLATES).length,
    });
  }

  // Generate simulation from template
  const templateId = searchParams.get("template");
  if (!templateId) {
    return NextResponse.json({ error: "Missing 'template' parameter. Use ?list=true to see available templates." }, { status: 400 });
  }

  if (!SIMULATION_TEMPLATES[templateId]) {
    return NextResponse.json({
      error: `Template '${templateId}' not found.`,
      available: Object.keys(SIMULATION_TEMPLATES),
    }, { status: 404 });
  }

  const html = generateSimulationHTML(templateId);

  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
      "Cache-Control": "public, max-age=86400", // Cache for 24h — deterministic output
    },
  });
}

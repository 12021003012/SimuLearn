import { NextRequest, NextResponse } from "next/server";
import { generateSimulation } from "@/lib/ai/sim-generator";
import { getCachedSimulation, cacheSimulation, hashQuery } from "@/lib/cache/redis";
import { withSecurity, SimulateSchema } from "@/lib/security/validate";

export const maxDuration = 120;

export async function POST(request: NextRequest) {
  const { data, error } = await withSecurity(request, "simulate", SimulateSchema);
  if (error) return error;

  try {
    const cacheKey = hashQuery(`sim:${data.topic}:${data.engine}`);
    const cached = await getCachedSimulation(cacheKey);
    if (cached) return NextResponse.json({ html: cached.html, cached: true });

    const html = await generateSimulation(data.topic, data.context ?? `Educational simulation about: ${data.topic}`, data.engine);
    await cacheSimulation(cacheKey, html);
    return NextResponse.json({ html, cached: false });
  } catch (err) {
    console.error("Simulate API error:", err);
    return NextResponse.json({ error: "Failed to generate simulation" }, { status: 500 });
  }
}


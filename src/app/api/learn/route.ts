import { NextRequest, NextResponse } from "next/server";
import { orchestrateLesson } from "@/lib/ai/orchestrator";
import { withSecurity, LearnSchema } from "@/lib/security/validate";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const { data, error } = await withSecurity(request, "learn", LearnSchema);
  if (error) return error;

  try {
    const lesson = await orchestrateLesson({ query: data.query });
    return NextResponse.json(lesson);
  } catch (err) {
    console.error("Learn API error:", err);
    return NextResponse.json({ error: "Failed to generate lesson. Please try again." }, { status: 500 });
  }
}

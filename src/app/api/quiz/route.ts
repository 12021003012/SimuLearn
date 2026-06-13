import { NextRequest, NextResponse } from "next/server";
import { generateQuiz } from "@/lib/ai/quiz-generator";
import { Difficulty } from "@/types";
import { withSecurity, QuizSchema } from "@/lib/security/validate";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const { data, error } = await withSecurity(request, "quiz", QuizSchema);
  if (error) return error;

  try {
    const questions = await generateQuiz(data.topic, data.context ?? data.topic, data.difficulty as Difficulty, data.count);
    return NextResponse.json({ questions });
  } catch (err) {
    console.error("Quiz API error:", err);
    return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 });
  }
}

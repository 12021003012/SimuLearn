import { NextRequest } from "next/server";
import { generateTutorResponse } from "@/lib/ai/text-generator";
import { withSecurity, TutorMessageSchema } from "@/lib/security/validate";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const { data, error } = await withSecurity(request, "tutor", TutorMessageSchema);
  if (error) return error as Response;

  try {
    const stream = await generateTutorResponse(data.message, {
      topic: data.topic ?? "general",
      history: data.history ?? [],
    });
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (err) {
    console.error("Tutor API error:", err);
    return new Response(JSON.stringify({ error: "AI tutor unavailable" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

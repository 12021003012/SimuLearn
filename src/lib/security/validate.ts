import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, RATE_LIMITS } from "./ratelimit";

// ===== Input Schemas =====

export const LearnSchema = z.object({
  query: z
    .string()
    .min(2, "Query too short")
    .max(500, "Query too long")
    .transform((s) => s.trim()),
  difficulty: z.number().int().min(1).max(10).optional(),
  subject: z.string().optional(),
});

export const SimulateSchema = z.object({
  topic: z
    .string()
    .min(2, "Topic too short")
    .max(300, "Topic too long")
    .transform((s) => s.trim()),
  context: z.string().max(1000).optional(),
  engine: z.enum(["p5js", "threejs", "d3"]).default("p5js"),
});

export const QuizSchema = z.object({
  topic: z.string().min(2).max(300).transform((s) => s.trim()),
  context: z.string().max(500).optional(),
  difficulty: z.number().int().min(1).max(10).default(3),
  count: z.number().int().min(1).max(10).default(4),
});

export const TutorMessageSchema = z.object({
  message: z.string().min(1).max(2000).transform((s) => s.trim()),
  topic: z.string().max(300).optional(),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(2000),
      })
    )
    .max(20)
    .default([]),
});

export const FeedbackSchema = z.object({
  type: z.enum(["bug", "suggestion", "content", "general"]),
  message: z.string().min(10).max(2000).transform((s) => s.trim()),
  page: z.string().max(200).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  email: z.string().email().optional().or(z.literal("")),
});

export const SignUpSchema = z.object({
  name: z.string().min(2).max(80).transform((s) => s.trim()),
  email: z.string().email().max(254).toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128),
});

// ===== Helper: get IP from request =====
export function getClientIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}

// ===== Helper: rate-limit response =====
export function rateLimitResponse(resetAt: number): NextResponse {
  return NextResponse.json(
    { error: "Too many requests. Please slow down." },
    {
      status: 429,
      headers: {
        "Retry-After": String(Math.ceil((resetAt - Date.now()) / 1000)),
      },
    }
  );
}

// ===== Helper: parse and validate body =====
export async function validateBody<T>(
  req: NextRequest,
  schema: z.ZodSchema<T>
): Promise<{ data: T; error: null } | { data: null; error: NextResponse }> {
  try {
    const raw = await req.json();
    const result = schema.safeParse(raw);
    if (!result.success) {
      const message = result.error.errors.map((e) => e.message).join("; ");
      return {
        data: null,
        error: NextResponse.json({ error: message }, { status: 400 }),
      };
    }
    return { data: result.data, error: null };
  } catch {
    return {
      data: null,
      error: NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }),
    };
  }
}

// ===== Helper: apply rate limit and parse =====
export async function withSecurity<T>(
  req: NextRequest,
  route: keyof typeof RATE_LIMITS,
  schema: z.ZodSchema<T>
): Promise<
  | { data: T; error: null }
  | { data: null; error: NextResponse }
> {
  const ip = getClientIP(req);
  const { allowed, resetAt } = checkRateLimit(ip, route, RATE_LIMITS[route]);
  if (!allowed) return { data: null, error: rateLimitResponse(resetAt) };
  return validateBody(req, schema);
}

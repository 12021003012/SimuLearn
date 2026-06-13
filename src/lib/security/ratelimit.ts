/**
 * Simple in-memory rate limiter (per IP).
 * For production, replace with Upstash Redis rate limiter.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) store.delete(key);
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  windowMs: number; // window duration in ms
  max: number;      // max requests per window
}

export function checkRateLimit(
  ip: string,
  route: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetAt: number } {
  const key = `${ip}:${route}`;
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + config.windowMs });
    return { allowed: true, remaining: config.max - 1, resetAt: now + config.windowMs };
  }

  if (entry.count >= config.max) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { allowed: true, remaining: config.max - entry.count, resetAt: entry.resetAt };
}

// Preset limits per route type
export const RATE_LIMITS = {
  learn:    { windowMs: 60_000, max: 10  }, // 10 lessons/min
  "learn-stream": { windowMs: 60_000, max: 10 }, // streaming lessons
  simulate: { windowMs: 60_000, max: 5   }, // 5 sims/min
  quiz:     { windowMs: 60_000, max: 20  }, // 20 quizzes/min
  tutor:    { windowMs: 60_000, max: 30  }, // 30 chat msgs/min
  feedback: { windowMs: 60_000, max: 5   }, // 5 feedbacks/min
  auth:     { windowMs: 60_000, max: 10  }, // 10 auth attempts/min
} as const;

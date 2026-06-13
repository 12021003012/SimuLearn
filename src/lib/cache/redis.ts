import { Redis } from "@upstash/redis";

function getRedis() {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

export async function getCachedLesson(queryHash: string) {
  try {
    const cached = await getRedis().get<string>(`lesson:${queryHash}`);
    if (cached) return JSON.parse(cached);
    return null;
  } catch {
    return null;
  }
}

export async function cacheLesson(queryHash: string, data: unknown, ttl = 86400) {
  try {
    await getRedis().set(`lesson:${queryHash}`, JSON.stringify(data), { ex: ttl });
  } catch (e) {
    console.error("Cache write failed:", e);
  }
}

export async function getCachedSimulation(key: string) {
  try {
    const cached = await getRedis().get<string>(`sim:${key}`);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

export async function cacheSimulation(key: string, html: string, ttl = 604800) {
  try {
    await getRedis().set(`sim:${key}`, JSON.stringify({ html }), { ex: ttl });
  } catch (e) {
    console.error("Sim cache write failed:", e);
  }
}

export function hashQuery(query: string): string {
  const normalized = query.toLowerCase().trim().replace(/\s+/g, " ");
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}


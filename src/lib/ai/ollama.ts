/**
 * Ollama integration using OpenAI-compatible API.
 * Uses local models on the configured Ollama server.
 * Acts as the PRIMARY provider — OpenAI/Anthropic are fallbacks.
 */

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://172.16.98.171:11434";

export interface OllamaMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OllamaResponse {
  message: { content: string };
  done: boolean;
}

/**
 * Send a chat request to Ollama (non-streaming).
 */
export async function ollamaChat(
  model: string,
  messages: OllamaMessage[],
  options: {
    format?: "json" | "";
    temperature?: number;
    timeout?: number;
  } = {}
): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeout ?? 120_000);

  try {
    const res = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages,
        stream: false,
        format: options.format ?? "",
        options: {
          temperature: options.temperature ?? 0.7,
          num_predict: 8192,
        },
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Ollama ${res.status}: ${text.slice(0, 200)}`);
    }

    const data: OllamaResponse = await res.json();
    return data.message.content;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Stream a response from Ollama.
 * Returns a ReadableStream of text chunks.
 */
export async function ollamaStream(
  model: string,
  messages: OllamaMessage[],
  options: { temperature?: number } = {}
): Promise<ReadableStream<Uint8Array>> {
  const res = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      options: { temperature: options.temperature ?? 0.7 },
    }),
  });

  if (!res.ok) throw new Error(`Ollama stream ${res.status}`);
  if (!res.body) throw new Error("No response body from Ollama");

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  return new ReadableStream({
    async start(controller) {
      const reader = res.body!.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const lines = decoder.decode(value).split("\n").filter(Boolean);
          for (const line of lines) {
            try {
              const obj = JSON.parse(line) as { message?: { content?: string }; done?: boolean };
              if (obj.message?.content) {
                controller.enqueue(encoder.encode(obj.message.content));
              }
            } catch {
              // skip malformed lines
            }
          }
        }
      } finally {
        controller.close();
        reader.releaseLock();
      }
    },
  });
}

/**
 * Check if Ollama server is reachable.
 * Caches result for 30s to avoid repeated network checks.
 */
let _ollamaAvailableCache: { value: boolean; expires: number } | null = null;

export async function isOllamaAvailable(): Promise<boolean> {
  if (_ollamaAvailableCache && Date.now() < _ollamaAvailableCache.expires) {
    return _ollamaAvailableCache.value;
  }
  try {
    const res = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      signal: AbortSignal.timeout(2000),
    });
    const available = res.ok;
    _ollamaAvailableCache = { value: available, expires: Date.now() + 30_000 };
    return available;
  } catch {
    _ollamaAvailableCache = { value: false, expires: Date.now() + 30_000 };
    return false;
  }
}

// ===== Model aliases =====
export const OLLAMA_MODELS = {
  fast:    "llama3.1:8b",           // classification, quick tasks
  smart:   "qwen3.5:35b",           // explanations, tutor
  coder:   "qwen3-coder:30b",       // code/simulation generation
  balanced: "llama3.3:latest",      // quiz, general
} as const;

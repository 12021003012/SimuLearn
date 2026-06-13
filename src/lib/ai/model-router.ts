import { QueryClassification, Subject, QueryIntent, ContentFormat, Difficulty } from "@/types";
import { ollamaChat, isOllamaAvailable, OLLAMA_MODELS } from "./ollama";

// Routes to the cheapest effective model per task
export type ModelTask = "classification" | "explanation" | "simulation_code" | "quiz" | "image";

interface ModelChoice {
  provider: "openai" | "anthropic";
  model: string;
  reason: string;
}

export function selectModel(task: ModelTask, complexity: Difficulty): ModelChoice {
  switch (task) {
    case "classification":
      return {
        provider: "openai",
        model: "gpt-4o-mini",
        reason: "Fast, cheap, excellent at structured classification",
      };
    case "explanation":
      if (complexity >= 4) {
        return {
          provider: "openai",
          model: "gpt-4o",
          reason: "Better reasoning for advanced JEE/NEET level explanations",
        };
      }
      return {
        provider: "openai",
        model: "gpt-4o-mini",
        reason: "Sufficient for simpler explanations, 10x cheaper",
      };
    case "simulation_code":
      return {
        provider: "anthropic",
        model: "claude-sonnet-4-20250514",
        reason: "Best at generating structured, working p5.js/Three.js code",
      };
    case "quiz":
      return {
        provider: "openai",
        model: "gpt-4o-mini",
        reason: "Good at structured quiz generation, cost-effective",
      };
    case "image":
      return {
        provider: "openai",
        model: "dall-e-3",
        reason: "Best quality educational diagrams",
      };
  }
}

export async function classifyQuery(query: string): Promise<QueryClassification> {
  const systemPrompt = `You are a query classifier for an educational platform. Analyze the student's query and return a JSON classification.

Return ONLY valid JSON with these exact fields:
{
  "intent": "concept_learning",
  "subject": "physics",
  "topics": ["topic1", "topic2"],
  "complexity": 3,
  "suggested_formats": ["simulation", "text"],
  "real_world_device": null,
  "exam_relevance": ["jee_mains", "cbse"]
}

intent must be one of: mechanism_explanation, concept_learning, problem_solving, comparison, real_world_connection, how_it_works
subject must be one of: physics, chemistry, mathematics, biology, computer_science, electronics, mechanical, medicine, general
suggested_formats must only contain: simulation, diagram, quiz, text, animation
exam_relevance must only contain: cbse, jee_mains, jee_advanced, neet, general`;

  let rawJson = "";

  // Try Ollama first (free, fast)
  if (await isOllamaAvailable()) {
    try {
      rawJson = await ollamaChat(
        OLLAMA_MODELS.fast,
        [{ role: "system", content: systemPrompt }, { role: "user", content: query }],
        { format: "json", temperature: 0.2, timeout: 8_000 }
      );
    } catch (err) {
      console.warn("Ollama classify failed, using OpenAI:", (err as Error).message);
    }
  }

  // Fallback to OpenAI
  if (!rawJson) {
    const OpenAI = (await import("openai")).default;
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: query }],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });
    rawJson = response.choices[0].message.content || "{}";
  }

  const result = JSON.parse(rawJson);

  return {
    intent: result.intent || "concept_learning",
    subject: result.subject || "general",
    topics: Array.isArray(result.topics) ? result.topics : [],
    complexity: Math.min(10, Math.max(1, Number(result.complexity) || 3)) as Difficulty,
    suggested_formats: Array.isArray(result.suggested_formats) ? result.suggested_formats : ["text", "simulation"],
    real_world_device: result.real_world_device || undefined,
    exam_relevance: Array.isArray(result.exam_relevance) ? result.exam_relevance : ["general"],
  } as QueryClassification;
}

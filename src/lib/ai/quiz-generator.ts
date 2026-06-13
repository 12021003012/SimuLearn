import OpenAI from "openai";
import { QuizQuestion, Difficulty } from "@/types";
import { ollamaChat, isOllamaAvailable, OLLAMA_MODELS } from "./ollama";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
}

export async function generateQuiz(
  topic: string,
  context: string,
  difficulty: Difficulty,
  count: number = 5
): Promise<QuizQuestion[]> {
  const systemPrompt = `You are an EXPERT quiz designer who creates questions at the level of India's toughest exams:
- Level 1-3: CBSE Board — direct application, single concept
- Level 4-5: JEE Mains — combine 2 concepts, numerical calculation required
- Level 6-7: JEE Advanced — multi-step, insight needed, tricky options
- Level 8-9: Olympiad/GATE — creative problem-solving, deep conceptual mastery
- Level 10: Research level — novel applications, requires synthesis of multiple fields

Generate EXACTLY ${count} quiz questions about "${topic}" at difficulty level ${difficulty}/10.

STRICT REQUIREMENTS:
1. Questions MUST test DEEP understanding, not rote memorization
2. Include at least 1 numerical calculation question with specific values
3. Include at least 1 conceptual reasoning question (WHY, not WHAT)
4. Each wrong option MUST be a result of a SPECIFIC common mistake:
   - Forgetting to account for a factor (e.g., friction, sign convention)
   - Off-by-one errors in counting
   - Confusing similar formulas
   - Calculation errors at specific steps
5. Explanations MUST be 4-6 sentences showing COMPLETE solution methodology
6. Hints should guide toward the approach WITHOUT revealing the answer
7. ALL math must use LaTeX: $inline$ for inline, $$display$$ for display equations
8. Questions should progressively increase in difficulty within the set

For difficulty >= 5: Include JEE Previous Year style problems
For difficulty >= 7: Include problems requiring insight/trick (like Irodov/Krotov)
For difficulty >= 9: Include problems that combine multiple topics creatively

Return ONLY a JSON object:
{
  "questions": [
    {
      "id": "q1",
      "type": "mcq",
      "question": "Detailed question with specific scenario, numerical values, and clear what's being asked... Use $LaTeX$ for any math.",
      "options": ["A) $10 \\text{ m/s}$", "B) $14.14 \\text{ m/s}$", "C) $20 \\text{ m/s}$", "D) $7.07 \\text{ m/s}$"],
      "correct_answer": "B",
      "explanation": "Detailed 4-6 sentence explanation showing the complete solution with all intermediate steps. Option A is wrong because [specific error]. Option C is wrong because [specific error].",
      "difficulty": ${difficulty},
      "hint": "A pedagogically useful hint that suggests the approach (e.g., 'Consider energy conservation at the two positions')"
    }
  ]
}`;

  let rawJson = "";

  // Primary: Ollama — use smart model for better quality questions
  if (await isOllamaAvailable()) {
    try {
      rawJson = await ollamaChat(
        difficulty >= 6 ? OLLAMA_MODELS.smart : OLLAMA_MODELS.balanced,
        [{ role: "system", content: systemPrompt }, { role: "user", content: `Topic: ${topic}\nContext: ${context}\nGenerate ${count} questions at difficulty ${difficulty}/10.` }],
        { format: "json", temperature: 0.8, timeout: 30_000 }
      );
    } catch (err) {
      console.warn("Ollama quiz failed, using OpenAI:", (err as Error).message);
    }
  }

  // Fallback: OpenAI
  if (!rawJson) {
    const model = difficulty >= 7 ? "gpt-4o" : "gpt-4o-mini";
    const response = await getOpenAI().chat.completions.create({
      model,
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: `Topic: ${topic}\nContext: ${context}\nGenerate ${count} questions at difficulty ${difficulty}/10.` }],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 4000,
    });
    rawJson = response.choices[0].message.content || '{"questions":[]}';
  }

  const result = JSON.parse(rawJson);
  const questions = Array.isArray(result) ? result : (result.questions || []);

  return questions.map((q: QuizQuestion, i: number) => ({
    id: q.id || `q${i + 1}`,
    type: q.type || "mcq",
    question: q.question,
    options: q.options,
    correct_answer: q.correct_answer,
    explanation: q.explanation || "",
    difficulty: q.difficulty || difficulty,
    hint: q.hint || "",
  }));
}

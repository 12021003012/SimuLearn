import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { ollamaChat, isOllamaAvailable, OLLAMA_MODELS } from "@/lib/ai/ollama";
import { MockTestConfig, MockTestQuestion, MockTestFormat, Subject } from "@/types";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
}

// Predefined test configurations
const TEST_CONFIGS: Record<MockTestFormat, Omit<MockTestConfig, "id" | "title" | "subjects">> = {
  jee_mains: {
    format: "jee_mains",
    totalQuestions: 90,
    duration: 180, // 3 hours
    sections: [],
    negativeMarking: true,
    markingScheme: { correct: 4, incorrect: -1, unattempted: 0 },
  },
  jee_advanced: {
    format: "jee_advanced",
    totalQuestions: 54,
    duration: 180,
    sections: [],
    negativeMarking: true,
    markingScheme: { correct: 4, incorrect: -2, unattempted: 0, partial: 1 },
  },
  gate: {
    format: "gate",
    totalQuestions: 65,
    duration: 180,
    sections: [],
    negativeMarking: true,
    markingScheme: { correct: 2, incorrect: -0.67, unattempted: 0 },
  },
  neet: {
    format: "neet",
    totalQuestions: 200,
    duration: 200,
    sections: [],
    negativeMarking: true,
    markingScheme: { correct: 4, incorrect: -1, unattempted: 0 },
  },
  custom: {
    format: "custom",
    totalQuestions: 30,
    duration: 60,
    sections: [],
    negativeMarking: false,
    markingScheme: { correct: 4, incorrect: 0, unattempted: 0 },
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      format = "jee_mains",
      subjects = ["physics"],
      difficulty = "medium",
      questionCount = 30,
      topics = [],
      source, // e.g., "previous_year", "dpp", "mock"
    } = body as {
      format: MockTestFormat;
      subjects: Subject[];
      difficulty: string;
      questionCount: number;
      topics: string[];
      source?: string;
    };

    const config = TEST_CONFIGS[format] || TEST_CONFIGS.custom;
    const actualCount = Math.min(questionCount, 50); // Cap at 50 per request

    const systemPrompt = buildPrompt(format, subjects, difficulty, actualCount, topics, source);

    let rawJson = "";

    if (await isOllamaAvailable()) {
      try {
        rawJson = await ollamaChat(
          OLLAMA_MODELS.smart,
          [{ role: "system", content: systemPrompt }, { role: "user", content: `Generate ${actualCount} questions for ${subjects.join(", ")} at ${difficulty} level.${topics.length > 0 ? ` Focus on: ${topics.join(", ")}` : ""}` }],
          { format: "json", temperature: 0.8, timeout: 45_000 }
        );
      } catch (err) {
        console.warn("Ollama mock test failed:", (err as Error).message);
      }
    }

    if (!rawJson) {
      const response = await getOpenAI().chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate ${actualCount} questions for ${subjects.join(", ")} at ${difficulty} level.${topics.length > 0 ? ` Focus on: ${topics.join(", ")}` : ""}` },
        ],
        response_format: { type: "json_object" },
        temperature: 0.8,
        max_tokens: 8000,
      });
      rawJson = response.choices[0].message.content || '{"questions":[]}';
    }

    const result = JSON.parse(rawJson);
    const questions: MockTestQuestion[] = (result.questions || []).map((q: MockTestQuestion, i: number) => ({
      id: q.id || `q${i + 1}`,
      sectionId: q.sectionId || `section_${q.subject || subjects[0]}`,
      type: q.type || "mcq",
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || "",
      difficulty: q.difficulty || difficulty,
      subject: q.subject || subjects[0],
      topic: q.topic || topics[0] || "general",
      subtopic: q.subtopic,
      source: q.source,
      marks: config.markingScheme.correct,
      negativeMarks: Math.abs(config.markingScheme.incorrect),
      hint: q.hint,
      solution_steps: q.solution_steps,
    }));

    const testConfig: MockTestConfig = {
      id: `test_${Date.now()}`,
      title: getTestTitle(format, subjects, source),
      format,
      subjects,
      totalQuestions: questions.length,
      duration: Math.min(config.duration, Math.ceil(questions.length * 2)), // 2 min per question or format default
      sections: subjects.map((sub) => ({
        id: `section_${sub}`,
        title: sub.charAt(0).toUpperCase() + sub.slice(1).replace("_", " "),
        subject: sub,
        questionCount: questions.filter((q) => q.subject === sub).length,
        questionTypes: [...new Set(questions.filter((q) => q.subject === sub).map((q) => q.type))],
        markingScheme: config.markingScheme,
      })),
      negativeMarking: config.negativeMarking,
      markingScheme: config.markingScheme,
      source: source || undefined,
    };

    return NextResponse.json({ config: testConfig, questions });
  } catch (err) {
    console.error("Mock test generation error:", err);
    return NextResponse.json({ error: "Failed to generate mock test" }, { status: 500 });
  }
}

function getTestTitle(format: MockTestFormat, subjects: Subject[], source?: string): string {
  const subjectStr = subjects.map((s) => s.charAt(0).toUpperCase() + s.slice(1).replace("_", " ")).join(", ");
  const formatNames: Record<MockTestFormat, string> = {
    jee_mains: "JEE Mains",
    jee_advanced: "JEE Advanced",
    gate: "GATE",
    neet: "NEET",
    custom: "Practice Test",
  };
  const sourceLabel = source === "previous_year" ? " (PYQ)" : source === "dpp" ? " (DPP)" : "";
  return `${formatNames[format]} — ${subjectStr}${sourceLabel}`;
}

function buildPrompt(
  format: MockTestFormat,
  subjects: Subject[],
  difficulty: string,
  count: number,
  topics: string[],
  source?: string
): string {
  const formatInstructions: Record<MockTestFormat, string> = {
    jee_mains: `JEE MAINS FORMAT:
- Section A: 20 MCQs (4 options, single correct) — +4 correct, -1 wrong
- Section B: 10 Numerical Type (integer answer, no options) — +4 correct, 0 wrong
- Questions MUST be at JEE Mains difficulty (combine 2+ concepts, numerical heavy)
- Include questions from: PYQs (2015-2024), Allen/FIITJEE DPPs, NTA mock patterns
- Tricky options that represent common calculation errors`,

    jee_advanced: `JEE ADVANCED FORMAT:
- Paper 1 style with mixed question types
- MCQ (single correct): +3 correct, -1 wrong
- MCQ (multiple correct): +4 all correct, +1 partial, -2 wrong
- Integer Type: Answer is 0-9, +3 correct, 0 wrong
- Matrix Match: Match items from two columns
- Questions MUST be at JEE Advanced difficulty (multi-concept, non-standard, insight-heavy)
- Include Irodov/Krotov style conceptual challenges
- Distractor options should be results of common mistakes in intermediate steps`,

    gate: `GATE FORMAT:
- MCQ (1 mark): +1 correct, -1/3 wrong
- MCQ (2 marks): +2 correct, -2/3 wrong  
- NAT (Numerical Answer Type): No negative marking
- MSQ (Multiple Select): No negative marking, no partial marking
- Questions at GATE level — professional engineering depth
- Include questions from: GATE PYQs (2010-2024), Made Easy/ACE Academy patterns
- Focus on application-based and analysis questions`,

    neet: `NEET FORMAT:
- 200 MCQs with 4 options (single correct)
- +4 correct, -1 wrong
- Biology (90), Physics (45), Chemistry (45)
- NCERT-based but application-oriented
- Include diagram-based questions (describe diagrams in text)`,

    custom: `CUSTOM PRACTICE FORMAT:
- Mix of MCQ and numerical questions
- Difficulty as specified
- Focus on thorough concept testing`,
  };

  const difficultyInstructions: Record<string, string> = {
    easy: "CBSE Board level — direct formula application, single-concept questions. Suitable for beginners.",
    medium: "JEE Mains level — requires combining 2 concepts, careful calculation, moderate problem-solving.",
    hard: "JEE Advanced level — multi-step, non-obvious approach needed, insight required, multiple concepts combined.",
    advanced: "Olympiad/Research level — requires creative problem-solving, unusual approaches, deep conceptual mastery.",
  };

  return `You are an EXPERT exam paper setter for India's toughest competitive exams. You have decades of experience at Allen Kota, FIITJEE, Resonance, and Physics Wallah.

Your questions are INDISTINGUISHABLE from actual exam papers. They test deep understanding, not memorization.

${formatInstructions[format]}

DIFFICULTY: ${difficultyInstructions[difficulty] || difficultyInstructions.medium}

SUBJECTS: ${subjects.join(", ")}
${topics.length > 0 ? `FOCUS TOPICS: ${topics.join(", ")}` : ""}
${source === "previous_year" ? "STYLE: Match actual previous year question patterns exactly." : ""}
${source === "dpp" ? "STYLE: Daily Practice Problems — progressive difficulty, thorough topic coverage." : ""}

CRITICAL RULES:
1. Every question MUST have a detailed step-by-step solution
2. Wrong options MUST be results of common errors (sign mistakes, forgetting factors, wrong formula)
3. Numerical values must be physically realistic
4. Use proper LaTeX in questions: $inline$ and $$display$$
5. Include the topic and subtopic for each question
6. Questions should be UNIQUE — not direct copies from any source
7. For numerical type: answer should be a clean number (integer or simple decimal)
8. Each question must test a SPECIFIC concept or skill

Return JSON:
{
  "questions": [
    {
      "id": "q1",
      "type": "mcq",
      "question": "A block of mass 2 kg is placed on...",
      "options": ["A) 10 m/s", "B) 14.14 m/s", "C) 20 m/s", "D) 7.07 m/s"],
      "correctAnswer": "B",
      "explanation": "Step-by-step solution with all intermediate calculations...",
      "difficulty": "${difficulty}",
      "subject": "${subjects[0]}",
      "topic": "mechanics",
      "subtopic": "work_energy_theorem",
      "source": "JEE Mains 2022 style",
      "hint": "Think about energy conservation",
      "solution_steps": ["Step 1: Identify forces...", "Step 2: Apply work-energy theorem...", "Step 3: Calculate..."]
    }
  ]
}

Generate EXACTLY ${count} questions.`;
}

import { classifyQuery } from "./model-router";
import { generateExplanation } from "./text-generator";
import { generateSimulation } from "./sim-generator";
import { generateQuiz } from "./quiz-generator";
import { getCachedLesson, cacheLesson, hashQuery } from "../cache/redis";
import { LessonResponse, LessonSection, LearnRequest } from "@/types";

export async function orchestrateLesson(request: LearnRequest): Promise<LessonResponse> {
  const { query } = request;
  const queryHash = hashQuery(query);

  // 1. Check cache first
  const cached = await getCachedLesson(queryHash);
  if (cached) {
    return { ...cached, cached: true };
  }

  // 2. Classify the query
  const classification = await classifyQuery(query);

  // 3. Parallel generation of content
  const STEM_SUBJECTS = ["physics", "chemistry", "mathematics", "biology", "computer_science"];
  const wantsSimulation =
    STEM_SUBJECTS.includes(classification.subject) ||
    classification.suggested_formats.some((f) => f.toLowerCase().includes("simulation"));

  const [explanationResult, simulationResult, quizResult] = await Promise.allSettled([
    generateExplanation(query, classification.subject, classification.topics, classification.complexity),
    wantsSimulation
      ? generateSimulation(
          query,
          `Subject: ${classification.subject}. Topics: ${classification.topics.join(", ")}. Intent: ${classification.intent}.`,
          "p5js"
        )
      : Promise.resolve(null),
    generateQuiz(query, classification.topics.join(", "), classification.complexity, 4),
  ]);

  // 4. Assemble sections
  const sections: LessonSection[] = [];
  let order = 0;

  // Hook section
  if (explanationResult.status === "fulfilled") {
    const explanation = explanationResult.value;

    sections.push({
      id: `section_${order}`,
      type: "hook",
      title: "Real-World Connection",
      content: explanation.hook,
      order: order++,
    });

    sections.push({
      id: `section_${order}`,
      type: "explanation",
      title: "Understanding the Concept",
      content: explanation.explanation,
      order: order++,
    });

    if (explanation.math_section) {
      sections.push({
        id: `section_${order}`,
        type: "math",
        title: "The Mathematics",
        content: explanation.math_section,
        order: order++,
      });
    }

    // Analogy section
    sections.push({
      id: `section_${order}`,
      type: "explanation",
      title: "Simple Analogy",
      content: `💡 **Think of it this way:** ${explanation.analogy}`,
      order: order++,
    });
  }

  // Simulation section
  if (simulationResult.status === "fulfilled" && simulationResult.value) {
    sections.push({
      id: `section_${order}`,
      type: "simulation",
      title: "Interactive Simulation",
      content: simulationResult.value,
      order: order++,
    });
  }

  // Quiz section
  if (quizResult.status === "fulfilled") {
    sections.push({
      id: `section_${order}`,
      type: "quiz",
      title: "Test Your Understanding",
      content: JSON.stringify(quizResult.value),
      order: order++,
    });
  }

  // Related topics
  sections.push({
    id: `section_${order}`,
    type: "related",
    title: "Explore Further",
    content: JSON.stringify(classification.topics),
    order: order++,
  });

  // 5. Build response
  const lesson: LessonResponse = {
    id: queryHash,
    query,
    title: classification.topics[0] || query,
    classification,
    sections,
    created_at: new Date().toISOString(),
    cached: false,
  };

  // 6. Cache for future use
  await cacheLesson(queryHash, lesson);

  return lesson;
}

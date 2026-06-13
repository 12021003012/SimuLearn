import { NextRequest } from "next/server";
import { classifyQuery } from "@/lib/ai/model-router";
import { generateExplanation } from "@/lib/ai/text-generator";
import { generateSimulation } from "@/lib/ai/sim-generator";
import { generateQuiz } from "@/lib/ai/quiz-generator";
import { getCachedLesson, cacheLesson, hashQuery } from "@/lib/cache/redis";
import { LessonSection } from "@/types";
import { withSecurity, LearnSchema } from "@/lib/security/validate";
import { findMatchingSimulations } from "@/data/simulations";
import { generateSimulationHTML, SIMULATION_TEMPLATES } from "@/lib/simulation-engine";

export const maxDuration = 120;

/**
 * Streaming lesson endpoint — sends JSON chunks as each section completes.
 * Uses FIXED order values so the client can sort sections correctly regardless
 * of which parallel promise resolves first.
 * 
 * Order: hook(0) → explanation(1) → math(2) → analogy(3) → simulation(4) → quiz(5) → related(6)
 */
export async function POST(request: NextRequest) {
  const { data, error } = await withSecurity(request, "learn-stream", LearnSchema);
  if (error) return error;

  const query = data.query;
  const queryHash = hashQuery(query);

  // Check cache
  const cached = await getCachedLesson(queryHash);
  if (cached) {
    return new Response(
      JSON.stringify({ type: "cached", data: { ...cached, cached: true } }) + "\n",
      { headers: { "Content-Type": "application/x-ndjson", "Cache-Control": "no-cache" } }
    );
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      function send(obj: Record<string, unknown>) {
        controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
      }

      try {
        // 1. Classification
        send({ type: "status", data: { step: "classifying" } });
        const classification = await classifyQuery(query);
        send({ type: "meta", data: { classification, title: classification.topics[0] || query } });

        const sections: LessonSection[] = [];

        // 2. Parallel generation with FIXED order values
        send({ type: "status", data: { step: "generating" } });

        const STEM_SUBJECTS = ["physics", "chemistry", "mathematics", "biology", "computer_science", "electronics", "mechanical"];
        const wantsSimulation =
          STEM_SUBJECTS.includes(classification.subject) ||
          classification.suggested_formats.some((f) => f.toLowerCase().includes("simulation"));

        const prebuiltSims = findMatchingSimulations(query);
        const skipAiSim = prebuiltSims.length > 0;

        // --- Explanation (orders 0-3) ---
        const explanationPromise = generateExplanation(query, classification.subject, classification.topics, classification.complexity)
          .then((explanation) => {
            // Hook — order 0
            if (explanation.hook) {
              const s: LessonSection = { id: "section_0", type: "hook", title: "Real-World Connection", content: explanation.hook, order: 0 };
              sections.push(s);
              send({ type: "section", data: s });
            }

            // Explanation — order 1
            if (explanation.explanation) {
              const s: LessonSection = { id: "section_1", type: "explanation", title: "Deep Dive", content: explanation.explanation, order: 1 };
              sections.push(s);
              send({ type: "section", data: s });
            }

            // Math — order 2
            if (explanation.math_section) {
              const s: LessonSection = { id: "section_2", type: "math", title: "Mathematical Framework", content: explanation.math_section, order: 2 };
              sections.push(s);
              send({ type: "section", data: s });
            }

            // Analogy — order 3
            if (explanation.analogy) {
              const s: LessonSection = { id: "section_3", type: "explanation", title: "Intuitive Understanding", content: `💡 **Think of it this way:** ${explanation.analogy}`, order: 3 };
              sections.push(s);
              send({ type: "section", data: s });
            }

            send({ type: "status", data: { step: "explanation_done" } });
          })
          .catch((err) => {
            console.error("Explanation generation failed:", err);
            send({ type: "error", data: { section: "explanation", message: "Failed to generate explanation" } });
          });

        // --- Simulation — order 4 ---
        // Priority: 1) Prebuilt HTML exists → skip  2) Rule-based template match → instant  3) AI generation
        const ruleBasedTemplate = findRuleBasedTemplate(query, classification.topics);
        
        const simulationPromise = (wantsSimulation && !skipAiSim)
          ? (ruleBasedTemplate
            ? Promise.resolve().then(() => {
                const html = generateSimulationHTML(ruleBasedTemplate);
                if (html) {
                  const s: LessonSection = { id: "section_4", type: "simulation", title: "Interactive Simulation", content: html, order: 4 };
                  sections.push(s);
                  send({ type: "section", data: s });
                }
                send({ type: "status", data: { step: "simulation_done" } });
              })
            : generateSimulation(
                query,
                `Subject: ${classification.subject}. Topics: ${classification.topics.join(", ")}. Complexity: ${classification.complexity}/10. Generate a DETAILED, interactive simulation with multiple parameters.`,
                "p5js"
              )
                .then((html) => {
                  if (html) {
                    const s: LessonSection = { id: "section_4", type: "simulation", title: "Interactive Simulation", content: html, order: 4 };
                    sections.push(s);
                    send({ type: "section", data: s });
                  }
                  send({ type: "status", data: { step: "simulation_done" } });
                })
                .catch((err) => {
                  console.error("Simulation generation failed:", err);
                  send({ type: "status", data: { step: "simulation_done" } });
                })
          )
          : Promise.resolve(send({ type: "status", data: { step: "simulation_done" } }));

        // --- Quiz — order 5 ---
        const quizPromise = generateQuiz(query, classification.topics.join(", "), classification.complexity, 4)
          .then((questions) => {
            if (questions.length > 0) {
              const s: LessonSection = { id: "section_5", type: "quiz", title: "Test Your Understanding", content: JSON.stringify(questions), order: 5 };
              sections.push(s);
              send({ type: "section", data: s });
            }
            send({ type: "status", data: { step: "quiz_done" } });
          })
          .catch((err) => {
            console.error("Quiz generation failed:", err);
            send({ type: "status", data: { step: "quiz_done" } });
          });

        await Promise.allSettled([explanationPromise, simulationPromise, quizPromise]);

        // Related — order 6
        const relatedSection: LessonSection = {
          id: "section_6", type: "related", title: "Explore Further", content: JSON.stringify(classification.topics), order: 6,
        };
        sections.push(relatedSection);
        send({ type: "section", data: relatedSection });

        // Done
        const lesson = {
          id: queryHash, query, title: classification.topics[0] || query, classification,
          sections: sections.sort((a, b) => a.order - b.order),
          created_at: new Date().toISOString(), cached: false,
        };
        send({ type: "done", data: { id: queryHash } });

        cacheLesson(queryHash, lesson).catch(() => {});
      } catch (err) {
        console.error("Stream lesson error:", err);
        send({ type: "error", data: { message: "Failed to generate lesson" } });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Cache-Control": "no-cache",
      "Transfer-Encoding": "chunked",
    },
  });
}

/**
 * Match a query/topics to a rule-based simulation template.
 * Returns templateId if matched, null otherwise.
 * This avoids AI calls for common physics/math simulations.
 */
function findRuleBasedTemplate(query: string, topics: string[]): string | null {
  const q = query.toLowerCase();
  const t = topics.map((tp) => tp.toLowerCase()).join(" ");
  const combined = q + " " + t;

  const matchers: [string[], string][] = [
    [["projectile", "trajectory", "launch", "ballistic"], "projectile-motion"],
    [["shm", "simple harmonic", "spring", "oscillat", "hooke"], "simple-harmonic-motion"],
    [["ohm", "resistance", "circuit", "current", "voltage"], "ohms-law"],
    [["pendulum", "bob", "string swing"], "pendulum"],
    [["wave", "transverse", "wavelength", "crest", "trough"], "wave-motion"],
    [["lens", "optic", "focal", "refract", "convex lens", "concave lens", "mirror"], "lens-optics"],
  ];

  for (const [keywords, templateId] of matchers) {
    if (keywords.some((kw) => combined.includes(kw))) {
      // Verify template exists
      if (SIMULATION_TEMPLATES[templateId]) return templateId;
    }
  }

  return null;
}

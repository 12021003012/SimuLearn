"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { LessonResponse, LessonSection, QueryClassification } from "@/types";
import { Loader2, AlertCircle, Beaker, RefreshCw, BookOpen, Brain, Zap, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { findMatchingSimulations, SimulationMapping } from "@/data/simulations";
import dynamic from "next/dynamic";
import "katex/dist/katex.min.css";
import MarkdownRenderer from "@/components/MarkdownRenderer";

const QuizCard = dynamic(() => import("@/components/QuizCard"), { ssr: false });

type LoadingStep = "classifying" | "generating" | "explanation_done" | "simulation_done" | "quiz_done";

export default function LearnPage() {
  const params = useParams();
  const query = decodeURIComponent(params.query as string);
  const [sections, setSections] = useState<LessonSection[]>([]);
  const [classification, setClassification] = useState<QueryClassification | null>(null);
  const [title, setTitle] = useState<string>(query);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<LoadingStep>("classifying");
  const [done, setDone] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef(Date.now());
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [loading]);

  const fetchLesson = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSections([]);
    setClassification(null);
    setDone(false);
    setCurrentStep("classifying");
    startTimeRef.current = Date.now();

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/learn-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done: streamDone, value } = await reader.read();
        if (streamDone) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const chunk = JSON.parse(line);
            handleChunk(chunk);
          } catch {
            // skip malformed
          }
        }
      }

      if (buffer.trim()) {
        try { handleChunk(JSON.parse(buffer)); } catch {}
      }

      setLoading(false);
      setDone(true);
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  function handleChunk(chunk: { type: string; data: Record<string, unknown> }) {
    switch (chunk.type) {
      case "cached": {
        const lesson = chunk.data as unknown as LessonResponse;
        setSections(lesson.sections);
        setClassification(lesson.classification);
        setTitle(lesson.title);
        setLoading(false);
        setDone(true);
        break;
      }
      case "meta":
        setClassification(chunk.data.classification as QueryClassification);
        setTitle(chunk.data.title as string);
        break;
      case "section":
        setSections((prev) => [...prev, chunk.data as unknown as LessonSection].sort((a, b) => a.order - b.order));
        break;
      case "status":
        setCurrentStep(chunk.data.step as LoadingStep);
        break;
      case "error":
        if (chunk.data.message) setError(chunk.data.message as string);
        break;
      case "done":
        setLoading(false);
        setDone(true);
        break;
    }
  }

  useEffect(() => {
    if (query) fetchLesson();
    return () => { abortRef.current?.abort(); };
  }, [query, fetchLesson]);

  const matchedSims = findMatchingSimulations(query);
  const hasContent = sections.length > 0;

  // Error state (no content arrived yet)
  if (error && !hasContent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Generation Failed</h2>
          <p className="text-surface-300 mb-6">{error}</p>
          <button onClick={fetchLesson}
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-medium transition-colors">
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 page-transition">
      {/* Full-page loading (no content yet) */}
      <AnimatePresence>
        {loading && !hasContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0 }}
            className="min-h-[70vh] flex items-center justify-center"
          >
            <div className="text-center max-w-lg mx-auto px-4">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="w-20 h-20 mx-auto mb-6 bg-brand-500/10 border border-brand-500/30 rounded-2xl flex items-center justify-center"
              >
                <Brain className="w-10 h-10 text-brand-400" />
              </motion.div>

              <h2 className="text-2xl font-bold text-white mb-2">Generating Your Lesson</h2>
              <p className="text-surface-300 mb-8">
                AI is crafting an interactive explanation for <span className="text-brand-400 font-medium">&quot;{query}&quot;</span>
              </p>

              {/* Progress steps - vertical, properly centered */}
              <div className="flex flex-col gap-3 max-w-xs mx-auto text-left mb-6">
                <ProgressStep label="Classifying your query" done={currentStep !== "classifying"} active={currentStep === "classifying"} />
                <ProgressStep label="Generating explanation" done={["explanation_done", "simulation_done", "quiz_done"].includes(currentStep)} active={currentStep === "generating"} />
                <ProgressStep label="Building simulation" done={["simulation_done", "quiz_done"].includes(currentStep)} active={currentStep === "explanation_done"} />
                <ProgressStep label="Creating quiz" done={currentStep === "quiz_done"} active={currentStep === "simulation_done"} />
              </div>

              <div className="text-xs text-surface-500">
                {elapsed > 0 && <span>{elapsed}s elapsed</span>}
                {elapsed > 15 && <span> — Content will appear progressively as it&apos;s ready</span>}
              </div>

              {/* Skeleton preview */}
              <div className="mt-8 space-y-3 max-w-md mx-auto">
                <div className="h-3 bg-surface-200/50 rounded-full w-full animate-pulse" />
                <div className="h-3 bg-surface-200/50 rounded-full w-4/5 animate-pulse" />
                <div className="h-3 bg-surface-200/50 rounded-full w-3/5 animate-pulse" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progressive content */}
      {hasContent && (
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            {classification && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-500/10 border border-brand-500/30 rounded-full text-brand-400 text-sm mb-4">
                <Zap className="w-3.5 h-3.5" />
                {classification.subject.replace("_", " ")} • Level {classification.complexity}
              </div>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-white">{formatTopicName(title)}</h1>
            <p className="text-surface-300 mt-2 text-lg">{query}</p>
          </motion.div>

          {/* Sections arriving progressively */}
          {sections.map((section) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <SectionRenderer section={section} />
            </motion.div>
          ))}

          {/* Inline loading indicator */}
          {loading && hasContent && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-3 py-6 text-surface-400">
              <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
              <span className="text-sm">
                {currentStep === "generating" || currentStep === "classifying" ? "Generating more content..." :
                  currentStep === "explanation_done" ? "Building simulation..." :
                  currentStep === "simulation_done" ? "Creating quiz..." : "Finishing up..."}
              </span>
            </motion.div>
          )}

          {/* Prebuilt simulations */}
          {done && matchedSims.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 mt-10">
              <div className="flex items-center gap-2">
                <Beaker className="w-5 h-5 text-orange-400" />
                <h2 className="text-xl font-bold text-white">Prebuilt Simulation{matchedSims.length > 1 ? "s" : ""}</h2>
              </div>
              <p className="text-surface-300 text-sm">
                Explore hands-on with {matchedSims.length > 1 ? "these" : "this"} curated interactive simulation{matchedSims.length > 1 ? "s" : ""}.
              </p>
              {matchedSims.map((sim) => (
                <PrebuiltSimulation key={sim.path} sim={sim} />
              ))}
            </motion.div>
          )}

          {/* Completion */}
          {done && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
              <div className="inline-flex items-center gap-2 text-sm text-green-400">
                <CheckCircle2 className="w-4 h-4" />
                Lesson complete
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

/** Convert slug-format topic names (e.g. "newtons_laws") to readable form ("Newton's Laws") */
function formatTopicName(name: string): string {
  return name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function ProgressStep({ label, done, active }: { label: string; done: boolean; active: boolean }) {
  return (
    <div className={`flex items-center gap-3 transition-colors ${done ? "text-green-400" : active ? "text-brand-400" : "text-surface-500"}`}>
      {done ? (
        <div className="w-5 h-5 rounded-full bg-green-400/20 border border-green-400 flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-3 h-3" />
        </div>
      ) : active ? (
        <div className="w-5 h-5 rounded-full border-2 border-brand-400 border-t-transparent animate-spin flex-shrink-0" />
      ) : (
        <div className="w-5 h-5 rounded-full border border-surface-400 flex-shrink-0" />
      )}
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

function SectionRenderer({ section }: { section: LessonSection }) {
  switch (section.type) {
    case "hook":
      return (
        <div className="bg-gradient-to-r from-brand-500/10 to-purple-500/10 border border-brand-500/20 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Zap className="w-6 h-6 text-brand-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-brand-400 uppercase tracking-wide mb-2">{section.title}</h3>
              <div className="text-white text-lg leading-relaxed">
                <MarkdownRenderer content={section.content} />
              </div>
            </div>
          </div>
        </div>
      );
    case "explanation":
      return (
        <div className="bg-surface-100 rounded-xl p-6 border border-surface-200">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-brand-400" />
            <h3 className="text-lg font-semibold text-white">{section.title}</h3>
          </div>
          <div className="prose prose-invert prose-sm max-w-none">
            <MarkdownRenderer content={section.content} />
          </div>
        </div>
      );
    case "math":
      return (
        <div className="bg-surface-100 rounded-xl p-6 border border-surface-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-green-400 text-lg font-bold">&#x2211;</span>
            <h3 className="text-lg font-semibold text-white">{section.title}</h3>
          </div>
          <div className="prose prose-invert prose-sm max-w-none font-mono">
            <MarkdownRenderer content={section.content} />
          </div>
        </div>
      );
    case "simulation":
      return (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Beaker className="w-5 h-5 text-orange-400" />
            <h3 className="text-lg font-semibold text-white">{section.title}</h3>
          </div>
          <p className="text-surface-300 text-sm mb-3">Interact with the simulation below — adjust controls to explore the concept.</p>
          <div className="rounded-xl overflow-hidden border border-surface-200 bg-surface-100">
            <div className="px-4 py-3 border-b border-surface-200 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-3 text-sm text-surface-300 font-medium">AI-Generated Simulation</span>
            </div>
            <iframe
              srcDoc={section.content}
              sandbox="allow-scripts allow-same-origin"
              style={{ border: "none", width: "100%", height: "550px" }}
              title="Interactive Simulation"
              loading="lazy"
            />
          </div>
        </div>
      );
    case "quiz":
      try {
        const questions = JSON.parse(section.content);
        return (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">{section.title}</h3>
            </div>
            <QuizCard questions={questions} />
          </div>
        );
      } catch {
        return null;
      }
    case "related":
      try {
        const topics: string[] = JSON.parse(section.content);
        return (
          <div className="bg-surface-100 rounded-xl p-6 border border-surface-200">
            <h3 className="text-lg font-semibold text-white mb-4">Explore Further</h3>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <a key={topic} href={`/learn/${encodeURIComponent(topic)}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-surface-200 hover:bg-surface-300 text-surface-300 hover:text-white rounded-lg text-sm transition-colors">
                  {formatTopicName(topic)} &#x2192;
                </a>
              ))}
            </div>
          </div>
        );
      } catch {
        return null;
      }
    default:
      return null;
  }
}

function PrebuiltSimulation({ sim }: { sim: SimulationMapping }) {
  return (
    <div className="rounded-xl overflow-hidden border border-surface-200 bg-surface-100">
      <div className="px-4 py-3 border-b border-surface-200 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-3 text-sm text-surface-300 font-medium">{sim.title}</span>
      </div>
      <iframe
        src={sim.path}
        sandbox="allow-scripts allow-same-origin"
        style={{ border: "none", width: "100%", height: "550px" }}
        title={sim.title}
        loading="lazy"
      />
    </div>
  );
}

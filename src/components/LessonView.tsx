"use client";

import { LessonResponse, LessonSection, QuizQuestion } from "@/types";
import SimulationFrame from "./SimulationFrame";
import QuizCard from "./QuizCard";
import { motion } from "framer-motion";
import { Zap, BookOpen, Calculator, Beaker, Brain, ArrowRight } from "lucide-react";

interface LessonViewProps {
  lesson: LessonResponse;
}

export default function LessonView({ lesson }: LessonViewProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Lesson Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-500/10 border border-brand-500/30 rounded-full text-brand-400 text-sm mb-4">
          <Zap className="w-3.5 h-3.5" />
          {lesson.classification.subject.replace("_", " ")} • Level {lesson.classification.complexity}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white">{lesson.title}</h1>
        <p className="text-surface-300 mt-2 text-lg">{lesson.query}</p>
      </motion.div>

      {/* Sections */}
      {lesson.sections.map((section, index) => (
        <motion.div
          key={section.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <SectionRenderer section={section} />
        </motion.div>
      ))}
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
              <h3 className="text-sm font-medium text-brand-400 uppercase tracking-wide mb-2">
                {section.title}
              </h3>
              <p className="text-white text-lg leading-relaxed">{section.content}</p>
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
            <Calculator className="w-5 h-5 text-green-400" />
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
          <p className="text-surface-300 text-sm mb-3">
            Interact with the simulation below — adjust controls to explore the concept.
          </p>
          <SimulationFrame html={section.content} title="Interactive Simulation" height="550px" />
        </div>
      );

    case "quiz":
      try {
        const questions: QuizQuestion[] = JSON.parse(section.content);
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
                <a
                  key={topic}
                  href={`/learn/${encodeURIComponent(topic)}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-surface-200 hover:bg-surface-300 text-surface-300 hover:text-white rounded-lg text-sm transition-colors"
                >
                  {topic}
                  <ArrowRight className="w-3.5 h-3.5" />
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

function MarkdownRenderer({ content }: { content: string }) {
  // Sanitize: strip all HTML tags from AI content before processing,
  // then build our own safe HTML from markdown patterns only.
  const sanitized = content
    .replace(/<script[\s\S]*?<\/script>/gi, "") // remove scripts
    .replace(/<[^>]+>/g, "");                   // strip all remaining HTML tags

  const html = sanitized
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, '<code class="bg-surface-200 px-1.5 py-0.5 rounded text-brand-300 text-sm font-mono">$1</code>')
    .replace(/^## (.*?)$/gm, '<h2 class="text-xl font-bold text-white mt-6 mb-3">$1</h2>')
    .replace(/^### (.*?)$/gm, '<h3 class="text-lg font-semibold text-white mt-4 mb-2">$1</h3>')
    .replace(/^\- (.*?)$/gm, '<li class="ml-4 text-surface-300 list-disc">$1</li>')
    .replace(/^• (.*?)$/gm, '<li class="ml-4 text-surface-300">$1</li>')
    .replace(/^\d+\. (.*?)$/gm, '<li class="ml-4 text-surface-300 list-decimal">$1</li>')
    .replace(/\$\$(.*?)\$\$/gs, '<div class="my-4 p-3 bg-surface-200/50 rounded-lg text-center text-brand-300 font-mono overflow-x-auto text-sm">$1</div>')
    .replace(/\$(.*?)\$/g, '<span class="text-brand-300 font-mono">$1</span>')
    .replace(/\n\n/g, '</p><p class="text-surface-300 leading-relaxed mb-3">')
    .replace(/\n/g, "<br/>");

  return (
    <div
      className="text-surface-300 leading-relaxed"
      // Safe: HTML tags from input are stripped above; only our own controlled patterns remain
      dangerouslySetInnerHTML={{ __html: `<p class="text-surface-300 leading-relaxed mb-3">${html}</p>` }}
    />
  );
}

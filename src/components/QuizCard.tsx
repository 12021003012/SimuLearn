"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Lightbulb, ChevronRight } from "lucide-react";
import { QuizQuestion } from "@/types";
import "katex/dist/katex.min.css";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface QuizCardProps {
  questions: QuizQuestion[];
  onComplete?: (score: number) => void;
}

export default function QuizCard({ questions, onComplete }: QuizCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const current = questions[currentIndex];
  if (!current) return null;

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);

    const isCorrect = answer === String(current.correct_answer);
    if (isCorrect) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowHint(false);
    } else {
      setCompleted(true);
      onComplete?.(score + (selectedAnswer === String(current.correct_answer) ? 1 : 0));
    }
  };

  if (completed) {
    const finalScore = score;
    const percentage = Math.round((finalScore / questions.length) * 100);
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-surface-100 rounded-xl p-8 border border-surface-200 text-center"
      >
        <div className="text-5xl mb-4">{percentage >= 75 ? "🎉" : percentage >= 50 ? "👍" : "📚"}</div>
        <h3 className="text-2xl font-bold text-white mb-2">
          {percentage >= 75 ? "Excellent!" : percentage >= 50 ? "Good Effort!" : "Keep Learning!"}
        </h3>
        <p className="text-surface-300 text-lg">
          You scored <span className="text-brand-400 font-bold">{finalScore}/{questions.length}</span> ({percentage}%)
        </p>
        <div className="mt-4 w-full bg-surface-200 rounded-full h-3">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-brand-400 to-green-400 transition-all duration-1000"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-surface-100 rounded-xl border border-surface-200 overflow-hidden">
      {/* Progress bar */}
      <div className="h-1 bg-surface-200">
        <div
          className="h-1 bg-brand-400 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="p-6">
        {/* Question counter */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-surface-300">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="text-sm text-brand-400 font-medium">
            Score: {score}/{currentIndex}
          </span>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
          >
            <div className="text-lg font-medium text-white mb-6">
              <MarkdownRenderer content={current.question} />
            </div>

            {/* Options */}
            {current.type === "mcq" && current.options && (
              <div className="space-y-3">
                {current.options.map((option, i) => {
                  const letter = String.fromCharCode(65 + i);
                  const isSelected = selectedAnswer === letter;
                  const isCorrect = letter === current.correct_answer;
                  const showCorrectHighlight = showResult && isCorrect;
                  const showWrongHighlight = showResult && isSelected && !isCorrect;

                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(letter)}
                      disabled={showResult}
                      className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                        showCorrectHighlight
                          ? "border-green-500 bg-green-500/10 text-green-300"
                          : showWrongHighlight
                          ? "border-red-500 bg-red-500/10 text-red-300"
                          : isSelected
                          ? "border-brand-400 bg-brand-400/10 text-brand-300"
                          : "border-surface-200 hover:border-surface-300 text-surface-300 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 flex items-center justify-center rounded-full border border-current text-sm font-medium">
                          {letter}
                        </span>
                        <span className="flex-1"><MarkdownRenderer content={option.replace(/^[A-D]\)\s*/, "")} /></span>
                        {showCorrectHighlight && <CheckCircle className="ml-auto w-5 h-5 text-green-400" />}
                        {showWrongHighlight && <XCircle className="ml-auto w-5 h-5 text-red-400" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* True/False */}
            {current.type === "true_false" && (
              <div className="flex gap-4">
                {["true", "false"].map((val) => (
                  <button
                    key={val}
                    onClick={() => handleAnswer(val)}
                    disabled={showResult}
                    className={`flex-1 py-3 rounded-lg border font-medium transition-all ${
                      showResult && val === current.correct_answer
                        ? "border-green-500 bg-green-500/10 text-green-300"
                        : showResult && selectedAnswer === val && val !== current.correct_answer
                        ? "border-red-500 bg-red-500/10 text-red-300"
                        : "border-surface-200 hover:border-brand-400 text-surface-300 hover:text-white"
                    }`}
                  >
                    {val === "true" ? "True ✓" : "False ✗"}
                  </button>
                ))}
              </div>
            )}

            {/* Numerical input */}
            {current.type === "numerical" && !showResult && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const input = (e.target as HTMLFormElement).elements.namedItem("answer") as HTMLInputElement;
                  handleAnswer(input.value);
                }}
                className="flex gap-3"
              >
                <input
                  name="answer"
                  type="number"
                  step="any"
                  placeholder="Enter your answer..."
                  className="flex-1 px-4 py-3 bg-surface rounded-lg border border-surface-200 text-white focus:border-brand-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium transition-colors"
                >
                  Submit
                </button>
              </form>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Hint */}
        {!showResult && current.hint && (
          <button
            onClick={() => setShowHint(!showHint)}
            className="mt-4 flex items-center gap-2 text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            <Lightbulb className="w-4 h-4" />
            {showHint ? current.hint : "Need a hint?"}
          </button>
        )}

        {/* Explanation after answer */}
        {showResult && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="mt-4 p-4 rounded-lg bg-surface/50 border border-surface-200"
          >
            <div className="text-sm text-surface-300 leading-relaxed">
              <strong className="text-white">Explanation:</strong>
              <MarkdownRenderer content={current.explanation} />
            </div>
            <button
              onClick={handleNext}
              className="mt-4 flex items-center gap-2 px-5 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium transition-colors"
            >
              {currentIndex < questions.length - 1 ? "Next Question" : "See Results"}
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChevronLeft, ChevronRight, Flag, CheckCircle2, XCircle, AlertTriangle, BookOpen, Target, Zap, Trophy } from "lucide-react";
import "katex/dist/katex.min.css";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { MockTestConfig, MockTestQuestion, MockTestFormat, Subject, MockTestScore, QuestionDifficulty } from "@/types";

type TestState = "config" | "loading" | "active" | "review" | "results";

export default function MockTestPage() {
  const [state, setState] = useState<TestState>("config");
  const [config, setConfig] = useState<MockTestConfig | null>(null);
  const [questions, setQuestions] = useState<MockTestQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[] | number | null>>({});
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());
  const [visitedQuestions, setVisitedQuestions] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState<MockTestScore | null>(null);
  const [showSolution, setShowSolution] = useState<string | null>(null);
  const startTimeRef = useRef(Date.now());

  // Timer
  useEffect(() => {
    if (state !== "active" || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, timeLeft]);

  // Mark current question as visited
  useEffect(() => {
    if (state === "active" && questions[currentIndex]) {
      setVisitedQuestions((prev) => new Set([...prev, questions[currentIndex].id]));
    }
  }, [state, currentIndex, questions]);

  const startTest = useCallback(async (format: MockTestFormat, subjects: Subject[], difficulty: QuestionDifficulty, count: number, topics: string[], source?: string) => {
    setState("loading");
    try {
      const res = await fetch("/api/mock-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format, subjects, difficulty, questionCount: count, topics, source }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setConfig(data.config);
      setQuestions(data.questions);
      setTimeLeft(data.config.duration * 60);
      setAnswers({});
      setMarkedForReview(new Set());
      setVisitedQuestions(new Set());
      setCurrentIndex(0);
      startTimeRef.current = Date.now();
      setState("active");
    } catch (err) {
      console.error(err);
      setState("config");
    }
  }, []);

  const handleSubmit = useCallback(() => {
    if (!config || !questions.length) return;
    const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);
    let totalScore = 0;
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    questions.forEach((q) => {
      const answer = answers[q.id];
      if (answer === null || answer === undefined) {
        unattempted++;
        totalScore += config.markingScheme.unattempted;
      } else {
        const isCorrect = checkAnswer(q, answer);
        if (isCorrect) {
          correct++;
          totalScore += q.marks;
        } else {
          incorrect++;
          totalScore -= q.negativeMarks;
        }
      }
    });

    const maxTotal = questions.reduce((sum, q) => sum + q.marks, 0);
    setScore({
      total: Math.max(0, totalScore),
      maxTotal,
      correct,
      incorrect,
      unattempted,
      sectionScores: {},
      timeTaken,
      accuracy: correct > 0 ? Math.round((correct / (correct + incorrect)) * 100) : 0,
    });
    setState("results");
  }, [config, questions, answers]);

  const currentQuestion = questions[currentIndex];

  if (state === "config") return <TestConfigPanel onStart={startTest} />;
  if (state === "loading") return <LoadingScreen />;
  if (state === "results" && score) return <ResultsScreen score={score} config={config!} questions={questions} answers={answers} onReview={() => setState("review")} onRetry={() => setState("config")} />;
  if (state === "review") return <ReviewScreen questions={questions} answers={answers} onBack={() => setState("results")} />;

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Top Bar — Timer + Progress */}
      <div className="sticky top-0 z-50 bg-surface-100 border-b border-surface-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-white font-semibold hidden md:block">{config?.title}</h2>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-sm font-bold ${timeLeft < 300 ? "bg-red-500/20 text-red-400 animate-pulse" : "bg-surface-200 text-white"}`}>
              <Clock className="w-4 h-4" />
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-surface-400 text-sm">
              {Object.keys(answers).filter((k) => answers[k] !== null).length}/{questions.length} answered
            </span>
            <button onClick={handleSubmit}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors">
              Submit Test
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 p-4">
        {/* Question Panel */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {currentQuestion && (
              <motion.div key={currentQuestion.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="bg-surface-100 rounded-xl border border-surface-200 p-6">
                {/* Question header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-brand-400">Q{currentIndex + 1}</span>
                    <span className="px-2 py-0.5 bg-surface-200 rounded text-xs text-surface-400 capitalize">{currentQuestion.type}</span>
                    <span className="px-2 py-0.5 bg-surface-200 rounded text-xs text-surface-400 capitalize">{currentQuestion.difficulty}</span>
                    {currentQuestion.marks && (
                      <span className="text-xs text-surface-400">+{currentQuestion.marks} / -{currentQuestion.negativeMarks}</span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setMarkedForReview((prev) => {
                        const next = new Set(prev);
                        if (next.has(currentQuestion.id)) next.delete(currentQuestion.id);
                        else next.add(currentQuestion.id);
                        return next;
                      });
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${markedForReview.has(currentQuestion.id) ? "bg-yellow-500/20 text-yellow-400" : "bg-surface-200 text-surface-400 hover:text-white"}`}
                  >
                    <Flag className="w-3.5 h-3.5" />
                    {markedForReview.has(currentQuestion.id) ? "Marked" : "Mark"}
                  </button>
                </div>

                {/* Question text */}
                <div className="mb-6">
                  <MarkdownRenderer content={currentQuestion.question} className="text-white text-base" />
                </div>

                {/* Options */}
                {currentQuestion.type === "mcq" && currentQuestion.options && (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, i) => {
                      const optionKey = String.fromCharCode(65 + i); // A, B, C, D
                      const isSelected = answers[currentQuestion.id] === optionKey;
                      return (
                        <button key={i}
                          onClick={() => setAnswers((prev) => ({ ...prev, [currentQuestion.id]: isSelected ? null : optionKey }))}
                          className={`w-full text-left p-4 rounded-xl border transition-all ${isSelected ? "bg-brand-500/15 border-brand-500 text-white" : "bg-surface-200/50 border-surface-200 text-surface-300 hover:border-surface-300 hover:text-white"}`}
                        >
                          <div className="flex items-start gap-3">
                            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${isSelected ? "bg-brand-500 text-white" : "bg-surface-300/20 text-surface-400"}`}>
                              {optionKey}
                            </span>
                            <MarkdownRenderer content={option.replace(/^[A-D]\)\s*/, "")} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* MSQ (Multiple Select) */}
                {currentQuestion.type === "msq" && currentQuestion.options && (
                  <div className="space-y-3">
                    <p className="text-sm text-yellow-400 mb-2">Select one or more correct options</p>
                    {currentQuestion.options.map((option, i) => {
                      const optionKey = String.fromCharCode(65 + i);
                      const selected = Array.isArray(answers[currentQuestion.id]) ? (answers[currentQuestion.id] as string[]) : [];
                      const isSelected = selected.includes(optionKey);
                      return (
                        <button key={i}
                          onClick={() => {
                            setAnswers((prev) => {
                              const current = Array.isArray(prev[currentQuestion.id]) ? [...(prev[currentQuestion.id] as string[])] : [];
                              if (isSelected) return { ...prev, [currentQuestion.id]: current.filter((k) => k !== optionKey) };
                              return { ...prev, [currentQuestion.id]: [...current, optionKey] };
                            });
                          }}
                          className={`w-full text-left p-4 rounded-xl border transition-all ${isSelected ? "bg-brand-500/15 border-brand-500 text-white" : "bg-surface-200/50 border-surface-200 text-surface-300 hover:border-surface-300"}`}
                        >
                          <div className="flex items-start gap-3">
                            <span className={`w-7 h-7 rounded flex items-center justify-center text-sm font-bold flex-shrink-0 ${isSelected ? "bg-brand-500 text-white" : "bg-surface-300/20 text-surface-400"}`}>
                              {optionKey}
                            </span>
                            <MarkdownRenderer content={option.replace(/^[A-D]\)\s*/, "")} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Numerical / Integer Type */}
                {(currentQuestion.type === "numerical" || currentQuestion.type === "integer_type") && (
                  <div className="mt-4">
                    <label className="text-sm text-surface-400 mb-2 block">Enter your answer (numerical value):</label>
                    <input
                      type="number"
                      step="any"
                      value={answers[currentQuestion.id] !== null && answers[currentQuestion.id] !== undefined ? String(answers[currentQuestion.id]) : ""}
                      onChange={(e) => setAnswers((prev) => ({ ...prev, [currentQuestion.id]: e.target.value ? parseFloat(e.target.value) : null }))}
                      className="w-full max-w-xs px-4 py-3 bg-surface-200 border border-surface-300 rounded-xl text-white text-lg font-mono focus:outline-none focus:border-brand-500 transition-colors"
                      placeholder="Type answer..."
                    />
                    {currentQuestion.type === "integer_type" && (
                      <p className="text-xs text-surface-500 mt-2">Answer is an integer between 0-9</p>
                    )}
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 pt-4 border-t border-surface-200">
                  <button onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))} disabled={currentIndex === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-surface-200 hover:bg-surface-300 text-white rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                  <button
                    onClick={() => setAnswers((prev) => ({ ...prev, [currentQuestion.id]: null }))}
                    className="px-4 py-2 text-surface-400 hover:text-white text-sm transition-colors"
                  >
                    Clear Response
                  </button>
                  <button onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))} disabled={currentIndex === questions.length - 1}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Question Palette (sidebar) */}
        <div className="lg:w-72 flex-shrink-0">
          <div className="bg-surface-100 rounded-xl border border-surface-200 p-4 sticky top-20">
            <h3 className="text-white font-semibold mb-3 text-sm">Question Palette</h3>
            <div className="grid grid-cols-5 gap-2 mb-4">
              {questions.map((q, i) => {
                const isAnswered = answers[q.id] !== null && answers[q.id] !== undefined;
                const isReview = markedForReview.has(q.id);
                const isCurrent = i === currentIndex;
                let bg = "bg-surface-200 text-surface-400";
                if (isCurrent) bg = "bg-brand-500 text-white ring-2 ring-brand-400";
                else if (isAnswered && isReview) bg = "bg-purple-500/50 text-white";
                else if (isAnswered) bg = "bg-green-500/50 text-white";
                else if (isReview) bg = "bg-yellow-500/50 text-white";
                else if (visitedQuestions.has(q.id)) bg = "bg-red-500/30 text-surface-300";
                return (
                  <button key={q.id} onClick={() => setCurrentIndex(i)}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold transition-all hover:scale-105 ${bg}`}>
                    {i + 1}
                  </button>
                );
              })}
            </div>
            {/* Legend */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-green-500/50" /> <span className="text-surface-400">Answered</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-red-500/30" /> <span className="text-surface-400">Not Answered (Visited)</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-yellow-500/50" /> <span className="text-surface-400">Marked for Review</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-purple-500/50" /> <span className="text-surface-400">Answered & Marked</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-surface-200" /> <span className="text-surface-400">Not Visited</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== Sub-components ====================

function TestConfigPanel({ onStart }: { onStart: (format: MockTestFormat, subjects: Subject[], difficulty: QuestionDifficulty, count: number, topics: string[], source?: string) => void }) {
  const [format, setFormat] = useState<MockTestFormat>("jee_mains");
  const [subjects, setSubjects] = useState<Subject[]>(["physics"]);
  const [difficulty, setDifficulty] = useState<QuestionDifficulty>("medium");
  const [count, setCount] = useState(30);
  const [topics, setTopics] = useState("");
  const [source, setSource] = useState<string>("mock");

  const formats: { id: MockTestFormat; label: string; desc: string; icon: string }[] = [
    { id: "jee_mains", label: "JEE Mains", desc: "75 MCQ + Numerical, 3hrs, -1 marking", icon: "🎯" },
    { id: "jee_advanced", label: "JEE Advanced", desc: "MCQ + MSQ + Integer, 3hrs, -2 marking", icon: "🔥" },
    { id: "gate", label: "GATE", desc: "MCQ + NAT + MSQ, 3hrs, -1/3 marking", icon: "🏗️" },
    { id: "neet", label: "NEET", desc: "200 MCQs, 3hrs 20min, -1 marking", icon: "🧬" },
    { id: "custom", label: "Custom / DPP", desc: "Custom question count & time", icon: "📝" },
  ];

  const allSubjects: { id: Subject; label: string }[] = [
    { id: "physics", label: "Physics" },
    { id: "chemistry", label: "Chemistry" },
    { id: "mathematics", label: "Mathematics" },
    { id: "biology", label: "Biology" },
    { id: "computer_science", label: "CS / Programming" },
    { id: "electronics", label: "Electronics" },
    { id: "mechanical", label: "Mechanical" },
  ];

  const difficulties: { id: QuestionDifficulty; label: string; desc: string }[] = [
    { id: "easy", label: "Easy", desc: "CBSE Board Level" },
    { id: "medium", label: "Medium", desc: "JEE Mains Level" },
    { id: "hard", label: "Hard", desc: "JEE Advanced Level" },
    { id: "advanced", label: "Advanced", desc: "Olympiad / GATE Level" },
  ];

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500/10 border border-brand-500/30 rounded-full text-brand-400 text-sm mb-4">
              <Target className="w-4 h-4" /> Mock Test Center
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Configure Your Test</h1>
            <p className="text-surface-300">JEE Mains, JEE Advanced, GATE, NEET — exam-grade questions with real marking schemes</p>
          </div>

          <div className="space-y-8">
            {/* Format selection */}
            <section>
              <h3 className="text-white font-semibold mb-3">Exam Format</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {formats.map((f) => (
                  <button key={f.id} onClick={() => setFormat(f.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${format === f.id ? "bg-brand-500/15 border-brand-500" : "bg-surface-100 border-surface-200 hover:border-surface-300"}`}>
                    <div className="text-2xl mb-1">{f.icon}</div>
                    <div className="text-white font-medium">{f.label}</div>
                    <div className="text-surface-400 text-xs mt-0.5">{f.desc}</div>
                  </button>
                ))}
              </div>
            </section>

            {/* Subject selection */}
            <section>
              <h3 className="text-white font-semibold mb-3">Subjects</h3>
              <div className="flex flex-wrap gap-2">
                {allSubjects.map((s) => (
                  <button key={s.id}
                    onClick={() => setSubjects((prev) => prev.includes(s.id) ? prev.filter((x) => x !== s.id) : [...prev, s.id])}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${subjects.includes(s.id) ? "bg-brand-500 text-white" : "bg-surface-100 text-surface-300 border border-surface-200 hover:border-surface-300"}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Difficulty */}
            <section>
              <h3 className="text-white font-semibold mb-3">Difficulty Level</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {difficulties.map((d) => (
                  <button key={d.id} onClick={() => setDifficulty(d.id)}
                    className={`p-3 rounded-xl border text-center transition-all ${difficulty === d.id ? "bg-brand-500/15 border-brand-500" : "bg-surface-100 border-surface-200 hover:border-surface-300"}`}>
                    <div className="text-white font-medium text-sm">{d.label}</div>
                    <div className="text-surface-400 text-xs mt-0.5">{d.desc}</div>
                  </button>
                ))}
              </div>
            </section>

            {/* Source / Type */}
            <section>
              <h3 className="text-white font-semibold mb-3">Question Source</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "mock", label: "Fresh Mock Test" },
                  { id: "previous_year", label: "PYQ Style" },
                  { id: "dpp", label: "DPP (Practice)" },
                ].map((s) => (
                  <button key={s.id} onClick={() => setSource(s.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${source === s.id ? "bg-brand-500 text-white" : "bg-surface-100 text-surface-300 border border-surface-200"}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Question count */}
            <section>
              <h3 className="text-white font-semibold mb-3">Number of Questions</h3>
              <div className="flex items-center gap-4">
                {[10, 20, 30, 50].map((n) => (
                  <button key={n} onClick={() => setCount(n)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${count === n ? "bg-brand-500 text-white" : "bg-surface-100 text-surface-300 border border-surface-200"}`}>
                    {n}
                  </button>
                ))}
              </div>
            </section>

            {/* Topics (optional) */}
            <section>
              <h3 className="text-white font-semibold mb-3">Focus Topics <span className="text-surface-400 font-normal">(optional)</span></h3>
              <input
                value={topics}
                onChange={(e) => setTopics(e.target.value)}
                placeholder="e.g., Mechanics, Thermodynamics, Optics..."
                className="w-full px-4 py-3 bg-surface-100 border border-surface-200 rounded-xl text-white placeholder-surface-400 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </section>

            {/* Start button */}
            <button
              onClick={() => onStart(format, subjects, difficulty, count, topics ? topics.split(",").map((t) => t.trim()) : [], source)}
              disabled={subjects.length === 0}
              className="w-full py-4 bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-600 hover:to-purple-700 text-white font-bold text-lg rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-500/20"
            >
              <div className="flex items-center justify-center gap-2">
                <Zap className="w-5 h-5" />
                Start Mock Test
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-brand-500/10 border border-brand-500/30 rounded-2xl flex items-center justify-center">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
            <Target className="w-10 h-10 text-brand-400" />
          </motion.div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Generating Your Test Paper</h2>
        <p className="text-surface-300">Creating exam-grade questions with detailed solutions...</p>
        <p className="text-surface-500 text-sm mt-4">This may take 15-30 seconds</p>
      </motion.div>
    </div>
  );
}

function ResultsScreen({ score, config, questions, answers, onReview, onRetry }: {
  score: MockTestScore; config: MockTestConfig; questions: MockTestQuestion[];
  answers: Record<string, string | string[] | number | null>; onReview: () => void; onRetry: () => void;
}) {
  const percentage = Math.round((score.total / score.maxTotal) * 100);
  const getGrade = () => {
    if (percentage >= 90) return { label: "Excellent", color: "text-green-400", emoji: "🏆" };
    if (percentage >= 70) return { label: "Good", color: "text-blue-400", emoji: "👏" };
    if (percentage >= 50) return { label: "Average", color: "text-yellow-400", emoji: "📈" };
    return { label: "Needs Work", color: "text-red-400", emoji: "💪" };
  };
  const grade = getGrade();

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="text-6xl mb-4">{grade.emoji}</div>
          <h1 className="text-3xl font-bold text-white mb-2">Test Complete!</h1>
          <p className={`text-xl font-semibold ${grade.color}`}>{grade.label}</p>
        </motion.div>

        <div className="bg-surface-100 rounded-xl border border-surface-200 p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-400">{score.total}</div>
              <div className="text-xs text-surface-400">Score</div>
              <div className="text-xs text-surface-500">out of {score.maxTotal}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{score.correct}</div>
              <div className="text-xs text-surface-400">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400">{score.incorrect}</div>
              <div className="text-xs text-surface-400">Incorrect</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-surface-300">{score.unattempted}</div>
              <div className="text-xs text-surface-400">Unattempted</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-surface-200 pt-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-surface-400" />
              <span className="text-surface-300 text-sm">Time: {formatTime(score.timeTaken)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-surface-400" />
              <span className="text-surface-300 text-sm">Accuracy: {score.accuracy}%</span>
            </div>
          </div>

          {config.negativeMarking && (
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-yellow-400 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Negative marking applied: {config.markingScheme.incorrect} per wrong answer
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button onClick={onReview}
            className="flex-1 py-3 bg-surface-100 border border-surface-200 hover:border-brand-500 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
            <BookOpen className="w-4 h-4" /> Review Solutions
          </button>
          <button onClick={onRetry}
            className="flex-1 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
            <Trophy className="w-4 h-4" /> New Test
          </button>
        </div>
      </div>
    </div>
  );
}

function ReviewScreen({ questions, answers, onBack }: {
  questions: MockTestQuestion[]; answers: Record<string, string | string[] | number | null>; onBack: () => void;
}) {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Solution Review</h2>
          <button onClick={onBack} className="px-4 py-2 bg-surface-100 border border-surface-200 text-white rounded-lg text-sm hover:border-surface-300 transition-colors">
            Back to Results
          </button>
        </div>
        <div className="space-y-6">
          {questions.map((q, i) => {
            const answer = answers[q.id];
            const isCorrect = checkAnswer(q, answer);
            const isUnattempted = answer === null || answer === undefined;
            return (
              <motion.div key={q.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className={`bg-surface-100 rounded-xl border p-6 ${isUnattempted ? "border-surface-200" : isCorrect ? "border-green-500/30" : "border-red-500/30"}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm font-bold text-brand-400">Q{i + 1}</span>
                  {isUnattempted ? (
                    <span className="px-2 py-0.5 bg-surface-200 rounded text-xs text-surface-400">Unattempted</span>
                  ) : isCorrect ? (
                    <span className="px-2 py-0.5 bg-green-500/20 rounded text-xs text-green-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Correct</span>
                  ) : (
                    <span className="px-2 py-0.5 bg-red-500/20 rounded text-xs text-red-400 flex items-center gap-1"><XCircle className="w-3 h-3" /> Incorrect</span>
                  )}
                </div>
                <MarkdownRenderer content={q.question} className="text-white mb-4" />

                {q.options && (
                  <div className="space-y-2 mb-4">
                    {q.options.map((opt, j) => {
                      const key = String.fromCharCode(65 + j);
                      const isUserAnswer = answer === key;
                      const isCorrectOption = q.correctAnswer === key;
                      let optClass = "bg-surface-200/30 border-surface-200 text-surface-300";
                      if (isCorrectOption) optClass = "bg-green-500/10 border-green-500/50 text-green-300";
                      else if (isUserAnswer && !isCorrect) optClass = "bg-red-500/10 border-red-500/50 text-red-300";
                      return (
                        <div key={j} className={`p-3 rounded-lg border ${optClass}`}>
                          <div className="flex items-start gap-2">
                            <span className="font-bold text-sm">{key}.</span>
                            <MarkdownRenderer content={opt.replace(/^[A-D]\)\s*/, "")} />
                            {isCorrectOption && <CheckCircle2 className="w-4 h-4 text-green-400 ml-auto flex-shrink-0" />}
                            {isUserAnswer && !isCorrect && <XCircle className="w-4 h-4 text-red-400 ml-auto flex-shrink-0" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Solution */}
                <div className="mt-4 p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                  <h4 className="text-blue-400 font-semibold text-sm mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> Solution
                  </h4>
                  <MarkdownRenderer content={q.explanation} />
                  {q.solution_steps && q.solution_steps.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {q.solution_steps.map((step, si) => (
                        <div key={si} className="text-sm text-surface-300">
                          <MarkdownRenderer content={step} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ==================== Helpers ====================

function checkAnswer(q: MockTestQuestion, answer: string | string[] | number | null | undefined): boolean {
  if (answer === null || answer === undefined) return false;
  if (q.type === "msq") {
    const correct = Array.isArray(q.correctAnswer) ? q.correctAnswer.sort() : [q.correctAnswer];
    const given = Array.isArray(answer) ? [...answer].sort() : [answer];
    return JSON.stringify(correct) === JSON.stringify(given);
  }
  if (q.type === "numerical" || q.type === "integer_type") {
    const correctNum = typeof q.correctAnswer === "number" ? q.correctAnswer : parseFloat(String(q.correctAnswer));
    const givenNum = typeof answer === "number" ? answer : parseFloat(String(answer));
    // Allow 1% tolerance for numerical
    return Math.abs(correctNum - givenNum) <= Math.abs(correctNum) * 0.01 + 0.01;
  }
  return String(answer).toUpperCase() === String(q.correctAnswer).toUpperCase();
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

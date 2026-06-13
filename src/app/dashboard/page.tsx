"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trophy, Flame, Target, BookOpen, Brain, Zap, Clock, TrendingUp, Award, ChevronRight, Play, RotateCcw, Calendar, BarChart3, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { CURRICULUM } from "@/data/curriculum";

interface LearningHistory {
  topic: string;
  subject: string;
  timestamp: number;
  score?: number;
  completed: boolean;
}

function useLocalProgress() {
  const [history, setHistory] = useState<LearningHistory[]>([]);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("simulearn_history");
    const storedXp = localStorage.getItem("simulearn_xp");
    const storedStreak = localStorage.getItem("simulearn_streak");
    const lastActive = localStorage.getItem("simulearn_last_active");

    if (stored) setHistory(JSON.parse(stored));
    if (storedXp) setXp(parseInt(storedXp));

    // Calculate streak
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (lastActive === today) {
      setStreak(parseInt(storedStreak || "1"));
    } else if (lastActive === yesterday) {
      setStreak(parseInt(storedStreak || "0"));
    } else if (lastActive) {
      setStreak(0);
      localStorage.setItem("simulearn_streak", "0");
    }
  }, []);

  return { history, streak, xp, level: Math.floor(xp / 500) + 1, xpToNext: 500 - (xp % 500) };
}

export default function DashboardPage() {
  const router = useRouter();
  const { history, streak, xp, level, xpToNext } = useLocalProgress();
  const [activeTab, setActiveTab] = useState<"overview" | "subjects" | "activity">("overview");

  const topicsLearned = history.filter((h) => h.completed).length;
  const quizzesTaken = history.filter((h) => h.score !== undefined).length;
  const avgScore = quizzesTaken > 0
    ? Math.round(history.filter((h) => h.score !== undefined).reduce((s, h) => s + (h.score || 0), 0) / quizzesTaken)
    : 0;
  const totalMinutes = Math.round(history.length * 8); // estimated

  // Subject progress
  const subjectProgress = Object.entries(CURRICULUM).map(([key, curr]) => {
    const totalChapters = curr.groups.flatMap((g) => g.chapters).length;
    const completed = history.filter((h) => h.subject === key && h.completed).length;
    return { key, label: curr.label, emoji: curr.emoji, total: totalChapters, completed, percent: totalChapters > 0 ? Math.round((completed / totalChapters) * 100) : 0 };
  });

  // Recent activity (last 10)
  const recentActivity = [...history].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);

  // Today's recommendations based on weakest subjects
  const weakSubjects = subjectProgress.filter((s) => s.completed > 0 && s.percent < 30).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
          <p className="text-surface-300">Track your learning progress and stay consistent</p>
        </div>
        <div className="flex items-center gap-3">
          {streak > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-full">
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="text-orange-400 font-bold text-sm">{streak} day streak</span>
            </div>
          )}
          <div className="flex items-center gap-2 px-4 py-2 bg-brand-500/10 border border-brand-500/30 rounded-full">
            <Award className="w-4 h-4 text-brand-400" />
            <span className="text-brand-400 font-bold text-sm">Level {level}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard icon={<BookOpen className="w-5 h-5 text-brand-400" />} label="Topics Learned" value={String(topicsLearned)} trend={topicsLearned > 0 ? "+3 this week" : "Start learning!"} />
        <StatCard icon={<Brain className="w-5 h-5 text-purple-400" />} label="Quizzes Taken" value={String(quizzesTaken)} trend={avgScore > 0 ? `Avg: ${avgScore}%` : "Take your first!"} />
        <StatCard icon={<Clock className="w-5 h-5 text-green-400" />} label="Study Time" value={`${totalMinutes}m`} trend="Keep going!" />
        <StatCard icon={<Zap className="w-5 h-5 text-yellow-400" />} label="Total XP" value={String(xp)} trend={`${xpToNext} to next level`} />
      </div>

      {/* XP Progress Bar */}
      <div className="bg-surface-100 border border-surface-200 rounded-xl p-5 mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white font-medium text-sm">Level {level} → Level {level + 1}</span>
          <span className="text-xs text-surface-400">{xp % 500} / 500 XP</span>
        </div>
        <div className="w-full h-3 bg-surface-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((xp % 500) / 500) * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-brand-400 to-purple-500 rounded-full"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 bg-surface-100 border border-surface-200 rounded-xl p-1 w-fit">
        {(["overview", "subjects", "activity"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${activeTab === tab ? "bg-brand-500/20 text-brand-400" : "text-surface-300 hover:text-white"}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-surface-100 border border-surface-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
              <button onClick={() => setActiveTab("activity")} className="text-xs text-brand-400 hover:text-brand-300">View all →</button>
            </div>
            {recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-10 h-10 text-surface-300 mx-auto mb-3" />
                <p className="text-surface-400 mb-4">No activity yet. Start exploring topics!</p>
                <Link href="/explore" className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-medium transition-colors">
                  <Play className="w-4 h-4" /> Start Learning
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.slice(0, 5).map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-surface-200/30 rounded-lg border border-surface-200/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-brand-400" />
                      </div>
                      <div>
                        <h4 className="text-sm text-white font-medium">{item.topic}</h4>
                        <p className="text-xs text-surface-400">{item.subject} • {new Date(item.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {item.score !== undefined && (
                      <span className={`text-sm font-bold ${item.score >= 70 ? "text-green-400" : item.score >= 50 ? "text-yellow-400" : "text-red-400"}`}>
                        {item.score}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommendations */}
          <div className="bg-surface-100 border border-surface-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Recommended Next</h2>
            <div className="space-y-3">
              {weakSubjects.length > 0 ? weakSubjects.map((s) => (
                <Link key={s.key} href={`/subjects/${s.key}`}>
                  <div className="p-3 bg-surface-200/30 rounded-lg border border-surface-200/50 hover:border-brand-400/30 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <span>{CURRICULUM[s.key].emoji}</span>
                      <span className="text-sm text-white font-medium">{s.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-surface-200 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-400 rounded-full" style={{ width: `${s.percent}%` }} />
                      </div>
                      <span className="text-xs text-surface-400">{s.percent}%</span>
                    </div>
                  </div>
                </Link>
              )) : (
                <>
                  <Link href="/subjects/physics">
                    <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg hover:border-blue-500/40 transition-colors cursor-pointer">
                      <h4 className="text-sm text-white font-medium mb-0.5">⚛️ Start with Physics</h4>
                      <p className="text-xs text-surface-400">32 chapters • Mechanics to Modern Physics</p>
                    </div>
                  </Link>
                  <Link href="/subjects/computer_science">
                    <div className="p-3 bg-orange-500/5 border border-orange-500/20 rounded-lg hover:border-orange-500/40 transition-colors cursor-pointer">
                      <h4 className="text-sm text-white font-medium mb-0.5">💻 Try Computer Science</h4>
                      <p className="text-xs text-surface-400">25 chapters • Programming to AI/ML</p>
                    </div>
                  </Link>
                  <Link href="/subjects/mathematics">
                    <div className="p-3 bg-purple-500/5 border border-purple-500/20 rounded-lg hover:border-purple-500/40 transition-colors cursor-pointer">
                      <h4 className="text-sm text-white font-medium mb-0.5">📐 Master Mathematics</h4>
                      <p className="text-xs text-surface-400">24 chapters • Algebra to Calculus</p>
                    </div>
                  </Link>
                </>
              )}
            </div>
            <Link href="/explore" className="block mt-4 text-center py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium text-sm transition-colors">
              Browse All Topics
            </Link>
          </div>
        </div>
      )}

      {activeTab === "subjects" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjectProgress.map((s) => (
            <Link key={s.key} href={`/subjects/${s.key}`}>
              <div className="bg-surface-100 border border-surface-200 rounded-xl p-5 hover:border-brand-400/30 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{s.emoji}</span>
                    <h3 className="text-white font-semibold">{s.label}</h3>
                  </div>
                  <ChevronRight className="w-4 h-4 text-surface-400" />
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-1 h-2 bg-surface-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${s.percent}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-brand-400 to-purple-500 rounded-full"
                    />
                  </div>
                  <span className="text-sm text-surface-300 font-medium w-12 text-right">{s.percent}%</span>
                </div>
                <div className="flex items-center justify-between text-xs text-surface-400">
                  <span>{s.completed} / {s.total} chapters completed</span>
                  <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3" /> {s.total} total</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {activeTab === "activity" && (
        <div className="bg-surface-100 border border-surface-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">All Activity</h2>
            <div className="flex items-center gap-2 text-xs text-surface-400">
              <Calendar className="w-3.5 h-3.5" /> Last 30 days
            </div>
          </div>
          {recentActivity.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-surface-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">No activity recorded yet</h3>
              <p className="text-surface-400 mb-4">Your learning history will appear here as you explore topics</p>
              <Link href="/explore" className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-medium transition-colors">
                <Sparkles className="w-4 h-4" /> Start Exploring
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 hover:bg-surface-200/30 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${item.completed ? "bg-green-400" : "bg-yellow-400"}`} />
                    <div>
                      <h4 className="text-sm text-white">{item.topic}</h4>
                      <p className="text-xs text-surface-400">{item.subject}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {item.score !== undefined && <span className="text-sm font-medium text-brand-400">{item.score}%</span>}
                    <p className="text-xs text-surface-500">{new Date(item.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick Action */}
      <div className="mt-8 bg-gradient-to-r from-brand-500/10 to-purple-500/10 border border-brand-500/20 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-500/20 rounded-xl flex items-center justify-center">
            <RotateCcw className="w-6 h-6 text-brand-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Quick Review Session</h3>
            <p className="text-surface-400 text-sm">AI-generated quiz on your recently studied topics</p>
          </div>
        </div>
        <button onClick={() => router.push("/explore")}
          className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-medium transition-colors whitespace-nowrap">
          Start Review →
        </button>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, trend }: { icon: React.ReactNode; label: string; value: string; trend: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface-100 border border-surface-200 rounded-xl p-4"
    >
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs text-surface-400">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white mb-0.5">{value}</div>
      <p className="text-xs text-surface-500">{trend}</p>
    </motion.div>
  );
}

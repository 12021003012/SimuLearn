"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Gamepad2, Trophy, Swords, Zap, Star, Lock, ChevronRight, Timer, Target, Award, Sparkles, Play, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CURRICULUM, getAllChapters } from "@/data/curriculum";

interface Quest {
  id: string;
  title: string;
  description: string;
  zone: string;
  type: "speed-quiz" | "simulation" | "boss-battle" | "exploration" | "challenge";
  xpReward: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  chapters: string[]; // chapter slugs to test
  timeLimit?: number; // seconds
  completed: boolean;
}

const ZONES = [
  { key: "physics", name: "Physics Plains", emoji: "⚡", description: "Mechanics, Waves, Electricity & Modern Physics", gradient: "from-blue-900/40 to-cyan-900/20", borderColor: "border-blue-500/30", accentColor: "text-blue-400" },
  { key: "chemistry", name: "Chemistry Caverns", emoji: "🧪", description: "Physical, Organic & Inorganic Chemistry", gradient: "from-green-900/40 to-emerald-900/20", borderColor: "border-green-500/30", accentColor: "text-green-400" },
  { key: "mathematics", name: "Math Mountains", emoji: "📐", description: "Algebra, Calculus, Geometry & Probability", gradient: "from-purple-900/40 to-pink-900/20", borderColor: "border-purple-500/30", accentColor: "text-purple-400" },
  { key: "biology", name: "Biology Forest", emoji: "🧬", description: "Cell Biology, Physiology, Genetics & Ecology", gradient: "from-emerald-900/40 to-teal-900/20", borderColor: "border-emerald-500/30", accentColor: "text-emerald-400" },
  { key: "computer_science", name: "CS Citadel", emoji: "💻", description: "DSA, Systems, Networks & AI/ML", gradient: "from-orange-900/40 to-yellow-900/20", borderColor: "border-orange-500/30", accentColor: "text-orange-400" },
  { key: "electronics", name: "Electronics Lab", emoji: "⚡", description: "Circuits, Signals, VLSI & Communications", gradient: "from-cyan-900/40 to-blue-900/20", borderColor: "border-cyan-500/30", accentColor: "text-cyan-400" },
  { key: "mechanical", name: "Mech Workshop", emoji: "⚙️", description: "Thermodynamics, Fluid Mechanics, Manufacturing", gradient: "from-slate-900/40 to-gray-900/20", borderColor: "border-slate-500/30", accentColor: "text-slate-400" },
  { key: "medicine", name: "Medical Academy", emoji: "🏥", description: "Anatomy, Physiology, Pathology & Clinical", gradient: "from-red-900/40 to-pink-900/20", borderColor: "border-red-500/30", accentColor: "text-red-400" },
];

const QUEST_TYPES: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  "speed-quiz": { label: "Speed Quiz", color: "bg-yellow-500/20 text-yellow-400", icon: Timer },
  "simulation": { label: "Simulation", color: "bg-brand-500/20 text-brand-400", icon: Zap },
  "boss-battle": { label: "Boss Battle", color: "bg-red-500/20 text-red-400", icon: Swords },
  "exploration": { label: "Exploration", color: "bg-green-500/20 text-green-400", icon: Target },
  "challenge": { label: "Challenge", color: "bg-purple-500/20 text-purple-400", icon: Award },
};

function generateQuests(): Quest[] {
  const quests: Quest[] = [];
  const subjects = Object.keys(CURRICULUM);

  // Generate 2 quests per subject
  for (const subj of subjects) {
    const chapters = getAllChapters(subj);
    if (chapters.length === 0) continue;

    // Quest 1: Speed quiz on random chapters
    const randomChapters = chapters.sort(() => Math.random() - 0.5).slice(0, 3);
    quests.push({
      id: `${subj}-speed-1`,
      title: `${CURRICULUM[subj].emoji} Quick Fire: ${CURRICULUM[subj].label}`,
      description: `Answer 5 questions from ${randomChapters.map(c => c.title).slice(0, 2).join(", ")}...`,
      zone: subj,
      type: "speed-quiz",
      xpReward: 30,
      difficulty: 2,
      chapters: randomChapters.map(c => c.slug),
      timeLimit: 120,
      completed: false,
    });

    // Quest 2: Simulation challenge
    const simChapters = chapters.filter(c => c.hasSimulation);
    if (simChapters.length > 0) {
      const simChapter = simChapters[Math.floor(Math.random() * simChapters.length)];
      quests.push({
        id: `${subj}-sim-1`,
        title: `🔬 Simulate: ${simChapter.title}`,
        description: `Explore the interactive simulation and understand ${simChapter.title}`,
        zone: subj,
        type: "simulation",
        xpReward: 50,
        difficulty: 3,
        chapters: [simChapter.slug],
        completed: false,
      });
    }
  }

  // Add boss battles
  quests.push({
    id: "boss-physics",
    title: "⚔️ Newton's Arena",
    description: "Master all 3 Newton's Laws — solve 10 advanced problems",
    zone: "physics",
    type: "boss-battle",
    xpReward: 100,
    difficulty: 4,
    chapters: ["Newton's laws of motion friction inertial frames pseudo forces"],
    timeLimit: 300,
    completed: false,
  });

  quests.push({
    id: "boss-cs",
    title: "⚔️ Algorithm Gauntlet",
    description: "Sort, search, and optimize — 8 coding challenges in 10 minutes",
    zone: "computer_science",
    type: "boss-battle",
    xpReward: 120,
    difficulty: 5,
    chapters: ["Dynamic programming memoization tabulation knapsack LCS LIS optimization"],
    timeLimit: 600,
    completed: false,
  });

  return quests;
}

export default function WorldPage() {
  const router = useRouter();
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [quests, setQuests] = useState<Quest[]>(() => generateQuests());
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);
  const [totalXp, setTotalXp] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("simulearn_xp");
    const storedCompleted = localStorage.getItem("simulearn_quests_completed");
    if (stored) setTotalXp(parseInt(stored));
    if (storedCompleted) setCompletedQuests(JSON.parse(storedCompleted));
  }, []);

  const handleStartQuest = (quest: Quest) => {
    // Navigate to the first chapter slug
    if (quest.chapters.length > 0) {
      router.push(`/learn/${encodeURIComponent(quest.chapters[0])}`);
    }
  };

  const zoneProgress = (key: string) => {
    const total = getAllChapters(key).length;
    const completed = completedQuests.filter(q => q.startsWith(key)).length;
    return total > 0 ? Math.min(Math.round((completed / total) * 100), 100) : 0;
  };

  const filteredQuests = selectedZone
    ? quests.filter(q => q.zone === selectedZone)
    : quests.slice(0, 8);

  const playerLevel = Math.floor(totalXp / 500) + 1;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-sm font-medium mb-4">
          <Gamepad2 className="w-4 h-4" />
          Learning RPG World
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">The World of Knowledge</h1>
        <p className="text-surface-300 max-w-lg mx-auto">
          Complete quests, explore zones, defeat boss challenges, and level up. Every topic mastered earns XP.
        </p>
      </div>

      {/* Player Stats Bar */}
      <div className="bg-surface-100 border border-surface-200 rounded-2xl p-5 mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-brand-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-500/20">
            {playerLevel}
          </div>
          <div>
            <div className="text-white font-semibold">Level {playerLevel} Explorer</div>
            <div className="text-xs text-surface-400">{totalXp} XP earned • {completedQuests.length} quests completed</div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-400">{quests.filter(q => q.type === "boss-battle").length}</div>
            <div className="text-xs text-surface-400">Boss Fights</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-brand-400">{ZONES.length}</div>
            <div className="text-xs text-surface-400">Zones</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-400">{quests.length}</div>
            <div className="text-xs text-surface-400">Active Quests</div>
          </div>
        </div>
      </div>

      {/* World Map Grid */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-brand-400" /> Zones
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ZONES.map((zone) => {
            const progress = zoneProgress(zone.key);
            const isSelected = selectedZone === zone.key;
            return (
              <motion.div
                key={zone.key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedZone(isSelected ? null : zone.key)}
                className={`relative rounded-2xl border p-5 transition-all cursor-pointer bg-gradient-to-br ${zone.gradient} ${isSelected ? zone.borderColor + " ring-1 ring-brand-400/30" : "border-surface-200 hover:border-surface-300"}`}
              >
                <div className="text-3xl mb-2">{zone.emoji}</div>
                <h3 className="text-white font-semibold mb-0.5">{zone.name}</h3>
                <p className="text-xs text-surface-400 mb-3 leading-relaxed">{zone.description}</p>
                <div className="flex items-center justify-between text-xs text-surface-400 mb-1.5">
                  <span>Progress</span>
                  <span className={zone.accentColor}>{progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-400 rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
                {isSelected && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Active Quests */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Swords className="w-5 h-5 text-yellow-400" />
            {selectedZone ? `Quests in ${ZONES.find(z => z.key === selectedZone)?.name}` : "Active Quests"}
          </h2>
          {selectedZone && (
            <button onClick={() => setSelectedZone(null)} className="text-sm text-brand-400 hover:text-brand-300">
              Show all →
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <AnimatePresence mode="popLayout">
            {filteredQuests.map((quest) => {
              const typeInfo = QUEST_TYPES[quest.type];
              const TypeIcon = typeInfo.icon;
              const isCompleted = completedQuests.includes(quest.id);
              return (
                <motion.div
                  key={quest.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`bg-surface-100 border rounded-xl p-5 transition-all ${isCompleted ? "border-green-500/30 opacity-60" : "border-surface-200 hover:border-brand-400/30"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${typeInfo.color}`}>
                          <TypeIcon className="w-3 h-3" /> {typeInfo.label}
                        </span>
                        {quest.timeLimit && (
                          <span className="text-xs text-surface-400 flex items-center gap-0.5">
                            <Timer className="w-3 h-3" /> {Math.floor(quest.timeLimit / 60)}m
                          </span>
                        )}
                      </div>
                      <h3 className="text-white font-semibold text-sm mb-1">{quest.title}</h3>
                      <p className="text-xs text-surface-400 leading-relaxed">{quest.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-bold text-yellow-400">+{quest.xpReward} XP</div>
                      <div className="flex items-center gap-0.5 mt-1 justify-end">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-3 h-3 ${s <= quest.difficulty ? "text-yellow-400 fill-yellow-400" : "text-surface-300"}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-surface-200/50 flex items-center justify-between">
                    <span className="text-xs text-surface-400">{ZONES.find(z => z.key === quest.zone)?.name}</span>
                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-green-400 text-xs font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                      </span>
                    ) : (
                      <button onClick={() => handleStartQuest(quest)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-medium transition-colors">
                        <Play className="w-3 h-3" /> Start Quest
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-surface-100 border border-surface-200 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" /> Achievements
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { title: "First Steps", desc: "Complete your first lesson", icon: "🚀", unlocked: totalXp > 0 },
            { title: "Quiz Master", desc: "Score 90%+ on 5 quizzes", icon: "🧠", unlocked: false },
            { title: "Sim Explorer", desc: "Try 10 simulations", icon: "🔬", unlocked: false },
            { title: "Polymath", desc: "Learn from 4+ subjects", icon: "🌟", unlocked: false },
            { title: "Speed Demon", desc: "Complete a speed quiz", icon: "⚡", unlocked: false },
            { title: "Boss Slayer", desc: "Defeat a boss battle", icon: "⚔️", unlocked: false },
            { title: "Streak King", desc: "7 day learning streak", icon: "🔥", unlocked: false },
            { title: "Centurion", desc: "Learn 100 chapters", icon: "💯", unlocked: false },
          ].map((achievement) => (
            <div key={achievement.title}
              className={`p-3 rounded-xl border text-center transition-all ${achievement.unlocked ? "border-yellow-500/30 bg-yellow-500/5" : "border-surface-200/50 opacity-50"}`}>
              <div className="text-2xl mb-1">{achievement.icon}</div>
              <h4 className={`text-xs font-semibold ${achievement.unlocked ? "text-white" : "text-surface-400"}`}>{achievement.title}</h4>
              <p className="text-[10px] text-surface-500 mt-0.5">{achievement.desc}</p>
              {achievement.unlocked && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mx-auto mt-1" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

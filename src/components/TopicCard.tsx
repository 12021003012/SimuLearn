"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Atom, Beaker, Calculator, Dna, Code2, Globe, BookOpen, Heart } from "lucide-react";
import { Subject } from "@/types";

interface TopicCardProps {
  subject: Subject;
  compact?: boolean;
}

const SUBJECT_CONFIG: Record<Subject, { icon: typeof Atom; color: string; gradient: string; label: string; description: string }> = {
  physics: {
    icon: Atom,
    color: "text-blue-400",
    gradient: "from-blue-500/20 to-cyan-500/20",
    label: "Physics",
    description: "Mechanics, Waves, Electricity & Modern Physics",
  },
  chemistry: {
    icon: Beaker,
    color: "text-green-400",
    gradient: "from-green-500/20 to-emerald-500/20",
    label: "Chemistry",
    description: "Organic, Inorganic & Physical Chemistry",
  },
  mathematics: {
    icon: Calculator,
    color: "text-purple-400",
    gradient: "from-purple-500/20 to-pink-500/20",
    label: "Mathematics",
    description: "Calculus, Algebra, Geometry & Statistics",
  },
  biology: {
    icon: Dna,
    color: "text-emerald-400",
    gradient: "from-emerald-500/20 to-teal-500/20",
    label: "Biology",
    description: "Botany, Zoology, Human Anatomy",
  },
  computer_science: {
    icon: Code2,
    color: "text-orange-400",
    gradient: "from-orange-500/20 to-yellow-500/20",
    label: "Computer Science",
    description: "Algorithms, Data Structures, AI & ML",
  },
  electronics: {
    icon: Code2,
    color: "text-cyan-400",
    gradient: "from-cyan-500/20 to-blue-500/20",
    label: "Electronics",
    description: "Circuits, Signals, VLSI & Communications",
  },
  mechanical: {
    icon: Globe,
    color: "text-slate-400",
    gradient: "from-slate-500/20 to-gray-500/20",
    label: "Mechanical",
    description: "Thermodynamics, Fluid Mechanics & Manufacturing",
  },
  medicine: {
    icon: Heart,
    color: "text-red-400",
    gradient: "from-red-500/20 to-pink-500/20",
    label: "Medical Science",
    description: "Anatomy, Physiology & Clinical Sciences",
  },
  general: {
    icon: Globe,
    color: "text-gray-400",
    gradient: "from-gray-500/20 to-slate-500/20",
    label: "General",
    description: "Cross-disciplinary topics",
  },
};

export default function TopicCard({ subject, compact }: TopicCardProps) {
  const config = SUBJECT_CONFIG[subject];
  const Icon = config.icon;

  if (compact) {
    return (
      <Link href={`/subjects/${subject}`}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r ${config.gradient} border border-surface-200 hover:border-surface-300 transition-colors cursor-pointer`}
        >
          <Icon className={`w-5 h-5 ${config.color}`} />
          <span className="text-sm font-medium text-white">{config.label}</span>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link href={`/subjects/${subject}`}>
      <motion.div
        whileHover={{ scale: 1.03, y: -4 }}
        whileTap={{ scale: 0.98 }}
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${config.gradient} border border-surface-200 hover:border-surface-300 p-6 cursor-pointer transition-colors group`}
      >
        <div className="relative z-10">
          <div className={`w-12 h-12 rounded-xl bg-surface-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
            <Icon className={`w-6 h-6 ${config.color}`} />
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">{config.label}</h3>
          <p className="text-sm text-surface-300">{config.description}</p>
        </div>
        {/* Decorative circle */}
        <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/5 group-hover:scale-150 transition-transform duration-500" />
      </motion.div>
    </Link>
  );
}

export function SubjectGrid() {
  const subjects: Subject[] = [
    "physics", "chemistry", "mathematics", "biology",
    "computer_science", "electronics", "mechanical", "medicine",
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {subjects.map((subject) => (
        <TopicCard key={subject} subject={subject} />
      ))}
    </div>
  );
}

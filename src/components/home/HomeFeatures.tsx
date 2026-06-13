"use client";

import { motion } from "framer-motion";
import { Zap, Brain, Gamepad2, FlaskConical, LineChart, Shield } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant AI Simulations",
    description: "Type any concept and get a fully interactive p5.js simulation in seconds. Adjust parameters with sliders, see real-time physics, and build deep intuition.",
    color: "text-brand-400",
    bg: "bg-brand-500/10",
    border: "border-brand-500/20",
    glow: "group-hover:shadow-brand-500/10",
  },
  {
    icon: Brain,
    title: "Adaptive Intelligence",
    description: "Our AI adjusts difficulty from CBSE basics to JEE Advanced level. Get personalized explanations based on your learning progress and speed.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    glow: "group-hover:shadow-purple-500/10",
  },
  {
    icon: Gamepad2,
    title: "Gamified Learning RPG",
    description: "Explore a virtual world where each zone is a subject. Complete quests, earn XP, unlock achievements, and level up as you master concepts.",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    glow: "group-hover:shadow-green-500/10",
  },
  {
    icon: FlaskConical,
    title: "Lab-Quality Experiments",
    description: "Every simulation includes accurate physics engines, real units, vector visualizations, and energy graphs — like having a virtual lab at home.",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    glow: "group-hover:shadow-orange-500/10",
  },
  {
    icon: LineChart,
    title: "Progress Analytics",
    description: "Track your learning streak, XP gains, topic mastery levels, and see detailed analytics on what you've learned and where to improve next.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    glow: "group-hover:shadow-cyan-500/10",
  },
  {
    icon: Shield,
    title: "Exam-Ready Content",
    description: "Content aligned with JEE, NEET, and board exam patterns. Quizzes include tricky distractors and multi-step problems from competitive exams.",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    glow: "group-hover:shadow-rose-500/10",
  },
];

export default function HomeFeatures() {
  return (
    <section className="relative z-10 py-24 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-brand-400 text-sm font-semibold uppercase tracking-wider mb-3"
        >
          Why SimuLearn?
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl font-bold text-white mb-4"
        >
          Everything You Need to Master Any Subject
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-surface-300 max-w-2xl mx-auto"
        >
          Built by students, for students. Every feature is designed to make complex concepts
          click instantly through interaction.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`group relative bg-surface-100/50 backdrop-blur-sm border border-surface-200 rounded-2xl p-7 hover:border-opacity-100 ${feature.border} transition-all duration-300 hover:shadow-xl ${feature.glow} cursor-default`}
          >
            <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}>
              <feature.icon className={`w-6 h-6 ${feature.color}`} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-brand-300 transition-colors">
              {feature.title}
            </h3>
            <p className="text-sm text-surface-300 leading-relaxed">
              {feature.description}
            </p>
            {/* Hover glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

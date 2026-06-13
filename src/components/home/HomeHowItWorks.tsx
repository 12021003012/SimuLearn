"use client";

import { motion } from "framer-motion";
import { Search, Cpu, SlidersHorizontal, Trophy } from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Ask Anything",
    description: "Type any concept — from simple to JEE Advanced level. Our AI understands context, complexity, and your learning goals.",
    color: "from-brand-500 to-cyan-500",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI Generates Lesson",
    description: "In seconds, get a complete lesson: hook, detailed explanation, mathematical derivations, interactive simulation, and an analogy.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: SlidersHorizontal,
    step: "03",
    title: "Interact & Explore",
    description: "Play with simulation sliders, change parameters, watch vectors update in real-time. Build intuition through experimentation.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Trophy,
    step: "04",
    title: "Quiz & Level Up",
    description: "Test your understanding with AI-generated quizzes. Earn XP, maintain streaks, and unlock new topics in the RPG world.",
    color: "from-orange-500 to-yellow-500",
  },
];

export default function HomeHowItWorks() {
  return (
    <section className="relative z-10 py-24 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-brand-400 text-sm font-semibold uppercase tracking-wider mb-3"
        >
          How It Works
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl font-bold text-white mb-4"
        >
          From Question to Mastery in 4 Steps
        </motion.h2>
      </div>

      <div className="relative">
        {/* Connecting line */}
        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-500/30 via-purple-500/30 to-orange-500/30 -translate-y-1/2" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative text-center group"
            >
              {/* Step number badge */}
              <div className="relative inline-flex mb-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} p-[1px] transition-transform duration-300 group-hover:scale-110`}>
                  <div className="w-full h-full rounded-2xl bg-surface-100 flex items-center justify-center">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-surface-100 border border-surface-200 rounded-full text-xs font-bold text-brand-400 flex items-center justify-center">
                  {index + 1}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-surface-300 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

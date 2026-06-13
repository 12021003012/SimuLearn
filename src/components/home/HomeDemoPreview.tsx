"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Play, Pause, RotateCcw, Maximize2, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function HomeDemoPreview() {
  const [activeTab, setActiveTab] = useState<"simulation" | "explanation" | "quiz">("simulation");

  return (
    <section className="relative z-10 py-16 px-4 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Tab selector */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-surface-100 border border-surface-200 rounded-xl p-1 gap-1">
            {[
              { id: "simulation" as const, label: "🧪 Simulation" },
              { id: "explanation" as const, label: "📖 Explanation" },
              { id: "quiz" as const, label: "❓ Quiz" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
                    : "text-surface-300 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Demo window */}
        <div className="bg-surface-100 border border-surface-200 rounded-2xl overflow-hidden shadow-2xl shadow-black/20">
          {/* Window header */}
          <div className="px-4 py-3 border-b border-surface-200 flex items-center justify-between bg-[#1e293b]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-3 text-xs text-surface-300">simulearn.app/learn/projectile-motion</span>
            </div>
            <div className="flex items-center gap-2">
              {activeTab === "simulation" && (
                <Link href="/simulations" className="flex items-center gap-1 px-2.5 py-1 rounded-md hover:bg-surface-200 text-surface-300 hover:text-white text-xs transition-colors">
                  <ExternalLink className="w-3 h-3" /> All Simulations
                </Link>
              )}
            </div>
          </div>

          {/* Content area */}
          <div className="relative h-[400px] md:h-[500px] bg-[#0f172a] overflow-hidden">
            {activeTab === "simulation" && <SimulationPreview />}
            {activeTab === "explanation" && <ExplanationPreview />}
            {activeTab === "quiz" && <QuizPreview />}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-4">
          <p className="text-xs text-surface-300/60">
            ↑ This is a LIVE interactive simulation. Drag to aim, sliders to tune physics.
          </p>
          <Link href="/simulations" className="text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors">
            Browse all 16 simulations →
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

function SimulationPreview() {
  return (
    <iframe
      src="/simulations/physics/projectile-motion.html"
      className="w-full h-full"
      style={{ border: "none" }}
      sandbox="allow-scripts allow-same-origin"
      title="Projectile Motion — Interactive Demo"
      loading="lazy"
    />
  );
}

function ExplanationPreview() {
  return (
    <div className="h-full p-8 overflow-y-auto">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Hook */}
        <div className="bg-brand-500/10 border border-brand-500/20 rounded-xl p-4">
          <p className="text-brand-300 text-sm leading-relaxed">
            🎯 Every time you throw a ball, kick a football, or watch fireworks explode in the sky — you&apos;re watching projectile motion in action. The same equations that describe a cricket ball&apos;s trajectory were used to land rovers on Mars!
          </p>
        </div>

        {/* Explanation */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-white">What is Projectile Motion?</h2>
          <p className="text-sm text-surface-300 leading-relaxed">
            A <strong className="text-white">projectile</strong> is any object that is given an initial velocity and then moves under the influence of gravity alone. The key insight is that horizontal and vertical motions are <strong className="text-white">independent</strong> of each other.
          </p>
          <div className="bg-surface-100 rounded-lg p-4 border border-surface-200 font-mono text-sm text-center">
            <span className="text-brand-400">x(t)</span> = v₀ cos(θ) · t
            <br />
            <span className="text-green-400">y(t)</span> = v₀ sin(θ) · t - ½gt²
          </div>
        </div>

        {/* Math section preview */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">📐 Derivation: Maximum Range</h3>
          <div className="bg-surface-100 rounded-lg p-4 border border-surface-200 text-sm text-surface-300 space-y-1 font-mono">
            <p>R = (v₀² sin 2θ) / g</p>
            <p className="text-surface-300/60">For maximum R: d/dθ [sin 2θ] = 0</p>
            <p className="text-brand-400">∴ θ = 45° gives maximum range</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuizPreview() {
  return (
    <div className="h-full p-8 flex items-center justify-center">
      <div className="max-w-lg w-full">
        <div className="bg-surface-100 border border-surface-200 rounded-2xl p-6">
          {/* Progress */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-surface-300">Question 2 of 4</span>
            <span className="text-xs text-brand-400 font-semibold">+50 XP</span>
          </div>
          <div className="h-1 bg-surface-200 rounded-full mb-6">
            <div className="h-full w-1/2 bg-brand-500 rounded-full" />
          </div>

          {/* Question */}
          <h3 className="text-white font-semibold mb-5 leading-relaxed">
            A projectile is launched at 60° with velocity 40 m/s. What is the ratio of its kinetic energy at the highest point to its kinetic energy at launch?
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {[
              { label: "A", text: "1:4", state: "default" },
              { label: "B", text: "1:2", state: "default" },
              { label: "C", text: "3:4", state: "selected" },
              { label: "D", text: "1:1", state: "default" },
            ].map((opt) => (
              <div
                key={opt.label}
                className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                  opt.state === "selected"
                    ? "border-brand-500 bg-brand-500/10"
                    : "border-surface-200 hover:border-surface-300"
                }`}
              >
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                  opt.state === "selected"
                    ? "bg-brand-500 text-white"
                    : "bg-surface-200 text-surface-300"
                }`}>
                  {opt.label}
                </span>
                <span className="text-sm text-white">{opt.text}</span>
              </div>
            ))}
          </div>

          {/* Submit button */}
          <button className="w-full mt-5 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold rounded-xl text-sm">
            Check Answer
          </button>
        </div>
      </div>
    </div>
  );
}

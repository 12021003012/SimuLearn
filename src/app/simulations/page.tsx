"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Beaker, Search, Maximize2, Minimize2, X, Atom, FlaskConical, Calculator, Code2, Heart, Cpu, Zap } from "lucide-react";
import { PREBUILT_SIMULATIONS, SimulationMapping } from "@/data/simulations";

const RULE_BASED_TEMPLATES = [
  { id: "projectile-motion", title: "Projectile Motion Lab", desc: "Launch angle, velocity, gravity — see parabolic arcs in real-time", color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30" },
  { id: "simple-harmonic-motion", title: "Simple Harmonic Motion", desc: "Spring-mass system with damping, energy graphs", color: "from-green-500/20 to-emerald-500/20 border-green-500/30" },
  { id: "pendulum", title: "Simple Pendulum", desc: "Vary length, gravity, angle — watch period change", color: "from-purple-500/20 to-violet-500/20 border-purple-500/30" },
  { id: "wave-motion", title: "Transverse Wave", desc: "Amplitude, wavelength, frequency — animated wave propagation", color: "from-pink-500/20 to-rose-500/20 border-pink-500/30" },
  { id: "ohms-law", title: "Ohm's Law Circuit", desc: "Voltage, resistance → current, power with electron animation", color: "from-orange-500/20 to-amber-500/20 border-orange-500/30" },
  { id: "lens-optics", title: "Thin Lens Optics", desc: "Object/focal length → image position with ray diagram", color: "from-cyan-500/20 to-sky-500/20 border-cyan-500/30" },
];

type Category = "all" | "physics" | "chemistry" | "math" | "cs" | "biology";

const CATEGORIES: { id: Category; label: string; icon: React.ReactNode; color: string }[] = [
  { id: "all", label: "All", icon: <Beaker className="w-4 h-4" />, color: "text-brand-400" },
  { id: "physics", label: "Physics", icon: <Atom className="w-4 h-4" />, color: "text-blue-400" },
  { id: "chemistry", label: "Chemistry", icon: <FlaskConical className="w-4 h-4" />, color: "text-green-400" },
  { id: "math", label: "Mathematics", icon: <Calculator className="w-4 h-4" />, color: "text-purple-400" },
  { id: "cs", label: "Computer Science", icon: <Code2 className="w-4 h-4" />, color: "text-orange-400" },
  { id: "biology", label: "Biology", icon: <Heart className="w-4 h-4" />, color: "text-pink-400" },
];

function getCategory(path: string): Category {
  if (path.includes("/physics/")) return "physics";
  if (path.includes("/chemistry/")) return "chemistry";
  if (path.includes("/math/")) return "math";
  if (path.includes("/cs/")) return "cs";
  if (path.includes("/biology/")) return "biology";
  return "all";
}

function getCategoryColor(cat: Category): string {
  const map: Record<Category, string> = {
    all: "from-brand-500/20 to-purple-500/20 border-brand-500/30",
    physics: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
    chemistry: "from-green-500/20 to-emerald-500/20 border-green-500/30",
    math: "from-purple-500/20 to-violet-500/20 border-purple-500/30",
    cs: "from-orange-500/20 to-amber-500/20 border-orange-500/30",
    biology: "from-pink-500/20 to-rose-500/20 border-pink-500/30",
  };
  return map[cat];
}

export default function SimulationsPage() {
  const [category, setCategory] = useState<Category>("all");
  const [search, setSearch] = useState("");
  const [activeSimulation, setActiveSimulation] = useState<SimulationMapping | null>(null);
  const [ruleBasedSrc, setRuleBasedSrc] = useState<string | null>(null);
  const [ruleBasedTitle, setRuleBasedTitle] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const filtered = useMemo(() => {
    return PREBUILT_SIMULATIONS.filter((sim) => {
      const matchesCat = category === "all" || getCategory(sim.path) === category;
      const matchesSearch = !search || sim.title.toLowerCase().includes(search.toLowerCase()) || sim.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [category, search]);

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500/10 border border-brand-500/30 rounded-full text-brand-400 text-sm mb-4">
            <Beaker className="w-4 h-4" /> Interactive Lab
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Simulation Gallery</h1>
          <p className="text-surface-300 max-w-2xl mx-auto">
            Explore {PREBUILT_SIMULATIONS.length} hand-crafted interactive simulations. Click to launch — no AI wait time, instant interaction.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
          {/* Category pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <button key={cat.id} onClick={() => setCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  category === cat.id
                    ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
                    : "bg-surface-100 text-surface-300 border border-surface-200 hover:border-surface-300 hover:text-white"
                }`}>
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64 ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search simulations..."
              className="w-full pl-9 pr-4 py-2.5 bg-surface-100 border border-surface-200 rounded-xl text-white text-sm placeholder-surface-400 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((sim) => {
              const cat = getCategory(sim.path);
              return (
                <motion.div
                  key={sim.path}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -4 }}
                  className={`bg-gradient-to-br ${getCategoryColor(cat)} border rounded-xl overflow-hidden cursor-pointer group`}
                  onClick={() => setActiveSimulation(sim)}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-surface-400" />
                        <span className="text-xs text-surface-400 uppercase font-semibold tracking-wide">{cat}</span>
                      </div>
                      <div className="px-2 py-0.5 bg-green-500/20 border border-green-500/30 rounded-full text-[10px] text-green-400 font-semibold">
                        READY
                      </div>
                    </div>
                    <h3 className="text-white font-semibold text-base mb-2 group-hover:text-brand-300 transition-colors">
                      {sim.title}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {sim.keywords.slice(0, 4).map((kw) => (
                        <span key={kw} className="px-2 py-0.5 bg-surface-200/50 rounded text-[10px] text-surface-400">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="px-5 pb-4">
                    <button className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white font-medium transition-all group-hover:bg-brand-500/20 group-hover:border-brand-500/30">
                      ▶ Launch Simulation
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Beaker className="w-12 h-12 text-surface-400 mx-auto mb-4 opacity-50" />
            <p className="text-surface-400 text-lg">No simulations found for &quot;{search}&quot;</p>
            <p className="text-surface-500 text-sm mt-1">Try a different search term or category</p>
          </div>
        )}

        {/* Generate Instantly — Rule-Based Engine */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-14"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-full">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-xs text-yellow-400 font-semibold">INSTANT</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Generate Instantly</h2>
              <p className="text-xs text-surface-400">Rule-based engine — no AI wait time, deterministic physics</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {RULE_BASED_TEMPLATES.map((tmpl) => (
              <motion.button
                key={tmpl.id}
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setRuleBasedSrc(`/api/simulate-rule?template=${tmpl.id}`); setRuleBasedTitle(tmpl.title); }}
                className={`text-left bg-gradient-to-br ${tmpl.color} border rounded-xl p-4 transition-all hover:shadow-lg`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-3.5 h-3.5 text-yellow-400" />
                  <span className="text-white font-semibold text-sm">{tmpl.title}</span>
                </div>
                <p className="text-surface-400 text-xs leading-relaxed">{tmpl.desc}</p>
                <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-md text-[10px] text-surface-300 font-medium">
                  ⚡ Zero latency • Pure physics
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Rule-Based Simulation Modal */}
      <AnimatePresence>
        {ruleBasedSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => { setRuleBasedSrc(null); setIsFullscreen(false); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`bg-surface-100 border border-surface-200 rounded-2xl overflow-hidden shadow-2xl ${
                isFullscreen ? "fixed inset-2" : "w-full max-w-5xl h-[80vh]"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-surface-200 bg-[#1e293b]">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-sm text-white font-medium">{ruleBasedTitle}</span>
                  <span className="px-2 py-0.5 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-[10px] text-yellow-400 font-semibold">
                    ⚡ RULE-BASED
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-1.5 rounded-lg hover:bg-surface-200 text-surface-400 hover:text-white transition-colors">
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                  <button onClick={() => { setRuleBasedSrc(null); setIsFullscreen(false); }}
                    className="p-1.5 rounded-lg hover:bg-surface-200 text-surface-400 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <iframe
                src={ruleBasedSrc}
                className="w-full h-[calc(100%-48px)]"
                style={{ border: "none" }}
                sandbox="allow-scripts allow-same-origin"
                title={ruleBasedTitle}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simulation Modal */}
      <AnimatePresence>
        {activeSimulation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => { setActiveSimulation(null); setIsFullscreen(false); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`bg-surface-100 border border-surface-200 rounded-2xl overflow-hidden shadow-2xl ${
                isFullscreen ? "fixed inset-2" : "w-full max-w-5xl h-[80vh]"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-surface-200 bg-[#1e293b]">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-sm text-white font-medium">{activeSimulation.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-1.5 rounded-lg hover:bg-surface-200 text-surface-400 hover:text-white transition-colors">
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                  <button onClick={() => { setActiveSimulation(null); setIsFullscreen(false); }}
                    className="p-1.5 rounded-lg hover:bg-surface-200 text-surface-400 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {/* Iframe */}
              <iframe
                src={activeSimulation.path}
                className="w-full h-[calc(100%-48px)]"
                style={{ border: "none" }}
                sandbox="allow-scripts allow-same-origin"
                title={activeSimulation.title}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Lightbulb, Cpu, Wifi, Heart, Plane, Snowflake, MapPin, Music, Eye } from "lucide-react";

const MECHANISMS = [
  { query: "How does WiFi work?", icon: Wifi, color: "from-blue-500 to-cyan-500" },
  { query: "How does a phone count steps?", icon: Cpu, color: "from-purple-500 to-pink-500" },
  { query: "How does GPS determine location?", icon: MapPin, color: "from-green-500 to-emerald-500" },
  { query: "How does a touchscreen detect fingers?", icon: Eye, color: "from-orange-500 to-yellow-500" },
  { query: "How does an airplane stay in the air?", icon: Plane, color: "from-sky-500 to-blue-500" },
  { query: "How does a refrigerator cool food?", icon: Snowflake, color: "from-cyan-500 to-blue-500" },
  { query: "How does Spotify recommend songs?", icon: Music, color: "from-green-500 to-lime-500" },
  { query: "How does a vaccine train the immune system?", icon: Heart, color: "from-red-500 to-pink-500" },
];

export default function HowItWorksPage() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/learn/${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-full text-orange-400 text-sm mb-6">
          <Lightbulb className="w-4 h-4" />
          Real-World Mechanism Explorer
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          How Does <span className="gradient-text">Anything</span> Work?
        </h1>
        <p className="text-lg text-surface-300 max-w-2xl mx-auto">
          Ask about any technology, device, or natural phenomenon. Get a multi-layered explanation
          from simple analogy to mathematical model, with interactive simulations.
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-16">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-300" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="How does ___ work?"
            className="w-full py-4 pl-14 pr-6 bg-surface-100 border border-surface-200 rounded-2xl text-white text-lg placeholder:text-surface-300 focus:outline-none focus:border-brand-400 transition-colors"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors"
          >
            Explore
          </button>
        </div>
      </form>

      {/* Mechanism Cards */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-6">Popular Mechanisms</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MECHANISMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.query}
                onClick={() => router.push(`/learn/${encodeURIComponent(item.query)}`)}
                className="text-left bg-surface-100 border border-surface-200 hover:border-surface-300 rounded-xl p-5 transition-all hover:scale-[1.02] group"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm text-white font-medium leading-snug">{item.query}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation Layers Preview */}
      <div className="mt-16 bg-surface-100 rounded-2xl border border-surface-200 p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Multi-Layer Explanations</h2>
        <p className="text-surface-300 mb-8">
          Every mechanism is explained at 4 levels of depth — from simple analogies to engineering specs.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { level: "Layer 1", title: "Simple Analogy", desc: "Like explaining to a 10-year-old", color: "border-green-500/30 bg-green-500/5" },
            { level: "Layer 2", title: "Physical Principle", desc: "Class 11-12 science level", color: "border-blue-500/30 bg-blue-500/5" },
            { level: "Layer 3", title: "Mathematical Model", desc: "JEE/NEET competitive level", color: "border-purple-500/30 bg-purple-500/5" },
            { level: "Layer 4", title: "Engineering Detail", desc: "Real-world implementation", color: "border-orange-500/30 bg-orange-500/5" },
          ].map((layer) => (
            <div key={layer.level} className={`rounded-xl border p-4 ${layer.color}`}>
              <span className="text-xs font-medium text-surface-300">{layer.level}</span>
              <h3 className="text-white font-semibold mt-1">{layer.title}</h3>
              <p className="text-xs text-surface-300 mt-1">{layer.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, ArrowRight, Clock, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { searchChapters } from "@/data/curriculum";

const POPULAR: string[] = [
  "How does WiFi work?",
  "Explain Newton's Laws of Motion",
  "Photosynthesis step by step",
  "Bubble sort visualized",
  "What is quantum entanglement?",
  "How does a refrigerator cool food?",
  "Explain DNA replication",
  "How does GPS determine location?",
];

export default function SearchHero() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{ title: string; slug: string; type: "chapter" | "popular" }>>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setSuggestions(POPULAR.slice(0, 5).map((s) => ({ title: s, slug: s, type: "popular" })));
      setSelectedIndex(-1);
      return;
    }
    const chapters = searchChapters(query).slice(0, 4).map((c) => ({
      title: c.title,
      slug: c.slug,
      type: "chapter" as const,
    }));
    const aiOption = { title: `Ask AI: "${query}"`, slug: query, type: "popular" as const };
    setSuggestions([...chapters, aiOption]);
    setSelectedIndex(-1);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/learn/${encodeURIComponent(query.trim())}`);
  };

  const handleSuggestionClick = (slug: string) => {
    router.push(`/learn/${encodeURIComponent(slug)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isFocused || suggestions.length === 0) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex((i) => Math.min(i + 1, suggestions.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIndex((i) => Math.max(i - 1, -1)); }
    else if (e.key === "Enter" && selectedIndex >= 0) { e.preventDefault(); handleSuggestionClick(suggestions[selectedIndex].slug); }
    else if (e.key === "Escape") { setIsFocused(false); inputRef.current?.blur(); }
  };

  const showDropdown = isFocused && suggestions.length > 0;

  return (
    <div className="relative w-full max-w-3xl mx-auto min-h-[140px]">
      <div className="absolute -inset-4 bg-gradient-to-r from-brand-400/20 via-purple-500/20 to-brand-400/20 rounded-3xl blur-xl opacity-60 pointer-events-none" />

      <form onSubmit={handleSubmit} className="relative z-10">
        <div className={`relative flex items-center bg-surface-100 border rounded-2xl transition-all duration-300 ${isFocused ? "border-brand-400 shadow-lg shadow-brand-400/20" : "border-surface-200 hover:border-surface-300"}`}>
          <Search className="absolute left-5 w-5 h-5 text-surface-300" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 150)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything — Newton's laws, photosynthesis, bubble sort…"
            className="w-full py-5 pl-14 pr-32 bg-transparent text-white text-lg placeholder:text-surface-400 focus:outline-none rounded-2xl"
            autoComplete="off"
          />
          <button type="submit" className="absolute right-3 flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-brand-500/20">
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Learn</span>
          </button>
        </div>

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 right-0 mt-2 bg-surface-100 border border-surface-200 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-50"
            >
              {!query.trim() && (
                <div className="px-4 pt-3 pb-1 text-xs text-surface-400 font-medium uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> Popular Questions
                </div>
              )}
              {query.trim() && suggestions.some((s) => s.type === "chapter") && (
                <div className="px-4 pt-3 pb-1 text-xs text-surface-400 font-medium uppercase tracking-wider">Curriculum Chapters</div>
              )}
              {suggestions.map((suggestion, i) => {
                const isSelected = i === selectedIndex;
                const isLastAI = suggestion.type === "popular" && query.trim() && i === suggestions.length - 1;
                return (
                  <div key={i}>
                    {isLastAI && suggestions.some((s) => s.type === "chapter") && (
                      <div className="px-4 pt-2 pb-1 text-xs text-surface-400 font-medium uppercase tracking-wider flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-brand-400" /> Or ask the AI
                      </div>
                    )}
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSuggestionClick(suggestion.slug)}
                      className={`w-full text-left flex items-center gap-3 px-4 py-3 transition-colors ${isSelected ? "bg-brand-500/15 text-brand-300" : "hover:bg-surface-200 text-white"}`}
                    >
                      {isLastAI ? <Sparkles className="w-4 h-4 text-brand-400 flex-shrink-0" /> : <ArrowRight className="w-4 h-4 text-surface-400 flex-shrink-0" />}
                      <span className="truncate">{suggestion.title}</span>
                    </button>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      <AnimatePresence>
        {!isFocused && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-5 flex flex-wrap gap-2 justify-center">
            {POPULAR.slice(0, 4).map((s) => (
              <button key={s} onClick={() => router.push(`/learn/${encodeURIComponent(s)}`)}
                className="px-4 py-2 text-sm text-surface-300 bg-surface-100/50 hover:bg-surface-100 border border-surface-200 hover:border-brand-400/50 rounded-full transition-all hover:text-brand-300 cursor-pointer">
                {s}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, TrendingUp, Filter, BookOpen, Zap, Clock, ChevronRight, Sparkles, GraduationCap, Atom, Beaker, Calculator, Code2, Dna, Heart, Cpu, Wrench } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CURRICULUM, searchChapters, getTotalStats, type Chapter } from "@/data/curriculum";

const SUBJECT_META: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  physics: { icon: Atom, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30" },
  chemistry: { icon: Beaker, color: "text-green-400", bg: "bg-green-500/10 border-green-500/30" },
  mathematics: { icon: Calculator, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/30" },
  biology: { icon: Dna, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30" },
  computer_science: { icon: Code2, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/30" },
  electronics: { icon: Cpu, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/30" },
  mechanical: { icon: Wrench, color: "text-slate-400", bg: "bg-slate-500/10 border-slate-500/30" },
  medicine: { icon: Heart, color: "text-red-400", bg: "bg-red-500/10 border-red-500/30" },
};

const DIFF_LABEL = ["", "Beginner", "Basic", "Intermediate", "Advanced", "Expert"];
const DIFF_COLOR = ["", "text-green-400", "text-green-400", "text-yellow-400", "text-orange-400", "text-red-400"];

const ALL_TAGS = ["All", "JEE Main", "JEE Advanced", "NEET", "B.Tech", "GATE", "AI/ML", "MBBS Phase 1", "DSA"];

export default function ExplorePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const stats = getTotalStats();

  const results = useMemo(() => {
    if (searchQuery.trim().length >= 2) {
      let chapters = searchChapters(searchQuery);
      if (selectedSubject !== "all") chapters = chapters.filter((c) => c.subject === selectedSubject);
      if (selectedTag !== "All") chapters = chapters.filter((c) => c.tags.some((t) => t === selectedTag));
      if (selectedDifficulty > 0) chapters = chapters.filter((c) => c.difficulty === selectedDifficulty);
      return chapters;
    }

    // No search: show chapters from selected subject or popular across all
    const allChapters: Array<Chapter & { subject: string }> = [];
    const subjects = selectedSubject === "all" ? Object.keys(CURRICULUM) : [selectedSubject];
    for (const subj of subjects) {
      const curr = CURRICULUM[subj];
      if (!curr) continue;
      for (const group of curr.groups) {
        for (const chapter of group.chapters) {
          allChapters.push({ ...chapter, subject: subj });
        }
      }
    }
    let filtered = allChapters;
    if (selectedTag !== "All") filtered = filtered.filter((c) => c.tags.some((t) => t === selectedTag));
    if (selectedDifficulty > 0) filtered = filtered.filter((c) => c.difficulty === selectedDifficulty);
    return filtered.slice(0, 30);
  }, [searchQuery, selectedSubject, selectedTag, selectedDifficulty]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) router.push(`/learn/${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Explore Topics</h1>
          <p className="text-surface-300">
            {stats.totalChapters} chapters across {stats.totalSubjects} subjects • {stats.totalSimulations} interactive simulations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-medium transition-colors ${showFilters ? "bg-brand-500/10 border-brand-500/30 text-brand-400" : "border-surface-200 text-surface-300 hover:border-surface-300"}`}>
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative max-w-3xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chapters, topics, or ask any question…"
            className="w-full py-3.5 pl-12 pr-28 bg-surface-100 border border-surface-200 rounded-xl text-white placeholder:text-surface-400 focus:outline-none focus:border-brand-400 transition-colors"
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-sm font-medium transition-colors">
            <Sparkles className="w-3.5 h-3.5" /> Ask AI
          </button>
        </div>
      </form>

      {/* Subject Pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => setSelectedSubject("all")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium border transition-colors ${selectedSubject === "all" ? "bg-brand-500/10 border-brand-500/30 text-brand-400" : "border-surface-200 text-surface-300 hover:border-surface-300"}`}>
          <GraduationCap className="w-4 h-4" /> All Subjects
        </button>
        {Object.entries(SUBJECT_META).map(([key, { icon: Icon, color, bg }]) => (
          <button key={key} onClick={() => setSelectedSubject(key)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium border transition-colors ${selectedSubject === key ? bg + " " + color : "border-surface-200 text-surface-300 hover:border-surface-300"}`}>
            <Icon className="w-4 h-4" /> {CURRICULUM[key]?.label.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* Filters panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-6">
            <div className="bg-surface-100 border border-surface-200 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tag filter */}
              <div>
                <label className="text-xs font-medium text-surface-400 mb-2 block">Exam / Category</label>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_TAGS.map((tag) => (
                    <button key={tag} onClick={() => setSelectedTag(tag)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${selectedTag === tag ? "bg-brand-500/10 border-brand-500/30 text-brand-400" : "border-surface-200 text-surface-400 hover:text-white"}`}>
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              {/* Difficulty filter */}
              <div>
                <label className="text-xs font-medium text-surface-400 mb-2 block">Difficulty</label>
                <div className="flex flex-wrap gap-1.5">
                  {[0, 1, 2, 3, 4, 5].map((d) => (
                    <button key={d} onClick={() => setSelectedDifficulty(d)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${selectedDifficulty === d ? "bg-brand-500/10 border-brand-500/30 text-brand-400" : "border-surface-200 text-surface-400 hover:text-white"}`}>
                      {d === 0 ? "Any" : DIFF_LABEL[d]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results count */}
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-brand-400" />
        <span className="text-sm text-surface-300">
          {searchQuery.trim().length >= 2
            ? `${results.length} result${results.length !== 1 ? "s" : ""} for "${searchQuery}"`
            : `Showing ${results.length} chapters`}
        </span>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {results.map((chapter) => {
          const meta = SUBJECT_META[chapter.subject];
          const SubIcon = meta?.icon ?? BookOpen;
          return (
            <Link key={chapter.id + chapter.subject} href={`/learn/${encodeURIComponent(chapter.slug)}`}>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="group bg-surface-100 border border-surface-200 hover:border-brand-400/40 rounded-xl p-4 transition-all duration-200 hover:shadow-lg hover:shadow-brand-500/5 cursor-pointer h-full flex flex-col"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium ${meta?.bg ?? "bg-gray-500/10"} border`}>
                    <SubIcon className={`w-3 h-3 ${meta?.color ?? "text-gray-400"}`} />
                    <span className={meta?.color ?? "text-gray-400"}>{CURRICULUM[chapter.subject]?.label.split(" ")[0]}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-surface-400 group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </div>
                <h3 className="text-white font-semibold text-sm leading-snug mb-1 group-hover:text-brand-300 transition-colors">{chapter.title}</h3>
                <p className="text-surface-400 text-xs leading-relaxed mb-auto flex-1">{chapter.description}</p>
                <div className="flex items-center gap-2 flex-wrap mt-3 pt-2 border-t border-surface-200/50">
                  <span className={`text-xs font-medium ${DIFF_COLOR[chapter.difficulty]}`}>{DIFF_LABEL[chapter.difficulty]}</span>
                  <span className="flex items-center gap-0.5 text-xs text-surface-400"><Clock className="w-3 h-3" />{chapter.estimatedMin}m</span>
                  {chapter.hasSimulation && <span className="flex items-center gap-0.5 text-xs text-brand-400"><Zap className="w-3 h-3" />Sim</span>}
                  {chapter.tags.slice(0, 1).map((tag) => (
                    <span key={tag} className="ml-auto px-1.5 py-0.5 bg-surface-200 text-surface-400 rounded text-[10px]">{tag}</span>
                  ))}
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {results.length === 0 && (
        <div className="text-center py-16">
          <Search className="w-12 h-12 text-surface-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No chapters found</h3>
          <p className="text-surface-400 mb-4">Try a different search or adjust your filters</p>
          <button onClick={() => { setSearchQuery(""); setSelectedSubject("all"); setSelectedTag("All"); setSelectedDifficulty(0); }}
            className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-medium transition-colors">
            Clear Filters
          </button>
        </div>
      )}

      {/* Quick Subject Navigation */}
      <div className="mt-12 border-t border-surface-200 pt-8">
        <h2 className="text-xl font-bold text-white mb-4">Browse by Subject</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(CURRICULUM).map(([key, curr]) => {
            const meta = SUBJECT_META[key];
            const Icon = meta?.icon ?? BookOpen;
            const chapterCount = curr.groups.flatMap((g) => g.chapters).length;
            return (
              <Link key={key} href={`/subjects/${key}`}>
                <div className={`group p-4 rounded-xl border transition-all hover:scale-[1.02] ${meta?.bg ?? "bg-surface-100 border-surface-200"} cursor-pointer`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-5 h-5 ${meta?.color ?? "text-gray-400"}`} />
                    <span className="text-white font-medium text-sm">{curr.label}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-surface-400">{chapterCount} chapters</span>
                    <ChevronRight className="w-3.5 h-3.5 text-surface-400 group-hover:text-brand-400 transition-colors" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

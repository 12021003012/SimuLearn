import { CURRICULUM } from "@/data/curriculum";
import Link from "next/link";
import { Atom, Beaker, Calculator, Dna, Code2, BookOpen, Globe, Heart, ArrowRight, GraduationCap } from "lucide-react";

const ICONS: Record<string, React.ElementType> = {
  physics: Atom,
  chemistry: Beaker,
  mathematics: Calculator,
  biology: Dna,
  computer_science: Code2,
  electronics: Code2,
  mechanical: Globe,
  medicine: Heart,
  general: GraduationCap,
};

const COLORS: Record<string, string> = {
  physics: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 hover:border-blue-400/60",
  chemistry: "from-green-500/20 to-emerald-500/20 border-green-500/30 hover:border-green-400/60",
  mathematics: "from-purple-500/20 to-pink-500/20 border-purple-500/30 hover:border-purple-400/60",
  biology: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 hover:border-emerald-400/60",
  computer_science: "from-orange-500/20 to-yellow-500/20 border-orange-500/30 hover:border-orange-400/60",
  electronics: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30 hover:border-cyan-400/60",
  mechanical: "from-slate-500/20 to-gray-500/20 border-slate-500/30 hover:border-slate-400/60",
  medicine: "from-red-500/20 to-pink-500/20 border-red-500/30 hover:border-red-400/60",
};

const ICON_COLORS: Record<string, string> = {
  physics: "text-blue-400",
  chemistry: "text-green-400",
  mathematics: "text-purple-400",
  biology: "text-emerald-400",
  computer_science: "text-orange-400",
  electronics: "text-cyan-400",
  mechanical: "text-slate-400",
  medicine: "text-red-400",
};

export default function SubjectsPage() {
  const subjects = Object.values(CURRICULUM);
  const totalChapters = subjects.reduce((sum, s) => sum + s.groups.flatMap((g) => g.chapters).length, 0);

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500/10 border border-brand-500/30 rounded-full text-brand-400 text-sm mb-4">
          <GraduationCap className="w-4 h-4" />
          Complete Curriculum
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          All <span className="gradient-text">Subjects</span>
        </h1>
        <p className="text-surface-300 text-lg max-w-2xl mx-auto">
          Browse {totalChapters}+ hand-curated chapters across {subjects.length} subjects — designed for JEE, NEET, CBSE and beyond.
          Each chapter gets an AI-generated interactive lesson with simulations.
        </p>
      </div>

      {/* Subject grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => {
          const Icon = ICONS[subject.subject] ?? GraduationCap;
          const colorClass = COLORS[subject.subject] ?? "from-gray-500/20 to-slate-500/20 border-gray-500/30 hover:border-gray-400/60";
          const iconColor = ICON_COLORS[subject.subject] ?? "text-gray-400";
          const totalChaps = subject.groups.flatMap((g) => g.chapters).length;

          return (
            <Link key={subject.subject} href={`/subjects/${subject.subject}`}>
              <div className={`group bg-gradient-to-br ${colorClass} border rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20 cursor-pointer h-full`}>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-black/20 flex items-center justify-center flex-shrink-0">
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{subject.emoji}</span>
                      <h2 className="text-xl font-bold text-white truncate">{subject.label}</h2>
                    </div>
                    <p className="text-surface-300 text-sm">{subject.tagline}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {subject.groups.map((g) => (
                    <span key={g.title} className="px-2 py-0.5 bg-black/20 rounded-full text-xs text-surface-300">
                      {g.title}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-400">
                    {totalChaps} chapters · {subject.groups.length} units
                  </span>
                  <ArrowRight className={`w-4 h-4 ${iconColor} group-hover:translate-x-1 transition-transform`} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* CTA */}
      <div className="mt-16 text-center p-8 bg-gradient-to-r from-brand-500/10 to-purple-500/10 border border-brand-500/20 rounded-2xl">
        <h2 className="text-2xl font-bold text-white mb-2">Don&apos;t see your topic?</h2>
        <p className="text-surface-300 mb-4">Ask the AI anything — it generates custom lessons on-the-fly</p>
        <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-colors">
          Ask a Question
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </main>
  );
}

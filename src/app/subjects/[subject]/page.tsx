import { notFound } from "next/navigation";
import Link from "next/link";
import { getSubjectCurriculum } from "@/data/curriculum";
import { Atom, Beaker, Calculator, Dna, Code2, BookOpen, Globe, Heart, GraduationCap, Clock, Zap, ChevronRight, Sparkles, BookMarked } from "lucide-react";

const ICONS: Record<string, React.ElementType> = {
  physics: Atom,
  chemistry: Beaker,
  mathematics: Calculator,
  biology: Dna,
  computer_science: Code2,
  electronics: Zap,
  mechanical: Globe,
  medicine: Heart,
  general: GraduationCap,
};

const GRADIENT_BG: Record<string, string> = {
  physics: "from-blue-900/30 to-cyan-900/20",
  chemistry: "from-green-900/30 to-emerald-900/20",
  mathematics: "from-purple-900/30 to-pink-900/20",
  biology: "from-emerald-900/30 to-teal-900/20",
  computer_science: "from-orange-900/30 to-yellow-900/20",
  electronics: "from-cyan-900/30 to-blue-900/20",
  mechanical: "from-slate-900/30 to-gray-900/20",
  medicine: "from-red-900/30 to-pink-900/20",
};

const ACCENT: Record<string, string> = {
  physics: "text-blue-400 border-blue-500/30 bg-blue-500/10",
  chemistry: "text-green-400 border-green-500/30 bg-green-500/10",
  mathematics: "text-purple-400 border-purple-500/30 bg-purple-500/10",
  biology: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  computer_science: "text-orange-400 border-orange-500/30 bg-orange-500/10",
  electronics: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  mechanical: "text-slate-400 border-slate-500/30 bg-slate-500/10",
  medicine: "text-red-400 border-red-500/30 bg-red-500/10",
};

const DIFF_COLOR = ["", "bg-green-500/20 text-green-400", "bg-green-500/20 text-green-400", "bg-yellow-500/20 text-yellow-400", "bg-orange-500/20 text-orange-400", "bg-red-500/20 text-red-400"];
const DIFF_LABEL = ["", "Beginner", "Basic", "Intermediate", "Advanced", "Expert"];

export async function generateStaticParams() {
  return ["physics", "chemistry", "mathematics", "biology", "computer_science", "medicine", "electronics", "mechanical"].map((s) => ({ subject: s }));
}

export default async function SubjectPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject } = await params;
  const curriculum = getSubjectCurriculum(subject);
  if (!curriculum) notFound();

  const Icon = ICONS[subject] ?? GraduationCap;
  const totalChapters = curriculum.groups.flatMap((g) => g.chapters).length;
  const totalMinutes = curriculum.groups.flatMap((g) => g.chapters).reduce((s, c) => s + c.estimatedMin, 0);
  const simCount = curriculum.groups.flatMap((g) => g.chapters).filter((c) => c.hasSimulation).length;
  const accentClass = ACCENT[subject] ?? "text-brand-400 border-brand-500/30 bg-brand-500/10";

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-surface-400 mb-6">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/subjects" className="hover:text-white transition-colors">Subjects</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-white">{curriculum.label}</span>
      </div>

      {/* Hero */}
      <div className={`bg-gradient-to-br ${GRADIENT_BG[subject] ?? "from-gray-900/30 to-slate-900/20"} border border-surface-200 rounded-2xl p-8 mb-8`}>
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 bg-black/30 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Icon className={`w-9 h-9 ${accentClass.split(" ")[0]}`} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-3xl">{curriculum.emoji}</span>
              <h1 className="text-3xl md:text-4xl font-bold text-white">{curriculum.label}</h1>
            </div>
            <p className="text-surface-300 text-lg">{curriculum.tagline}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: BookMarked, label: "Chapters", value: totalChapters },
            { icon: Clock, label: "Est. Hours", value: `${Math.round(totalMinutes / 60)}h` },
            { icon: Zap, label: "Simulations", value: simCount },
          ].map(({ icon: StatIcon, label, value }) => (
            <div key={label} className="text-center p-3 bg-black/20 rounded-xl">
              <StatIcon className={`w-5 h-5 mx-auto mb-1 ${accentClass.split(" ")[0]}`} />
              <div className="text-xl font-bold text-white">{value}</div>
              <div className="text-xs text-surface-400">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Chapter groups */}
      <div className="space-y-8">
        {curriculum.groups.map((group, groupIndex) => (
          <section key={group.title}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold border ${accentClass}`}>
                {groupIndex + 1}
              </div>
              <h2 className="text-xl font-bold text-white">{group.title}</h2>
              <span className="text-sm text-surface-400">{group.chapters.length} chapters</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {group.chapters.map((chapter) => (
                <Link key={chapter.id} href={`/learn/${encodeURIComponent(chapter.slug)}`}>
                  <div className="group bg-surface-100 border border-surface-200 hover:border-brand-400/50 rounded-xl p-4 transition-all duration-200 hover:bg-surface-100/80 hover:shadow-lg hover:shadow-brand-500/5 cursor-pointer flex flex-col gap-2">
                    {/* Chapter header */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-white font-semibold group-hover:text-brand-400 transition-colors leading-snug">
                        {chapter.title}
                      </h3>
                      <ChevronRight className="w-4 h-4 text-surface-400 group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-0.5" />
                    </div>

                    {/* Description */}
                    <p className="text-surface-300 text-sm leading-relaxed">{chapter.description}</p>

                    {/* Meta row */}
                    <div className="flex items-center gap-2 flex-wrap mt-auto pt-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${DIFF_COLOR[chapter.difficulty] ?? DIFF_COLOR[3]}`}>
                        {DIFF_LABEL[chapter.difficulty] ?? "Intermediate"}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-surface-400">
                        <Clock className="w-3 h-3" />
                        {chapter.estimatedMin}m
                      </span>
                      {chapter.hasSimulation && (
                        <span className="flex items-center gap-1 text-xs text-brand-400">
                          <Sparkles className="w-3 h-3" />
                          Simulation
                        </span>
                      )}
                      <div className="flex gap-1 ml-auto">
                        {chapter.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="px-1.5 py-0.5 bg-surface-200 text-surface-400 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

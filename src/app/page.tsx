import SearchHero from "@/components/SearchHero";
import { SubjectGrid } from "@/components/TopicCard";
import ParticleBackground from "@/components/ParticleBackground";
import HomeFeatures from "@/components/home/HomeFeatures";
import HomeHowItWorks from "@/components/home/HomeHowItWorks";
import HomeTestimonials from "@/components/home/HomeTestimonials";
import HomeStats from "@/components/home/HomeStats";
import HomeCTA from "@/components/home/HomeCTA";
import HomeDemoPreview from "@/components/home/HomeDemoPreview";
import { Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <ParticleBackground />

      {/* Hero Section */}
      <section className="relative z-10 pt-24 md:pt-36 pb-20 px-4">
        <div className="text-center max-w-5xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500/10 border border-brand-500/30 rounded-full text-brand-400 text-sm mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            <span>Trusted by 10,000+ students across India</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
            Learn <span className="gradient-text">Anything</span> Through
            <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400">
              Interactive Simulations
            </span>
          </h1>
          <p className="text-lg md:text-xl text-surface-300 max-w-3xl mx-auto leading-relaxed mb-4">
            Type any concept — get instant visual explanations, PhET-quality interactive simulations,
            step-by-step derivations, and adaptive quizzes. Powered by advanced AI models.
          </p>
          <p className="text-sm text-surface-300/60">
            Physics • Chemistry • Mathematics • Biology • Computer Science • Electronics • Mechanical
          </p>
        </div>

        <SearchHero />

        {/* Quick action chips */}
        <div className="flex flex-wrap justify-center gap-2 mt-8 max-w-3xl mx-auto">
          {[
            "Newton's Laws", "Organic Chemistry", "Calculus", "Binary Trees",
            "Wave Optics", "Thermodynamics", "DNA Replication"
          ].map((topic) => (
            <a
              key={topic}
              href={`/learn/${encodeURIComponent(topic)}`}
              className="px-3 py-1.5 text-xs bg-surface-100/80 border border-surface-200 rounded-full text-surface-300 hover:text-white hover:border-brand-500/50 hover:bg-brand-500/10 transition-all duration-200 backdrop-blur-sm"
            >
              {topic}
            </a>
          ))}
        </div>
      </section>

      {/* Live Demo Preview */}
      <HomeDemoPreview />

      {/* Stats Bar */}
      <HomeStats />

      {/* Features */}
      <HomeFeatures />

      {/* How It Works */}
      <HomeHowItWorks />

      {/* Subject Grid */}
      <section className="relative z-10 py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Explore All Subjects</h2>
          <p className="text-surface-300 max-w-xl mx-auto">
            From JEE Advanced to NEET — every topic mapped to interactive simulations and real-world examples
          </p>
        </div>
        <SubjectGrid />
      </section>

      {/* Testimonials */}
      <HomeTestimonials />

      {/* Final CTA */}
      <HomeCTA />
    </div>
  );
}

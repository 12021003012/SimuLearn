"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HomeCTA() {
  return (
    <section className="relative z-10 py-24 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto relative"
      >
        {/* Glow background */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl" />
        
        <div className="relative bg-surface-100/90 backdrop-blur-md border border-surface-200 rounded-3xl p-10 md:p-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-500/10 border border-brand-500/30 rounded-full text-brand-400 text-xs font-medium mb-6">
            <Sparkles className="w-3 h-3" />
            Free to use — No credit card required
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Ready to Learn<br className="hidden md:block" />
            <span className="gradient-text">Smarter, Not Harder?</span>
          </h2>
          
          <p className="text-surface-300 max-w-xl mx-auto mb-8 leading-relaxed">
            Join 10,000+ students who replaced rote memorization with interactive understanding.
            Start your first simulation in under 30 seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/explore"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold rounded-xl hover:from-brand-400 hover:to-brand-500 transition-all duration-200 shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 hover:-translate-y-0.5"
            >
              Start Learning Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-surface-200/50 text-white font-semibold rounded-xl hover:bg-surface-200 transition-all duration-200 border border-surface-200"
            >
              See How It Works
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-6 mt-10 text-xs text-surface-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              No signup required
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              Works on mobile
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              100% free simulations
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              AI-powered 24/7
            </span>
          </div>
        </div>
      </motion.div>

      {/* Footer-like minimal info */}
      <div className="max-w-4xl mx-auto mt-16 text-center">
        <p className="text-xs text-surface-300/50">
          Built with ❤️ for Indian students • Physics • Chemistry • Maths • Biology • CS • Electronics • Mechanical
        </p>
      </div>
    </section>
  );
}

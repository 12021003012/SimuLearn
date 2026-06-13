"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Arjun Patel",
    role: "JEE Advanced 2025 — AIR 342",
    avatar: "AP",
    content: "The simulations made me actually understand rotational dynamics. I could play with moment of inertia and SEE why angular momentum is conserved. This is better than any coaching class.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "NEET 2025 — 698/720",
    avatar: "PS",
    content: "DNA replication and cell division animations were incredible. Instead of memorizing diagrams, I understood the process step by step. The quiz questions are tougher than NEET — great practice.",
    rating: 5,
  },
  {
    name: "Rohit Kumar",
    role: "Class 12 CBSE — 97%",
    avatar: "RK",
    content: "I was struggling with integration. The area-under-curve simulator made it click in 10 minutes. The gamification kept me coming back every day — 45 day streak!",
    rating: 5,
  },
  {
    name: "Sneha Reddy",
    role: "B.Tech CSE — IIT Bombay",
    avatar: "SR",
    content: "The sorting algorithm visualizer and Dijkstra pathfinding simulations are stunning. I used this to prep for coding interviews. The quality is PhET-level but for CS topics too.",
    rating: 5,
  },
  {
    name: "Vikram Singh",
    role: "JEE Mains 2025 — 99.8%ile",
    avatar: "VS",
    content: "Electric circuit simulator taught me Kirchhoff's laws better than 2 years of coaching. I can literally build circuits and see current flow. Mind-blowing.",
    rating: 5,
  },
  {
    name: "Ananya Desai",
    role: "Teacher — DPS Bangalore",
    avatar: "AD",
    content: "I use SimuLearn in my physics classes now. Students are 3x more engaged. The AI adapts difficulty perfectly — my toppers get JEE-level problems while others get fundamentals.",
    rating: 5,
  },
];

export default function HomeTestimonials() {
  return (
    <section className="relative z-10 py-24 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-400 text-sm font-semibold uppercase tracking-wider mb-3"
          >
            Student Success Stories
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Loved by Toppers Across India
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-surface-300 max-w-xl mx-auto"
          >
            Join thousands of students who transformed their understanding through interactive learning
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="bg-surface-100/50 backdrop-blur-sm border border-surface-200 rounded-2xl p-6 hover:border-surface-300 transition-all duration-300 relative group"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-surface-200 group-hover:text-brand-500/20 transition-colors" />
              
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-sm text-surface-300 leading-relaxed mb-5 line-clamp-4">
                &ldquo;{t.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{t.name}</div>
                  <div className="text-xs text-surface-300">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

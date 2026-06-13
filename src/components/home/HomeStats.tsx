"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const stats = [
  { value: 10000, suffix: "+", label: "Active Students", prefix: "" },
  { value: 500, suffix: "+", label: "Simulations Built", prefix: "" },
  { value: 50, suffix: "+", label: "Topics Covered", prefix: "" },
  { value: 98, suffix: "%", label: "Student Satisfaction", prefix: "" },
];

function AnimatedCounter({ value, suffix, prefix }: { value: number; suffix: string; prefix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-bold text-white">
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  );
}

export default function HomeStats() {
  return (
    <section className="relative z-10 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-surface-100/80 via-surface-100 to-surface-100/80 backdrop-blur-md border border-surface-200 rounded-3xl p-8 md:p-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <AnimatedCounter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                <div className="text-sm text-surface-300 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

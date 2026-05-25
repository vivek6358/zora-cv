"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { Star, Users, FileText, TrendingUp } from "lucide-react";

const companies = [
  { name: "Google", slug: "google" },
  { name: "Spotify", slug: "spotify" },
  { name: "Apple", slug: "apple" },
  { name: "Stripe", slug: "stripe" },
  { name: "Netflix", slug: "netflix" },
  { name: "Airbnb", slug: "airbnb" },
  { name: "Meta", slug: "meta" },
  { name: "Notion", slug: "notion" },
];

const stats = [
  { icon: FileText, value: 500, suffix: "K+", label: "Resumes Created" },
  { icon: Users, value: 120, suffix: "K+", label: "Active Users" },
  { icon: TrendingUp, value: 3, suffix: "x", label: "More Interviews" },
  { icon: Star, value: 4.9, suffix: " / 5", label: "Average Rating", isFloat: true },
];

function AnimatedCounter({ to, suffix, isFloat }: { to: number, suffix: string, isFloat?: boolean }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => isFloat ? latest.toFixed(1) : Math.round(latest).toString());
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, to, { duration: 2.5, ease: [0.16, 1, 0.3, 1] });
      return controls.stop;
    }
  }, [count, to, isInView]);

  return (
    <span ref={ref} className="inline-flex items-center justify-center">
      <motion.span>{rounded}</motion.span>
      <span>{suffix}</span>
    </span>
  );
}

export function SocialProof() {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-100 dark:border-slate-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="inline-flex w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 items-center justify-center shadow-md mb-3">
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                <AnimatedCounter to={s.value} suffix={s.suffix} isFloat={s.isFloat} />
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trusted by */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-8">
            Trusted by professionals from top companies
          </p>
          {/* Trusted by Marquee */}
          <div className="relative flex overflow-hidden py-4" style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
              className="flex items-center gap-16 pr-16 w-max shrink-0"
            >
              {[...companies, ...companies].map((c, i) => (
                <div key={`${c.name}-${i}`} className="flex items-center gap-3 group cursor-default">
                  <img 
                    src={`https://cdn.simpleicons.org/${c.slug}/000000`} 
                    alt={c.name}
                    className="w-7 h-7 opacity-30 dark:invert dark:opacity-40 group-hover:opacity-60 dark:group-hover:opacity-80 transition-opacity duration-300" 
                  />
                  <span className="text-2xl font-black text-slate-300 dark:text-slate-700 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors duration-300 tracking-tight shrink-0">
                    {c.name}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

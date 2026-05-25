"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Target } from "lucide-react";

const scoreCategories = [
  { label: "ATS Compatibility", score: 92, color: "bg-emerald-500" },
  { label: "Formatting", score: 96, color: "bg-emerald-500" },
  { label: "Keyword Match", score: 67, color: "bg-amber-500" },
  { label: "Readability", score: 88, color: "bg-emerald-500" },
  { label: "Completeness", score: 75, color: "bg-amber-500" },
];

const suggestions = [
  { type: "fix", text: "Add quantifiable results to 3 experience bullet points" },
  { type: "fix", text: "Include missing keywords: TypeScript, Agile, REST APIs" },
  { type: "good", text: "Contact section is perfectly formatted for ATS" },
  { type: "good", text: "Strong professional summary with target keywords" },
];

export function AtsShowcase() {
  return (
    <section id="ats" className="py-28 bg-slate-50 dark:bg-slate-900/40 relative overflow-hidden">
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[400px] h-[400px] bg-emerald-400/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[400px] h-[400px] bg-indigo-400/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-sm font-semibold mb-4">
            AI-Powered Analysis
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Know your ATS score{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">before you apply</span>
          </h2>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Our AI simulates how 100+ ATS systems parse your resume and gives you an exact optimization plan.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Score Ring */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center"
          >
            <div className="relative w-56 h-56 mb-8">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-200 dark:text-slate-800" />
                <motion.circle
                  initial={{ strokeDashoffset: 251 }}
                  whileInView={{ strokeDashoffset: 251 - 251 * 0.85 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                  cx="50" cy="50" r="40"
                  fill="none"
                  stroke="url(#scoreGrad)"
                  strokeWidth="8"
                  strokeDasharray="251"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="text-6xl font-black text-slate-900 dark:text-white"
                >
                  85
                </motion.span>
                <span className="text-sm font-bold text-emerald-500 mt-1">Top 15%</span>
              </div>
            </div>

            <div className="w-full max-w-sm space-y-3">
              {scoreCategories.map((cat, i) => (
                <motion.div
                  key={cat.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.3, duration: 0.4 }}
                >
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{cat.label}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{cat.score}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${cat.score}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + 0.5, duration: 0.8, ease: "easeOut" }}
                      className={`h-full ${cat.color} rounded-full`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Suggestions Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-5"
          >
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <Target className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-slate-800 dark:text-white">AI Recommendations</h3>
              </div>
              <div className="space-y-3">
                {suggestions.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex gap-3 p-3.5 rounded-xl border ${
                      s.type === "fix"
                        ? "bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900"
                        : "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900"
                    }`}
                  >
                    {s.type === "fix" ? (
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    )}
                    <p className="text-sm text-slate-700 dark:text-slate-300">{s.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <Link
              href="/score"
              className="flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-2xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-200"
            >
              Analyze My Resume Free →
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

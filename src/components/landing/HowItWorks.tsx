"use client";

import { motion } from "framer-motion";
import { LayoutTemplate, FileEdit, Sparkles, Download } from "lucide-react";

const steps = [
  {
    icon: LayoutTemplate,
    color: "from-indigo-500 to-violet-500",
    step: "01",
    title: "Pick Your Template",
    desc: "Choose from 14+ ATS-optimized, professionally designed templates tailored to your industry.",
  },
  {
    icon: FileEdit,
    color: "from-blue-500 to-cyan-500",
    step: "02",
    title: "Fill Your Details",
    desc: "Our guided multi-step form makes it easy to add your experience, skills, and education — no formatting needed.",
  },
  {
    icon: Sparkles,
    color: "from-violet-500 to-purple-500",
    step: "03",
    title: "Optimize with AI",
    desc: "AI analyzes your content, improves your bullet points, and tells you exactly how to hit a 90+ ATS score.",
  },
  {
    icon: Download,
    color: "from-emerald-500 to-teal-500",
    step: "04",
    title: "Download & Apply",
    desc: "Export a pixel-perfect PDF that looks identical on screen and in print. Start applying in under 10 minutes.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-28 bg-slate-50 dark:bg-slate-900/40 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-4">
            Simple Process
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Your resume in{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">4 easy steps</span>
          </h2>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Most users go from blank page to interview-ready in under 10 minutes.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8 relative mt-12">
          {/* Connector line on desktop */}
          <div className="hidden md:block absolute top-[52px] left-[calc(12.5%+28px)] right-[calc(12.5%+28px)] h-[3px] bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 origin-left"
            />
          </div>

          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8 }}
              className="relative flex flex-col items-center text-center p-6 rounded-3xl border border-transparent hover:border-slate-200/60 dark:hover:border-slate-800 hover:bg-white dark:hover:bg-slate-900/50 hover:shadow-xl hover:shadow-slate-200/40 dark:hover:shadow-slate-950/40 transition-all duration-300 group cursor-pointer"
            >
              {/* Glow background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className={`relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg shadow-indigo-500/10 group-hover:scale-110 group-hover:shadow-indigo-500/25 transition-all duration-300 mb-6`}>
                <step.icon className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-sm">
                  <span className="text-[10px] font-black text-slate-700 dark:text-slate-350">{step.step}</span>
                </div>
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{step.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-[200px]">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

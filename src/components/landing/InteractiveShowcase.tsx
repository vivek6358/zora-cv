"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2, Zap } from "lucide-react";

const DEMO_DATA = {
  "Personal Info": {
    fields: [
      { label: "Full Name", value: "Alexandra Chen" },
      { label: "Job Title", value: "Senior Product Manager" },
      { label: "Email", value: "alex.chen@email.com" },
      { label: "Location", value: "San Francisco, CA" },
    ],
    resumeLines: [
      { w: "75%", bold: true },
      { w: "55%", bold: false },
      { w: "65%", bold: false },
    ],
  },
  "Experience": {
    fields: [
      { label: "Company", value: "Google LLC" },
      { label: "Role", value: "Product Manager II" },
      { label: "Duration", value: "Jan 2021 – Present" },
      { label: "Impact", value: "Led 12-person cross-functional team" },
    ],
    resumeLines: [
      { w: "80%", bold: true },
      { w: "60%", bold: false },
      { w: "90%", bold: false },
      { w: "70%", bold: false },
    ],
  },
  "Education": {
    fields: [
      { label: "Degree", value: "B.S. Computer Science" },
      { label: "University", value: "UC Berkeley" },
      { label: "GPA", value: "3.9 / 4.0" },
      { label: "Year", value: "2019" },
    ],
    resumeLines: [
      { w: "65%", bold: true },
      { w: "50%", bold: false },
      { w: "40%", bold: false },
    ],
  },
  "Skills": {
    fields: [
      { label: "Skill 1", value: "Product Roadmapping" },
      { label: "Skill 2", value: "Agile / Scrum" },
      { label: "Skill 3", value: "SQL & Data Analytics" },
      { label: "Skill 4", value: "Figma & UX Research" },
    ],
    resumeLines: [
      { w: "85%", bold: false },
      { w: "70%", bold: false },
      { w: "80%", bold: false },
    ],
  },
  "Projects": {
    fields: [
      { label: "Project", value: "AI Recommendation Engine" },
      { label: "Impact", value: "+34% conversion rate" },
      { label: "Stack", value: "Python, TensorFlow, GCP" },
      { label: "Year", value: "2023" },
    ],
    resumeLines: [
      { w: "75%", bold: true },
      { w: "90%", bold: false },
      { w: "60%", bold: false },
    ],
  },
};

const sections = Object.keys(DEMO_DATA) as (keyof typeof DEMO_DATA)[];

const aiSuggestions = [
  { tip: "Add metrics to your bullet points to increase impact by 40%." },
  { tip: "Your summary is missing industry keywords. Try adding 'Agile' and 'CI/CD'." },
  { tip: "Consider quantifying your team leadership — e.g., 'Led a team of 5 engineers'." },
];

export function InteractiveShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [atsScore, setAtsScore] = useState(72);
  const [tipIdx, setTipIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);

  const activeSection = sections[activeIdx];
  const activeData = DEMO_DATA[activeSection];
  const currentField = activeData.fields[charIdx % activeData.fields.length];

  // Cycle sections
  useEffect(() => {
    const t = setInterval(() => {
      setActiveIdx((s) => (s + 1) % sections.length);
      setCharIdx(0);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  // Cycle typed field
  useEffect(() => {
    const t = setInterval(() => setCharIdx((c) => c + 1), 1400);
    return () => clearInterval(t);
  }, []);

  // Animate ATS score
  useEffect(() => {
    const t = setInterval(() => {
      setAtsScore((s) => {
        const next = s + Math.floor(Math.random() * 3 + 1);
        return next > 96 ? 72 : next;
      });
    }, 1600);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTipIdx((c) => (c + 1) % aiSuggestions.length), 3200);
    return () => clearInterval(t);
  }, []);

  const scoreColor = atsScore > 85 ? "text-emerald-500" : atsScore > 70 ? "text-amber-500" : "text-rose-500";
  const ringColor = atsScore > 85 ? "stroke-emerald-400" : atsScore > 70 ? "stroke-amber-400" : "stroke-rose-400";
  const dashOffset = 283 - (283 * atsScore) / 100;

  return (
    <section id="showcase" className="py-28 bg-white dark:bg-slate-950 overflow-hidden relative">
      <div className="absolute top-0 left-1/3 w-[600px] h-[400px] bg-indigo-400/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-4">
            Live Product Preview
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Watch your resume build{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">in real time</span>
          </h2>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Our split-screen editor lets you edit on the left and see your polished resume on the right — instantly.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl shadow-slate-200/40 dark:shadow-slate-900/60 bg-slate-50 dark:bg-slate-900"
        >
          {/* Chrome bar */}
          <div className="h-11 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
            <div className="flex-1 flex justify-center">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-6 py-1 rounded-md text-xs text-slate-400 font-mono">
                zoracv.ai/editor
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Auto-saved
            </div>
          </div>

          <div className="grid md:grid-cols-[220px_1fr_1.2fr] min-h-[480px]">
            {/* Section Nav */}
            <div className="bg-white dark:bg-slate-950 border-r border-slate-100 dark:border-slate-800 p-4 space-y-1 hidden md:block">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-2 mb-3">Resume Sections</p>
              {sections.map((sec, i) => (
                <button
                  key={sec}
                  onClick={() => { setActiveIdx(i); setCharIdx(0); }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeIdx === i
                      ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
                  }`}
                >
                  {activeIdx === i && (
                    <motion.span layoutId="indicator" className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2 mb-0.5" />
                  )}
                  {sec}
                </button>
              ))}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
                <div className="flex items-center gap-2 px-3 py-2.5 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl">
                  <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">AI Assistant Active</span>
                </div>
              </div>
            </div>

            {/* Form panel with real typed data */}
            <div className="bg-white dark:bg-slate-950 p-6 border-r border-slate-100 dark:border-slate-800">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIdx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <h3 className="font-bold text-base text-slate-800 dark:text-white mb-5">{activeSection}</h3>
                  <div className="space-y-4">
                    {activeData.fields.map((f, i) => (
                      <div key={f.label}>
                        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{f.label}</label>
                        <div className={`h-9 rounded-xl border flex items-center px-3 text-sm font-medium ${
                          i === charIdx % activeData.fields.length
                            ? "border-indigo-300 dark:border-indigo-700 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-200 dark:ring-indigo-900 text-indigo-700 dark:text-indigo-300"
                            : i < charIdx % activeData.fields.length
                            ? "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                            : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-transparent"
                        }`}>
                          <AnimatePresence mode="wait">
                            {i <= charIdx % activeData.fields.length && (
                              <motion.span
                                key={`${activeIdx}-${i}-${charIdx}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                              >
                                {f.value}
                                {i === charIdx % activeData.fields.length && (
                                  <span className="animate-pulse ml-0.5 inline-block w-0.5 h-4 bg-indigo-500 align-middle" />
                                )}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* AI tip */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={tipIdx}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.3 }}
                      className="mt-5 flex gap-2 bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/50 dark:to-violet-950/50 border border-indigo-100 dark:border-indigo-900 rounded-xl p-3"
                    >
                      <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{aiSuggestions[tipIdx].tip}</p>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Resume Preview panel with real content */}
            <div className="bg-slate-100 dark:bg-slate-900 p-6 flex items-center justify-center">
              <div className="w-full max-w-[340px] bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-4 text-white">
                  <p className="text-sm font-black tracking-wide truncate">Alexandra Chen</p>
                  <p className="text-xs text-white/70 mt-0.5 truncate">Senior Product Manager · alex.chen@email.com</p>
                </div>

                {/* Body */}
                <div className="p-4 space-y-4">
                  {/* Experience */}
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-1.5">Experience</p>
                    <p className="text-xs font-bold text-slate-800">Product Manager II — Google LLC</p>
                    <p className="text-[10px] text-slate-500">Jan 2021 – Present · San Francisco</p>
                    <div className="mt-1.5 space-y-1">
                      {["Led 12-person cross-functional team, shipped 3 major features", "Improved retention by 28% via ML-driven personalization", "Managed $4M product roadmap across 2 teams"].map((b, bi) => (
                        <motion.p
                          key={`${activeIdx}-${bi}`}
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: bi * 0.1 }}
                          className="text-[10px] text-slate-600 leading-relaxed"
                        >· {b}</motion.p>
                      ))}
                    </div>
                  </div>

                  {/* Education */}
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-1.5">Education</p>
                    <p className="text-xs font-bold text-slate-800">B.S. Computer Science — UC Berkeley</p>
                    <p className="text-[10px] text-slate-500">GPA: 3.9 / 4.0 · 2019</p>
                  </div>

                  {/* Skills */}
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-1.5">Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {["Agile", "SQL", "Figma", "GCP", "Python", "Scrum"].map((s) => (
                        <span key={s} className="text-[9px] font-semibold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ATS Score */}
                <div className="mx-4 mb-4 p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 flex items-center gap-3">
                  <div className="relative w-12 h-12 shrink-0">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="10" className="text-slate-200" />
                      <circle
                        cx="50" cy="50" r="45" fill="none"
                        stroke="currentColor" strokeWidth="10"
                        strokeDasharray="283"
                        strokeDashoffset={dashOffset}
                        strokeLinecap="round"
                        className={`${ringColor} transition-all duration-700`}
                      />
                    </svg>
                    <span className={`absolute inset-0 flex items-center justify-center text-xs font-black ${scoreColor}`}>{atsScore}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">ATS Score</p>
                    <p className={`text-xs font-semibold ${scoreColor} flex items-center gap-0.5`}>
                      <Zap className="w-3 h-3 fill-current" />
                      {atsScore > 85 ? "Excellent" : atsScore > 70 ? "Good" : "Needs Work"}
                    </p>
                    <p className="text-[9.5px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                      Get 95+ ATS score with our AI builder
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="text-center mt-10">
          <Link
            href="/editor"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all duration-300"
          >
            Try the Editor Free →
          </Link>
        </div>
      </div>
    </section>
  );
}

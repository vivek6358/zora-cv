"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_PERSON = {
  name: "Alexandra Chen",
  title: "Senior Product Manager",
  email: "alex.chen@email.com",
  phone: "+1 (415) 555-0192",
  location: "San Francisco, CA",
  summary: "Results-driven PM with 6+ years leading cross-functional teams at Google and Stripe. Shipped products used by 50M+ users.",
  experience: [
    { role: "Product Manager II", company: "Google LLC", dates: "2021–Present", bullets: ["Led 12-person team, shipped 3 major features", "Improved retention by 28%", "Managed $4M roadmap"] },
    { role: "Associate PM", company: "Stripe", dates: "2019–2021", bullets: ["Launched Stripe Billing to 10k+ merchants", "Reduced churn by 18% via onboarding redesign"] },
  ],
  education: "B.S. Computer Science · UC Berkeley · GPA 3.9",
  skills: ["Agile", "SQL", "Figma", "GCP", "Python", "Scrum", "A/B Testing"],
};

const templates = [
  {
    id: "modern",
    name: "Modern Zora",
    category: "Professional",
    popular: true,
    headerBg: "bg-gradient-to-r from-indigo-600 to-violet-600",
    headerText: "text-white",
    accentColor: "text-indigo-600",
    accentBg: "bg-indigo-50",
    borderColor: "border-indigo-100",
    skillBg: "bg-indigo-50 text-indigo-700",
    sectionDivider: "border-indigo-100",
  },
  {
    id: "minimal",
    name: "Clean Minimal",
    category: "Creative",
    popular: false,
    headerBg: "bg-slate-800",
    headerText: "text-white",
    accentColor: "text-slate-700",
    accentBg: "bg-slate-100",
    borderColor: "border-slate-200",
    skillBg: "bg-slate-100 text-slate-700",
    sectionDivider: "border-slate-200",
  },
  {
    id: "executive",
    name: "Executive Pro",
    category: "Corporate",
    popular: false,
    headerBg: "bg-gradient-to-r from-amber-600 to-orange-600",
    headerText: "text-white",
    accentColor: "text-amber-700",
    accentBg: "bg-amber-50",
    borderColor: "border-amber-100",
    skillBg: "bg-amber-50 text-amber-700",
    sectionDivider: "border-amber-100",
  },
  {
    id: "tech",
    name: "Tech Startup",
    category: "Tech",
    popular: false,
    headerBg: "bg-gradient-to-r from-sky-500 to-blue-600",
    headerText: "text-white",
    accentColor: "text-sky-600",
    accentBg: "bg-sky-50",
    borderColor: "border-sky-100",
    skillBg: "bg-sky-50 text-sky-700",
    sectionDivider: "border-sky-100",
  },
  {
    id: "creative",
    name: "Creative Bold",
    category: "Creative",
    popular: false,
    headerBg: "bg-gradient-to-r from-rose-500 to-pink-600",
    headerText: "text-white",
    accentColor: "text-rose-600",
    accentBg: "bg-rose-50",
    borderColor: "border-rose-100",
    skillBg: "bg-rose-50 text-rose-700",
    sectionDivider: "border-rose-100",
  },
  {
    id: "ats",
    name: "ATS Champion",
    category: "ATS Optimized",
    popular: false,
    headerBg: "bg-gradient-to-r from-emerald-500 to-teal-600",
    headerText: "text-white",
    accentColor: "text-emerald-700",
    accentBg: "bg-emerald-50",
    borderColor: "border-emerald-100",
    skillBg: "bg-emerald-50 text-emerald-700",
    sectionDivider: "border-emerald-100",
  },
];

const categories = ["All", "Professional", "Corporate", "Creative", "Tech", "ATS Optimized"];

function MiniResume({ t }: { t: typeof templates[0] }) {
  if (t.id === "modern") {
    return (
      <div className="absolute inset-4 bg-white rounded-xl shadow-md flex flex-col overflow-hidden text-[6px] leading-tight font-sans">
        {/* Header */}
        <div className="px-3 py-2 border-b border-indigo-100">
          <p className="font-extrabold text-[8.5px] tracking-tight text-slate-900">{DEMO_PERSON.name}</p>
          <p className="text-indigo-600 font-semibold text-[6.5px] mt-0.5">{DEMO_PERSON.title}</p>
          <p className="text-slate-400 text-[5px] mt-0.5">{DEMO_PERSON.email} · {DEMO_PERSON.location}</p>
        </div>
        {/* Body */}
        <div className="p-2.5 space-y-1.5 flex-1 overflow-hidden">
          <div>
            <p className="font-bold uppercase tracking-wider text-indigo-600 text-[5px] mb-0.5">Experience</p>
            {DEMO_PERSON.experience.map((exp, i) => (
              <div key={i} className="mb-1">
                <div className="flex justify-between items-baseline font-bold text-slate-800 text-[5.5px]">
                  <span>{exp.role}</span>
                  <span className="text-slate-400 font-normal text-[4.5px]">{exp.dates}</span>
                </div>
                <p className="text-indigo-600 text-[5px] font-semibold">{exp.company}</p>
                {exp.bullets.slice(0, 1).map((b, bi) => (
                  <p key={bi} className="text-slate-500 text-[5px] leading-tight">· {b}</p>
                ))}
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100" />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="font-bold uppercase tracking-wider text-indigo-600 text-[5px] mb-0.5">Education</p>
              <p className="text-slate-700 text-[5px] leading-tight font-medium">{DEMO_PERSON.education}</p>
            </div>
            <div>
              <p className="font-bold uppercase tracking-wider text-indigo-600 text-[5px] mb-0.5">Skills</p>
              <div className="flex flex-wrap gap-0.5">
                {DEMO_PERSON.skills.slice(0, 4).map((s) => (
                  <span key={s} className="px-1 py-0.2 bg-indigo-50 text-indigo-700 rounded font-semibold text-[4.5px]">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (t.id === "minimal") {
    return (
      <div className="absolute inset-4 bg-white rounded-xl shadow-md flex flex-col overflow-hidden text-[6px] leading-tight font-serif p-3">
        {/* Header */}
        <div className="text-center border-b border-slate-900 pb-1.5 mb-2">
          <p className="font-normal text-[9.5px] uppercase tracking-wider text-slate-900">{DEMO_PERSON.name}</p>
          <p className="text-[5.5px] text-slate-500 italic mt-0.5">{DEMO_PERSON.title}</p>
          <p className="text-slate-500 text-[5px] mt-0.5">{DEMO_PERSON.email} · {DEMO_PERSON.phone} · {DEMO_PERSON.location}</p>
        </div>
        {/* Body */}
        <div className="space-y-2 flex-1 overflow-hidden">
          <div>
            <p className="font-bold uppercase tracking-widest text-slate-800 text-[5px] border-b border-slate-100 pb-0.5 mb-1">Experience</p>
            {DEMO_PERSON.experience.map((exp, i) => (
              <div key={i} className="mb-1">
                <div className="flex justify-between items-baseline font-bold text-slate-900 text-[5.5px]">
                  <span>{exp.company}</span>
                  <span className="text-slate-500 font-normal italic text-[4.5px]">{exp.dates}</span>
                </div>
                <p className="text-slate-700 text-[5px] italic font-medium">{exp.role}</p>
                {exp.bullets.slice(0, 1).map((b, bi) => (
                  <p key={bi} className="text-slate-500 text-[5px] leading-tight">· {b}</p>
                ))}
              </div>
            ))}
          </div>
          <div>
            <p className="font-bold uppercase tracking-widest text-slate-800 text-[5px] border-b border-slate-100 pb-0.5 mb-1">Education</p>
            <p className="text-slate-700 text-[5px]">{DEMO_PERSON.education}</p>
          </div>
          <div>
            <p className="font-bold uppercase tracking-widest text-slate-800 text-[5px] border-b border-slate-100 pb-0.5 mb-0.5">Skills</p>
            <p className="text-slate-650 text-[5px]">{DEMO_PERSON.skills.join(", ")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (t.id === "executive") {
    return (
      <div className="absolute inset-4 bg-white rounded-xl shadow-md flex flex-col overflow-hidden text-[6px] leading-tight font-sans p-3">
        {/* Header */}
        <div className="border-b-2 border-slate-800 pb-1.5 mb-2">
          <p className="font-black text-[9.5px] uppercase tracking-tight text-slate-900">{DEMO_PERSON.name}</p>
          <p className="text-slate-650 font-bold uppercase tracking-wide text-[5.5px] mt-0.5">{DEMO_PERSON.title}</p>
          <p className="text-slate-500 text-[4.8px] mt-0.5">{DEMO_PERSON.email} | {DEMO_PERSON.location}</p>
        </div>
        {/* Body */}
        <div className="space-y-2 flex-1 overflow-hidden">
          <div>
            <p className="font-bold uppercase tracking-wider text-slate-900 text-[5px] bg-slate-100 px-1 py-0.5 mb-1">Professional Experience</p>
            {DEMO_PERSON.experience.map((exp, i) => (
              <div key={i} className="mb-1 px-0.5">
                <div className="flex justify-between items-baseline font-bold text-slate-900 text-[5.5px]">
                  <span>{exp.role}</span>
                  <span className="text-slate-500 text-[4.5px] font-bold">{exp.dates}</span>
                </div>
                <p className="text-slate-700 text-[5px] font-medium">{exp.company} • {exp.location}</p>
                {exp.bullets.slice(0, 1).map((b, bi) => (
                  <p key={bi} className="text-slate-500 text-[5px] leading-tight">· {b}</p>
                ))}
              </div>
            ))}
          </div>
          <div>
            <p className="font-bold uppercase tracking-wider text-slate-900 text-[5px] bg-slate-100 px-1 py-0.5 mb-1">Education</p>
            <p className="text-slate-700 text-[5px] px-0.5">{DEMO_PERSON.education}</p>
          </div>
          <div>
            <p className="font-bold uppercase tracking-wider text-slate-900 text-[5px] bg-slate-100 px-1 py-0.5 mb-0.5">Skills</p>
            <p className="text-slate-700 text-[5px] px-0.5">{DEMO_PERSON.skills.join(" • ")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (t.id === "tech") {
    return (
      <div className="absolute inset-4 bg-slate-950 rounded-xl shadow-md flex flex-col overflow-hidden text-[5.5px] leading-tight font-mono p-3 text-emerald-400">
        {/* Header */}
        <div className="border-b border-emerald-950 pb-1.5 mb-2">
          <p className="font-bold text-[8px] text-white">{DEMO_PERSON.name.toLowerCase().replace(" ", "_")}()</p>
          <p className="text-emerald-500 text-[5px] mt-0.5">~/roles/senior-pm</p>
          <p className="text-slate-400 text-[4.5px] mt-0.5">email: {DEMO_PERSON.email}</p>
        </div>
        {/* Body */}
        <div className="space-y-2 flex-1 overflow-hidden">
          <div>
            <p className="font-bold text-emerald-500 text-[4.8px] mb-0.5">// employment_history</p>
            {DEMO_PERSON.experience.map((exp, i) => (
              <div key={i} className="mb-1 text-slate-300">
                <div className="flex justify-between items-baseline text-white">
                  <span className="font-bold">{exp.role} @ {exp.company}</span>
                  <span className="text-slate-500 text-[4.2px]">{exp.dates.toUpperCase()}</span>
                </div>
                {exp.bullets.slice(0, 1).map((b, bi) => (
                  <p key={bi} className="text-slate-400 text-[4.8px] leading-tight">* {b}</p>
                ))}
              </div>
            ))}
          </div>
          <div>
            <p className="font-bold text-emerald-500 text-[4.8px] mb-0.5">// academic_degrees</p>
            <p className="text-slate-300">{DEMO_PERSON.education}</p>
          </div>
          <div>
            <p className="font-bold text-emerald-500 text-[4.8px] mb-0.5">// tech_stack</p>
            <p className="text-slate-300">{DEMO_PERSON.skills.map(s => `* ${s.toLowerCase()}`).join(" ")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (t.id === "creative") {
    return (
      <div className="absolute inset-4 bg-white rounded-xl shadow-md flex overflow-hidden text-[5.5px] leading-tight font-sans">
        {/* Sidebar */}
        <div className="w-[35%] bg-slate-900 text-white p-2 flex flex-col gap-2 overflow-hidden">
          <div>
            <p className="font-black text-[7.5px] tracking-tighter leading-none">{DEMO_PERSON.name.split(' ')[0]}</p>
            <p className="font-light text-[7.5px] tracking-tight leading-none">{DEMO_PERSON.name.split(' ').slice(1).join(' ')}</p>
            <p className="text-indigo-400 font-semibold text-[4.5px] uppercase mt-1">{DEMO_PERSON.title}</p>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-[4px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-800 pb-0.5 mb-1">Contact</p>
              <p className="text-[4.2px] text-slate-300 truncate">{DEMO_PERSON.email}</p>
              <p className="text-[4.2px] text-slate-300">{DEMO_PERSON.location}</p>
            </div>
            <div>
              <p className="text-[4px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-800 pb-0.5 mb-1">Expertise</p>
              <div className="flex flex-col gap-0.5 text-slate-300">
                {DEMO_PERSON.skills.slice(0, 4).map((s) => (
                  <span key={s} className="truncate">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="w-[65%] p-2.5 space-y-2 overflow-hidden bg-white">
          <div>
            <p className="font-bold text-slate-900 text-[6.5px] border-b border-slate-100 pb-0.5 mb-1">Profile</p>
            <p className="text-slate-650 text-[4.8px] leading-relaxed">{DEMO_PERSON.summary}</p>
          </div>
          <div>
            <p className="font-bold text-slate-900 text-[6.5px] border-b border-slate-100 pb-0.5 mb-1">Experience</p>
            {DEMO_PERSON.experience.slice(0, 1).map((exp, i) => (
              <div key={i} className="mb-0.5">
                <p className="font-bold text-slate-800 text-[5.5px] leading-tight">{exp.role}</p>
                <p className="text-indigo-600 text-[4.8px] font-semibold leading-none">{exp.company}</p>
                <p className="text-slate-400 text-[4px] uppercase tracking-wider">{exp.dates}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ATS Champion / Academic template representation
  return (
    <div className="absolute inset-4 bg-white rounded-xl shadow-md flex flex-col overflow-hidden text-[6px] leading-tight font-serif p-3">
      {/* Header */}
      <div className="text-center border-b border-slate-900 pb-1 mb-2">
        <p className="font-bold text-[9px] uppercase tracking-wider text-slate-900">{DEMO_PERSON.name}</p>
        <p className="text-[5.5px] text-slate-550 italic mt-0.5">{DEMO_PERSON.title}</p>
        <p className="text-slate-500 text-[4.8px] mt-0.5">{DEMO_PERSON.email} | {DEMO_PERSON.phone} | {DEMO_PERSON.location}</p>
      </div>
      {/* Body */}
      <div className="space-y-1.5 flex-1 overflow-hidden">
        <div>
          <p className="font-bold uppercase tracking-wider text-slate-850 text-[5px] border-b border-slate-200 pb-0.5 mb-1">Professional Experience</p>
          {DEMO_PERSON.experience.map((exp, i) => (
            <div key={i} className="mb-1">
              <div className="flex justify-between items-baseline font-bold text-slate-900 text-[5.5px]">
                <span>{exp.role} — {exp.company}</span>
                <span className="text-slate-500 font-normal text-[4.5px]">{exp.dates}</span>
              </div>
              {exp.bullets.slice(0, 1).map((b, bi) => (
                <p key={bi} className="text-slate-500 text-[5px] leading-tight">· {b}</p>
              ))}
            </div>
          ))}
        </div>
        <div>
          <p className="font-bold uppercase tracking-wider text-slate-850 text-[5px] border-b border-slate-200 pb-0.5 mb-0.5">Education</p>
          <p className="text-slate-700 text-[5px]">{DEMO_PERSON.education}</p>
        </div>
        <div>
          <p className="font-bold uppercase tracking-wider text-slate-850 text-[5px] border-b border-slate-200 pb-0.5 mb-0.5">Skills</p>
          <p className="text-slate-700 text-[5px]">{DEMO_PERSON.skills.slice(0, 5).join(", ")}</p>
        </div>
      </div>
    </div>
  );
}

export function TemplateShowcase() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filtered = activeCategory === "All" ? templates : templates.filter((t) => t.category === activeCategory);

  return (
    <section id="templates" className="py-28 bg-white dark:bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 text-sm font-semibold mb-4">
            Template Marketplace
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Designs that make{" "}
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">recruiters notice</span>
          </h2>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10">
            6+ ATS-friendly templates crafted by professional designers. Every one is built to get you past the robots.
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  activeCategory === cat
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.map((template, i) => (
              <motion.div
                key={template.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                onHoverStart={() => setHoveredId(template.id)}
                onHoverEnd={() => setHoveredId(null)}
                className="group relative bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/60 hover:-translate-y-2 transition-all duration-400 cursor-pointer"
              >
                {template.popular && (
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
                    <Star className="w-3 h-3 fill-white" /> Popular
                  </div>
                )}

                {/* Template preview with real resume data */}
                <div className="aspect-[4/5] relative overflow-hidden">
                  <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800" />
                  <MiniResume t={template} />

                  {/* Hover Overlay */}
                  <AnimatePresence>
                    {hoveredId === template.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-10"
                      >
                        <Link
                          href="/dashboard"
                          onClick={(e) => e.stopPropagation()}
                          className="px-5 py-2.5 rounded-xl bg-white text-slate-900 font-semibold text-sm shadow-xl hover:scale-105 transition-transform"
                        >
                          Use Template
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">{template.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 uppercase tracking-wider">{template.category}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-full">
                      <Check className="w-3 h-3" /> ATS Ready
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="text-center mt-12">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
          >
            Get Started Free →
          </Link>
        </div>
      </div>
    </section>
  );
}

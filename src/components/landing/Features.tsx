"use client";

import { useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { Sparkles, FileText, Target, LayoutTemplate, Zap, Download, TrendingUp, Shield } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    gradient: "from-indigo-500 via-violet-500 to-purple-600",
    glow: "shadow-indigo-500/30",
    glowHover: "group-hover:shadow-indigo-500/60",
    borderGlow: "rgba(99,102,241,0.4)",
    orb: "bg-indigo-400/10",
    title: "AI Resume Writing",
    desc: "Our AI drafts powerful bullet points and summaries tailored to your role and industry in seconds.",
    badge: "Most Popular",
  },
  {
    icon: Target,
    gradient: "from-emerald-400 via-teal-500 to-green-600",
    glow: "shadow-emerald-500/30",
    glowHover: "group-hover:shadow-emerald-500/60",
    borderGlow: "rgba(16,185,129,0.4)",
    orb: "bg-emerald-400/10",
    title: "ATS Score Analysis",
    desc: "Get a real-time compatibility score and know exactly how recruiters' software reads your resume.",
    badge: null,
  },
  {
    icon: FileText,
    gradient: "from-blue-500 via-sky-500 to-cyan-500",
    glow: "shadow-blue-500/30",
    glowHover: "group-hover:shadow-blue-500/60",
    borderGlow: "rgba(59,130,246,0.4)",
    orb: "bg-blue-400/10",
    title: "Live Resume Preview",
    desc: "See every change reflected instantly. What you write is exactly what gets printed.",
    badge: null,
  },
  {
    icon: LayoutTemplate,
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    glow: "shadow-violet-500/30",
    glowHover: "group-hover:shadow-violet-500/60",
    borderGlow: "rgba(139,92,246,0.4)",
    orb: "bg-violet-400/10",
    title: "Premium Templates",
    desc: "14+ recruiter-approved, ATS-friendly designs crafted for every industry from tech to finance.",
    badge: null,
  },
  {
    icon: Zap,
    gradient: "from-amber-400 via-orange-500 to-rose-500",
    glow: "shadow-amber-500/30",
    glowHover: "group-hover:shadow-amber-500/60",
    borderGlow: "rgba(245,158,11,0.4)",
    orb: "bg-amber-400/10",
    title: "Smart Suggestions",
    desc: "AI-powered keyword recommendations and phrase enhancements to outperform the competition.",
    badge: null,
  },
  {
    icon: Download,
    gradient: "from-rose-500 via-pink-500 to-fuchsia-500",
    glow: "shadow-rose-500/30",
    glowHover: "group-hover:shadow-rose-500/60",
    borderGlow: "rgba(244,63,94,0.4)",
    orb: "bg-rose-400/10",
    title: "Instant PDF Export",
    desc: "Download pixel-perfect, print-ready PDFs that look identical on screen and paper.",
    badge: null,
  },
  {
    icon: TrendingUp,
    gradient: "from-sky-500 via-blue-500 to-indigo-500",
    glow: "shadow-sky-500/30",
    glowHover: "group-hover:shadow-sky-500/60",
    borderGlow: "rgba(14,165,233,0.4)",
    orb: "bg-sky-400/10",
    title: "Resume Analytics",
    desc: "Track views, downloads, and ATS score history. Know when recruiters are looking.",
    badge: null,
  },
  {
    icon: Shield,
    gradient: "from-slate-600 via-slate-500 to-slate-400",
    glow: "shadow-slate-500/30",
    glowHover: "group-hover:shadow-slate-500/60",
    borderGlow: "rgba(100,116,139,0.4)",
    orb: "bg-slate-400/10",
    title: "ATS Optimization",
    desc: "Auto-format for machine parsers. No tables, no graphics — just clean, scannable content.",
    badge: null,
  },
];

function FeatureCard({ f, index }: { f: typeof features[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  const spotlightX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const spotlightY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    setHovered(false);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
      className="group relative cursor-pointer"
    >
      {/* Animated glow border */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute -inset-[1.5px] rounded-2xl z-0 pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${f.borderGlow}, transparent, ${f.borderGlow})`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Card */}
      <div className="relative z-10 h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-6 overflow-hidden transition-shadow duration-500 hover:shadow-2xl">

        {/* Spotlight effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: hovered
              ? `radial-gradient(circle at ${spotlightX.get()} ${spotlightY.get()}, ${f.borderGlow.replace("0.4", "0.08")} 0%, transparent 65%)`
              : "none",
          }}
        />

        {/* Floating orb background */}
        <div className={`absolute -top-6 -right-6 w-24 h-24 ${f.orb} rounded-full blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-80`} />

        {/* Grid pattern on card */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:20px_20px] rounded-2xl opacity-60" />

        <div className="relative z-10">
          {/* Badge */}
          {f.badge && (
            <div className="absolute -top-2 right-0">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-md">
                ✦ {f.badge}
              </span>
            </div>
          )}

          <div className="flex items-center gap-4 mb-4">
            {/* Icon with magnetic effect */}
            <motion.div
              whileHover={{ scale: 1.15, rotate: [0, -10, 10, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
              className={`flex-shrink-0 inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br ${f.gradient} items-center justify-center shadow-lg ${f.glow} ${f.glowHover} transition-shadow duration-500`}
              style={{ transform: "translateZ(30px)" }}
            >
              <f.icon className="w-5 h-5 text-white" />
            </motion.div>

            {/* Animated underline title */}
            <h3 className="font-bold text-base text-slate-900 dark:text-white relative inline-block">
              {f.title}
              <motion.div
                className={`absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r ${f.gradient} rounded-full`}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 0 }}
                animate={hovered ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.3 }}
                style={{ originX: 0, width: "100%" }}
              />
            </h3>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function Features() {
  return (
    <section id="features" className="py-28 bg-slate-50/80 dark:bg-slate-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-indigo-400/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] bg-violet-400/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-block px-4 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-4"
          >
            Everything you need
          </motion.span>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            The complete{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
              AI resume toolkit
            </span>
          </h2>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Every feature you need to create a resume that beats ATS filters and impresses hiring managers.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5" style={{ perspective: "1200px" }}>
          {features.map((f, i) => (
            <FeatureCard key={f.title} f={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion, useInView, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Sparkles, FileText, Target, LayoutTemplate, Zap, Download,
  TrendingUp, Shield, CheckCircle2, Infinity, Heart, Rocket, Gift, Star
} from "lucide-react";

const freeFeatures = [
  { icon: Sparkles, label: "AI Resume Generation", desc: "Unlimited AI-written bullet points & summaries" },
  { icon: Target, label: "ATS Score Analysis", desc: "Real-time compatibility score for every resume" },
  { icon: FileText, label: "Unlimited Resumes", desc: "Create and save as many resumes as you want" },
  { icon: LayoutTemplate, label: "All 14+ Templates", desc: "Every premium template unlocked, no upgrade needed" },
  { icon: Download, label: "PDF Export", desc: "Pixel-perfect, print-ready PDF downloads" },
  { icon: Zap, label: "Smart AI Suggestions", desc: "Keyword & phrasing recommendations that beat filters" },
  { icon: TrendingUp, label: "Resume Analytics", desc: "Track views, downloads, and ATS history" },
  { icon: Shield, label: "ATS Optimization", desc: "Auto-formatted for machine parsers every time" },
];

const stats = [
  { value: "100%", label: "Free forever", icon: Gift },
  { value: "0", label: "Credit cards required", icon: Shield },
  { value: "∞", label: "Resumes you can build", icon: Infinity },
  { value: "14+", label: "Premium templates unlocked", icon: LayoutTemplate },
];

function AnimatedCounter({ target, duration = 1500 }: { target: string; duration?: number }) {
  return <span>{target}</span>;
}

function FeaturePill({ feat, index }: { feat: typeof freeFeatures[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  const spotlightSize = useSpring(hovered ? 250 : 0, { bounce: 0 });

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="group relative flex flex-col p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/40 backdrop-blur-sm hover:border-emerald-200 dark:hover:border-emerald-700 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-500 cursor-default overflow-hidden"
    >
      {/* Dynamic Hover Spotlight */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: useTransform(
            [mouseX, mouseY, spotlightSize],
            ([x, y, size]) => `radial-gradient(${size}px circle at ${x}px ${y}px, rgba(16, 185, 129, 0.08), transparent 80%)`
          ),
        }}
      />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <motion.div
            animate={hovered ? { scale: 1.1, rotate: [0, -10, 10, -5, 5, 0] } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.5 }}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-50 dark:from-emerald-950/50 dark:to-teal-900/50 flex items-center justify-center border border-emerald-200 dark:border-emerald-800 shadow-inner group-hover:shadow-emerald-400/20 transition-all duration-300"
          >
            <feat.icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </motion.div>
          <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
             <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
        </div>

        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{feat.label}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
      </div>
    </motion.div>
  );
}

export function Pricing() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} id="pricing" className="py-28 relative overflow-hidden bg-white dark:bg-slate-950">
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-br from-emerald-400/8 via-teal-400/6 to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-violet-400/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-sm font-semibold mb-5"
          >
            <Gift className="w-3.5 h-3.5" />
            Completely Free
          </motion.div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-5">
            Everything is{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 bg-clip-text text-transparent">
                free.
              </span>
              {/* Animated underline */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full origin-left"
              />
            </span>
            {" "}Always.
          </h2>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            We believe great career tools should be accessible to everyone — not locked behind paywalls.
            No credit cards. No trials. No limits. Ever.
          </p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5, type: "spring", bounce: 0.4 }}
              whileHover={{ y: -8, scale: 1.05 }}
              className="group relative text-center p-8 rounded-[2rem] bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 hover:border-emerald-300 dark:hover:border-emerald-700/50 hover:bg-white/80 dark:hover:bg-slate-900/80 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 overflow-hidden"
            >
              {/* Hover sweep effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/5 to-teal-500/0 opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-0 transition-all duration-700 pointer-events-none" />

              <motion.div
                whileHover={{ rotate: 180, scale: 1.2 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 items-center justify-center shadow-lg shadow-emerald-400/30 mb-5 relative z-10"
              >
                <s.icon className="w-7 h-7 text-white" />
              </motion.div>
              <p className="text-4xl md:text-5xl font-black bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent mb-2 leading-none relative z-10 tracking-tight">
                <AnimatedCounter target={s.value} />
              </p>
              <p className="text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest relative z-10">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {freeFeatures.map((feat, i) => (
            <FeaturePill key={feat.label} feat={feat} index={i} />
          ))}
        </div>

        {/* Big CTA card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-green-600" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:30px_30px]" />
          {/* Animated orbs */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none"
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.28, 0.15] }}
            transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"
          />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 p-10 lg:p-14">
            <div className="text-center lg:text-left max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white/90 text-xs font-bold uppercase tracking-wider mb-4">
                <Star className="w-3 h-3 fill-white" /> No catch. No credit card.
              </div>
              <h3 className="text-3xl lg:text-4xl font-extrabold text-white mb-3 leading-tight">
                Start building your perfect resume today
              </h3>
              <p className="text-white/75 text-lg leading-relaxed">
                Join thousands of job seekers who've landed interviews using our free AI resume builder.
                Create your account in 30 seconds — zero cost, full access.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 flex-shrink-0">
              <div className="text-center mb-1">
                <p className="text-white/60 text-sm font-medium uppercase tracking-wider">Your plan</p>
                <p className="text-6xl font-black text-white leading-none mt-1">$0</p>
                <p className="text-white/70 text-sm mt-1">/ forever</p>
              </div>
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-emerald-700 font-bold text-base shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30 hover:scale-105 transition-all duration-300"
              >
                <Rocket className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                Get Free Access
              </Link>
              <p className="text-white/50 text-xs text-center">No spam · No credit card · Cancel never needed</p>
            </div>
          </div>
        </motion.div>

        {/* Bottom trust line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="text-center text-sm text-slate-400 dark:text-slate-500 mt-8 flex items-center justify-center gap-2"
        >
          <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
          Built with love for job seekers everywhere — free, because everyone deserves a great resume
          <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
        </motion.p>
      </div>
    </section>
  );
}

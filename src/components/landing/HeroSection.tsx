"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle2, Star, Zap, TrendingUp } from "lucide-react";
import AnimatedShaderBackground from "@/components/ui/animated-shader-background";
import { AnimatedText } from "@/components/ui/animated-underline-text-one";

const TYPING_LINES = [
  "Senior Software Engineer with 6+ years building scalable web applications...",
  "Led a team of 4 engineers to ship a Next.js rewrite, reducing TTI by 40%...",
  "Proficient in React, TypeScript, Node.js, AWS, and distributed systems...",
];

function TypingSimulator() {
  const [lineIdx, setLineIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    const line = TYPING_LINES[lineIdx];
    if (charIdx < line.length) {
      const t = setTimeout(() => {
        setDisplayed(line.slice(0, charIdx + 1));
        setCharIdx((c) => c + 1);
      }, 28);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setCharIdx(0);
        setDisplayed("");
        setLineIdx((i) => (i + 1) % TYPING_LINES.length);
      }, 2400);
      return () => clearTimeout(t);
    }
  }, [charIdx, lineIdx]);

  return (
    <span className="text-slate-700 text-xs leading-relaxed">
      {displayed}
      <span className="animate-pulse border-r-2 border-indigo-500 ml-0.5">&nbsp;</span>
    </span>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white pt-24 pb-16">
      <AnimatedShaderBackground className="opacity-75" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(99,102,241,0.12),transparent_32%),radial-gradient(circle_at_76%_34%,rgba(6,182,212,0.10),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.62)_0%,rgba(255,255,255,0.86)_62%,rgba(255,255,255,1)_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:48px_48px] opacity-50 pointer-events-none" />

      {/* Background depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-24 left-[12%] w-72 h-72 bg-cyan-300/20 rounded-full blur-[90px]" />
        <div className="absolute bottom-24 right-[18%] w-80 h-80 bg-indigo-300/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT: Copy */}
          <div className="flex flex-col gap-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-200/80 bg-white/80 text-indigo-700 text-sm font-semibold shadow-sm shadow-indigo-500/10 backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                <Sparkles className="w-3.5 h-3.5 fill-current text-indigo-500" />
                Unlimited AI Resume Builder - 100% Free Forever
              </div>
            </motion.div>
 
            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="text-5xl sm:text-6xl lg:text-[68px] font-extrabold tracking-tight leading-[1.08] text-slate-950">
                Build Resumes That{" "}
                <AnimatedText
                  text="Win Interviews"
                  textElement="span"
                  className="align-baseline"
                  textClassName="text-5xl sm:text-6xl lg:text-[68px] font-extrabold tracking-tight leading-[1.08] bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-600 bg-clip-text text-transparent"
                  underlineClassName="text-indigo-500"
                  underlinePath="M 2,11 Q 75,3 150,9 Q 225,15 298,8"
                  underlineHoverPath="M 2,9 Q 75,16 150,8 Q 225,1 298,10"
                  underlineDuration={1.1}
                />
              </h1>
              <p className="mt-6 text-xl text-slate-600 leading-relaxed max-w-xl">
                ZoraCV&apos;s AI analyzes thousands of job descriptions to craft perfectly tailored, ATS-optimized resumes - in minutes, not hours.
              </p>
            </motion.div>
 
            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex flex-wrap gap-4 items-center"
            >
              <Link
                href="/dashboard"
                className="group relative px-7 py-3.5 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  Build Your Resume Free
                  <Sparkles className="w-4 h-4 fill-current text-indigo-200" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              <a
                href="#showcase"
                className="group flex items-center gap-2 px-7 py-3.5 rounded-2xl text-base font-semibold text-slate-700 bg-white/85 border border-slate-200 hover:border-indigo-300 hover:-translate-y-1 shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-md"
              >
                <span className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 flex items-center justify-center">
                  <span className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-white ml-0.5" />
                </span>
                See it in action
              </a>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex flex-wrap items-center gap-6 text-sm"
            >
              <div className="flex -space-x-2">
                {["bg-indigo-400", "bg-violet-400", "bg-pink-400", "bg-sky-400"].map((c, i) => (
                  <div key={i} className={`w-9 h-9 rounded-full border-2 border-white ${c} flex items-center justify-center text-white font-bold text-xs`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-1 font-bold text-slate-900">4.9</span>
                </div>
                <p className="text-slate-500">From 12,400+ reviews</p>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>No credit card required</span>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Advanced 3D Isometric Preview */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:flex items-center justify-center w-full h-[550px]"
            style={{ perspective: "1000px" }}
          >
            {/* 3D Stack Container */}
            <motion.div
              animate={{
                rotateX: [15, 20, 15],
                rotateY: [-20, -28, -20],
                y: [-15, 15, -15],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-[300px] h-[420px]"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Back Card */}
              <div 
                className="absolute inset-0 bg-slate-100 dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 opacity-40"
                style={{ transform: "translateZ(-80px) translateX(40px) translateY(40px)" }}
              >
                <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded-t-2xl" />
              </div>

              {/* Middle Card */}
              <div 
                className="absolute inset-0 bg-slate-50 dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 opacity-80"
                style={{ transform: "translateZ(-40px) translateX(20px) translateY(20px)" }}
              >
                <div className="h-24 bg-indigo-100 dark:bg-indigo-900/40 rounded-t-2xl" />
              </div>

              {/* Front Main Card */}
              <div 
                className="absolute inset-0 bg-white rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] border border-slate-200 overflow-hidden"
                style={{ transform: "translateZ(0px)" }}
              >
                {/* Resume header */}
                <div className="bg-slate-900 p-6 text-white shadow-sm relative overflow-hidden">
                  {/* Subtle background pattern in header */}
                  <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:4px_4px]" />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="relative z-10"
                  >
                    <h3 className="text-[22px] font-bold tracking-tight mb-0.5">Alexandra Chen</h3>
                    <p className="text-[11px] text-indigo-300 font-medium tracking-wide uppercase">Senior Software Engineer</p>
                    <div className="flex gap-3 mt-3 text-[9px] text-slate-400">
                      <span>alexandra@example.com</span>
                      <span>San Francisco, CA</span>
                    </div>
                  </motion.div>
                </div>
                
                <div className="p-5 space-y-4 bg-white">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                  >
                    <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                      Professional Summary
                      <div className="flex-1 h-px bg-slate-100" />
                    </h4>
                    <div className="text-[10px] leading-relaxed text-slate-700 min-h-[45px]">
                      <TypingSimulator />
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 2.5 }}
                  >
                    <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                      Experience
                      <div className="flex-1 h-px bg-slate-100" />
                    </h4>
                    
                    <div className="mb-3 relative pl-3 border-l border-slate-200">
                      <div className="absolute w-1.5 h-1.5 bg-indigo-500 rounded-full -left-[4px] top-1" />
                      <div className="flex justify-between items-baseline mb-1">
                        <p className="text-[11px] font-bold text-slate-800">Tech Lead <span className="text-slate-400 font-medium">@ Stripe</span></p>
                        <span className="text-[8px] text-slate-400 font-semibold tracking-wider">2021 - Present</span>
                      </div>
                      <ul className="text-[9px] text-slate-600 space-y-1.5 mt-1.5">
                        <motion.li 
                          initial={{ opacity: 0, x: -10 }} 
                          animate={{ opacity: 1, x: 0 }} 
                          transition={{ delay: 3, duration: 0.5 }}
                          className="flex items-start gap-1"
                        >
                          <span className="text-indigo-400 mt-0.5">•</span> Architected microservices using Go and gRPC, increasing throughput by 45%.
                        </motion.li>
                        <motion.li 
                          initial={{ opacity: 0, x: -10 }} 
                          animate={{ opacity: 1, x: 0 }} 
                          transition={{ delay: 3.5, duration: 0.5 }}
                          className="flex items-start gap-1"
                        >
                          <span className="text-indigo-400 mt-0.5">•</span> Mentored a team of 6 engineers and streamlined CI/CD pipelines.
                        </motion.li>
                      </ul>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 4.2 }}
                  >
                    <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                      Skills
                      <div className="flex-1 h-px bg-slate-100" />
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {["React", "TypeScript", "Node.js", "Python", "AWS", "Docker", "GraphQL"].map((skill, i) => (
                        <motion.span
                          key={skill}
                          initial={{ opacity: 0, scale: 0.8, y: 5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ delay: 4.5 + i * 0.1, type: "spring", stiffness: 200 }}
                          className="px-2 py-0.5 bg-indigo-50/50 text-indigo-700 border border-indigo-100/50 text-[8px] font-bold rounded-md"
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* 3D Floating Widgets */}
              {/* ATS Score */}
              <motion.div
                animate={{ z: [40, 80, 40], y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-12 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] border border-slate-100"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full border-4 border-emerald-400 flex items-center justify-center">
                    <span className="text-base font-black text-emerald-600">92</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">ATS Score</p>
                    <p className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> Excellent
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* AI Suggestion */}
              <motion.div
                animate={{ z: [50, 90, 50], y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-10 -left-20 bg-gradient-to-br from-white to-indigo-50/80 backdrop-blur-xl border border-indigo-100 rounded-2xl p-4 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] max-w-[220px]"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-indigo-700">AI Optimization</p>
                    <p className="text-[10px] text-slate-600 mt-1 leading-relaxed">Action verbs detected! Added impact metrics to increase visibility by 34%.</p>
                  </div>
                </div>
              </motion.div>

              {/* Keyword Badge */}
              <motion.div
                animate={{ z: [20, 50, 20], x: [0, 10, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-1/2 -right-20 bg-white/95 backdrop-blur-xl border border-slate-100 rounded-xl px-4 py-2.5 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.15)]"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center">
                    <Zap className="w-3 h-3 text-violet-600" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">+12 Keywords</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
}

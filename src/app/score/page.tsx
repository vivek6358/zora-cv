"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud, CheckCircle2, AlertCircle, Sparkles, ArrowLeft,
  TrendingUp, Loader2, FileText, Target, RefreshCw
} from "lucide-react";

const BARS = [
  { label: "ATS Compatibility", key: "compatibility" },
  { label: "Formatting", key: "formatting" },
  { label: "Keyword Match", key: "keywords" },
  { label: "Readability", key: "readability" },
  { label: "Completeness", key: "completeness" },
];

type ScoreResult = {
  overallScore: number;
  label: string;
  breakdown: Record<string, number>;
  strengths: string[];
  improvements: string[];
};

export default function ScorePage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setResult(null);
    setError("");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const analyze = async () => {
    if (!file) { setError("Please upload your resume first."); return; }
    setIsAnalyzing(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("jobTitle", jobTitle || "General");

      const res = await fetch("/api/ai/ats-score", { method: "POST", body: formData });
      const data = await res.json();

      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const scoreColor = (s: number) => s >= 80 ? "text-emerald-500" : s >= 60 ? "text-amber-500" : "text-rose-500";
  const barColor = (s: number) => s >= 80 ? "bg-emerald-500" : s >= 60 ? "bg-amber-500" : "bg-rose-500";
  const ringOffset = (s: number) => 251 - (251 * s) / 100;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Top Nav */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <span className="font-black text-xl bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">ZoraCV</span>
          <Link href="/dashboard" className="text-sm font-semibold px-4 py-2 rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition-colors">
            Build My Resume
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-sm font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" /> AI-Powered · Free · No Login Required
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Check your ATS score{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">instantly</span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Upload your resume PDF and our AI will simulate how 100+ ATS systems parse it — and tell you exactly how to score higher.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 space-y-6"
            >
              {/* File Drop Zone */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Upload Your Resume <span className="text-red-500">*</span>
                </label>
                <label
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className={`relative flex flex-col items-center justify-center gap-3 min-h-[180px] rounded-2xl border-2 border-dashed transition-all cursor-pointer group ${
                    file
                      ? "border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20"
                      : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/30 hover:border-violet-400 hover:bg-violet-50/20"
                  }`}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf,.txt,.doc,.docx"
                    onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
                    className="sr-only"
                  />
                  {file ? (
                    <>
                      <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                        <FileText className="w-7 h-7 text-emerald-600" />
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-emerald-700 dark:text-emerald-400 truncate max-w-[260px]">{file.name}</p>
                        <p className="text-sm text-emerald-600 dark:text-emerald-500 mt-0.5">✓ Ready to analyze — click to change</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-violet-100 dark:group-hover:bg-violet-900/30 transition-colors">
                        <UploadCloud className="w-7 h-7 text-slate-400 group-hover:text-violet-500 transition-colors" />
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-slate-700 dark:text-slate-300">Drag & drop or click to upload</p>
                        <p className="text-sm text-slate-400 mt-1">PDF, TXT, DOC · Max 10MB</p>
                      </div>
                    </>
                  )}
                </label>
              </div>

              {/* Job Title (optional) */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Target Job Title <span className="text-slate-400 font-normal">(optional — improves keyword analysis)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior Software Engineer, Product Manager..."
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 rounded-xl px-4 py-3">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                </div>
              )}

              <button
                onClick={analyze}
                disabled={!file || isAnalyzing}
                className="w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-600 hover:shadow-emerald-500/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing your resume...</>
                ) : (
                  <><Target className="w-5 h-5" /> Analyze My Resume Free</>
                )}
              </button>

              <p className="text-center text-xs text-slate-400">
                Your resume is analyzed privately and never stored. Results in ~15 seconds.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Score Hero */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-8">
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  {/* Ring */}
                  <div className="relative w-44 h-44 shrink-0">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-800" />
                      <motion.circle
                        initial={{ strokeDashoffset: 251 }}
                        animate={{ strokeDashoffset: ringOffset(result.overallScore) }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                        cx="50" cy="50" r="40"
                        fill="none"
                        stroke="url(#scoreGrad2)"
                        strokeWidth="8"
                        strokeDasharray="251"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="scoreGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#6366f1" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className={`text-5xl font-black ${scoreColor(result.overallScore)}`}
                      >
                        {result.overallScore}
                      </motion.span>
                      <span className="text-xs text-slate-400 mt-1 font-medium tracking-widest uppercase">Score</span>
                    </div>
                  </div>

                  {/* Bars */}
                  <div className="flex-1 w-full space-y-3">
                    <div className="mb-4">
                      <h2 className={`text-2xl font-black ${scoreColor(result.overallScore)}`}>{result.label}</h2>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                        {result.overallScore >= 80
                          ? "Your resume is well-optimized for ATS systems!"
                          : result.overallScore >= 60
                          ? "Good foundation — a few tweaks will boost your score significantly."
                          : "Several improvements needed to pass ATS filters."}
                      </p>
                    </div>
                    {BARS.map((bar, i) => {
                      const val = result.breakdown[bar.key] ?? 70;
                      return (
                        <div key={bar.key}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-slate-700 dark:text-slate-300">{bar.label}</span>
                            <span className={`font-bold ${scoreColor(val)}`}>{val}%</span>
                          </div>
                          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${val}%` }}
                              transition={{ delay: i * 0.1 + 0.5, duration: 0.8, ease: "easeOut" }}
                              className={`h-full ${barColor(val)} rounded-full`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Improvements */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-white">Needs Improvement</h3>
                  </div>
                  <div className="space-y-3">
                    {result.improvements.map((tip, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900"
                      >
                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-slate-700 dark:text-slate-300">{tip}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Strengths */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-white">Looking Great</h3>
                  </div>
                  <div className="space-y-3">
                    {result.strengths.map((s, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-slate-700 dark:text-slate-300">{s}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-8 text-white text-center">
                <TrendingUp className="w-10 h-10 mx-auto mb-3 opacity-80" />
                <h3 className="text-2xl font-black mb-2">Ready to boost your score?</h3>
                <p className="text-white/80 mb-6">Use our AI editor to fix all the issues above and hit 90+ ATS score in minutes.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/dashboard"
                    className="px-8 py-3.5 rounded-2xl bg-white text-violet-700 font-bold hover:bg-violet-50 transition-colors shadow-lg"
                  >
                    Fix My Resume with AI →
                  </Link>
                  <button
                    onClick={() => { setResult(null); setFile(null); setJobTitle(""); }}
                    className="px-8 py-3.5 rounded-2xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" /> Analyze Another
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  { 
    q: "Is ZoraCV really 100% free to use?", 
    a: "Yes! There are no hidden fees, no premium tiers, and no credit card required. You get unlimited resumes, full access to all ATS-optimized templates, and our complete suite of AI tools completely free forever." 
  },
  { 
    q: "What is an ATS score and why does it matter?", 
    a: "ATS (Applicant Tracking System) software is used by 99% of Fortune 500 companies to filter resumes before a human ever sees them. Our system simulates these engines to score how well your resume performs, so you never get auto-rejected." 
  },
  { 
    q: "How does the AI improve my resume?", 
    a: "Our AI analyzes your content against thousands of job descriptions. It suggests stronger action verbs, identifies missing industry keywords, and completely rewrites weak bullet points to highlight measurable impact." 
  },
  { 
    q: "Can I download my resume as a PDF?", 
    a: "Absolutely. You can generate unlimited pixel-perfect, print-ready PDF downloads. What you see in the live preview is exactly what the recruiter will see when they open your file." 
  },
  { 
    q: "Can I customize the template designs?", 
    a: "Yes! While our templates are strictly engineered to pass ATS filters, you have full control over accent colors, font choices, line spacing, and margin sizing to make your resume uniquely yours." 
  },
  { 
    q: "Is my data secure and private?", 
    a: "We take your privacy seriously. We do not sell your personal data to third-party advertisers. Your resume data is encrypted and stored securely solely for the purpose of helping you build your career." 
  },
];

function FaqItem({ faq, isOpen, onClick, index }: { faq: typeof faqs[0], isOpen: boolean, onClick: () => void, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className={cn(
        "group relative rounded-2xl border transition-all duration-300 overflow-hidden",
        isOpen 
          ? "bg-white/80 dark:bg-slate-900/80 border-indigo-200 dark:border-indigo-800 shadow-lg shadow-indigo-500/5 backdrop-blur-xl" 
          : "bg-white/40 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 hover:bg-white/60 dark:hover:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 backdrop-blur-sm"
      )}
    >
      {isOpen && (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5 pointer-events-none" />
      )}

      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-5 md:p-6 text-left relative z-10"
      >
        <span className={cn(
          "font-semibold text-base transition-colors duration-300 pr-6",
          isOpen ? "text-indigo-600 dark:text-indigo-400" : "text-slate-900 dark:text-slate-100 group-hover:text-indigo-500"
        )}>
          {faq.q}
        </span>
        
        <div className={cn(
          "shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border",
          isOpen 
            ? "bg-indigo-500 border-indigo-500 rotate-180" 
            : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 group-hover:border-indigo-200 dark:group-hover:border-indigo-800"
        )}>
          <Minus className={cn("w-4 h-4 absolute transition-all duration-300", isOpen ? "opacity-100 scale-100 text-white" : "opacity-0 scale-50")} />
          <Plus className={cn("w-4 h-4 absolute transition-all duration-300", isOpen ? "opacity-0 scale-50" : "opacity-100 scale-100 text-slate-600 dark:text-slate-400 group-hover:text-indigo-500")} />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="px-5 md:px-6 pb-6 text-sm text-slate-600 dark:text-slate-400 leading-relaxed relative z-10">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent mb-4" />
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.05),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(139,92,246,0.05),transparent_50%)] pointer-events-none" />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-4 shadow-sm"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            FAQ
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Got questions? <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 bg-clip-text text-transparent">
              We've got answers.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Everything you need to know about ZoraCV, billing, and how our AI helps you land your dream job.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FaqItem 
              key={i} 
              index={i}
              faq={faq} 
              isOpen={openIdx === i} 
              onClick={() => setOpenIdx(openIdx === i ? null : i)} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}

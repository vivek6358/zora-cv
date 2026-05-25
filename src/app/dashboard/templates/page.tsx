"use client";

import { motion } from "framer-motion";
import { useResumeStore } from "@/store/resumeStore";
import { useRouter } from "next/navigation";
import { Star, Users, CheckCircle, LayoutTemplate } from "lucide-react";
import { useState } from "react";

export default function TemplatesGallery() {
  const router = useRouter();
  const { loadResume } = useResumeStore();
  const [isCreating, setIsCreating] = useState(false);

  const templates = [
    {
      id: "modern",
      name: "Modern Zora",
      category: "Tech & Corporate",
      description: "A clean, accented design perfect for modern corporate roles and engineering positions.",
      score: 98,
      users: "24.5k",
      badge: "Most Popular",
      theme: "indigo"
    },
    {
      id: "minimal",
      name: "Clean Minimalist",
      category: "Finance & Law",
      description: "Strictly black and white with serif fonts. Best for traditional ATS systems.",
      score: 99,
      users: "18.2k",
      theme: "slate"
    },
    {
      id: "creative",
      name: "Creative Studio",
      category: "Design & Media",
      description: "A vibrant, two-column layout tailored for designers and creative professionals.",
      score: 92,
      users: "12.1k",
      badge: "Trending",
      theme: "pink"
    },
    {
      id: "professional",
      name: "Executive Professional",
      category: "Management",
      description: "A solid, structured layout designed for managers and executives.",
      score: 96,
      users: "15.8k",
      theme: "emerald"
    },
    {
      id: "academic",
      name: "Academic CV",
      category: "Education & Research",
      description: "A comprehensive multi-page layout optimized for research, publications, and teaching roles.",
      score: 95,
      users: "8.4k",
      theme: "purple"
    },
    {
      id: "tech",
      name: "Silicon Valley Tech",
      category: "Software & IT",
      description: "A compact single-page standard favored by tech recruiters at Google, Apple, and Meta.",
      score: 97,
      users: "32.1k",
      badge: "Recruiter Pick",
      theme: "cyan"
    },
  ];

  const handleUseTemplate = async (templateId: string) => {
    if (isCreating) return;
    setIsCreating(true);
    try {
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template: templateId }),
      });
      const data = await res.json();
      if (data.resume) {
        const mappedResume = { ...data.resume, id: data.resume._id };
        loadResume(mappedResume);
        router.push("/editor");
      }
    } catch (error) {
      console.error(error);
      setIsCreating(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-6xl mx-auto space-y-8 pb-10">
      
      {/* Header */}
      <motion.div variants={item} className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
          <LayoutTemplate className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-500 shrink-0" />
          Template Marketplace
        </h1>
        <p className="text-slate-550 max-w-2xl text-base sm:text-lg">
          Choose from our collection of ATS-optimized, professionally designed templates. All templates are fully customizable in the editor.
        </p>
      </motion.div>

      {/* Grid */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {templates.map((t) => (
          <div key={t.id} className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 flex flex-col">
            
            {/* Visual Preview Area */}
            <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-950 p-8 flex items-center justify-center relative overflow-hidden">
              {/* Badge */}
              {t.badge && (
                <div className="absolute top-4 left-4 z-20">
                  <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg">
                    {t.badge}
                  </span>
                </div>
              )}
              
              {/* The "Paper" */}
              <div className="w-[85%] h-[90%] bg-white rounded-lg shadow-xl border border-slate-200/50 transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-1 relative z-10 flex flex-col p-4 overflow-hidden select-none">
                {t.id === "modern" && (
                  <div className="w-full h-full bg-white flex flex-col gap-1.5 text-left font-sans text-[8px] leading-tight">
                    <div className="border-b border-indigo-200 pb-1.5 mb-1">
                      <div className="text-[12px] font-bold text-slate-800 leading-none">John Doe</div>
                      <div className="text-[7px] font-medium text-indigo-600 mt-1">Software Engineer</div>
                    </div>
                    <div className="text-[6px] font-bold text-indigo-600 uppercase tracking-wider">Professional Summary</div>
                    <div className="text-[5px] text-slate-600 line-clamp-2">Experienced engineer specializing in building high-performance web applications using React, Next.js, and TypeScript.</div>
                    
                    <div className="text-[6px] font-bold text-indigo-600 uppercase tracking-wider mt-1">Experience</div>
                    <div>
                      <div className="text-[6px] font-semibold text-slate-800">Senior Developer • Tech Corp</div>
                      <div className="text-[5px] text-slate-500">2020 - Present</div>
                      <ul className="text-[5px] text-slate-600 list-disc ml-2.5 mt-0.5 space-y-0.5">
                        <li>Led development of a high-traffic e-commerce SaaS platform.</li>
                        <li>Mentored junior developers and optimized page load times.</li>
                      </ul>
                    </div>
                  </div>
                )}
                {t.id === "minimal" && (
                  <div className="w-full h-full bg-white flex flex-col gap-1.5 items-center font-serif text-center text-[8px] leading-tight">
                    <div className="border-b border-black w-full flex flex-col items-center pb-1.5 mb-1">
                      <div className="text-[12px] font-normal uppercase tracking-wide text-black leading-none">John Doe</div>
                      <div className="text-[5px] text-black mt-1">john@email.com • New York, NY • +1 234 567 890</div>
                    </div>
                    <div className="text-[6px] font-bold uppercase tracking-widest text-black mt-1 w-full text-left border-b border-black/20 pb-0.5">Experience</div>
                    <div className="w-full text-left mt-0.5">
                      <div className="flex justify-between items-baseline">
                        <span className="text-[6px] font-bold text-black">Tech Corp</span>
                        <span className="text-[5px] italic text-slate-600">2020 - Present</span>
                      </div>
                      <div className="text-[5.5px] italic text-black">Senior Developer</div>
                      <ul className="text-[5px] text-black list-disc ml-2.5 mt-0.5 space-y-0.5">
                        <li>Designed scalable REST APIs serving over 50,000 requests per day.</li>
                        <li>Implemented automation pipelines reducing deployment error rates.</li>
                      </ul>
                    </div>
                  </div>
                )}
                {t.id === "creative" && (
                  <div className="w-full h-full bg-white flex rounded overflow-hidden font-sans text-[7px] leading-tight -m-4">
                    <div className="w-[35%] bg-slate-900 h-full p-3 flex flex-col gap-1.5 text-white">
                      <div className="text-[12px] font-black leading-none tracking-tighter">John</div>
                      <div className="text-[12px] font-light leading-none tracking-tight">Doe</div>
                      <div className="text-[6px] font-semibold text-indigo-400 mt-1 uppercase">Developer</div>
                      <div className="text-[5px] font-bold text-slate-500 uppercase mt-2.5 border-b border-slate-700 pb-0.5">Contact</div>
                      <div className="text-[4.5px] text-slate-300 mt-0.5 break-all">john@email.com</div>
                      <div className="text-[4.5px] text-slate-300">New York, NY</div>
                      
                      <div className="text-[5px] font-bold text-slate-500 uppercase mt-2.5 border-b border-slate-700 pb-0.5">Skills</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <span className="bg-slate-800 px-1 py-0.5 rounded-sm text-[4px]">React</span>
                        <span className="bg-slate-800 px-1 py-0.5 rounded-sm text-[4px]">Next.js</span>
                        <span className="bg-slate-800 px-1 py-0.5 rounded-sm text-[4px]">Node</span>
                      </div>
                    </div>
                    <div className="w-[65%] h-full p-3 flex flex-col gap-1.5">
                      <div className="text-[7px] font-bold text-slate-900 relative inline-block mb-1">
                        Experience
                        <div className="absolute -bottom-0.5 left-0 w-1/3 h-[1px] bg-indigo-500" />
                      </div>
                      <div className="pl-2 border-l border-slate-200 relative mt-0.5">
                        <div className="absolute w-1.5 h-1.5 bg-indigo-500 rounded-full -left-[3.5px] top-0.5 border border-white" />
                        <div className="text-[6px] font-bold text-slate-900 leading-tight">Senior Developer</div>
                        <div className="text-[5.5px] font-semibold text-indigo-600">Tech Corp • 2020 - Present</div>
                        <div className="text-[5px] text-slate-500 mt-1 leading-relaxed">Supervised backend and frontend infrastructure, enhancing overall reliability and responsiveness.</div>
                      </div>
                    </div>
                  </div>
                )}
                {t.id === "professional" && (
                  <div className="w-full h-full bg-white flex flex-col gap-1.5 font-sans text-[8px] leading-tight">
                    <div className="border-b-2 border-slate-800 pb-1.5 mb-1">
                      <div className="text-[12px] font-black tracking-tight uppercase text-slate-900 leading-none">John Doe</div>
                      <div className="text-[6px] font-bold text-slate-600 uppercase tracking-wider mt-1">Software Engineer</div>
                    </div>
                    <div className="bg-slate-100 px-1 py-0.5">
                      <div className="text-[6px] font-bold uppercase tracking-widest text-slate-900">Professional Experience</div>
                    </div>
                    <div className="mt-0.5">
                      <div className="flex justify-between w-full items-end">
                        <div>
                          <div className="text-[6px] font-bold text-slate-900">Senior Developer</div>
                          <div className="text-[5.5px] font-semibold text-slate-700">Tech Corp</div>
                        </div>
                        <div className="text-[5px] font-bold text-slate-500">2020 - Present</div>
                      </div>
                      <ul className="text-[5px] text-slate-800 list-disc ml-2.5 mt-0.5 space-y-0.5">
                        <li>Programmed microservices running on Kubernetes with 99.9% uptime.</li>
                        <li>Automated quality testing to decrease regressions by 35%.</li>
                      </ul>
                    </div>
                  </div>
                )}
                {t.id === "academic" && (
                  <div className="w-full h-full bg-white flex flex-col gap-1 font-serif text-[7px] leading-tight">
                    <div className="text-center mb-1 pb-1 border-b">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-900 leading-none">John Doe, PhD</div>
                      <div className="text-[5px] text-slate-500 mt-0.5">University of California, Berkeley • john@berkeley.edu</div>
                    </div>
                    <div className="text-[5px] font-bold uppercase tracking-wider border-b border-slate-200 pb-0.5 mb-0.5">Education</div>
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>PhD in Computer Science, UC Berkeley</span>
                      <span>2015 - 2020</span>
                    </div>
                    <div className="text-[5px] text-slate-500 italic">Dissertation: Scalable Distributed Machine Learning Graph Architectures.</div>
                    <div className="text-[5px] font-bold uppercase tracking-wider border-b border-slate-200 pb-0.5 mt-1.5 mb-0.5">Selected Publications</div>
                    <ul className="list-decimal pl-3 space-y-0.5 text-slate-750">
                      <li>J. Doe, et al. "Distributed Graph Learning." Journal of AI, 2019.</li>
                    </ul>
                  </div>
                )}
                {t.id === "tech" && (
                  <div className="w-full h-full bg-white flex flex-col gap-1.5 font-mono text-[6.5px] leading-none">
                    <div className="flex justify-between items-start border-b border-slate-300 pb-1 mb-1">
                      <div>
                        <div className="text-[11px] font-bold text-slate-900 leading-none">john_doe.go()</div>
                        <div className="text-[5px] font-medium text-indigo-600 mt-1">/usr/bin/software-engineer</div>
                      </div>
                      <div className="text-[5px] text-slate-500 text-right">github.com/johndoe<br/>john@email.com</div>
                    </div>
                    <div className="text-[5px] font-bold text-indigo-600">// Technical Stack</div>
                    <div className="text-[4.5px] text-slate-700 leading-tight">Languages: Go, TypeScript, Python, C++</div>
                    
                    <div className="text-[5px] font-bold text-indigo-600 mt-1">// Experience</div>
                    <div>
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>Staff Software Engineer @ Google</span>
                        <span>2021 - Present</span>
                      </div>
                      <ul className="text-[4.5px] text-slate-650 list-disc pl-3 mt-0.5 space-y-0.5">
                        <li>Designed dynamic query planner.</li>
                        <li>Reduced query tail latency by 45%.</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 flex items-center justify-center">
                <button 
                  onClick={() => handleUseTemplate(t.id)}
                  disabled={isCreating}
                  className="bg-white text-slate-900 px-8 py-3 rounded-full font-bold shadow-2xl hover:scale-105 transition-transform disabled:opacity-50"
                >
                  {isCreating ? "Loading..." : "Use Template"}
                </button>
              </div>
            </div>

            {/* Meta Data */}
            <div className="p-4 sm:p-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-500 mb-1">{t.category}</p>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{t.name}</h3>
                </div>
                <div className="flex flex-col items-end shrink-0 ml-2">
                  <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md mb-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold">{t.score} ATS</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
                    <Users className="w-3.5 h-3.5" /> {t.users}
                  </div>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-2">{t.description}</p>
              {/* Mobile CTA — always visible since hover overlay needs cursor */}
              <button
                onClick={() => handleUseTemplate(t.id)}
                disabled={isCreating}
                className="mt-4 w-full sm:hidden bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-bold shadow hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {isCreating ? "Loading..." : "Use This Template"}
              </button>
            </div>
            
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

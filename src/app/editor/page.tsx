"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/resumeStore";
import Link from "next/link";
import { ArrowLeft, Download, CheckCircle2, MoreHorizontal, Zap, Check, Loader2, Sparkles, Copy, X, FileText, Star, Eye, ChevronLeft } from "lucide-react";
import { calculateATSScore, getATSLabel } from "@/lib/ats";
import { EditorSidebar } from "@/components/editor/EditorSidebar";
import { PersonalInfoForm } from "@/components/forms/PersonalInfoForm";
import { ExperienceForm } from "@/components/forms/ExperienceForm";
import { EducationForm } from "@/components/forms/EducationForm";
import { SkillsForm } from "@/components/forms/SkillsForm";
import { ProjectsForm } from "@/components/forms/ProjectsForm";
import { TemplatesForm } from "@/components/forms/TemplatesForm";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import { toast } from "sonner";

export default function EditorPage() {
  const { resume, loadResume } = useResumeStore();
  const [activeSection, setActiveSection] = useState("personal");
  const { status } = useSession();
  const router = useRouter();

  // AI & Optimization States
  const [showAtsModal, setShowAtsModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [atsResult, setAtsResult] = useState<{ tips: string[], keywords: string[] } | null>(null);
  const [aiJobTitle, setAiJobTitle] = useState("");
  const [loadingAts, setLoadingAts] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${resume.personalInfo.fullName || 'Untitled'}_Resume`,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.8);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  const handleOptimizeAts = async () => {
    setLoadingAts(true);
    setAtsResult(null);
    setShowAtsModal(true);
    try {
      const res = await fetch("/api/ai/optimize-ats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData: resume })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAtsResult(data.result);
      toast.success("ATS optimization analysis complete!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to analyze ATS");
      setShowAtsModal(false);
    } finally {
      setLoadingAts(false);
    }
  };

  const handleGenerateAI = async () => {
    if (!aiJobTitle) return;
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/generate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle: aiJobTitle })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Merge generated data with current resume template
      const updatedResume = {
        ...resume,
        title: `${aiJobTitle} Resume (AI)`,
        personalInfo: data.resume.personalInfo || resume.personalInfo,
        experience: data.resume.experience || [],
        education: data.resume.education || [],
        skills: data.resume.skills || [],
        projects: data.resume.projects || []
      };

      // Save to database
      await fetch(`/api/resumes/${resume.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedResume)
      });

      // Load into store
      loadResume(updatedResume);

      toast.success("Resume populated with AI content successfully!");
      setShowAiModal(false);
      setAiJobTitle("");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to generate AI content");
    } finally {
      setIsGenerating(false);
    }
  };

  // Viewport scaling logic
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const padding = 48; // padding around the A4 paper
      const availableWidth = rect.width - padding;
      const availableHeight = rect.height - padding;
      
      const targetWidth = 794; // width of 210mm in pixels at 96 DPI
      const targetHeight = 1123; // height of 297mm in pixels at 96 DPI
      
      const scaleW = availableWidth / targetWidth;
      const scaleH = availableHeight / targetHeight;
      
      const newScale = Math.min(scaleW, scaleH);
      setScale(Math.max(0.2, Math.min(newScale, 1.2))); // cap scale between 20% and 120%
    };

    // Delay calculation slightly to allow container to render
    const timer = setTimeout(handleResize, 100);
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [status]);

  // Global auto-save to backend
  useEffect(() => {
    // We only want to save if this is a real DB resume with a mongo _id length (or id)
    if (resume && resume.id && resume.id.length > 20 && status === "authenticated") {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = setTimeout(async () => {
        try {
          await fetch(`/api/resumes/${resume.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            // Make sure we pass the full resume object
            body: JSON.stringify(resume)
          });
        } catch (error) {
          console.error("Auto-save failed", error);
        }
      }, 1000); // 1 second debounce
    }
    
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [resume, status]);

  return (
    <div className="flex h-[100dvh] bg-background overflow-hidden flex-col font-sans">
      {/* Top Navbar */}
      <header className="h-14 border-b flex items-center justify-between px-4 bg-card z-30 shrink-0 shadow-sm relative">
        <div className="flex items-center gap-2 min-w-0">
          <Link href="/dashboard" className="p-2 -ml-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="h-5 w-px bg-border shrink-0"></div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-sm leading-tight text-foreground truncate max-w-[120px] sm:max-w-none">{resume.title || "Untitled Resume"}</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" /> <span className="hidden sm:inline">Auto-saved just now</span><span className="sm:hidden">Saved</span>
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 mr-2">
            {(() => {
              const score = calculateATSScore(resume);
              const { label, color, border, bg } = getATSLabel(score);
              return (
                <>
                  <div className="text-right">
                    <div className="text-xs font-medium text-foreground">ATS Score</div>
                    <div className={`text-[10px] font-bold uppercase ${color}`}>{label}</div>
                  </div>
                  <div className={`w-8 h-8 rounded-full border-2 ${border} flex items-center justify-center text-xs font-bold ${color} ${bg}`}>
                    {score}
                  </div>
                </>
              );
            })()}
          </div>
          <div className="h-5 w-px bg-border hidden lg:block"></div>
          <button 
            onClick={() => setShowAiModal(true)}
            title="Generate resume content using AI (1 credit)"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-purple-100 hover:border-purple-350 dark:border-slate-800 dark:hover:border-slate-700 bg-purple-50/50 hover:bg-purple-55 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 dark:hover:bg-purple-500/20 transition-all cursor-pointer"
          >
            <Star className="w-3.5 h-3.5 fill-purple-100 dark:fill-purple-950" />
            <span className="hidden sm:inline">Generate with AI</span>
          </button>
          <button 
            onClick={handleOptimizeAts}
            title="Optimize ATS score using AI (1 credit)"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-indigo-100 hover:border-indigo-350 dark:border-slate-800 dark:hover:border-slate-700 bg-indigo-50/50 hover:bg-indigo-55 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 fill-indigo-100 dark:fill-indigo-950" />
            <span className="hidden sm:inline">Optimize ATS</span>
          </button>
          <div className="h-5 w-px bg-border hidden sm:block"></div>
          <button 
            onClick={() => handlePrint()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:scale-105 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </header>

      {/* Main Workspace - 3 Panes */}
      <main className="flex-1 flex overflow-hidden relative bg-muted/10">

        {/* Pane 1: Navigation Sidebar */}
        <EditorSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

        {/* Pane 2: Form Workspace — hidden on mobile/tablet when preview tab is active */}
        <div className={`${activeSection === "preview" ? "hidden" : "flex"} flex-1 lg:flex lg:w-[45%] lg:flex-none h-full bg-card flex-col relative z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)] lg:border-r`}>
          <div className="flex-1 overflow-y-auto scrollbar-hide p-4 lg:p-8 pb-24 lg:pb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground capitalize">
                      {activeSection.replace(/([A-Z])/g, ' $1').trim()}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Update your information below. Changes save automatically.
                    </p>
                  </div>
                </div>

                {activeSection === "personal" && <PersonalInfoForm />}
                {activeSection === "experience" && <ExperienceForm />}
                {activeSection === "education" && <EducationForm />}
                {activeSection === "skills" && <SkillsForm />}
                {activeSection === "projects" && <ProjectsForm />}
                {activeSection === "templates" && <TemplatesForm />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Pane 3: Live Preview — desktop sidebar + mobile fullscreen when preview tab active */}
        <div
          ref={containerRef}
          className={`${activeSection === "preview" ? "flex pb-16" : "hidden"} lg:flex flex-1 h-full bg-slate-100/50 dark:bg-black/20 overflow-auto items-start lg:items-center justify-center p-4 lg:p-6 relative select-none`}
        >
          {/* Mobile back button */}
          <button
            onClick={() => setActiveSection("personal")}
            className="lg:hidden absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Edit
          </button>

          {/* Mobile download button */}
          <button
            onClick={() => handlePrint()}
            className="lg:hidden absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-indigo-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </button>

          {/* Paper Document — visual preview only, no print ref */}
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top center",
              width: "210mm",
              height: "297mm",
              marginTop: activeSection === "preview" ? "2.5rem" : "0",
            }}
            className="bg-white paper-shadow relative group shrink-0 rounded-sm"
          >
            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity z-50">
              <span className="bg-black/70 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-md font-mono">{Math.round(scale * 100)}% Fitted</span>
            </div>
            <ResumePreview />
          </div>
        </div>

        {/* Always-rendered print target — off-screen so react-to-print works on all screen sizes */}
        <div
          style={{ position: "absolute", left: "-9999px", top: 0, width: "210mm", pointerEvents: "none" }}
          aria-hidden="true"
        >
          <ResumePreview ref={componentRef} />
        </div>
      </main>

      {/* ATS Optimization Modal */}
      {showAtsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-950 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600" />
            <button onClick={() => setShowAtsModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-5 h-5 fill-indigo-100 dark:fill-indigo-950" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">ATS Optimization Tips</h3>
                <p className="text-xs text-slate-550 dark:text-slate-400">1 AI credit deducted. Tips are generated based on your resume data.</p>
              </div>
            </div>

            {loadingAts ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                <span className="text-sm font-semibold text-slate-500 animate-pulse">Running AI screen scan...</span>
              </div>
            ) : atsResult ? (
              <div className="space-y-6">
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Recommendations</h4>
                  <ul className="space-y-2.5">
                    {atsResult.tips?.map((tip, i) => (
                      <li key={i} className="flex gap-2.5 items-start text-sm text-slate-650 dark:text-slate-350">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-2.5">
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Recommended Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {atsResult.keywords?.map((word, i) => (
                      <span key={i} className="bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400 px-3 py-1 rounded-full text-xs font-semibold border border-indigo-100/50 dark:border-indigo-900/10">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setShowAtsModal(false)}
                  className="w-full bg-slate-900 dark:bg-slate-800 text-white font-bold text-sm py-2.5 rounded-xl hover:bg-black transition-colors"
                >
                  Apply Suggestions
                </button>
              </div>
            ) : null}
          </motion.div>
        </div>
      )}

      {/* AI Generator Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
            
            <button 
              onClick={() => setShowAiModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6">
              <Star className="w-6 h-6 text-indigo-600 fill-indigo-600" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Generate with AI</h2>
            <p className="text-slate-500 text-sm mb-6">Enter your target job title, and our AI will generate a complete resume draft tailored to that role instantly.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Target Job Title</label>
                <input 
                  type="text" 
                  autoFocus
                  placeholder="e.g. Senior Frontend Engineer"
                  value={aiJobTitle}
                  onChange={(e) => setAiJobTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerateAI()}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-900 dark:text-white"
                />
              </div>

              <button 
                onClick={handleGenerateAI}
                disabled={!aiJobTitle || isGenerating}
                className="w-full bg-indigo-600 text-white px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-indigo-600/40 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Draft...
                  </>
                ) : (
                  <>
                    <Star className="w-5 h-5" />
                    Generate Resume
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}

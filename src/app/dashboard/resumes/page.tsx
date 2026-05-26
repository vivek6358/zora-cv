"use client";

import { useResumeStore } from "@/store/resumeStore";
import { Plus, Trash2, FileText, Star, X, Loader2, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ResumeMiniThumbnail } from "@/components/dashboard/ResumeMiniThumbnail";

export default function MyResumesPage() {
  const { resume, loadResume } = useResumeStore();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dbResumes, setDbResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // AI Wizard State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiJobTitle, setAiJobTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    } else if (status === "authenticated") {
      fetch("/api/resumes")
        .then((res) => res.json())
        .then((data) => {
          if (data.resumes) {
            setDbResumes(data.resumes);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [status, router]);

  const handleCreateNew = async () => {
    try {
      const res = await fetch("/api/resumes", { method: "POST" });
      const data = await res.json();
      if (data.resume) {
        loadResume(data.resume);
        router.push("/editor");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this resume?")) return;
    try {
      await fetch(`/api/resumes/${id}`, { method: "DELETE" });
      setDbResumes((prev) => prev.filter((r) => r._id !== id));
      toast.success("Resume deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete resume");
    }
  };

  const handleGenerateAI = async () => {
    if (!aiJobTitle) return;
    setIsGenerating(true);
    try {
      // 1. Create blank resume
      const createRes = await fetch("/api/resumes", { method: "POST" });
      const createData = await createRes.json();
      
      if (!createData.resume) throw new Error("Failed to create resume");
      
      const newResumeId = createData.resume._id;
      
      // 2. Call Gemini to generate full resume structure
      const aiRes = await fetch("/api/ai/generate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle: aiJobTitle })
      });
      
      const aiData = await aiRes.json();
      
      if (aiData.error) throw new Error(aiData.error);

      // Merge generated data with the created resume shell
      const updatedResume = {
        ...createData.resume,
        title: `${aiJobTitle} Resume (AI)`,
        personalInfo: aiData.resume.personalInfo || createData.resume.personalInfo,
        experience: aiData.resume.experience || [],
        education: aiData.resume.education || [],
        skills: aiData.resume.skills || [],
        projects: aiData.resume.projects || []
      };

      // 3. Save to DB
      await fetch(`/api/resumes/${newResumeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedResume)
      });

      // 4. Open Editor
      loadResume({ ...updatedResume, id: newResumeId });
      router.push("/editor");

    } catch (err: any) {
      console.error(err);
      setIsGenerating(false);
      setShowAiModal(false);
      toast.error(err.message || "Failed to generate resume");
    }
  };

  if (status === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading resumes...</div>;
  }

  const filteredResumes = dbResumes.filter((r) =>
    (r.title || "Untitled Resume").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  } as const;

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  } as const;

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 max-w-6xl mx-auto pb-10"
    >
      {/* Header and Controls */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <FileText className="w-8 h-8 text-indigo-500" />
            My Resumes
          </h1>
          <p className="text-slate-500 mt-1.5">Manage, search, and edit your custom professional resumes.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setShowAiModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
          >
            <Star className="w-4 h-4 text-white fill-white" />
            Generate with AI
          </button>
        </div>
      </motion.div>

      {/* Grid of Resumes */}
      <motion.div variants={item} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Create New Card */}
        <button 
          onClick={handleCreateNew} 
          className="group cursor-pointer relative rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-950/20 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 flex flex-col items-center justify-center p-6 text-center gap-3 min-h-[320px]"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-lg">Create New Resume</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-[165px] mx-auto">Start building a fresh resume from scratch</p>
          </div>
        </button>

        {filteredResumes.map((r) => (
          <div key={r._id} className="group relative bg-card/60 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-primary/30 flex flex-col min-h-[320px]">
            <div className="aspect-[4/3] bg-slate-50 dark:bg-slate-950/40 relative flex items-center justify-center p-4 transition-colors group-hover:bg-primary/5 border-b">
              {/* Paper thumbnail */}
              <ResumeMiniThumbnail resume={r} />

              {/* Overlay Action — hover only on desktop */}
              <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center justify-center backdrop-blur-sm z-20">
                <button
                  onClick={() => {
                    const mappedResume = { ...r, id: r._id };
                    loadResume(mappedResume);
                    router.push("/editor");
                  }}
                  className="bg-white text-slate-900 px-6 py-2.5 rounded-full text-sm font-bold shadow-xl hover:scale-105 transition-transform cursor-pointer"
                >
                  Open in Editor
                </button>
              </div>
            </div>

            <div className="p-6 flex flex-col justify-between flex-1 relative z-30 bg-white dark:bg-slate-900/60">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white truncate text-lg">{r.title || "Untitled Resume"}</h3>
                <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  Updated {new Date(r.updatedAt).toLocaleDateString()}
                </p>
              </div>

              {/* Mobile: direct Open button always visible */}
              <button
                onClick={() => {
                  const mappedResume = { ...r, id: r._id };
                  loadResume(mappedResume);
                  router.push("/editor");
                }}
                className="sm:hidden mt-3 w-full bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-bold shadow-md active:scale-95 transition-transform cursor-pointer"
              >
                Open in Editor
              </button>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-100 dark:border-indigo-900/30 uppercase tracking-wide">
                  {r.template}
                </div>
                <button
                  onClick={() => handleDelete(r._id)}
                  className="text-slate-400 hover:text-rose-500 p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Delete Resume"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredResumes.length === 0 && searchQuery && (
        <div className="text-center py-12 bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl">
          <p className="text-slate-500">No resumes matched your search query "{searchQuery}".</p>
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
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"
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
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              <button 
                onClick={handleGenerateAI}
                disabled={!aiJobTitle || isGenerating}
                className="w-full bg-indigo-600 text-white px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-indigo-600/40 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
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
    </motion.div>
  );
}

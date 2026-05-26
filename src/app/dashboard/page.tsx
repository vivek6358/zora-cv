"use client";

import { useResumeStore } from "@/store/resumeStore";
import { Plus, Trash2, FileText, Activity, Download, LayoutTemplate, Star, ArrowUpRight, Search } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ATSScoreChart } from "@/components/dashboard/AnalyticsCharts";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogOut, X, Loader2, Sparkles, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { calculateATSScore } from "@/lib/ats";
import { ResumeMiniThumbnail } from "@/components/dashboard/ResumeMiniThumbnail";

export default function DashboardPage() {
  const { resume, loadResume } = useResumeStore();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dbResumes, setDbResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // AI Wizard State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiJobTitle, setAiJobTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // AI Update / Optimize State
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateJobTitle, setUpdateJobTitle] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);
    setUploadedFileName(file.name);
    toast.success(`"${file.name}" selected — ready to upgrade!`);
  };

  const handleUpdateAI = async () => {
    if (!updateJobTitle.trim()) {
      toast.error("Please enter a target job title");
      return;
    }
    if (!uploadedFile) {
      toast.error("Please upload your resume PDF or TXT file first");
      return;
    }

    setIsUpdating(true);
    const toastId = toast.loading("Analyzing & upgrading your resume with AI...");

    try {
      // 1. Build FormData — send file + job title directly to server-side parser + AI
      const formData = new FormData();
      formData.append("file", uploadedFile);
      formData.append("jobTitle", updateJobTitle.trim());

      const aiRes = await fetch("/api/ai/upgrade-resume", {
        method: "POST",
        body: formData,
      });

      const aiData = await aiRes.json();
      if (aiData.error) throw new Error(aiData.error);

      // 2. Create a blank resume shell in the database
      const createRes = await fetch("/api/resumes", { method: "POST" });
      const createData = await createRes.json();
      if (!createData.resume) throw new Error("Failed to create resume record");

      const newResumeId = createData.resume._id;

      // 3. Build the full upgraded resume object
      const upgradedResume = {
        ...createData.resume,
        title: `${updateJobTitle.trim()} — AI Upgraded`,
        template: createData.resume.template || "modern",
        personalInfo: aiData.resume.personalInfo || createData.resume.personalInfo,
        experience: aiData.resume.experience || [],
        education: aiData.resume.education || [],
        skills: aiData.resume.skills || [],
        projects: aiData.resume.projects || [],
      };

      // 4. Save the upgraded resume to the database
      await fetch(`/api/resumes/${newResumeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(upgradedResume),
      });

      // 5. Load into editor store and redirect
      loadResume({ ...upgradedResume, id: newResumeId });
      toast.success("Resume upgraded! Opening editor...", { id: toastId });
      setShowUpdateModal(false);
      router.push("/editor");
    } catch (err: any) {
      console.error("Upgrade error:", err);
      toast.error(err.message || "Failed to upgrade resume", { id: toastId });
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    } else if (status === "authenticated") {
      // Fetch resumes
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

    } catch (err) {
      console.error(err);
      setIsGenerating(false);
      setShowAiModal(false);
    }
  };

  if (status === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>;
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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
      className="space-y-8 max-w-6xl mx-auto"
    >
      {/* Premium Hero Section */}
      <motion.div variants={item} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 p-8 md:p-12 text-white shadow-2xl shadow-indigo-900/20 border border-white/10">
        {/* Abstract floating shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 right-40 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -mb-20 pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight mb-3 md:mb-4">
            Welcome back, {session?.user?.name?.split(" ")[0] || "Creator"}
          </h1>
          <p className="text-indigo-100/80 text-sm sm:text-lg mb-6 md:mb-8 max-w-xl leading-relaxed">
            Your ATS score is in the top 5% of users. Let's build your next standout resume or optimize your current one for your dream job.
          </p>
          
          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3">
            <button 
              onClick={handleCreateNew}
              className="bg-white text-indigo-900 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-50 hover:scale-105 transition-all duration-300 shadow-xl shadow-white/10"
            >
              <Plus className="w-5 h-5" />
              Create New Resume
            </button>
            <button 
              onClick={() => setShowAiModal(true)}
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 hover:bg-white/20 transition-all duration-300"
            >
              <Star className="w-5 h-5 text-purple-300" />
              Generate with AI
            </button>
            <button 
              onClick={() => setShowUpdateModal(true)}
              className="bg-gradient-to-r from-purple-550 to-pink-550 border border-purple-550/30 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:opacity-90 hover:scale-105 transition-all duration-300 shadow-xl shadow-purple-550/20"
            >
              <Sparkles className="w-5 h-5 text-pink-300" />
              Update with AI
            </button>
          </div>
        </div>

        {/* Floating UI Graphic */}
        <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 w-72 h-80 perspective-1000 pointer-events-none">
          <motion.div 
            animate={{ y: [-10, 10, -10], rotateY: [-5, 5, -5], rotateX: [5, -5, 5] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full relative"
          >
            {/* Fake floating resume card */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl flex flex-col gap-3 transform rotate-y-12 rotate-z-6">
              <div className="h-4 w-1/3 bg-white/40 rounded-md" />
              <div className="h-2 w-1/4 bg-indigo-300/50 rounded-md" />
              <div className="h-px w-full bg-white/20 my-2" />
              <div className="h-2 w-full bg-white/20 rounded-md" />
              <div className="h-2 w-5/6 bg-white/20 rounded-md" />
              <div className="mt-auto h-12 w-12 rounded-full border-4 border-emerald-400 flex items-center justify-center self-end">
                <span className="text-emerald-400 font-bold text-sm">92</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={item} className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <StatCard 
          title="Total Resumes" 
          value={dbResumes.length.toString()} 
          icon={FileText} 
          trend={dbResumes.length > 0 ? `+${dbResumes.length} total` : "No resumes yet"} 
        />
        <StatCard 
          title="Avg. ATS Score" 
          value={
            dbResumes.length > 0 
              ? Math.round(dbResumes.reduce((acc, r) => acc + calculateATSScore(r), 0) / dbResumes.length).toString()
              : "0"
          } 
          icon={Activity} 
          trend={dbResumes.length > 0 ? "Based on contents" : "Create a resume first"} 
        />
        <StatCard 
          title="Templates Used" 
          value={new Set(dbResumes.map(r => r.template)).size.toString()} 
          icon={LayoutTemplate} 
          trend={dbResumes.length > 0 ? "Unique designs" : "0 templates"} 
        />
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Recent Resumes Grid */}
        <motion.div variants={item} className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Recent Resumes</h2>
            <Link href="/dashboard/resumes" className="text-sm font-medium text-primary hover:underline">View all</Link>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {dbResumes.length === 0 ? (
              <div className="col-span-2 text-center py-10 bg-muted/20 rounded-2xl border border-dashed">
                <p className="text-muted-foreground">You don't have any resumes yet.</p>
              </div>
            ) : (
              dbResumes.slice(0, 3).map((r) => (
                <div key={r._id} className="group relative bg-card/60 backdrop-blur-md rounded-2xl border border-white/10 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-primary/30 flex flex-col">
                  <div className="aspect-[1/1.1] bg-muted/30 relative flex items-center justify-center p-4 transition-colors group-hover:bg-primary/5">
                    {/* Paper thumbnail */}
                    <ResumeMiniThumbnail resume={r} />

                    {/* Overlay Action — visible on hover (desktop) */}
                    <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center justify-center backdrop-blur-sm z-20">
                      <button
                        onClick={() => {
                          const mappedResume = { ...r, id: r._id };
                          loadResume(mappedResume);
                          router.push("/editor");
                        }}
                        className="bg-white text-indigo-900 px-6 py-2.5 rounded-full text-sm font-bold shadow-xl hover:scale-105 transition-transform cursor-pointer border border-indigo-100"
                      >
                        Open in Editor
                      </button>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col justify-between flex-1 bg-white dark:bg-slate-900 relative z-30">
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
              ))
            )}

            {/* Create New Card */}
            <button onClick={handleCreateNew} className="group cursor-pointer relative rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-card/30 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 flex flex-col items-center justify-center p-6 text-center gap-3 h-full min-h-[300px]">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Create New Resume</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-[150px] mx-auto">Start from scratch or import from LinkedIn</p>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Analytics & Activity */}
        <motion.div variants={item} className="space-y-6">
          {/* ATS Trend Chart */}
          <div className="bg-card/60 backdrop-blur-md rounded-2xl border shadow-sm p-5 glass-card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm">ATS Score Trend</h3>
              <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> 12%
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Your average score is improving</p>
            <ATSScoreChart />
          </div>

          {/* AI Insights Widget */}
          <div className="bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl border border-indigo-500/10 shadow-sm p-5">
            <h3 className="font-semibold text-sm flex items-center gap-2 text-indigo-700 dark:text-indigo-400 mb-4">
              <Star className="w-4 h-4 fill-indigo-500 text-indigo-500" />
              AI Insights
            </h3>
            <ul className="space-y-3">
              <li className="text-sm bg-white/60 dark:bg-slate-900/60 p-3 rounded-xl border border-white/20 shadow-sm">
                <span className="font-medium text-foreground block mb-1">Add more metrics</span>
                <span className="text-muted-foreground text-xs leading-relaxed">Resumes with numbers perform 40% better in ATS. Try adding metrics to your latest role.</span>
              </li>
              <li className="text-sm bg-white/60 dark:bg-slate-900/60 p-3 rounded-xl border border-white/20 shadow-sm">
                <span className="font-medium text-foreground block mb-1">Missing Keyword: Next.js</span>
                <span className="text-muted-foreground text-xs leading-relaxed">You mention React but not Next.js in your skills section.</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>

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

      {/* AI Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 relative max-h-[90vh] overflow-y-auto"
          >
            {/* Color bar at top */}
            <div className="absolute top-0 left-0 w-full h-1.5 rounded-t-3xl bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500" />
            
            <button 
              onClick={() => { if (!isUpdating) setShowUpdateModal(false); }}
              className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-950/40 dark:to-purple-950/40 flex items-center justify-center mb-5">
              <UploadCloud className="w-7 h-7 text-violet-600" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Upgrade Resume with AI</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">Upload your existing resume PDF. Our AI will scan it and rewrite it to maximize your ATS score so you can edit and download it.</p>

            <div className="space-y-5">
              {/* Job Title */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Target Job Title <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  placeholder="e.g. Senior Software Engineer"
                  value={updateJobTitle}
                  onChange={(e) => setUpdateJobTitle(e.target.value)}
                  disabled={isUpdating}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 disabled:opacity-60"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Upload Your Resume <span className="text-red-500">*</span></label>
                <label className={`relative flex flex-col items-center justify-center gap-3 min-h-[160px] rounded-2xl border-2 border-dashed transition-all cursor-pointer group ${uploadedFileName ? "border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20" : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/30 hover:border-violet-400 hover:bg-violet-50/30"} ${isUpdating ? "pointer-events-none opacity-60" : ""}`}>
                  <input
                    type="file"
                    accept=".pdf,.txt"
                    onChange={handleFileChange}
                    disabled={isUpdating}
                    className="sr-only"
                  />
                  {uploadedFileName ? (
                    <>
                      <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                        <span className="text-2xl">📄</span>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400 truncate max-w-[240px]">{uploadedFileName}</p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-0.5">✓ Ready to upgrade — click to change</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-violet-100 dark:group-hover:bg-violet-900/20 transition-colors">
                        <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-violet-500 transition-colors" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Click to upload PDF or TXT</p>
                        <p className="text-xs text-slate-400 mt-0.5">Supports all standard resume formats · Max 10MB</p>
                      </div>
                    </>
                  )}
                </label>
              </div>

              {/* Submit Button */}
              <button 
                onClick={handleUpdateAI}
                disabled={!updateJobTitle.trim() || !uploadedFile || isUpdating}
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-4 rounded-xl font-bold text-sm shadow-lg shadow-violet-500/25 hover:from-violet-700 hover:to-purple-700 hover:shadow-violet-500/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Upgrading your resume...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Upgrade My Resume
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-400">AI will analyze your resume, rewrite it for maximum ATS score, and open it in the editor.</p>
            </div>
          </motion.div>
        </div>
      )}

    </motion.div>
  );
}

function StatCard({ title, value, icon: Icon, trend }: { title: string, value: string, icon: any, trend: string }) {
  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col gap-3 group hover:border-primary/30 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm font-medium">{title}</span>
        <div className="p-2 bg-primary/5 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div>
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        <div className="text-xs text-muted-foreground mt-1">{trend}</div>
      </div>
    </div>
  );
}

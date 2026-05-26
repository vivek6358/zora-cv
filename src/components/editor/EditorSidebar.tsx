"use client";

import { cn } from "@/lib/utils";
import { User, Briefcase, GraduationCap, Wrench, FolderGit2, LayoutTemplate, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useResumeStore } from "@/store/resumeStore";

const navItems = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "projects", label: "Projects", icon: FolderGit2 },
];

export function EditorSidebar({ activeSection, setActiveSection }: { activeSection: string, setActiveSection: (s: string) => void }) {
  const { resume } = useResumeStore();

  // Find the step number (1-5) based on the active section
  const stepNumber = navItems.findIndex(item => item.id === activeSection) + 1;
  const displayStep = stepNumber > 0 ? stepNumber : 1; // Default to 1 if not in the main 5

  const allItems = [...navItems, { id: "templates", label: "Templates", icon: LayoutTemplate }, { id: "preview", label: "Preview", icon: Eye }];

  return (
    <>
      {/* ── DESKTOP: vertical left sidebar ── */}
      <div className="hidden lg:flex w-64 bg-card border-r flex-col h-full z-20 shadow-sm shrink-0">
        <div className="p-4 border-b">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Resume Content</div>
          <div className="text-sm text-foreground font-medium flex items-center justify-between">
            <span>Step</span>
            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[10px] font-bold">
              {displayStep}/5
            </span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeTab" 
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={cn("w-5 h-5 shrink-0 relative z-10", isActive && "text-primary")} />
                <span className="text-sm font-medium relative z-10">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t">
          <button 
            onClick={() => setActiveSection("templates")}
            className={cn(
              "w-full flex items-center gap-2 p-2.5 rounded-xl transition-colors cursor-pointer",
              activeSection === "templates" 
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                : "bg-muted hover:bg-muted/80 text-foreground"
            )}
          >
            <LayoutTemplate className="w-4 h-4 shrink-0" />
            <span className="text-sm font-medium">Templates</span>
          </button>
        </div>
      </div>

      {/* ── MOBILE: fixed bottom tab bar ── */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 dark:bg-slate-950/95 border-t border-slate-200 dark:border-slate-800 backdrop-blur-xl safe-area-bottom">
        <div className="flex items-stretch h-16">
          {allItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition-all relative",
                  isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-500"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobileActiveTab"
                    className="absolute inset-x-1 top-0 h-0.5 bg-indigo-500 rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon className={cn("w-5 h-5 shrink-0", isActive && "text-indigo-600 dark:text-indigo-400")} />
                <span className="text-[10px] font-semibold leading-none">
                  {item.id === "personal" ? "Info" : item.label.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

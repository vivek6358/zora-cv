"use client";

import { useResumeStore } from "@/store/resumeStore";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Check, Star, ExternalLink, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useUiStore } from "@/store/uiStore";

const templates = [
  { id: 'modern', name: 'Modern Zora', type: 'Professional', popular: true, desc: 'Clean lines and modern typography for tech roles.' },
  { id: 'minimal', name: 'Clean Minimalist', type: 'Creative', popular: false, desc: 'Maximum whitespace for high readability and elegance.' },
  { id: 'professional', name: 'Executive Standard', type: 'Professional', popular: false, desc: 'Traditional layout optimized for conservative industries.' },
  { id: 'creative', name: 'Design Portfolio', type: 'Creative', popular: false, desc: 'Bold headers and layout for creative professionals.' },
  { id: 'academic', name: 'Academic CV', type: 'Academic', popular: false, desc: 'Comprehensive multi-page layout optimized for research and academia.' },
  { id: 'tech', name: 'Silicon Valley Tech', type: 'Technical', popular: false, desc: 'Compact layout optimized for top-tier software and tech roles.' },
];

export default function TemplatesPage() {
  const { resume, setTemplate } = useResumeStore();
  const { setSidebarOpen } = useUiStore();

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  } as const;
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } }
  } as const;

  return (
    <div className="flex h-screen bg-muted/20">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative">
        {/* Mobile Header Bar */}
        <div className="md:hidden flex items-center justify-between p-4 sticky top-0 bg-white/60 dark:bg-slate-950/60 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/80 z-20">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 rounded-xl text-slate-550 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Open Sidebar"
          >
            <Menu className="w-5.5 h-5.5" />
          </button>
          <span className="font-bold text-slate-800 dark:text-white">Templates</span>
          <div className="w-9 h-9" /> {/* Spacer */}
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
        <div className="container mx-auto py-8 max-w-5xl relative z-10 px-4 md:px-8">
          
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
            <motion.div variants={item} className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Template Marketplace</h1>
              <p className="text-muted-foreground mt-1 text-lg">Choose a professional, ATS-optimized design that fits your industry.</p>
              
              <div className="flex items-center gap-2 mt-6">
                <button className="bg-foreground text-background px-4 py-1.5 rounded-full text-sm font-medium">All</button>
                <button className="bg-card border hover:bg-muted text-muted-foreground px-4 py-1.5 rounded-full text-sm font-medium transition-colors">Professional</button>
                <button className="bg-card border hover:bg-muted text-muted-foreground px-4 py-1.5 rounded-full text-sm font-medium transition-colors">Creative</button>
              </div>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => {
                const isActive = resume.template === template.id;
                
                return (
                  <motion.div 
                    variants={item}
                    key={template.id}
                    onClick={() => setTemplate(template.id as any)}
                    className={cn(
                      "group relative glass-panel rounded-3xl p-3 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.1)]",
                      isActive ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "hover:border-primary/50"
                    )}
                  >
                    {template.popular && (
                      <div className="absolute -top-3 -right-3 bg-gradient-to-r from-accent to-primary text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 z-20">
                        <Star className="w-3 h-3 fill-current" /> Popular
                      </div>
                    )}
                    
                    <div className="aspect-[1/1.4] bg-muted/30 rounded-2xl mb-4 overflow-hidden relative border shadow-inner">
                      {/* Abstract preview rendering */}
                      <div className="absolute inset-x-4 top-4 bottom-4 bg-white shadow-md rounded border flex flex-col items-center justify-center transition-transform duration-700 ease-out group-hover:scale-105">
                         <div className="w-full px-4 mb-4">
                           <div className="h-4 w-2/3 bg-slate-200 rounded mb-2"></div>
                           <div className="h-2 w-1/3 bg-primary/30 rounded"></div>
                         </div>
                         <div className="w-full px-4 space-y-2">
                           <div className="h-1.5 w-full bg-slate-100 rounded"></div>
                           <div className="h-1.5 w-full bg-slate-100 rounded"></div>
                           <div className="h-1.5 w-4/5 bg-slate-100 rounded"></div>
                         </div>
                      </div>

                      {/* Hover action overlay */}
                      <div className={cn(
                        "absolute inset-0 flex items-center justify-center backdrop-blur-[2px] transition-all duration-300",
                        isActive ? "bg-primary/10 opacity-100" : "bg-black/20 opacity-0 group-hover:opacity-100"
                      )}>
                        {isActive ? (
                          <div className="bg-primary text-primary-foreground rounded-full p-4 shadow-xl">
                            <Check className="w-6 h-6" />
                          </div>
                        ) : (
                          <button className="bg-white text-black px-4 py-2 rounded-xl text-sm font-semibold shadow-xl flex items-center gap-2">
                            Select Template
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="px-2 pb-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground text-lg">{template.name}</h3>
                        <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wider">{template.type}</p>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{template.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { FileText, LayoutTemplate, Activity, Settings, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-0 flex items-start justify-center pt-[20vh] z-50 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-lg pointer-events-auto"
            >
              <Command className="bg-card border shadow-2xl rounded-xl overflow-hidden glass-panel">
                <div className="flex items-center border-b px-3">
                  <Search className="w-5 h-5 text-muted-foreground mr-2 shrink-0" />
                  <Command.Input 
                    placeholder="Type a command or search..." 
                    className="flex h-12 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-none ring-0 focus:ring-0"
                    autoFocus
                  />
                  <div className="flex items-center gap-1">
                     <kbd className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-medium font-mono text-muted-foreground">ESC</kbd>
                  </div>
                </div>
                <Command.List className="max-h-[300px] overflow-y-auto p-2">
                  <Command.Empty className="py-6 text-center text-sm text-muted-foreground">No results found.</Command.Empty>
                  
                  <Command.Group heading="Navigation" className="px-2 text-xs font-medium text-muted-foreground mb-2 mt-2">
                    <Command.Item 
                      onSelect={() => { router.push('/dashboard'); setOpen(false); }}
                      className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-foreground hover:bg-primary/10 hover:text-primary cursor-pointer aria-selected:bg-primary/10 aria-selected:text-primary transition-colors"
                    >
                      <FileText className="w-4 h-4" /> Go to Dashboard
                    </Command.Item>
                    <Command.Item 
                      onSelect={() => { router.push('/editor'); setOpen(false); }}
                      className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-foreground hover:bg-primary/10 hover:text-primary cursor-pointer aria-selected:bg-primary/10 aria-selected:text-primary transition-colors"
                    >
                      <LayoutTemplate className="w-4 h-4" /> Create New Resume
                    </Command.Item>
                    <Command.Item 
                      onSelect={() => { router.push('/score'); setOpen(false); }}
                      className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-foreground hover:bg-primary/10 hover:text-primary cursor-pointer aria-selected:bg-primary/10 aria-selected:text-primary transition-colors"
                    >
                      <Activity className="w-4 h-4" /> View ATS Scores
                    </Command.Item>
                  </Command.Group>
                </Command.List>
              </Command>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

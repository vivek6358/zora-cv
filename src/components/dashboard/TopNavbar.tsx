"use client";

import { useSession } from "next-auth/react";
import { Search, Bell, Moon, Sun, ChevronDown, User as UserIcon, LogOut, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { useUiStore } from "@/store/uiStore";
import { ZoraCVLogo } from "@/components/ui/ZoraCVLogo";

export function TopNavbar() {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { setSidebarOpen } = useUiStore();

  // Focus shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        document.getElementById('global-search')?.focus();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <header className="h-16 border-b border-slate-200/60 dark:border-white/10 bg-white/40 dark:bg-slate-950/40 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-6">
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setSidebarOpen(true)}
        className="md:hidden p-2 -ml-2 rounded-xl text-slate-550 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        aria-label="Open Sidebar"
      >
        <Menu className="w-5.5 h-5.5" />
      </button>

      {/* Logo — visible only on mobile (desktop shows it in the sidebar) */}
      <div className="md:hidden">
        <ZoraCVLogo size={30} />
      </div>

      {/* Spacer to push right actions to the right on desktop */}
      <div className="hidden md:block" />

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* User Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1 pr-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
              {session?.user?.name?.charAt(0) || "U"}
            </div>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 origin-top-right overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{session?.user?.name}</p>
                  <p className="text-xs text-slate-500 truncate">{session?.user?.email}</p>
                </div>
                
                <div className="py-1">
                  <button className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                    <UserIcon className="w-4 h-4" /> Profile
                  </button>
                  <button onClick={() => signOut({ callbackUrl: "/" })} className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

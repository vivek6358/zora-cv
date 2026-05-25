"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FileText, Settings, LayoutTemplate, Sparkles, X } from "lucide-react";
import { useUiStore } from "@/store/uiStore";
import { ZoraCVLogo } from "@/components/ui/ZoraCVLogo";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Resumes", href: "/dashboard/resumes", icon: FileText },
  { name: "Templates", href: "/dashboard/templates", icon: LayoutTemplate },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

function SidebarContent({ pathname, onLinkClick }: { pathname: string; onLinkClick?: () => void }) {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-6 pb-2">
        <ZoraCVLogo size={34} />
      </div>
      
      <div className="px-6 py-4">
        <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 mb-3 ml-1">Main Menu</p>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onLinkClick}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 relative overflow-hidden",
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-xl" />
                )}
                <item.icon className={cn(
                  "h-5 w-5 transition-transform duration-300 group-hover:scale-110", 
                  isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 group-hover:text-slate-600"
                )} />
                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6">
        <div 
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-100/50 dark:border-indigo-900/30 p-5 shadow-sm transition-all"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/20 to-transparent rounded-bl-full -mr-4 -mt-4" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-500 fill-current" />
            Free Forever Access
          </h3>
          <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
            Create, export, and optimize ATS resumes with unlimited AI tools.
          </p>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUiStore();

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile, visible on medium screens and up) */}
      <aside className="hidden md:flex w-64 bg-white/45 dark:bg-slate-950/40 backdrop-blur-2xl border-r border-white/20 dark:border-slate-800/50 flex-col h-full shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-30">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile Drawer (visible on mobile screens when active) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div 
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
          />
          
          {/* Drawer Panel */}
          <aside className="relative flex w-64 max-w-xs flex-col bg-white dark:bg-slate-950 h-full p-2 shadow-2xl border-r border-slate-200 dark:border-slate-800/80 animate-in slide-in-from-left duration-300 z-55">
            {/* Close button inside drawer */}
            <button 
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-800 transition-colors z-50"
            >
              <X className="w-5 h-5" />
            </button>
            
            <SidebarContent pathname={pathname} onLinkClick={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}

import { Sidebar } from "@/components/sidebar/Sidebar";
import { TopNavbar } from "@/components/dashboard/TopNavbar";
import { CommandPalette } from "@/components/ui/CommandPalette";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[100dvh] bg-slate-50 dark:bg-slate-950 font-sans selection:bg-indigo-500/30 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative flex flex-col min-w-0">
        {/* Soft Grid Texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>
        <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-indigo-500/5 dark:from-indigo-500/10 to-transparent pointer-events-none z-0"></div>
        
        <TopNavbar />
        
        <div className="flex-1 relative z-10 p-4 md:p-8">
          {children}
        </div>
      </main>
      <CommandPalette />
    </div>
  );
}


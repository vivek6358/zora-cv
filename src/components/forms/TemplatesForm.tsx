import { useResumeStore } from "@/store/resumeStore";
import { ResumeTemplate } from "@/types/resume";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

export function TemplatesForm() {
  const { resume, setTemplate } = useResumeStore();

  const templates: { id: ResumeTemplate; name: string; description: string; badge?: string }[] = [
    {
      id: "modern",
      name: "Modern Zora",
      description: "A clean, accented design perfect for tech and modern corporate roles.",
      badge: "Popular",
    },
    {
      id: "minimal",
      name: "Clean Minimalist",
      description: "Strictly black and white with serif fonts. Best for finance, law, and traditional ATS systems.",
    },
    {
      id: "creative",
      name: "Creative Studio",
      description: "A vibrant, two-column layout tailored for designers and creative professionals.",
    },
    {
      id: "professional",
      name: "Executive Professional",
      description: "A solid, structured layout designed for managers and executives.",
    },
    {
      id: "academic",
      name: "Academic CV",
      description: "A comprehensive multi-page layout optimized for research, publications, and academia.",
    },
    {
      id: "tech",
      name: "Silicon Valley Tech",
      description: "A compact single-page standard favored by recruiters at Google, Meta, and Apple.",
      badge: "Tech Choice",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((t) => (
          <div
            key={t.id}
            onClick={() => setTemplate(t.id)}
            className={cn(
              "relative cursor-pointer rounded-2xl border-2 p-5 transition-all duration-200",
              resume.template === t.id
                ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                : "border-border bg-card hover:border-primary/50 hover:bg-muted/50"
            )}
          >
            {/* Active Indicator */}
            {resume.template === t.id && (
              <div className="absolute top-4 right-4 text-primary">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            )}

            {/* Badge */}
            {t.badge && (
              <span className="absolute top-[-10px] left-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shadow-sm">
                {t.badge}
              </span>
            )}

            <div className="mt-2">
              <h3 className="font-semibold text-foreground text-lg">{t.name}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                {t.description}
              </p>
            </div>
            
            {/* Mini visual representation */}
            <div className="mt-4 aspect-[4/3] w-full rounded-lg border border-slate-200 bg-white overflow-hidden shadow-sm flex items-center justify-center p-2 opacity-80 group-hover:opacity-100 transition-opacity">
               {t.id === "modern" && (
                 <div className="w-full h-full bg-white border flex flex-col p-2 gap-1 text-left font-sans">
                   <div className="border-b border-indigo-200 pb-1 mb-1">
                     <div className="text-[10px] font-bold text-slate-800 leading-none">{resume.personalInfo?.fullName || "John Doe"}</div>
                     <div className="text-[6px] font-medium text-indigo-600 mt-0.5">{resume.personalInfo?.jobTitle || "Software Engineer"}</div>
                   </div>
                   <div className="text-[5px] font-bold text-indigo-600 uppercase tracking-wider mt-1">Experience</div>
                   <div className="text-[5px] font-semibold text-slate-800 leading-tight">{resume.experience?.[0]?.jobTitle || "Senior Developer"}</div>
                   <div className="text-[4px] text-slate-500 leading-tight">{resume.experience?.[0]?.company || "Tech Corp"} • {resume.experience?.[0]?.startDate || "2020"} - {resume.experience?.[0]?.endDate || "Present"}</div>
                   <ul className="text-[4px] text-slate-650 list-disc ml-2 mt-0.5 leading-tight">
                     <li>{resume.experience?.[0]?.description?.[0] || "Developed scalable web applications"}</li>
                     {resume.experience?.[0]?.description?.[1] && <li>{resume.experience?.[0]?.description?.[1]}</li>}
                   </ul>
                 </div>
               )}

               {t.id === "minimal" && (
                 <div className="w-full h-full bg-white border flex flex-col p-2 gap-1 items-center font-serif text-center">
                   <div className="border-b border-black w-full flex flex-col items-center pb-1 mb-1">
                     <div className="text-[10px] font-normal uppercase tracking-wide text-black leading-none">{resume.personalInfo?.fullName || "John Doe"}</div>
                     <div className="text-[4px] text-black mt-0.5">{resume.personalInfo?.email || "john@email.com"} • {resume.personalInfo?.location || "New York, NY"}</div>
                   </div>
                   <div className="text-[5px] font-bold uppercase tracking-widest text-black mt-1 w-full text-left border-b border-black/20 pb-0.5">Experience</div>
                   <div className="w-full flex justify-between items-baseline mt-0.5">
                      <span className="text-[5px] font-bold text-black">{resume.experience?.[0]?.company || "Tech Corp"}</span>
                      <span className="text-[4px] italic text-black">{resume.experience?.[0]?.startDate || "2020"} - {resume.experience?.[0]?.endDate || "Present"}</span>
                   </div>
                   <div className="text-[4px] italic text-black w-full text-left">{resume.experience?.[0]?.jobTitle || "Senior Developer"}</div>
                   <ul className="text-[4px] text-black list-disc ml-2 mt-0.5 leading-tight w-full text-left">
                     <li>{resume.experience?.[0]?.description?.[0] || "Developed scalable web applications"}</li>
                   </ul>
                 </div>
               )}

               {t.id === "creative" && (
                 <div className="w-full h-full bg-white border flex rounded overflow-hidden font-sans">
                   <div className="w-[35%] bg-slate-900 h-full p-2 flex flex-col gap-1 text-white">
                     <div className="text-[10px] font-black leading-none tracking-tighter">{(resume.personalInfo?.fullName || "John Doe").split(" ")[0]}</div>
                     <div className="text-[10px] font-light leading-none tracking-tight">{(resume.personalInfo?.fullName || "John Doe").split(" ").slice(1).join(" ")}</div>
                     <div className="text-[5px] font-semibold text-indigo-400 mt-1 uppercase">{resume.personalInfo?.jobTitle || "Developer"}</div>
                     <div className="text-[4px] font-bold text-slate-500 uppercase mt-2.5 border-b border-slate-700 pb-0.5">Contact</div>
                     <div className="text-[3px] text-slate-300 mt-0.5 truncate">{resume.personalInfo?.email || "john@email.com"}</div>
                     <div className="text-[3px] text-slate-300">{resume.personalInfo?.location || "New York, NY"}</div>
                   </div>
                   <div className="w-[65%] h-full p-2 flex flex-col gap-1">
                     <div className="text-[6px] font-bold text-slate-900 relative inline-block mb-1">
                       Experience
                       <div className="absolute -bottom-0.5 left-0 w-1/2 h-[1px] bg-indigo-500" />
                     </div>
                     <div className="pl-1 border-l border-slate-200 relative mt-0.5">
                       <div className="absolute w-1 h-1 bg-indigo-500 rounded-full -left-[2.5px] top-0.5 border border-white" />
                       <div className="text-[5px] font-bold text-slate-900 leading-tight truncate">{resume.experience?.[0]?.jobTitle || "Senior Dev"}</div>
                       <div className="text-[4px] font-semibold text-indigo-600 truncate">{resume.experience?.[0]?.company || "Tech Corp"}</div>
                       <div className="text-[3px] text-slate-500 mt-0.5 leading-tight line-clamp-2">{resume.experience?.[0]?.description?.[0] || "Developed web apps and led a team of 5."}</div>
                     </div>
                   </div>
                 </div>
               )}

               {t.id === "professional" && (
                 <div className="w-full h-full bg-white border flex flex-col p-2 gap-1 font-sans">
                   <div className="border-b-2 border-slate-800 pb-1 mb-1">
                     <div className="text-[10px] font-black tracking-tight uppercase text-slate-900 leading-none">{resume.personalInfo?.fullName || "John Doe"}</div>
                     <div className="text-[5px] font-bold text-slate-650 uppercase tracking-wider mt-0.5 truncate">{resume.personalInfo?.jobTitle || "Software Engineer"}</div>
                   </div>
                   <div className="bg-slate-100 p-0.5 mt-1">
                     <div className="text-[5px] font-bold uppercase tracking-widest text-slate-900">Professional Experience</div>
                   </div>
                   <div className="flex justify-between w-full mt-0.5 items-end">
                     <div className="min-w-0">
                       <div className="text-[5px] font-bold text-slate-900 leading-none truncate">{resume.experience?.[0]?.jobTitle || "Senior Developer"}</div>
                       <div className="text-[4px] font-semibold text-slate-700 mt-0.5 truncate">{resume.experience?.[0]?.company || "Tech Corp"}</div>
                     </div>
                     <div className="text-[4px] font-bold text-slate-500 shrink-0 ml-1">{resume.experience?.[0]?.startDate || "2020"} - {resume.experience?.[0]?.endDate || "Present"}</div>
                   </div>
                   <ul className="text-[4px] text-slate-800 list-disc ml-2 leading-tight">
                     <li className="line-clamp-2">{resume.experience?.[0]?.description?.[0] || "Developed scalable web applications"}</li>
                   </ul>
                 </div>
               )}

               {t.id === "academic" && (
                 <div className="w-full h-full bg-white border flex flex-col p-2 gap-0.5 font-serif text-left">
                   <div className="text-center border-b pb-0.5 mb-1">
                     <div className="text-[9px] font-bold uppercase text-slate-900 leading-none">{resume.personalInfo?.fullName || "John Doe, PhD"}</div>
                     <div className="text-[4px] text-slate-500 mt-0.5 truncate">{resume.personalInfo?.email || "john@berkeley.edu"}</div>
                   </div>
                   <div className="text-[4.5px] font-bold uppercase border-b pb-0.5">Education</div>
                   <div className="text-[4px] font-bold text-slate-800 mt-0.5 leading-none">{resume.education?.[0]?.degree || "PhD in CS, UC Berkeley"}</div>
                   <div className="text-[4px] font-bold uppercase border-b pb-0.5 mt-1">Publications</div>
                   <div className="text-[3.5px] text-slate-700 truncate">1. J. Doe, et al. "Distributed Graph Learning." 2019.</div>
                 </div>
               )}

               {t.id === "tech" && (
                 <div className="w-full h-full bg-white border flex flex-col p-2 gap-1 font-mono leading-none text-left">
                   <div className="flex justify-between items-start border-b pb-0.5 mb-1">
                     <div>
                       <div className="text-[9px] font-bold text-slate-900 leading-none">{resume.personalInfo?.fullName?.toLowerCase().replace(" ", "_") || "john_doe"}.go()</div>
                       <div className="text-[4.5px] font-medium text-emerald-600 mt-0.5 truncate">{resume.personalInfo?.jobTitle || "software-engineer"}</div>
                     </div>
                   </div>
                   <div className="text-[4.5px] font-bold text-emerald-600">// Experience</div>
                   <div className="text-[4px] font-bold text-slate-800 truncate">{resume.experience?.[0]?.jobTitle || "Staff Software Engineer"} @ {resume.experience?.[0]?.company || "Google"}</div>
                   <div className="text-[3.5px] text-slate-500 truncate">- Reduced tail latency by 45%.</div>
                 </div>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

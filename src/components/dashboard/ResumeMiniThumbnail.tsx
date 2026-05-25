import React from "react";
import { ResumePreview } from "@/components/resume/ResumePreview";

export function ResumeMiniThumbnail({ resume }: { resume: any }) {
  if (!resume) return null;

  return (
    <div className="w-[140px] h-[198px] rounded-md shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden bg-white relative flex justify-center items-start transition-all duration-300 select-none">
      <div 
        style={{ 
          width: "794px",
          height: "1123px",
          transform: "scale(0.176)", 
          transformOrigin: "top left",
        }}
        className="absolute top-0 left-0 bg-white pointer-events-none text-left"
      >
        <ResumePreview resumeData={resume} />
      </div>
    </div>
  );
}

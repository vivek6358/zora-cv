"use client";

import { useResumeStore } from "@/store/resumeStore";
import { cn } from "@/lib/utils";
import { ResumeData } from "@/types/resume";
import React from "react";

export const ResumePreview = React.forwardRef<HTMLDivElement, { resumeData?: any }>((props, ref) => {
  const { resume: storeResume } = useResumeStore();
  const rawResume = props.resumeData || storeResume;

  if (!rawResume) return null;

  // Normalize resume data to prevent runtime crashes from missing fields/relations
  const resume = {
    ...rawResume,
    template: rawResume.template || "modern",
    personalInfo: {
      fullName: "",
      jobTitle: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
      github: "",
      summary: "",
      ...(rawResume.personalInfo || {}),
    },
    experience: (rawResume.experience || []).map((exp: any) => ({
      ...exp,
      jobTitle: exp.jobTitle || "",
      company: exp.company || "",
      location: exp.location || "",
      startDate: exp.startDate || "",
      endDate: exp.endDate || "",
      description: Array.isArray(exp.description) ? exp.description : [],
    })),
    education: (rawResume.education || []).map((edu: any) => ({
      ...edu,
      degree: edu.degree || "",
      school: edu.school || "",
      location: edu.location || "",
      startDate: edu.startDate || "",
      endDate: edu.endDate || "",
      description: edu.description || "",
    })),
    skills: (rawResume.skills || []).map((skill: any) => ({
      ...skill,
      name: skill.name || "",
    })),
    projects: (rawResume.projects || []).map((proj: any) => ({
      ...proj,
      title: proj.title || "",
      description: proj.description || "",
      url: proj.url || "",
      technologies: Array.isArray(proj.technologies) ? proj.technologies : [],
    })),
  };

  return (
    <div ref={ref} className="w-full bg-white print:bg-white text-black" style={{ minHeight: "1123px" }}>
      {resume.template === "modern" && <ModernTemplate resume={resume as any} />}
      {resume.template === "minimal" && <MinimalTemplate resume={resume as any} />}
      {resume.template === "creative" && <CreativeTemplate resume={resume as any} />}
      {resume.template === "professional" && <ProfessionalTemplate resume={resume as any} />}
      {resume.template === "academic" && <AcademicTemplate resume={resume as any} />}
      {resume.template === "tech" && <TechTemplate resume={resume as any} />}
    </div>
  );
});

ResumePreview.displayName = "ResumePreview";

function ModernTemplate({ resume }: { resume: ResumeData }) {
  return (
    <div className="p-5 font-sans text-[12px] leading-snug">
      <header className="border-b-2 border-indigo-600/30 pb-2 mb-2.5">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">{resume.personalInfo.fullName}</h1>
        <p className="text-sm text-indigo-600 mt-0.5 font-medium">{resume.personalInfo.jobTitle}</p>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5 text-xs text-slate-650 font-medium">
          {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
          {resume.personalInfo.phone && <span>{resume.personalInfo.phone}</span>}
          {resume.personalInfo.location && <span>{resume.personalInfo.location}</span>}
          {resume.personalInfo.linkedin && <span>{resume.personalInfo.linkedin}</span>}
        </div>
      </header>

      {resume.personalInfo.summary && (
        <section className="mb-2.5">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 mb-1">Professional Summary</h2>
          <p className="text-slate-700 text-[11px] leading-normal">{resume.personalInfo.summary}</p>
        </section>
      )}

      {resume.experience.length > 0 && (
        <section className="mb-2.5">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 mb-1">Experience</h2>
          <div className="space-y-2">
            {resume.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-0.5">
                  <h3 className="font-semibold text-slate-900 text-[12px] leading-tight">{exp.jobTitle}</h3>
                  <span className="text-xs text-slate-500 font-medium whitespace-nowrap ml-2">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <div className="text-[11px] font-medium text-indigo-600 mb-0.5">{exp.company}{exp.location ? ` • ${exp.location}` : ""}</div>
                <ul className="list-disc list-outside ml-4 text-[11px] text-slate-700 space-y-0.5 leading-normal">
                  {exp.description.map((desc, i) => <li key={i}>{desc}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-4">
        {resume.education.length > 0 && (
          <section className="mb-2.5">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 mb-1">Education</h2>
            <div className="space-y-1.5">
              {resume.education.map((edu) => (
                <div key={edu.id}>
                  <h3 className="font-semibold text-slate-900 text-[12px] leading-tight">{edu.degree}</h3>
                  <div className="text-[11px] text-slate-700">{edu.school}</div>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {resume.skills.length > 0 && (
          <section className="mb-2.5">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 mb-1">Skills</h2>
            <div className="flex flex-wrap gap-1">
              {resume.skills.map((skill) => (
                <span key={skill.id} className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-medium border border-slate-200">
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>

      {resume.projects && resume.projects.length > 0 && (
        <section className="mb-2.5">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 mb-1">Projects</h2>
          <div className="space-y-1.5">
            {resume.projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-start mb-0.5">
                  <h3 className="font-semibold text-slate-900 text-[12px] leading-tight">{proj.title}</h3>
                  {proj.url && <span className="text-[10px] text-indigo-600 font-medium ml-2">{proj.url}</span>}
                </div>
                <p className="text-[11px] text-slate-700 leading-normal mb-0.5">{proj.description}</p>
                {proj.technologies && proj.technologies.length > 0 && (
                  <p className="text-[10px] text-slate-500 font-medium">
                    {proj.technologies.join(" • ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function MinimalTemplate({ resume }: { resume: ResumeData }) {
  return (
    <div className="p-5 font-serif text-[12px] leading-snug">
      <header className="border-b border-black pb-2 mb-2.5 text-center">
        <h1 className="text-xl font-normal tracking-wide text-black uppercase">{resume.personalInfo.fullName}</h1>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-1.5 text-xs text-black">
          {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
          {resume.personalInfo.phone && <span>• {resume.personalInfo.phone}</span>}
          {resume.personalInfo.location && <span>• {resume.personalInfo.location}</span>}
        </div>
      </header>

      {resume.personalInfo.summary && (
        <section className="mb-2.5">
          <p className="text-black text-[11px] leading-normal">{resume.personalInfo.summary}</p>
        </section>
      )}

      {resume.experience.length > 0 && (
        <section className="mb-2.5">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-black mb-1.5 border-b border-black/20 pb-0.5">Experience</h2>
          <div className="space-y-2">
            {resume.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="font-bold text-black text-[12px]">{exp.company}</h3>
                  <span className="text-xs text-black italic">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <div className="text-[11px] font-normal text-black italic mb-0.5">{exp.jobTitle}{exp.location ? ` - ${exp.location}` : ""}</div>
                <ul className="list-disc list-outside ml-4 text-[11px] text-black space-y-0.5 leading-normal">
                  {exp.description.map((desc, i) => <li key={i}>{desc}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.education.length > 0 && (
        <section className="mb-2.5">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-black mb-1.5 border-b border-black/20 pb-0.5">Education</h2>
          <div className="space-y-1.5">
            {resume.education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-bold text-black text-[12px]">{edu.school}</h3>
                  <div className="text-[11px] text-black">{edu.degree}</div>
                </div>
                <span className="text-xs text-black italic">
                  {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.skills.length > 0 && (
        <section className="mb-2.5">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-black mb-1.5 border-b border-black/20 pb-0.5">Skills</h2>
          <p className="text-[11px] text-black leading-normal">
            {resume.skills.map(s => s.name).join(", ")}
          </p>
        </section>
      )}
    </div>
  );
}

function CreativeTemplate({ resume }: { resume: ResumeData }) {
  return (
    <div className="font-sans flex" style={{ minHeight: "297mm" }}>
      {/* Sidebar */}
      <div className="w-[33%] bg-slate-900 text-white p-4" style={{ minHeight: "297mm" }}>
        <h1 className="text-xl font-black tracking-tighter leading-none mb-1">{resume.personalInfo.fullName.split(' ')[0]}</h1>
        <h1 className="text-xl font-light tracking-tight leading-none mb-2">{resume.personalInfo.fullName.split(' ').slice(1).join(' ')}</h1>
        <p className="text-indigo-400 font-semibold tracking-wide uppercase text-[9px] mb-4">{resume.personalInfo.jobTitle}</p>

        <div className="space-y-4">
          <div>
            <h2 className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 border-b border-slate-700 pb-0.5">Contact</h2>
            <div className="space-y-1 text-[11px] text-slate-300">
              {resume.personalInfo.email && <div className="break-all">{resume.personalInfo.email}</div>}
              {resume.personalInfo.phone && <div>{resume.personalInfo.phone}</div>}
              {resume.personalInfo.location && <div>{resume.personalInfo.location}</div>}
              {resume.personalInfo.website && <div className="break-all">{resume.personalInfo.website}</div>}
            </div>
          </div>

          {resume.skills.length > 0 && (
            <div>
              <h2 className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 border-b border-slate-700 pb-0.5">Expertise</h2>
              <div className="flex flex-col gap-0.5">
                {resume.skills.map((skill) => (
                  <div key={skill.id} className="text-[11px] font-medium text-slate-200">
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {resume.education.length > 0 && (
            <div>
              <h2 className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 border-b border-slate-700 pb-0.5">Education</h2>
              <div className="space-y-2">
                {resume.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="text-[9px] text-indigo-400 font-bold mb-0.5">{edu.startDate} - {edu.endDate}</div>
                    <div className="text-[11px] font-bold text-white leading-tight mb-0.5">{edu.degree}</div>
                    <div className="text-[10px] text-slate-400">{edu.school}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="w-[67%] bg-white p-5">
        {resume.personalInfo.summary && (
          <section className="mb-3.5 mt-1">
            <h2 className="text-sm font-bold text-slate-900 mb-1.5 relative inline-block">
              Profile
              <div className="absolute -bottom-0.5 left-0 w-1/2 h-0.5 bg-indigo-500"></div>
            </h2>
            <p className="text-slate-600 text-[11px] leading-normal">{resume.personalInfo.summary}</p>
          </section>
        )}

        {resume.experience.length > 0 && (
          <section className="mb-3.5">
            <h2 className="text-sm font-bold text-slate-900 mb-2 relative inline-block">
              Experience
              <div className="absolute -bottom-0.5 left-0 w-1/2 h-0.5 bg-indigo-500"></div>
            </h2>
            <div className="space-y-2.5">
              {resume.experience.map((exp) => (
                <div key={exp.id} className="relative pl-3 border-l-2 border-slate-200">
                  <div className="absolute w-2 h-2 bg-indigo-500 rounded-full -left-[5px] top-1 border-2 border-white"></div>
                  <h3 className="font-bold text-slate-900 text-[12px] leading-tight">{exp.jobTitle}</h3>
                  <div className="text-[11px] font-semibold text-indigo-600 mb-0.5">{exp.company}</div>
                  <div className="text-[9px] font-bold text-slate-400 mb-1 uppercase tracking-wider">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </div>
                  <ul className="list-disc list-outside ml-3 text-[11px] text-slate-600 space-y-0.5 leading-normal">
                    {exp.description.map((desc, i) => <li key={i}>{desc}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {resume.projects && resume.projects.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-slate-900 mb-2 relative inline-block">
              Projects
              <div className="absolute -bottom-0.5 left-0 w-1/2 h-0.5 bg-indigo-500"></div>
            </h2>
            <div className="grid grid-cols-1 gap-2">
              {resume.projects.map((proj) => (
                <div key={proj.id} className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <h3 className="font-bold text-slate-900 text-[12px] leading-tight">{proj.title}</h3>
                  <p className="text-[11px] text-slate-600 mt-1 mb-1.5 leading-normal">{proj.description}</p>
                  <div className="flex flex-wrap gap-1">
                     {proj.technologies?.map(tech => (
                       <span key={tech} className="bg-white px-1.5 py-0.5 rounded text-[9px] font-medium text-indigo-600 border border-indigo-100">{tech}</span>
                     ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function ProfessionalTemplate({ resume }: { resume: ResumeData }) {
  return (
    <div className="p-5 font-sans text-slate-800 text-[12px] leading-snug">
      <header className="border-b-4 border-slate-800 pb-2 mb-2.5">
        <h1 className="text-xl font-black tracking-tight uppercase text-slate-900 leading-tight">{resume.personalInfo.fullName}</h1>
        <p className="text-xs text-slate-605 font-bold uppercase tracking-wider mt-0.5">{resume.personalInfo.jobTitle}</p>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5 text-xs font-medium text-slate-600">
          {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
          {resume.personalInfo.phone && <span>| {resume.personalInfo.phone}</span>}
          {resume.personalInfo.location && <span>| {resume.personalInfo.location}</span>}
          {resume.personalInfo.linkedin && <span>| {resume.personalInfo.linkedin}</span>}
        </div>
      </header>

      {resume.personalInfo.summary && (
        <section className="mb-2.5">
          <p className="text-[11px] leading-normal">{resume.personalInfo.summary}</p>
        </section>
      )}

      {resume.experience.length > 0 && (
        <section className="mb-2.5">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 mb-1.5 bg-slate-100 p-0.5 px-2">Professional Experience</h2>
          <div className="space-y-2 px-1">
            {resume.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-end mb-0.5">
                  <div>
                    <h3 className="font-bold text-slate-900 text-[12px] leading-tight">{exp.jobTitle}</h3>
                    <div className="text-[11px] font-semibold text-slate-700 mt-0.5">{exp.company}{exp.location ? `, ${exp.location}` : ""}</div>
                  </div>
                  <span className="text-xs font-bold text-slate-500 whitespace-nowrap ml-2">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <ul className="list-disc list-outside ml-4 mt-0.5 text-[11px] space-y-0.5 leading-normal">
                  {exp.description.map((desc, i) => <li key={i}>{desc}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.education.length > 0 && (
        <section className="mb-2.5">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 mb-1.5 bg-slate-100 p-0.5 px-2">Education</h2>
          <div className="space-y-1.5 px-1">
            {resume.education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-900 text-[12px] leading-tight">{edu.degree}</h3>
                  <div className="text-[11px] text-slate-700">{edu.school}{edu.location ? `, ${edu.location}` : ""}</div>
                </div>
                <span className="text-xs font-bold text-slate-500 whitespace-nowrap ml-2">
                  {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.skills.length > 0 && (
        <section className="mb-2.5">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 mb-1.5 bg-slate-100 p-0.5 px-2">Core Competencies</h2>
          <div className="px-1 text-[11px] font-medium leading-normal text-slate-750">
            {resume.skills.map(s => s.name).join(" • ")}
          </div>
        </section>
      )}
    </div>
  );
}

function AcademicTemplate({ resume }: { resume: ResumeData }) {
  return (
    <div className="p-5 font-serif text-slate-900 text-[12px] leading-snug">
      <header className="border-b border-slate-900 pb-2 mb-2.5 text-center">
        <h1 className="text-xl font-bold tracking-wide uppercase leading-tight">{resume.personalInfo.fullName}</h1>
        <p className="text-xs text-slate-600 mt-0.5 italic">{resume.personalInfo.jobTitle}</p>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-1.5 text-xs text-slate-600 font-medium">
          {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
          {resume.personalInfo.phone && <span>| {resume.personalInfo.phone}</span>}
          {resume.personalInfo.location && <span>| {resume.personalInfo.location}</span>}
          {resume.personalInfo.linkedin && <span>| {resume.personalInfo.linkedin}</span>}
        </div>
      </header>

      {resume.personalInfo.summary && (
        <section className="mb-2.5">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-800 mb-1 border-b pb-0.5">Research Interests</h2>
          <p className="text-slate-700 text-[11px] leading-normal">{resume.personalInfo.summary}</p>
        </section>
      )}

      {resume.education.length > 0 && (
        <section className="mb-2.5">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-800 mb-1.5 border-b pb-0.5">Education</h2>
          <div className="space-y-1.5">
            {resume.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="font-bold text-slate-900 text-[12px] leading-tight">{edu.degree}</h3>
                  <span className="text-xs text-slate-500 font-medium ml-2">{edu.startDate} - {edu.current ? "Present" : edu.endDate}</span>
                </div>
                <div className="text-[11px] text-slate-700 font-medium leading-normal">{edu.school}{edu.location ? ` • ${edu.location}` : ""}</div>
                {edu.description && <p className="text-[10px] text-slate-600 mt-0.5 italic leading-normal">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.experience.length > 0 && (
        <section className="mb-2.5">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-800 mb-1.5 border-b pb-0.5">Academic & Professional Appointments</h2>
          <div className="space-y-2">
            {resume.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="font-bold text-slate-900 text-[12px] leading-tight">{exp.jobTitle}</h3>
                  <span className="text-xs text-slate-500 font-medium ml-2">{exp.startDate} - {exp.current ? "Present" : exp.endDate}</span>
                </div>
                <div className="text-[11px] font-medium text-slate-700 mb-0.5">{exp.company}{exp.location ? ` • ${exp.location}` : ""}</div>
                <ul className="list-disc list-outside ml-4 text-[11px] text-slate-700 space-y-0.5 leading-normal">
                  {exp.description.map((desc, i) => <li key={i}>{desc}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.projects && resume.projects.length > 0 && (
        <section className="mb-2.5">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-800 mb-1.5 border-b pb-0.5">Research Projects & Grants</h2>
          <div className="space-y-1.5">
            {resume.projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="font-bold text-slate-900 text-[12px] leading-tight">{proj.title}</h3>
                  {proj.url && <span className="text-[10px] text-slate-500 italic ml-2">{proj.url}</span>}
                </div>
                <p className="text-[11px] text-slate-700 leading-normal">{proj.description}</p>
                {proj.technologies && proj.technologies.length > 0 && (
                  <p className="text-[10px] text-slate-500 mt-0.5">Key Areas: {proj.technologies.join(", ")}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.skills.length > 0 && (
        <section className="mb-2.5">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-800 mb-1 border-b pb-0.5">Skills & Technical Competencies</h2>
          <div className="flex flex-wrap gap-1">
            {resume.skills.map((skill) => (
              <span key={skill.id} className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-[10px] border border-slate-200">
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function TechTemplate({ resume }: { resume: ResumeData }) {
  return (
    <div className="p-5 font-mono text-slate-900 text-[10.5px] leading-snug">
      <header className="border-b border-emerald-600/30 pb-2 mb-3.5 flex justify-between items-start">
        <div>
          <h1 className="text-base font-bold tracking-tight text-slate-900">{resume.personalInfo.fullName.toLowerCase().replace(/ /g, "_")}()</h1>
          <p className="text-xs text-emerald-600 font-bold mt-0.5">~/roles/{resume.personalInfo.jobTitle.toLowerCase().replace(/ /g, "-")}</p>
        </div>
        <div className="text-right text-slate-650 leading-normal text-[9.5px]">
          {resume.personalInfo.email && <div>email: {resume.personalInfo.email}</div>}
          {resume.personalInfo.phone && <div>phone: {resume.personalInfo.phone}</div>}
          {resume.personalInfo.location && <div>loc: {resume.personalInfo.location}</div>}
          {resume.personalInfo.linkedin && <div>in: {resume.personalInfo.linkedin}</div>}
        </div>
      </header>

      {resume.personalInfo.summary && (
        <section className="mb-3">
          <h2 className="font-bold text-emerald-600 mb-0.5 text-[11px]">// professional_profile</h2>
          <p className="text-slate-700 leading-normal">{resume.personalInfo.summary}</p>
        </section>
      )}

      {resume.skills.length > 0 && (
        <section className="mb-3">
          <h2 className="font-bold text-emerald-600 mb-1 text-[11px]">// tech_stack</h2>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-slate-700">
            {resume.skills.map((skill) => (
              <span key={skill.id}>* {skill.name}</span>
            ))}
          </div>
        </section>
      )}

      {resume.experience.length > 0 && (
        <section className="mb-3">
          <h2 className="font-bold text-emerald-600 mb-1 text-[11px]">// employment_history</h2>
          <div className="space-y-2">
            {resume.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start font-bold">
                  <span className="text-slate-900">{exp.jobTitle} @ {exp.company}</span>
                  <span className="text-slate-500 font-normal ml-2 whitespace-nowrap">
                    {exp.startDate} - {exp.current ? "PRESENT" : exp.endDate.toUpperCase()}
                  </span>
                </div>
                {exp.location && <div className="text-slate-500 italic text-[9.5px] mb-0.5">{exp.location}</div>}
                <ul className="list-inside list-disc pl-2 text-slate-700 space-y-0.5 leading-normal">
                  {exp.description.map((desc, i) => <li key={i}>{desc}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.education.length > 0 && (
        <section className="mb-3">
          <h2 className="font-bold text-emerald-600 mb-1 text-[11px]">// academic_degrees</h2>
          <div className="space-y-1.5">
            {resume.education.map((edu) => (
              <div key={edu.id} className="flex justify-between">
                <div>
                  <span className="font-bold text-slate-900">{edu.degree}</span>
                  <span className="text-slate-700"> • {edu.school}</span>
                </div>
                <span className="text-slate-500 ml-2 whitespace-nowrap">
                  {edu.startDate} - {edu.current ? "PRESENT" : edu.endDate.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.projects && resume.projects.length > 0 && (
        <section className="mb-3">
          <h2 className="font-bold text-emerald-600 mb-1 text-[11px]">// side_projects</h2>
          <div className="space-y-1.5">
            {resume.projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-900">{proj.title}</span>
                  {proj.url && <span className="text-emerald-600 font-normal ml-2">{proj.url}</span>}
                </div>
                <p className="text-slate-700 mt-0.5 leading-normal">{proj.description}</p>
                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="text-slate-500 text-[9.5px] mt-0.5">tech: {proj.technologies.join(", ")}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

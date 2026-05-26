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
    <div ref={ref} className="w-full h-full bg-white print:bg-white text-black overflow-hidden relative">
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
    <div className="p-10 font-sans">
      <header className="border-b-2 border-indigo-600/30 pb-6 mb-6">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">{resume.personalInfo.fullName}</h1>
        <p className="text-xl text-indigo-600 mt-2 font-medium">{resume.personalInfo.jobTitle}</p>
        <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-600 font-medium">
          {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
          {resume.personalInfo.phone && <span>{resume.personalInfo.phone}</span>}
          {resume.personalInfo.location && <span>{resume.personalInfo.location}</span>}
          {resume.personalInfo.linkedin && <span>{resume.personalInfo.linkedin}</span>}
        </div>
      </header>

      {resume.personalInfo.summary && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-600 mb-2">Professional Summary</h2>
          <p className="text-slate-700 text-sm leading-relaxed">{resume.personalInfo.summary}</p>
        </section>
      )}

      {resume.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-600 mb-4">Experience</h2>
          <div className="space-y-6">
            {resume.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-slate-900">{exp.jobTitle}</h3>
                  <span className="text-sm text-slate-500 font-medium">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <div className="text-sm font-medium text-indigo-600 mb-2">{exp.company} • {exp.location}</div>
                <ul className="list-disc list-outside ml-4 text-sm text-slate-700 space-y-1">
                  {exp.description.map((desc, i) => <li key={i}>{desc}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-6">
        {resume.education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-600 mb-4">Education</h2>
            <div className="space-y-4">
              {resume.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-slate-900">{edu.degree}</h3>
                  </div>
                  <div className="text-sm text-slate-700">{edu.school}</div>
                  <span className="text-xs text-slate-500 font-medium">
                      {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {resume.skills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-600 mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill) => (
                <span key={skill.id} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-medium border border-slate-200">
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>

      {resume.projects && resume.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-600 mb-4">Projects</h2>
          <div className="space-y-4">
            {resume.projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    {proj.title}
                  </h3>
                  {proj.url && <span className="text-xs text-indigo-600 font-medium">{proj.url}</span>}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed mb-1">{proj.description}</p>
                {proj.technologies && proj.technologies.length > 0 && (
                  <p className="text-xs text-slate-500 font-medium">
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
    <div className="p-12 font-serif">
      <header className="border-b border-black pb-4 mb-6 text-center">
        <h1 className="text-3xl font-normal tracking-wide text-black uppercase">{resume.personalInfo.fullName}</h1>
        <div className="flex flex-wrap justify-center gap-3 mt-3 text-sm text-black">
          {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
          {resume.personalInfo.phone && <span>• {resume.personalInfo.phone}</span>}
          {resume.personalInfo.location && <span>• {resume.personalInfo.location}</span>}
        </div>
      </header>

      {resume.personalInfo.summary && (
        <section className="mb-6">
          <p className="text-black text-sm leading-relaxed">{resume.personalInfo.summary}</p>
        </section>
      )}

      {resume.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-black mb-3 border-b border-black/20 pb-1">Experience</h2>
          <div className="space-y-5">
            {resume.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-black text-sm">{exp.company}</h3>
                  <span className="text-sm text-black italic">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <div className="text-sm font-normal text-black italic mb-2">{exp.jobTitle} {exp.location && `- ${exp.location}`}</div>
                <ul className="list-disc list-outside ml-4 text-sm text-black space-y-1">
                  {exp.description.map((desc, i) => <li key={i}>{desc}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-black mb-3 border-b border-black/20 pb-1">Education</h2>
          <div className="space-y-3">
            {resume.education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-bold text-black text-sm">{edu.school}</h3>
                  <div className="text-sm text-black">{edu.degree}</div>
                </div>
                <span className="text-sm text-black italic">
                    {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-black mb-3 border-b border-black/20 pb-1">Skills</h2>
          <p className="text-sm text-black">
            {resume.skills.map(s => s.name).join(", ")}
          </p>
        </section>
      )}
    </div>
  );
}

function CreativeTemplate({ resume }: { resume: ResumeData }) {
  return (
    <div className="font-sans flex h-[297mm]">
      {/* Sidebar */}
      <div className="w-[35%] bg-slate-900 text-white p-8">
        <h1 className="text-4xl font-black tracking-tighter leading-none mb-2">{resume.personalInfo.fullName.split(' ')[0]}</h1>
        <h1 className="text-4xl font-light tracking-tight leading-none mb-4">{resume.personalInfo.fullName.split(' ').slice(1).join(' ')}</h1>
        <p className="text-indigo-400 font-semibold tracking-wide uppercase text-sm mb-10">{resume.personalInfo.jobTitle}</p>

        <div className="space-y-8">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 border-b border-slate-700 pb-2">Contact</h2>
            <div className="space-y-3 text-sm text-slate-300">
              {resume.personalInfo.email && <div className="break-all">{resume.personalInfo.email}</div>}
              {resume.personalInfo.phone && <div>{resume.personalInfo.phone}</div>}
              {resume.personalInfo.location && <div>{resume.personalInfo.location}</div>}
              {resume.personalInfo.website && <div className="break-all">{resume.personalInfo.website}</div>}
            </div>
          </div>

          {resume.skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 border-b border-slate-700 pb-2">Expertise</h2>
              <div className="flex flex-col gap-2">
                {resume.skills.map((skill) => (
                  <div key={skill.id} className="text-sm font-medium text-slate-200">
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {resume.education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 border-b border-slate-700 pb-2">Education</h2>
              <div className="space-y-4">
                {resume.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="text-xs text-indigo-400 font-bold mb-1">{edu.startDate} - {edu.endDate}</div>
                    <div className="text-sm font-bold text-white leading-tight mb-1">{edu.degree}</div>
                    <div className="text-xs text-slate-400">{edu.school}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="w-[65%] bg-white p-8 pb-12">
        {resume.personalInfo.summary && (
          <section className="mb-10 mt-4">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 relative inline-block">
              Profile
              <div className="absolute -bottom-1 left-0 w-1/2 h-1 bg-indigo-500"></div>
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">{resume.personalInfo.summary}</p>
          </section>
        )}

        {resume.experience.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 relative inline-block">
              Experience
              <div className="absolute -bottom-1 left-0 w-1/2 h-1 bg-indigo-500"></div>
            </h2>
            <div className="space-y-8">
              {resume.experience.map((exp) => (
                <div key={exp.id} className="relative pl-4 border-l-2 border-slate-200">
                  <div className="absolute w-3 h-3 bg-indigo-500 rounded-full -left-[7px] top-1.5 border-4 border-white"></div>
                  <h3 className="font-bold text-slate-900 text-lg leading-tight">{exp.jobTitle}</h3>
                  <div className="text-sm font-semibold text-indigo-600 mb-1">{exp.company}</div>
                  <div className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </div>
                  <ul className="list-disc list-outside ml-4 text-sm text-slate-600 space-y-1.5">
                    {exp.description.map((desc, i) => <li key={i}>{desc}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {resume.projects && resume.projects.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 relative inline-block">
              Projects
              <div className="absolute -bottom-1 left-0 w-1/2 h-1 bg-indigo-500"></div>
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {resume.projects.map((proj) => (
                <div key={proj.id} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h3 className="font-bold text-slate-900">{proj.title}</h3>
                  <p className="text-sm text-slate-600 mt-2 mb-3">{proj.description}</p>
                  <div className="flex flex-wrap gap-2">
                     {proj.technologies?.map(tech => (
                       <span key={tech} className="bg-white px-2 py-1 rounded text-xs font-medium text-indigo-600 border border-indigo-100">{tech}</span>
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
    <div className="p-10 font-sans text-slate-800">
      <header className="border-b-4 border-slate-800 pb-4 mb-6">
        <h1 className="text-3xl font-black tracking-tight uppercase text-slate-900">{resume.personalInfo.fullName}</h1>
        <p className="text-lg text-slate-600 font-bold uppercase tracking-wider mt-1">{resume.personalInfo.jobTitle}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm font-medium">
          {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
          {resume.personalInfo.phone && <span>| {resume.personalInfo.phone}</span>}
          {resume.personalInfo.location && <span>| {resume.personalInfo.location}</span>}
          {resume.personalInfo.linkedin && <span>| {resume.personalInfo.linkedin}</span>}
        </div>
      </header>

      {resume.personalInfo.summary && (
        <section className="mb-6">
          <p className="text-sm leading-relaxed">{resume.personalInfo.summary}</p>
        </section>
      )}

      {resume.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-3 bg-slate-100 p-1.5 px-3">Professional Experience</h2>
          <div className="space-y-5 px-1">
            {resume.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-end mb-1">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-none">{exp.jobTitle}</h3>
                    <div className="text-sm font-semibold text-slate-700 mt-1">{exp.company} {exp.location && `, ${exp.location}`}</div>
                  </div>
                  <span className="text-sm font-bold text-slate-500 whitespace-nowrap">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <ul className="list-disc list-outside ml-5 mt-2 text-sm space-y-1">
                  {exp.description.map((desc, i) => <li key={i}>{desc}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-3 bg-slate-100 p-1.5 px-3">Education</h2>
          <div className="space-y-4 px-1">
            {resume.education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-900">{edu.degree}</h3>
                  <div className="text-sm text-slate-700">{edu.school}, {edu.location}</div>
                </div>
                <span className="text-sm font-bold text-slate-500 whitespace-nowrap">
                    {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-3 bg-slate-100 p-1.5 px-3">Core Competencies</h2>
          <div className="px-1 text-sm font-medium leading-relaxed">
             {resume.skills.map(s => s.name).join(" • ")}
          </div>
        </section>
      )}
    </div>
  );
}

function AcademicTemplate({ resume }: { resume: ResumeData }) {
  return (
    <div className="p-12 font-serif text-slate-900">
      <header className="border-b border-slate-900 pb-4 mb-6 text-center">
        <h1 className="text-3xl font-bold tracking-wide uppercase">{resume.personalInfo.fullName}</h1>
        <p className="text-base text-slate-650 mt-1 italic">{resume.personalInfo.jobTitle}</p>
        <div className="flex flex-wrap justify-center gap-3 mt-3 text-xs text-slate-600 font-medium">
          {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
          {resume.personalInfo.phone && <span>| {resume.personalInfo.phone}</span>}
          {resume.personalInfo.location && <span>| {resume.personalInfo.location}</span>}
          {resume.personalInfo.linkedin && <span>| {resume.personalInfo.linkedin}</span>}
        </div>
      </header>

      {resume.personalInfo.summary && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-2 border-b pb-1">Research Interests</h2>
          <p className="text-slate-700 text-sm leading-relaxed">{resume.personalInfo.summary}</p>
        </section>
      )}

      {resume.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3 border-b pb-1">Education</h2>
          <div className="space-y-4">
            {resume.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-slate-900">{edu.degree}</h3>
                  <span className="text-sm text-slate-500 font-medium">{edu.startDate} - {edu.current ? "Present" : edu.endDate}</span>
                </div>
                <div className="text-sm text-slate-700 font-medium">{edu.school} • {edu.location}</div>
                {edu.description && <p className="text-xs text-slate-650 mt-1 italic">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3 border-b pb-1">Academic & Professional Appointments</h2>
          <div className="space-y-6">
            {resume.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-slate-900">{exp.jobTitle}</h3>
                  <span className="text-sm text-slate-500 font-medium">{exp.startDate} - {exp.current ? "Present" : exp.endDate}</span>
                </div>
                <div className="text-sm font-medium text-slate-700 mb-2">{exp.company} • {exp.location}</div>
                <ul className="list-disc list-outside ml-4 text-sm text-slate-700 space-y-1">
                  {exp.description.map((desc, i) => <li key={i}>{desc}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.projects && resume.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3 border-b pb-1">Research Projects & Grants</h2>
          <div className="space-y-4">
            {resume.projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-slate-900">{proj.title}</h3>
                  {proj.url && <span className="text-xs text-slate-550 italic">{proj.url}</span>}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{proj.description}</p>
                {proj.technologies && proj.technologies.length > 0 && (
                  <p className="text-xs text-slate-500 mt-1">Key Areas: {proj.technologies.join(", ")}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-2 border-b pb-1">Skills & Technical Competencies</h2>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill) => (
              <span key={skill.id} className="bg-slate-100 text-slate-800 px-2 py-1 rounded text-xs border border-slate-200">
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
    <div className="p-10 font-mono text-slate-955 text-xs">
      <header className="border-b border-emerald-600/30 pb-4 mb-5 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{resume.personalInfo.fullName.toLowerCase().replace(" ", "_")}()</h1>
          <p className="text-sm text-emerald-600 font-bold mt-1">~/roles/{resume.personalInfo.jobTitle.toLowerCase().replace(" ", "-")}</p>
        </div>
        <div className="text-right text-slate-600 leading-normal">
          {resume.personalInfo.email && <div>email: {resume.personalInfo.email}</div>}
          {resume.personalInfo.phone && <div>phone: {resume.personalInfo.phone}</div>}
          {resume.personalInfo.location && <div>loc: {resume.personalInfo.location}</div>}
          {resume.personalInfo.linkedin && <div>linkedin: {resume.personalInfo.linkedin}</div>}
        </div>
      </header>

      {resume.personalInfo.summary && (
        <section className="mb-5">
          <h2 className="font-bold text-emerald-600 mb-1">// professional_profile</h2>
          <p className="text-slate-700 leading-relaxed">{resume.personalInfo.summary}</p>
        </section>
      )}

      {resume.skills.length > 0 && (
        <section className="mb-5">
          <h2 className="font-bold text-emerald-600 mb-2">// tech_stack</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-850">
            {resume.skills.map((skill) => (
              <span key={skill.id}>
                * {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {resume.experience.length > 0 && (
        <section className="mb-5">
          <h2 className="font-bold text-emerald-600 mb-3">// employment_history</h2>
          <div className="space-y-4">
            {resume.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start font-bold">
                  <span className="text-slate-900">{exp.jobTitle} @ {exp.company}</span>
                  <span className="text-slate-500 font-normal">
                    {exp.startDate} - {exp.current ? "PRESENT" : exp.endDate.toUpperCase()}
                  </span>
                </div>
                <div className="text-slate-500 italic text-[11px] mb-1">{exp.location}</div>
                <ul className="list-inside list-disc pl-2 text-slate-700 space-y-1">
                  {exp.description.map((desc, i) => <li key={i}>{desc}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.education.length > 0 && (
        <section className="mb-5">
          <h2 className="font-bold text-emerald-600 mb-2">// academic_degrees</h2>
          <div className="space-y-3">
            {resume.education.map((edu) => (
              <div key={edu.id} className="flex justify-between">
                <div>
                  <span className="font-bold text-slate-900">{edu.degree}</span>
                  <span className="text-slate-700"> • {edu.school}</span>
                </div>
                <span className="text-slate-500">
                  {edu.startDate} - {edu.current ? "PRESENT" : edu.endDate.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.projects && resume.projects.length > 0 && (
        <section className="mb-5">
          <h2 className="font-bold text-emerald-600 mb-3">// side_projects</h2>
          <div className="space-y-3">
            {resume.projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-900">{proj.title}</span>
                  {proj.url && <span className="text-emerald-600 font-normal">{proj.url}</span>}
                </div>
                <p className="text-slate-700 mt-1">{proj.description}</p>
                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="text-slate-500 text-[10px] mt-0.5">tech: {proj.technologies.join(", ")}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

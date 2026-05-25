import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ResumeData, ResumeTemplate, PersonalInfo, Experience, Education, Skill, Project } from '@/types/resume';
import { sampleResume } from '@/data/sampleResume';

interface ResumeState {
  resume: ResumeData;
  // Actions
  updatePersonalInfo: (data: Partial<PersonalInfo>) => void;
  setTemplate: (template: ResumeTemplate) => void;
  
  // Experience Actions
  addExperience: (exp: Experience) => void;
  updateExperience: (id: string, exp: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  reorderExperience: (startIndex: number, endIndex: number) => void;
  
  // Education Actions
  addEducation: (edu: Education) => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  reorderEducation: (startIndex: number, endIndex: number) => void;

  // Skill Actions
  addSkill: (skill: Skill) => void;
  removeSkill: (id: string) => void;
  reorderSkills: (startIndex: number, endIndex: number) => void;

  // Project Actions
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  removeProject: (id: string) => void;
  reorderProjects: (startIndex: number, endIndex: number) => void;

  // Load external data
  loadResume: (data: ResumeData) => void;
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      resume: sampleResume, // Load sample by default

      updatePersonalInfo: (data) =>
        set((state) => ({
          resume: {
            ...state.resume,
            personalInfo: { ...state.resume.personalInfo, ...data },
            lastModified: new Date().toISOString(),
          },
        })),

      setTemplate: (template) =>
        set((state) => ({
          resume: { ...state.resume, template, lastModified: new Date().toISOString() },
        })),

      addExperience: (exp) =>
        set((state) => ({
          resume: {
            ...state.resume,
            experience: [...state.resume.experience, exp],
            lastModified: new Date().toISOString(),
          },
        })),

      updateExperience: (id, expData) =>
        set((state) => ({
          resume: {
            ...state.resume,
            experience: state.resume.experience.map((e) => (e.id === id ? { ...e, ...expData } : e)),
            lastModified: new Date().toISOString(),
          },
        })),

      removeExperience: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            experience: state.resume.experience.filter((e) => e.id !== id),
            lastModified: new Date().toISOString(),
          },
        })),

      reorderExperience: (startIndex, endIndex) =>
        set((state) => {
          const result = Array.from(state.resume.experience);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return {
            resume: { ...state.resume, experience: result, lastModified: new Date().toISOString() },
          };
        }),

      addEducation: (edu) =>
        set((state) => ({
          resume: {
            ...state.resume,
            education: [...state.resume.education, edu],
            lastModified: new Date().toISOString(),
          },
        })),

      updateEducation: (id, eduData) =>
        set((state) => ({
          resume: {
            ...state.resume,
            education: state.resume.education.map((e) => (e.id === id ? { ...e, ...eduData } : e)),
            lastModified: new Date().toISOString(),
          },
        })),

      removeEducation: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            education: state.resume.education.filter((e) => e.id !== id),
            lastModified: new Date().toISOString(),
          },
        })),

      reorderEducation: (startIndex, endIndex) =>
        set((state) => {
          const result = Array.from(state.resume.education);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return {
            resume: { ...state.resume, education: result, lastModified: new Date().toISOString() },
          };
        }),

      addSkill: (skill) =>
        set((state) => ({
          resume: {
            ...state.resume,
            skills: [...state.resume.skills, skill],
            lastModified: new Date().toISOString(),
          },
        })),

      removeSkill: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            skills: state.resume.skills.filter((s) => s.id !== id),
            lastModified: new Date().toISOString(),
          },
        })),

      reorderSkills: (startIndex, endIndex) =>
        set((state) => {
          const result = Array.from(state.resume.skills);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return {
            resume: { ...state.resume, skills: result, lastModified: new Date().toISOString() },
          };
        }),

      addProject: (project) =>
        set((state) => ({
          resume: {
            ...state.resume,
            projects: [...state.resume.projects, project],
            lastModified: new Date().toISOString(),
          },
        })),

      updateProject: (id, projData) =>
        set((state) => ({
          resume: {
            ...state.resume,
            projects: state.resume.projects.map((p) => (p.id === id ? { ...p, ...projData } : p)),
            lastModified: new Date().toISOString(),
          },
        })),

      removeProject: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            projects: state.resume.projects.filter((p) => p.id !== id),
            lastModified: new Date().toISOString(),
          },
        })),

      reorderProjects: (startIndex, endIndex) =>
        set((state) => {
          const result = Array.from(state.resume.projects);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return {
            resume: { ...state.resume, projects: result, lastModified: new Date().toISOString() },
          };
        }),

      loadResume: (data) =>
        set(() => ({
          resume: data,
        })),
    }),
    {
      name: 'resume-storage', // local storage key
    }
  )
);

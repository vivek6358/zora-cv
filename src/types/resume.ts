export type ResumeTemplate = 'modern' | 'minimal' | 'professional' | 'creative' | 'academic' | 'tech';

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  url?: string;
  technologies: string[];
}

export interface ResumeData {
  id: string;
  title: string;
  lastModified: string;
  template: ResumeTemplate;
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
}

export interface ResumeScore {
  total: number;
  atsCompatibility: number;
  readability: number;
  skillsMatch: number;
  formatting: number;
  completeness: number;
}

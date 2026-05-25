import { ResumeData } from '@/types/resume';

export const sampleResume: ResumeData = {
  id: 'resume-1',
  title: 'Senior Frontend Developer',
  lastModified: new Date().toISOString(),
  template: 'modern',
  personalInfo: {
    fullName: 'Alex Jonathan',
    jobTitle: 'Senior Frontend Engineer',
    email: 'alex.jonathan@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    website: 'alexj.dev',
    linkedin: 'linkedin.com/in/alexj',
    github: 'github.com/alexj',
    summary: 'Detail-oriented and passionate Senior Frontend Engineer with 6+ years of experience building scalable web applications. Proficient in React, Next.js, and TypeScript. Dedicated to creating elegant and highly performant user experiences.',
  },
  experience: [
    {
      id: 'exp-1',
      jobTitle: 'Senior Frontend Engineer',
      company: 'TechFlow Solutions',
      location: 'San Francisco, CA',
      startDate: '2021-03',
      endDate: '',
      current: true,
      description: [
        'Led a team of 4 frontend developers to migrate a legacy monolithic application to Next.js, improving page load times by 40%.',
        'Implemented a comprehensive design system using React and Tailwind CSS, reducing development time for new features by 25%.',
        'Optimized critical rendering paths, achieving a 99 score on Google Lighthouse performance metrics.',
      ],
    },
    {
      id: 'exp-2',
      jobTitle: 'Software Engineer',
      company: 'Innovate Digital',
      location: 'Austin, TX',
      startDate: '2018-06',
      endDate: '2021-02',
      current: false,
      description: [
        'Developed interactive dashboards for data visualization using React and D3.js.',
        'Integrated RESTful APIs and optimized data fetching with React Query, minimizing unnecessary network requests.',
        'Mentored junior engineers and conducted regular code reviews to ensure code quality and maintainability.',
      ],
    }
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'Bachelor of Science in Computer Science',
      school: 'University of Texas at Austin',
      location: 'Austin, TX',
      startDate: '2014-08',
      endDate: '2018-05',
      current: false,
      description: 'Graduated with Honors. Specialized in Software Engineering and Human-Computer Interaction.',
    }
  ],
  skills: [
    { id: 'sk-1', name: 'JavaScript (ES6+)', level: 'Expert' },
    { id: 'sk-2', name: 'TypeScript', level: 'Advanced' },
    { id: 'sk-3', name: 'React', level: 'Expert' },
    { id: 'sk-4', name: 'Next.js', level: 'Advanced' },
    { id: 'sk-5', name: 'Tailwind CSS', level: 'Expert' },
    { id: 'sk-6', name: 'Zustand / Redux', level: 'Advanced' },
    { id: 'sk-7', name: 'GraphQL', level: 'Intermediate' },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'E-commerce Platform Architecture',
      description: 'Architected and built a highly scalable frontend for a leading e-commerce brand, handling over 1M monthly visitors.',
      url: 'github.com/alexj/ecom-arch',
      technologies: ['Next.js', 'TypeScript', 'Stripe API', 'Tailwind'],
    }
  ]
};

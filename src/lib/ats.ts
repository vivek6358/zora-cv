export function calculateATSScore(resume: any): number {
  if (!resume) return 0;
  let score = 0;
  
  // 1. Personal Info (Max 25)
  if (resume.personalInfo) {
    if (resume.personalInfo.fullName) score += 5;
    if (resume.personalInfo.jobTitle) score += 5;
    if (resume.personalInfo.email) score += 5;
    if (resume.personalInfo.phone) score += 5;
    if (resume.personalInfo.location) score += 5;
  }
  
  // 2. Summary (Max 15)
  if (resume.personalInfo?.summary && resume.personalInfo.summary.length > 20) {
    score += 15;
  } else if (resume.personalInfo?.summary) {
    score += 5;
  }
  
  // 3. Experience (Max 30)
  const experiences = resume.experience || [];
  if (experiences.length > 0) {
    score += 10; // has experience
    let bulletCount = 0;
    experiences.forEach((exp: any) => {
      if (exp.description && Array.isArray(exp.description)) {
        bulletCount += exp.description.filter((b: string) => b && b.trim().length > 5).length;
      }
    });
    score += Math.min(20, bulletCount * 5);
  }
  
  // 4. Education (Max 10)
  if (resume.education && resume.education.length > 0) {
    score += 10;
  }
  
  // 5. Skills (Max 10)
  const skills = resume.skills || [];
  if (skills.length > 0) {
    score += Math.min(10, skills.length * 2);
  }
  
  // 6. Projects (Max 10)
  const projects = resume.projects || [];
  if (projects.length > 0) {
    score += Math.min(10, projects.length * 5);
  }
  
  return score;
}

export function getATSLabel(score: number): { label: string; color: string; border: string; bg: string } {
  if (score >= 85) return { label: "Excellent", color: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500", bg: "bg-emerald-500/10" };
  if (score >= 70) return { label: "Good", color: "text-indigo-600 dark:text-indigo-400", border: "border-indigo-500", bg: "bg-indigo-500/10" };
  if (score >= 50) return { label: "Average", color: "text-amber-600 dark:text-amber-400", border: "border-amber-500", bg: "bg-amber-500/10" };
  return { label: "Poor", color: "text-rose-600 dark:text-rose-400", border: "border-rose-500", bg: "bg-rose-500/10" };
}

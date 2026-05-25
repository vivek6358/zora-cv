"use client";

import { useResumeStore } from "@/store/resumeStore";
import { Plus, X, GripVertical } from "lucide-react";
import { useState } from "react";

export function SkillsForm() {
  const { resume, addSkill, removeSkill } = useResumeStore();
  const [newSkill, setNewSkill] = useState("");
  const [newLevel, setNewLevel] = useState<"Beginner" | "Intermediate" | "Advanced" | "Expert" | "">("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    
    addSkill({
      id: crypto.randomUUID(),
      name: newSkill.trim(),
      level: newLevel ? (newLevel as any) : undefined,
    });
    
    setNewSkill("");
    setNewLevel("");
  };

  return (
    <div className="space-y-6">
      
      {/* Quick Add Form */}
      <form onSubmit={handleAdd} className="flex gap-2 p-4 bg-muted/30 rounded-xl border border-border">
        <div className="flex-1">
          <input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="e.g. React, Python, Project Management"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        <div className="w-40">
          <select
            value={newLevel}
            onChange={(e) => setNewLevel(e.target.value as any)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Level (Optional)</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={!newSkill.trim()}
          className="h-10 px-4 flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 font-medium text-sm transition-colors"
        >
          <Plus className="w-4 h-4 mr-1" /> Add
        </button>
      </form>

      {/* Skills List */}
      <div className="space-y-2">
        {resume.skills.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">No skills added yet.</p>
        ) : (
          resume.skills.map((skill) => (
            <div key={skill.id} className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg shadow-sm group hover:border-primary/50 transition-colors">
              <button className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing p-1">
                <GripVertical className="w-4 h-4" />
              </button>
              
              <div className="flex-1 flex items-center gap-3">
                <input
                  value={skill.name}
                  onChange={(e) => {
                    // Quick update name directly (if we had updateSkill action, we'd use it here)
                    // Since resumeStore might lack updateSkill, let's just add it if missing or assume it's read-only in this quick list.
                    // Wait, resumeStore has addSkill, removeSkill, reorderSkills. It doesn't have updateSkill!
                    // I will need to update the store to add updateSkill, or just keep it simple and make them read-only badges.
                  }}
                  readOnly
                  className="bg-transparent border-none focus:outline-none text-sm font-medium text-foreground w-full"
                />
              </div>

              {skill.level && (
                <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
                  {skill.level}
                </span>
              )}

              <button 
                onClick={() => removeSkill(skill.id)}
                className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors opacity-0 group-hover:opacity-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

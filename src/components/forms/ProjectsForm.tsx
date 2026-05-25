"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useResumeStore } from "@/store/resumeStore";
import { Project } from "@/types/resume";
import { useEffect, useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  url: z.string().optional(),
  technologiesStr: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

function ProjectItemForm({ project, index }: { project: Project; index: number }) {
  const { updateProject, removeProject } = useResumeStore();
  const [isExpanded, setIsExpanded] = useState(index === 0);

  const { register, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...project,
      url: project.url || "",
      technologiesStr: project.technologies.join(", "),
    },
  });

  useEffect(() => {
    const subscription = watch((value) => {
      updateProject(project.id, {
        title: value.title,
        description: value.description,
        url: value.url,
        technologies: value.technologiesStr 
          ? value.technologiesStr.split(",").map(t => t?.trim()).filter(t => t && t.length > 0)
          : [],
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, updateProject, project.id]);

  const formValues = watch(); // Still need this for display in the header

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden shadow-sm transition-all">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <button className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing p-1">
            <GripVertical className="w-4 h-4" />
          </button>
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              {formValues.title || "Untitled Project"}
            </h4>
            <p className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-[300px]">
              {formValues.description || "Project description..."}
            </p>
          </div>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); removeProject(project.id); }}
          className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      {isExpanded && (
        <div className="p-4 border-t border-border grid grid-cols-2 gap-4">
          <div className="space-y-2 col-span-2 sm:col-span-1">
            <label className="text-xs font-medium text-foreground">Project Title</label>
            <input
              {...register("title")}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <div className="space-y-2 col-span-2 sm:col-span-1">
            <label className="text-xs font-medium text-foreground">URL / Link</label>
            <input
              {...register("url")}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2 col-span-2">
            <label className="text-xs font-medium text-foreground">Technologies (Comma separated)</label>
            <input
              {...register("technologiesStr")}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="React, TypeScript, TailwindCSS"
            />
          </div>
          <div className="space-y-2 col-span-2">
            <label className="text-xs font-medium text-foreground">Description</label>
            <textarea
              {...register("description")}
              className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Explain what you built and your impact..."
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function ProjectsForm() {
  const { resume, addProject } = useResumeStore();

  const handleAdd = () => {
    addProject({
      id: crypto.randomUUID(),
      title: "",
      description: "",
      url: "",
      technologies: [],
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {resume.projects.map((proj, idx) => (
          <ProjectItemForm key={proj.id} project={proj} index={idx} />
        ))}
      </div>
      
      <button
        onClick={handleAdd}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-border rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors hover:bg-muted/30"
      >
        <Plus className="w-4 h-4" /> Add Project
      </button>
    </div>
  );
}

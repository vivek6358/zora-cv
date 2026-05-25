"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useResumeStore } from "@/store/resumeStore";
import { Experience } from "@/types/resume";
import { useEffect, useState } from "react";
import { Plus, Trash2, GripVertical, Sparkles, Loader2 } from "lucide-react";

const schema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  current: z.boolean(),
  descriptionStr: z.string(),
});

type FormValues = z.infer<typeof schema>;

function ExperienceItemForm({ experience, index }: { experience: Experience; index: number }) {
  const { updateExperience, removeExperience } = useResumeStore();
  const [isExpanded, setIsExpanded] = useState(index === 0);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const { register, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...experience,
      descriptionStr: experience.description.join("\n"),
    },
  });

  // Auto-save
  useEffect(() => {
    const subscription = watch((value) => {
      updateExperience(experience.id, {
        jobTitle: value.jobTitle,
        company: value.company,
        location: value.location,
        startDate: value.startDate,
        endDate: value.endDate,
        current: value.current,
        description: value.descriptionStr ? value.descriptionStr.split("\n").filter((l) => l.trim().length > 0) : [],
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, updateExperience, experience.id]);

  const formValues = watch();

  const handleAiImprove = async () => {
    const currentText = watch("descriptionStr");
    if (!currentText || currentText.trim().length === 0) return;

    try {
      setIsAiLoading(true);
      const res = await fetch("/api/ai/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: currentText, context: "experience" }),
      });
      const data = await res.json();
      if (data.result) {
        setValue("descriptionStr", data.result, { shouldDirty: true, shouldTouch: true });
      } else if (data.error) {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to improve text with AI");
    } finally {
      setIsAiLoading(false);
    }
  };

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
              {formValues.jobTitle || "Untitled Role"}
            </h4>
            <p className="text-xs text-muted-foreground">
              {formValues.company || "Company"} • {formValues.startDate || "Start"} - {formValues.current ? "Present" : formValues.endDate || "End"}
            </p>
          </div>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); removeExperience(experience.id); }}
          className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      {isExpanded && (
        <div className="p-4 border-t border-border grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">Job Title</label>
            <input
              {...register("jobTitle")}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">Company</label>
            <input
              {...register("company")}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">Location</label>
            <input
              {...register("location")}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center gap-2">
              <input type="checkbox" {...register("current")} id={`current-${experience.id}`} className="rounded border-input text-primary focus:ring-primary" />
              <label htmlFor={`current-${experience.id}`} className="text-xs font-medium text-foreground">I currently work here</label>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">Start Date</label>
            <input
              {...register("startDate")}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="e.g. Jan 2020"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">End Date</label>
            <input
              {...register("endDate")}
              disabled={formValues.current}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
              placeholder="e.g. Dec 2022"
            />
          </div>
          <div className="space-y-2 col-span-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground">Description (One bullet point per line)</label>
              <button
                type="button"
                onClick={handleAiImprove}
                disabled={isAiLoading || !formValues.descriptionStr?.trim()}
                className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                Improve with AI
              </button>
            </div>
            <textarea
              {...register("descriptionStr")}
              className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Developed new features...&#10;Increased revenue by 15%..."
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function ExperienceForm() {
  const { resume, addExperience } = useResumeStore();

  const handleAdd = () => {
    addExperience({
      id: crypto.randomUUID(),
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: [],
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {resume.experience.map((exp, idx) => (
          <ExperienceItemForm key={exp.id} experience={exp} index={idx} />
        ))}
      </div>
      
      <button
        onClick={handleAdd}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-border rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors hover:bg-muted/30"
      >
        <Plus className="w-4 h-4" /> Add Experience
      </button>
    </div>
  );
}

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useResumeStore } from "@/store/resumeStore";
import { Education } from "@/types/resume";
import { useEffect, useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";

const schema = z.object({
  degree: z.string().min(1, "Degree is required"),
  school: z.string().min(1, "School is required"),
  location: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  current: z.boolean(),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

function EducationItemForm({ education, index }: { education: Education; index: number }) {
  const { updateEducation, removeEducation } = useResumeStore();
  const [isExpanded, setIsExpanded] = useState(index === 0);

  const { register, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...education,
      description: education.description || "",
    },
  });

  useEffect(() => {
    const subscription = watch((value) => {
      updateEducation(education.id, {
        degree: value.degree,
        school: value.school,
        location: value.location,
        startDate: value.startDate,
        endDate: value.endDate,
        current: value.current,
        description: value.description,
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, updateEducation, education.id]);

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
              {formValues.degree || "Untitled Degree"}
            </h4>
            <p className="text-xs text-muted-foreground">
              {formValues.school || "School"} • {formValues.startDate || "Start"} - {formValues.current ? "Present" : formValues.endDate || "End"}
            </p>
          </div>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); removeEducation(education.id); }}
          className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      {isExpanded && (
        <div className="p-4 border-t border-border grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">Degree / Program</label>
            <input
              {...register("degree")}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">School / University</label>
            <input
              {...register("school")}
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
              <input type="checkbox" {...register("current")} id={`edu-current-${education.id}`} className="rounded border-input text-primary focus:ring-primary" />
              <label htmlFor={`edu-current-${education.id}`} className="text-xs font-medium text-foreground">I currently study here</label>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">Start Date</label>
            <input
              {...register("startDate")}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="e.g. Sep 2018"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">End Date</label>
            <input
              {...register("endDate")}
              disabled={formValues.current}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
              placeholder="e.g. May 2022"
            />
          </div>
          <div className="space-y-2 col-span-2">
            <label className="text-xs font-medium text-foreground">Additional Details (Optional)</label>
            <textarea
              {...register("description")}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Relevant coursework, GPA, honors, etc."
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function EducationForm() {
  const { resume, addEducation } = useResumeStore();

  const handleAdd = () => {
    addEducation({
      id: crypto.randomUUID(),
      degree: "",
      school: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {resume.education.map((edu, idx) => (
          <EducationItemForm key={edu.id} education={edu} index={idx} />
        ))}
      </div>
      
      <button
        onClick={handleAdd}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-border rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors hover:bg-muted/30"
      >
        <Plus className="w-4 h-4" /> Add Education
      </button>
    </div>
  );
}

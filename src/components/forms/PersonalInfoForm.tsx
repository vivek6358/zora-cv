"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useResumeStore } from "@/store/resumeStore";
import { useEffect, useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

const schema = z.object({
  fullName: z.string().min(2, "Name is required"),
  jobTitle: z.string().min(2, "Job title is required"),
  email: z.string().email("Invalid email"),
  phone: z.string(),
  location: z.string(),
  summary: z.string(),
});

type FormValues = z.infer<typeof schema>;

export function PersonalInfoForm() {
  const { resume, updatePersonalInfo } = useResumeStore();
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const { register, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: resume.personalInfo,
  });

  const formValues = watch();

  const handleAiImprove = async () => {
    const currentText = watch("summary");
    if (!currentText || currentText.trim().length === 0) return;

    try {
      setIsAiLoading(true);
      const res = await fetch("/api/ai/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: currentText, context: "summary" }),
      });
      const data = await res.json();
      if (data.result) {
        setValue("summary", data.result, { shouldDirty: true, shouldTouch: true });
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

  // Auto-save feature to Zustand store
  useEffect(() => {
    const subscription = watch((value) => {
      updatePersonalInfo(value as FormValues);
    });
    return () => subscription.unsubscribe();
  }, [watch, updatePersonalInfo]);

  return (
    <form className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Full Name</label>
          <input
            {...register("fullName")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Job Title</label>
          <input
            {...register("jobTitle")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Email</label>
          <input
            {...register("email")}
            type="email"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Phone</label>
          <input
            {...register("phone")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>

        <div className="space-y-2 col-span-2">
          <label className="text-sm font-medium text-foreground">Location</label>
          <input
            {...register("location")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>

        <div className="space-y-2 col-span-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Professional Summary</label>
            <button
              type="button"
              onClick={handleAiImprove}
              disabled={isAiLoading || !formValues.summary?.trim()}
              className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              Improve with AI
            </button>
          </div>
          <textarea
            {...register("summary")}
            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
      </div>
    </form>
  );
}

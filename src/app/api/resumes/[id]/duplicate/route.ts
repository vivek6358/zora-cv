import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Resume } from "@/models/Resume";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";
import { checkAndDeductCredits } from "@/lib/credits";

// POST /api/resumes/[id]/duplicate - Duplicate a specific resume
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = (session.user as any).id;

    // Check and deduct credits (1 credit per resume duplication)
    if (session.user.email) {
      const deduction = await checkAndDeductCredits(session.user.email, "Resume Duplication", 1);
      if (!deduction.success) {
        return NextResponse.json({ error: deduction.error, code: "INSUFFICIENT_CREDITS" }, { status: 403 });
      }
    }

    await connectToDatabase();

    // 1. Fetch the original resume
    const originalResume = await Resume.findOne({ _id: id, userId }).lean();
    
    if (!originalResume) {
      return NextResponse.json({ error: "Resume not found or unauthorized" }, { status: 404 });
    }

    // 2. Prepare the duplicated data
    // Remove the _id, createdAt, updatedAt, __v so mongoose generates new ones
    const { _id, createdAt, updatedAt, __v, ...resumeData } = originalResume as any;
    
    // Change the title slightly to indicate it's a copy
    resumeData.title = `${resumeData.title || 'Untitled Resume'} (Copy)`;

    // Regenerate internal item IDs for arrays so they don't collide
    if (resumeData.experience) {
      resumeData.experience = resumeData.experience.map((e: any) => ({ ...e, _id: new mongoose.Types.ObjectId(), id: Math.random().toString(36).substr(2, 9) }));
    }
    if (resumeData.education) {
      resumeData.education = resumeData.education.map((e: any) => ({ ...e, _id: new mongoose.Types.ObjectId(), id: Math.random().toString(36).substr(2, 9) }));
    }
    if (resumeData.skills) {
      resumeData.skills = resumeData.skills.map((s: any) => ({ ...s, _id: new mongoose.Types.ObjectId(), id: Math.random().toString(36).substr(2, 9) }));
    }
    if (resumeData.projects) {
      resumeData.projects = resumeData.projects.map((p: any) => ({ ...p, _id: new mongoose.Types.ObjectId(), id: Math.random().toString(36).substr(2, 9) }));
    }

    // 3. Create the new document
    const duplicatedResume = await Resume.create(resumeData);

    return NextResponse.json({ resume: duplicatedResume, message: "Resume duplicated successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error duplicating resume:", error);
    return NextResponse.json({ error: "Failed to duplicate resume" }, { status: 500 });
  }
}

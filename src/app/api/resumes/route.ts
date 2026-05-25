import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Resume } from "@/models/Resume";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { checkAndDeductCredits } from "@/lib/credits";

// GET /api/resumes - Fetch all resumes for the logged-in user
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    await connectToDatabase();

    const resumes = await Resume.find({ userId }).sort({ updatedAt: -1 });

    return NextResponse.json({ resumes }, { status: 200 });
  } catch (error) {
    console.error("Error fetching resumes:", error);
    return NextResponse.json({ error: "Failed to fetch resumes" }, { status: 500 });
  }
}

// POST /api/resumes - Create a new blank resume
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    // Parse optional body for template selection
    let template = "modern";
    try {
      const body = await req.json();
      if (body.template) {
        template = body.template;
      }
    } catch (e) {
      // No body provided, use default
    }

    // Check and deduct credits (1 credit per resume creation)
    if (session.user.email) {
      const deduction = await checkAndDeductCredits(session.user.email, "Resume Creation", 1);
      if (!deduction.success) {
        return NextResponse.json({ error: deduction.error, code: "INSUFFICIENT_CREDITS" }, { status: 403 });
      }
    }

    const newResume = await Resume.create({
      userId,
      title: "Untitled Resume",
      template: template,
      personalInfo: {
        fullName: session.user.name || "",
        email: session.user.email || "",
      },
      experience: [],
      education: [],
      skills: [],
      projects: [],
    });

    return NextResponse.json({ resume: newResume }, { status: 201 });
  } catch (error) {
    console.error("Error creating resume:", error);
    return NextResponse.json({ error: "Failed to create resume" }, { status: 500 });
  }
}

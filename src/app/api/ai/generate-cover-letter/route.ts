import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { GoogleGenAI } from "@google/genai";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { checkAndDeductCredits } from "@/lib/credits";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Deduct 1 credit for Cover Letter Generation
    const deduction = await checkAndDeductCredits(session.user.email, "Cover Letter Generation", 1);
    if (!deduction.success) {
      return NextResponse.json({ error: deduction.error, code: "INSUFFICIENT_CREDITS" }, { status: 403 });
    }

    const { resumeData } = await req.json();
    if (!resumeData) {
      return NextResponse.json({ error: "Resume data is required" }, { status: 400 });
    }

    const prompt = `You are a professional executive resume writer and career consultant.
    Write a highly engaging, persuasive, and professional Cover Letter based on this resume:
    Name: ${resumeData.personalInfo?.fullName}
    Job Title: ${resumeData.personalInfo?.jobTitle}
    Summary: ${resumeData.personalInfo?.summary}
    Experiences: ${JSON.stringify(resumeData.experience?.map((e: any) => ({ title: e.jobTitle, company: e.company, desc: e.description })))}

    Format the cover letter with standard professional spacing (Date, Hiring Manager, Salutation, Body, Sign-off). Keep it to 3-4 powerful paragraphs. Do not wrap it in markdown block tags, return plain text format.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return NextResponse.json({ result: response.text });
  } catch (error: any) {
    console.error("Cover Letter Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

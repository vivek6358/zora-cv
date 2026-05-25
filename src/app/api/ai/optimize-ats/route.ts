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

    // Deduct 1 credit for ATS Optimization
    const deduction = await checkAndDeductCredits(session.user.email, "ATS Optimization", 1);
    if (!deduction.success) {
      return NextResponse.json({ error: deduction.error, code: "INSUFFICIENT_CREDITS" }, { status: 403 });
    }

    const { resumeData } = await req.json();
    if (!resumeData) {
      return NextResponse.json({ error: "Resume data is required" }, { status: 400 });
    }

    const prompt = `You are an expert ATS optimization consultant. Analyze the following resume data:
    Name: ${resumeData.personalInfo?.fullName}
    Job Title: ${resumeData.personalInfo?.jobTitle}
    Summary: ${resumeData.personalInfo?.summary}
    Skills: ${JSON.stringify(resumeData.skills?.map((s: any) => s.name))}
    Experiences: ${JSON.stringify(resumeData.experience?.map((e: any) => ({ title: e.jobTitle, desc: e.description })))}

    Provide 3 concrete, metric-driven optimization tips and 3 recommended high-impact keywords to add for this role to pass ATS screeners. Keep it concise.
    Format your response as a valid JSON object matching this structure:
    {
      "tips": ["Tip 1...", "Tip 2...", "Tip 3..."],
      "keywords": ["keyword1", "keyword2", "keyword3"]
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let jsonString = response.text || "";
    if (jsonString.includes("```json")) {
      const match = jsonString.match(/```json\n([\s\S]*?)\n```/);
      if (match) jsonString = match[1];
    } else if (jsonString.includes("```")) {
      const match = jsonString.match(/```\n([\s\S]*?)\n```/);
      if (match) jsonString = match[1];
    }

    const result = JSON.parse(jsonString);
    return NextResponse.json({ result });
  } catch (error: any) {
    console.error("ATS Optimization Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

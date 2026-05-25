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

    // Check and deduct credits (1 credit per AI resume generation)
    const deduction = await checkAndDeductCredits(session.user.email, "Resume Generation", 1);
    if (!deduction.success) {
      return NextResponse.json({ error: deduction.error, code: "INSUFFICIENT_CREDITS" }, { status: 403 });
    }

    const { jobTitle } = await req.json();

    if (!jobTitle) {
      return NextResponse.json({ error: "Job title is required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return NextResponse.json({ error: "Gemini API key is not configured" }, { status: 500 });
    }

    const prompt = `You are an expert executive resume writer. Generate a complete, highly professional, ATS-optimized resume for a "${jobTitle}".
    
Return ONLY a valid JSON object matching the following structure. Do not wrap it in markdown code blocks.
{
  "personalInfo": {
    "fullName": "John Doe",
    "jobTitle": "${jobTitle}",
    "email": "john@example.com",
    "phone": "+1 234 567 8900",
    "location": "New York, NY",
    "summary": "A highly impactful and concise professional summary..."
  },
  "experience": [
    {
      "id": "1",
      "jobTitle": "...",
      "company": "...",
      "location": "...",
      "startDate": "Jan 2020",
      "endDate": "Present",
      "current": true,
      "description": ["Action-oriented bullet 1...", "Action-oriented bullet 2..."]
    }
  ],
  "education": [
    {
      "id": "1",
      "degree": "...",
      "school": "...",
      "location": "...",
      "startDate": "...",
      "endDate": "...",
      "current": false,
      "description": "..."
    }
  ],
  "skills": [
    { "id": "1", "name": "Skill 1", "level": "Expert" },
    { "id": "2", "name": "Skill 2", "level": "Advanced" }
  ],
  "projects": [
    {
      "id": "1",
      "title": "...",
      "description": "...",
      "url": "...",
      "technologies": ["Tech 1", "Tech 2"]
    }
  ]
}
Ensure you generate 2 realistic experiences, 1 education, 6 realistic skills, and 1 project.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let jsonString = response.text || "";
    // Clean up markdown json block if Gemini returns it
    if (jsonString.includes("```json")) {
      const match = jsonString.match(/```json\n([\s\S]*?)\n```/);
      if (match) {
        jsonString = match[1];
      }
    } else if (jsonString.includes("```")) {
      const match = jsonString.match(/```\n([\s\S]*?)\n```/);
      if (match) {
        jsonString = match[1];
      }
    }

    const resumeData = JSON.parse(jsonString);

    return NextResponse.json({ resume: resumeData });
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return NextResponse.json(
      { error: "An error occurred during AI generation: " + error.message },
      { status: 500 }
    );
  }
}

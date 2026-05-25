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

    // Dynamic credits logging if needed (will always succeed per credits.ts)
    await checkAndDeductCredits(session.user.email, "Resume Optimization", 1);

    const { jobTitle, resumeText } = await req.json();

    if (!jobTitle) {
      return NextResponse.json({ error: "Target job title is required" }, { status: 400 });
    }
    if (!resumeText || resumeText.trim().length === 0) {
      return NextResponse.json({ error: "Resume text content is required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return NextResponse.json({ error: "Gemini API key is not configured" }, { status: 500 });
    }

    const prompt = `You are an expert executive resume writer and ATS optimizer. Your task is to analyze the following user's raw resume text and their target job title, rewrite it to maximize impact, action verbs, achievements, and ATS matching, and output a valid JSON object matching the requested structure.

Target Job Title: "${jobTitle}"
Current Resume / Text:
${resumeText}

Optimize the personalInfo, experience, education, skills, and projects based on the current resume content. If some sections are missing, reconstruct them to the best of your ability using information from other parts of the text or leave them empty. Rephrase bullet points to start with strong action verbs and include metrics/achievements where possible. Keep IDs as strings (e.g. "1", "2").

Return ONLY a valid JSON object matching the following structure. Do not wrap it in markdown code blocks.
{
  "personalInfo": {
    "fullName": "...",
    "jobTitle": "${jobTitle}",
    "email": "...",
    "phone": "...",
    "location": "...",
    "summary": "Re-written professional summary to align with the target job..."
  },
  "experience": [
    {
      "id": "1",
      "jobTitle": "...",
      "company": "...",
      "location": "...",
      "startDate": "...",
      "endDate": "...",
      "current": false,
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
    { "id": "1", "name": "Skill 1", "level": "Expert" }
  ],
  "projects": [
    {
      "id": "1",
      "title": "...",
      "description": "...",
      "url": "...",
      "technologies": ["Tech 1"]
    }
  ]
}`;

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
    console.error("AI Update Resume Error:", error);
    return NextResponse.json(
      { error: "An error occurred during resume update analysis: " + error.message },
      { status: 500 }
    );
  }
}

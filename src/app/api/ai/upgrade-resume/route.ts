import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { GoogleGenAI } from "@google/genai";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const runtime = "nodejs";

const PROMPT_TEMPLATE = (jobTitle: string) => `You are a world-class executive resume writer and ATS optimization specialist.

Carefully read the resume document provided and extract ALL information from it. Then rewrite and restructure it to:
1. Maximize ATS score with relevant keywords for the target role
2. Use powerful action verbs and quantified achievements
3. Write an impactful professional summary tailored to the target role
4. Optimize skill listings for ATS keyword matching
5. Structure experience bullet points for maximum impact

Target Job Title: "${jobTitle}"

CRITICAL INSTRUCTIONS:
- Extract EVERY piece of information from the resume (names, companies, dates, education, skills, everything)
- Do NOT make up or hallucinate any data not present in the resume
- Return ONLY a valid raw JSON object — NO markdown, NO code blocks, NO explanatory text before or after
- The JSON must start with { and end with }

Required JSON structure:
{
  "personalInfo": {
    "fullName": "full name extracted from resume",
    "jobTitle": "${jobTitle}",
    "email": "email from resume or empty string",
    "phone": "phone from resume or empty string",
    "location": "location from resume or empty string",
    "summary": "Powerful 3-4 sentence professional summary rewritten to target ${jobTitle} with strong ATS keywords"
  },
  "experience": [
    {
      "id": "1",
      "jobTitle": "job title from resume",
      "company": "company name from resume",
      "location": "city, country from resume",
      "startDate": "Month YYYY",
      "endDate": "Month YYYY or Present",
      "current": false,
      "description": ["Rewritten bullet starting with strong action verb + metric", "Bullet 2", "Bullet 3"]
    }
  ],
  "education": [
    {
      "id": "1",
      "degree": "degree name from resume",
      "school": "university/school name from resume",
      "location": "location from resume or empty string",
      "startDate": "YYYY",
      "endDate": "YYYY",
      "current": false,
      "description": "honors, GPA, or relevant coursework from resume"
    }
  ],
  "skills": [
    { "id": "1", "name": "Skill from resume", "level": "Expert" },
    { "id": "2", "name": "Skill from resume", "level": "Advanced" }
  ],
  "projects": [
    {
      "id": "1",
      "title": "Project from resume",
      "description": "Impact-focused description rewritten from resume",
      "url": "url from resume or empty string",
      "technologies": ["Tech from resume"]
    }
  ]
}`;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key_here") {
      return NextResponse.json({ error: "Gemini API key is not configured" }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const jobTitle = formData.get("jobTitle") as string | null;

    if (!jobTitle || !jobTitle.trim()) {
      return NextResponse.json({ error: "Target job title is required" }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ error: "Resume file is required" }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name.toLowerCase();
    const isPdf = fileName.endsWith(".pdf") || file.type === "application/pdf";

    let response;

    if (isPdf) {
      // Send the PDF directly to Gemini as inline base64 data.
      // Gemini natively reads PDFs — no external parsing library needed.
      const base64Pdf = fileBuffer.toString("base64");

      response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  mimeType: "application/pdf",
                  data: base64Pdf,
                },
              },
              {
                text: PROMPT_TEMPLATE(jobTitle.trim()),
              },
            ],
          },
        ],
      });
    } else {
      // Plain text / TXT file — just send the text
      const resumeText = fileBuffer.toString("utf-8");

      if (!resumeText || resumeText.trim().length < 30) {
        return NextResponse.json(
          { error: "The text file appears to be empty or too short." },
          { status: 400 }
        );
      }

      response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `${PROMPT_TEMPLATE(jobTitle.trim())}\n\nResume Text:\n${resumeText.slice(0, 10000)}`,
      });
    }

    let jsonString = response.text || "";

    // Strip markdown code blocks if present
    const jsonBlockMatch = jsonString.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonBlockMatch) {
      jsonString = jsonBlockMatch[1];
    }

    // Extract the JSON object from the response
    const jsonStart = jsonString.indexOf("{");
    const jsonEnd = jsonString.lastIndexOf("}");
    if (jsonStart !== -1 && jsonEnd !== -1) {
      jsonString = jsonString.slice(jsonStart, jsonEnd + 1);
    }

    let resumeData;
    try {
      resumeData = JSON.parse(jsonString);
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr, "Raw response:", jsonString.slice(0, 500));
      return NextResponse.json(
        { error: "AI returned an invalid response. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ resume: resumeData });
  } catch (error: any) {
    console.error("Upgrade Resume API Error:", error);
    return NextResponse.json(
      { error: "An error occurred: " + error.message },
      { status: 500 }
    );
  }
}

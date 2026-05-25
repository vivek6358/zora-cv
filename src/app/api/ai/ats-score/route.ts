import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const runtime = "nodejs";

const PROMPT = (jobTitle: string) => `You are an expert ATS (Applicant Tracking System) analyst. Analyze the resume document provided and return a detailed ATS score report.

Target Job Title: "${jobTitle || "General"}"

Evaluate the resume on these 5 dimensions, score each 0-100:
1. compatibility: How well the resume structure and format works with ATS parsing systems
2. formatting: Clean formatting, no tables/columns/graphics that confuse ATS, standard fonts and section headers
3. keywords: Match of relevant keywords and skills for the target job title (if provided)
4. readability: Clear language, action verbs, logical flow, appropriate length
5. completeness: All essential sections present (contact, summary, experience, education, skills)

Also identify:
- 3-5 specific strengths of this resume
- 3-5 specific improvements needed

RESPOND ONLY with a valid raw JSON object (no markdown, no code blocks):
{
  "overallScore": <number 0-100>,
  "label": "<one of: Excellent | Good | Needs Work | Poor>",
  "breakdown": {
    "compatibility": <number>,
    "formatting": <number>,
    "keywords": <number>,
    "readability": <number>,
    "completeness": <number>
  },
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["specific improvement 1", "specific improvement 2", "specific improvement 3"]
}`;

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key_here") {
      return NextResponse.json({ error: "Gemini API key is not configured" }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const jobTitle = (formData.get("jobTitle") as string | null) || "General";

    if (!file) {
      return NextResponse.json({ error: "Resume file is required" }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name.toLowerCase();
    const isPdf = fileName.endsWith(".pdf") || file.type === "application/pdf";

    let response;

    if (isPdf) {
      // Send PDF directly to Gemini — it natively understands PDFs
      const base64Pdf = fileBuffer.toString("base64");
      response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              { inlineData: { mimeType: "application/pdf", data: base64Pdf } },
              { text: PROMPT(jobTitle) },
            ],
          },
        ],
      });
    } else {
      // TXT / DOC — extract as text
      const resumeText = fileBuffer.toString("utf-8").slice(0, 10000);
      response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `${PROMPT(jobTitle)}\n\nResume Text:\n${resumeText}`,
      });
    }

    let jsonString = response.text || "";

    // Strip any markdown code blocks
    const codeBlock = jsonString.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (codeBlock) jsonString = codeBlock[1];

    // Extract JSON object
    const start = jsonString.indexOf("{");
    const end = jsonString.lastIndexOf("}");
    if (start !== -1 && end !== -1) jsonString = jsonString.slice(start, end + 1);

    let scoreData;
    try {
      scoreData = JSON.parse(jsonString);
    } catch {
      console.error("JSON parse error. Raw:", jsonString.slice(0, 300));
      return NextResponse.json({ error: "AI returned an invalid response. Please try again." }, { status: 500 });
    }

    // Ensure overallScore is a number within range
    if (typeof scoreData.overallScore !== "number") {
      scoreData.overallScore = Math.round(
        Object.values(scoreData.breakdown as Record<string, number>).reduce((a, b) => a + b, 0) / 5
      );
    }
    scoreData.overallScore = Math.min(100, Math.max(0, Math.round(scoreData.overallScore)));

    return NextResponse.json(scoreData);
  } catch (error: any) {
    console.error("ATS Score API Error:", error);
    return NextResponse.json({ error: "An error occurred: " + error.message }, { status: 500 });
  }
}

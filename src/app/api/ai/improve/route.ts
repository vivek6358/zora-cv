import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { GoogleGenAI } from "@google/genai";
import { checkAndDeductCredits } from "@/lib/credits";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check and deduct credits (1 credit per AI rewrite / improve)
    const deduction = await checkAndDeductCredits(session.user.email, "AI Rewrite", 1);
    if (!deduction.success) {
      return NextResponse.json({ error: deduction.error, code: "INSUFFICIENT_CREDITS" }, { status: 403 });
    }

    const { text, context } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return NextResponse.json({ error: "Gemini API key is not configured" }, { status: 500 });
    }

    let prompt = "";
    if (context === "summary") {
      prompt = `You are an expert executive resume writer and career coach.
Rewrite the following professional summary to be highly impactful, concise, and engaging.
Use strong action verbs and professional tone.
Do not include any introductory text, pleasantries, or formatting like "Here is the summary".
Return ONLY the rewritten text itself.

Original Text:
${text}`;
    } else {
      prompt = `You are an expert executive resume writer and career coach.
Rewrite the following resume experience bullet point(s) to be highly professional, action-oriented, and metric-driven.
Use the XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]".
Ensure the bullets start with strong action verbs.
Format the output as plain text with one bullet point per line (no bullet characters like • or -, just the text).
Do not include any introductory text, pleasantries, or formatting like "Here are the revised bullets".
Return ONLY the rewritten text itself.

Original Text:
${text}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return NextResponse.json({ result: response.text });
  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json(
      { error: "An error occurred during AI generation: " + error.message },
      { status: 500 }
    );
  }
}

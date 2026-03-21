import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const QUIZ_SYSTEM_PROMPT = `You are an IPL cricket quiz generator. Return ONLY valid JSON, no markdown, no explanation.
Generate one multiple-choice question about IPL cricket history (2008–2026).
Format: { "question": string, "options": [string,string,string,string], "correct": number (0-3 index), "explanation": string }
Make the explanation 1-2 sentences, informative and in a commentator voice.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const difficulty: string = body.difficulty ?? "medium";

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY" },
        { status: 500 }
      );
    }

    const client = new GoogleGenerativeAI(apiKey);
    const model = client.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: QUIZ_SYSTEM_PROMPT,
    });

    const result = await model.generateContent(
      `Generate one IPL quiz question. Difficulty: ${difficulty}.`
    );

    const raw = result.response.text();

    // Strip triple backticks if present
    const cleaned = raw
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Quiz route error:", err);
    return NextResponse.json(
      { error: "Failed to generate question" },
      { status: 500 }
    );
  }
}
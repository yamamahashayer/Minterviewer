import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { role, interviewType, techStack, questionCount } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // === YOUR ORIGINAL PROMPT (preserved exactly) ===
    const sessionId = Math.random().toString(36).slice(2) + Date.now();
    const prompt = `You are an expert interviewer. Generate ${questionCount} diverse interview questions for a ${role} position.
Interview type: ${interviewType}
Tech stack: ${(Array.isArray(techStack) ? techStack : []).join(', ')}

For technical interviews, include:
- 60% coding questions (mark with isCoding: true)
- 40% conceptual questions

For behavioral interviews, focus on:
- Leadership and teamwork
- Problem-solving scenarios
- Communication skills

Vary phrasing and coverage on each request. Avoid repeating the same wording. Randomize question order.
Session id: ${sessionId}

Return ONLY a JSON array named questions (no extra text), each item with:
{
  "text": "question text",
  "type": "verbal" | "coding",
  "isCoding": boolean,
  "difficulty": "easy" | "medium" | "hard",
  "category": "string"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text?.trim() || "[]";

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      console.error("JSON parse failed:", text);
      parsed = { questions: [] };
    }

    const items = Array.isArray(parsed.questions)
      ? parsed.questions
      : Array.isArray(parsed)
      ? parsed
      : [];

    return NextResponse.json({ questions: items });

  } catch (err: any) {
    console.error("Gemini request failed:", err);
    return NextResponse.json(
      { error: "Gemini request failed" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { role, interviewType, techStack, questionCount } = await req.json();

    console.log("Received generate-questions request:", { role, interviewType, techStack, questionCount });

    const apiKey = process.env.GEMINI_API_KEY;
    console.log("GEMINI_API_KEY present:", !!apiKey);

    if (!apiKey) {
      console.error("Missing GEMINI_API_KEY");
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
    You are an expert technical interviewer. Generate ${questionCount || 5} interview questions for a ${role} position.
    
    Interview Type: ${interviewType}
    Tech Stack: ${Array.isArray(techStack) ? techStack.join(", ") : techStack}
    
    For each question, specify:
    1. The question text
    2. The type (verbal or coding)
    3. isCoding (boolean) - true if it requires writing code
    
    If the interview type is "technical", include a mix of conceptual and coding questions.
    If "behavioral", focus on soft skills and past experiences.
    
    Return **ONLY** valid JSON.
    `;

    console.log("Sending prompt to Gemini...");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ["verbal", "coding"] },
                  isCoding: { type: Type.BOOLEAN }
                },
                required: ["text", "type", "isCoding"]
              }
            }
          },
          required: ["questions"]
        }
      }
    });

    const text = response.text?.trim() || "{}";
    console.log("Gemini response text:", text);

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      console.error("JSON parse failed:", text, e);
      return NextResponse.json(
        { error: "Invalid JSON returned from Gemini" },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);

  } catch (error) {
    console.error("Question Generation Error:", error);
    return NextResponse.json(
      { error: "Failed to generate questions" },
      { status: 500 }
    );
  }
}

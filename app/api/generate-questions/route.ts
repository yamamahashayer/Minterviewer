import { NextRequest, NextResponse } from "next/server";
import { openRouter } from "@/lib/openrouter";

export async function POST(req: NextRequest) {
  try {
    const { role, interviewType, techStack, questionCount } = await req.json();

    console.log("Received generate-questions request:", { role, interviewType, techStack, questionCount });

    const prompt = `
    You are an expert technical interviewer. Generate ${questionCount || 5} interview questions for a ${role} position.
    
    Interview Type: ${interviewType}
    Tech Stack: ${Array.isArray(techStack) ? techStack.join(", ") : techStack}
    
    For each question, specify:
    1. The question text
    2. The type (verbal or coding)
    3. isCoding (boolean) - true if it requires writing code
    4. thinkingTime (integer) - suggested time in seconds to think before answering (e.g., 15-30 seconds)
    5. answerTime (integer) - suggested time in seconds to record the answer (e.g., 60-120 seconds)
    
    If the interview type is "technical", include a mix of conceptual and coding questions.
    If "behavioral", focus on soft skills and past experiences.
    
    Return **ONLY** valid JSON.
    `;

    console.log("Sending prompt to OpenRouter (Gemini)...");

    const completion = await openRouter.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        { role: "system", content: "You are a helpful assistant that outputs JSON." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const text = completion.choices[0]?.message?.content?.trim() || "{}";
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

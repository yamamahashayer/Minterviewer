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
    
    For each question, return a JSON object with these exact keys:
    - "text": The question string
    - "type": "verbal" or "coding"
    - "isCoding": boolean
    - "thinkingTime": integer (seconds)
    - "answerTime": integer (seconds)
    
    Response format:
    [
      {
        "text": "Question text here",
        "type": "verbal",
        "isCoding": false,
        "thinkingTime": 30,
        "answerTime": 60
      }
    ]
    
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

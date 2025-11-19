import { NextRequest, NextResponse } from "next/server";
import { generateSummarySuggestions } from "@/lib/cvSuggestions/Gemini/summaryGemini";

export async function POST(req: NextRequest, context: any) {
  const { menteeid } = await context.params;

  try {
    const body = await req.json();

    const result = await generateSummarySuggestions({
      menteeId: menteeid,
      cvType: body.cvType,
      cvData: body.cvData,
      targetRole: body.targetRole,
      jobDescription: body.jobDescription,
    });

    return NextResponse.json(result);
  } catch (e) {
    console.error("❌ Summary Suggestion API error:", e);
    return NextResponse.json(
      {
        summaryTemplates: [],
        phrases: [],
      },
      { status: 200 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { generateSkillsSuggestions } from "@/lib/cvSuggestions/Gemini/skillsgemini";

export async function POST(req: NextRequest, context: any) {
  const { menteeid } = await context.params;

  try {
    const body = await req.json();

    const result = await generateSkillsSuggestions({
      menteeId: menteeid,
      cvType: body.cvType,
      cvData: body.cvData,
      targetRole: body.targetRole,
      jobDescription: body.jobDescription,
    });

    return NextResponse.json(result);
  } catch (e) {
    console.error("❌ Skills Suggestion API error:", e);
    return NextResponse.json(
      {
        technicalSkills: [],
        softSkills: [],
        languages: [],
      },
      { status: 200 }
    );
  }
}

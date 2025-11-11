import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import CvAnalysis from "@/models/CvAnalysis";
import Resume from "@/models/Resume";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const isObjectId = (id?: string) =>
  !!id && mongoose.Types.ObjectId.isValid(String(id));

export async function GET(
  req: NextRequest,
  ctx: { params: { menteeid: string; resumeId: string } }
) {
  try {
    await connectDB();

    const { menteeid, resumeId } = ctx.params;
    console.log("📘 Fetching CV report for:", { menteeid, resumeId });

    if (!isObjectId(menteeid) || !isObjectId(resumeId)) {
      return NextResponse.json(
        { ok: false, error: "Invalid menteeId or resumeId" },
        { status: 400 }
      );
    }

    const resume = await Resume.findById(resumeId).lean();
    if (!resume) {
      return NextResponse.json(
        { ok: false, error: "Resume not found" },
        { status: 404 }
      );
    }

    const analysis = await CvAnalysis.findOne({
      mentee: menteeid,
      resume: resumeId,
    }).lean();

    if (!analysis) {
      return NextResponse.json({
        ok: true,
        analyzed: false,
        resume,
        message: "No AI analysis found for this CV yet.",
      });
    }

    return NextResponse.json({
      ok: true,
      analyzed: true,
      resume,
      analysis,
    });
  } catch (err: any) {
    console.error("❌ Error fetching CV report:", err);
    return NextResponse.json(
      { ok: false, error: err.message || "Server error" },
      { status: 500 }
    );
  }
}

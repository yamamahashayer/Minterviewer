import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import CvAnalysis from "@/models/CvAnalysis";

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ analysisId: string }> }
) {
  try {
    await connectDB();

    // ✅ فك الـ params صح
    const { analysisId } = await ctx.params;

    const analysis = await CvAnalysis.findById(analysisId).lean();

    if (!analysis) {
      return NextResponse.json(
        { error: "CV analysis not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ analysis });
  } catch (err) {
    console.error("CV analysis error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

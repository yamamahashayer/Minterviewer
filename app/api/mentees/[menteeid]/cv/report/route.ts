import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import CvAnalysis from "@/models/CvAnalysis";

export async function GET(req: NextRequest, { params }: any) {
  await connectDB();
  const menteeId = params.menteeId;
  const resumeId = req.nextUrl.searchParams.get("resumeId");

  if (!menteeId || !resumeId) {
    return NextResponse.json({ error: "Missing menteeId or resumeId" }, { status: 400 });
  }

  const analysis = await CvAnalysis.findOne({ mentee: menteeId, resume: resumeId });

  if (!analysis) {
    return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
  }

  return NextResponse.json(analysis);
}

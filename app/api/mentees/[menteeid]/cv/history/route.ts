import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";
import CvAnalysis from "@/models/CvAnalysis";
import "@/models/Resume";



export async function GET(
  req: NextRequest,
  context: { params: Promise<{ menteeid: string }> }
) {
  const { menteeid } = await context.params;
  await connectDB();

  console.log("📜 Fetching full CV history for mentee:", menteeid);

  if (!mongoose.Types.ObjectId.isValid(menteeid)) {
    return NextResponse.json(
      { ok: false, error: "Invalid menteeId" },
      { status: 400 }
    );
  }

  try {
    const history = await CvAnalysis.find({ mentee: menteeid })
      .populate("resume")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      ok: true,
      count: history.length,
      history,
    });
  } catch (err: any) {
    console.error("❌ Error fetching CV history:", err);
    return NextResponse.json(
      { ok: false, error: err.message || "Server error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import CvAnalysis from "@/models/CvAnalysis";

const unwrapParams = async (ctx) => {
  const p = ctx?.params;
  return p && typeof p.then === "function" ? await p : p;
};

export async function POST(req, ctx) {
  try {
    await connectDB();

    const params = await unwrapParams(ctx);

    const companyId = params?.companyId; // ← مهم الآن
    const jobId = params?.jobId;

    const { menteeId, analysisId } = await req.json();

    if (!menteeId || !analysisId) {
      return NextResponse.json(
        { ok: false, message: "menteeId and analysisId are required" },
        { status: 400 }
      );
    }

    // 1) verify analysis exists
    const analysis = await CvAnalysis.findById(analysisId);
    if (!analysis) {
      return NextResponse.json(
        { ok: false, message: "CV Analysis not found." },
        { status: 404 }
      );
    }

    // 2) fetch job AND ensure it belongs to company
    const job = await Job.findOne({ _id: jobId, companyId });
    if (!job) {
      return NextResponse.json(
        { ok: false, message: "Job not found for this company." },
        { status: 404 }
      );
    }

    // 3) add applicant
    job.applicants.push({
      menteeId,
      analysisId,
    });

    await job.save();

    return NextResponse.json({ ok: true, job });
  } catch (err) {
    console.error("Apply Error:", err);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}

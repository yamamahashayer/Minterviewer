import { NextResponse } from "next/server";
import mongoose from "mongoose";
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
    const companyId = params?.companyId;
    const jobId = params?.jobId;

    const { menteeId, analysisId } = await req.json();

    if (!menteeId || !analysisId) {
      return NextResponse.json(
        { ok: false, message: "menteeId and analysisId are required" },
        { status: 400 }
      );
    }

    // Validate ObjectIDs
    if (
      !mongoose.Types.ObjectId.isValid(menteeId) ||
      !mongoose.Types.ObjectId.isValid(analysisId)
    ) {
      return NextResponse.json(
        { ok: false, message: "Invalid ObjectId." },
        { status: 400 }
      );
    }

    // 1) check analysis exists
    const analysis = await CvAnalysis.findById(analysisId);
    if (!analysis) {
      return NextResponse.json(
        { ok: false, message: "CV Analysis not found." },
        { status: 404 }
      );
    }

    // 2) fetch job + ensure company owns the job
    const job = await Job.findOne({ _id: jobId, companyId });
    if (!job) {
      return NextResponse.json(
        { ok: false, message: "Job not found for this company." },
        { status: 404 }
      );
    }

    // 3) prevent duplicate application
    const alreadyApplied = job.applicants.some(
      (a) => a.menteeId.toString() === menteeId
    );

    if (alreadyApplied) {
      return NextResponse.json(
        { ok: false, message: "Applicant has already applied to this job." },
        { status: 400 }
      );
    }

    // 4) add applicant
    const newApplicant = {
      menteeId,
      analysisId,
      status: "pending",
      createdAt: new Date(),
    };

    job.applicants.push(newApplicant);
    await job.save();

    return NextResponse.json({ ok: true, applicant: newApplicant });
  } catch (err) {
    console.error("Apply Error:", err);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}

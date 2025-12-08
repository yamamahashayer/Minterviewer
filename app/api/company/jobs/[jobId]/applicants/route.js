import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import Mentee from "@/models/Mentee";
import CvAnalysis from "@/models/CvAnalysis";

export const dynamic = "force-dynamic";

// 🔥 نفس الهيلبر اللي بيحل مشكلة params Promise
const getParams = async (ctx) => {
  const p = ctx?.params;
  return p && typeof p.then === "function" ? await p : p;
};

export async function GET(req, ctx) {
  try {
    await connectDB();

    const p = await getParams(ctx); // 🔥 فككنا params
    const jobId = p.jobId;

    const job = await Job.findById(jobId);

    if (!job) {
      return NextResponse.json(
        { ok: false, message: "Job not found." },
        { status: 404 }
      );
    }

    const applicants = [];

    for (const app of job.applicants) {
      const mentee = await Mentee.findById(app.menteeId);
      const analysis = await CvAnalysis.findById(app.analysisId);

      applicants.push({
        _id: app._id,
        menteeId: app.menteeId,
        status: app.status,
        createdAt: app.createdAt,
        mentee,
        analysis,
      });
    }

    return NextResponse.json({ ok: true, applicants });
  } catch (err) {
    console.error("Applicants GET Error:", err);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}

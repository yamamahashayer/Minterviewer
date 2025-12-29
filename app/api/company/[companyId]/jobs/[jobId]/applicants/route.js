import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

import Job from "@/models/Job";
import Mentee from "@/models/Mentee";
import CvAnalysis from "@/models/CvAnalysis";
import "@/models/User";

export const dynamic = "force-dynamic";

/* ================= UTILS ================= */
const unwrapParams = async (ctx) => {
  const p = ctx?.params;
  return p && typeof p.then === "function" ? await p : p;
};

/* ================= GET ================= */
export async function GET(req, ctx) {
  try {
    console.log("🟡 [APPLICANTS] API HIT");

    await connectDB();
    console.log("🟢 DB connected");

    const { companyId, jobId } = await unwrapParams(ctx);
    console.log("📌 Params:", { companyId, jobId });

    /* ================= FETCH JOB ================= */
    const job = await Job.findOne({ _id: jobId, companyId }).lean();

    if (!job) {
      return NextResponse.json(
        { ok: false, message: "Job not found for this company." },
        { status: 404 }
      );
    }

    /* ================= IDS ================= */
    const menteeIds = job.applicants.map((a) => a.menteeId);
    const analysisIds = job.applicants
      .map((a) => a.analysisId)
      .filter(Boolean);

    /* ================= MENTEES ================= */
    const mentees = await Mentee.find({ _id: { $in: menteeIds } })
      .populate({
        path: "user",
        select: "full_name email phoneNumber Country",
      })
      .lean();

    const analyses = await CvAnalysis.find({
      _id: { $in: analysisIds },
    }).lean();

    /* ================= MAPS ================= */
    const menteeMap = new Map(
      mentees.map((m) => [m._id.toString(), m])
    );

    const analysisMap = new Map(
      analyses.map((a) => [a._id.toString(), a])
    );

    /* ================= RESPONSE ================= */
    const applicants = job.applicants.map((app) => {
      const mentee = menteeMap.get(app.menteeId.toString());
      const analysis = app.analysisId
        ? analysisMap.get(app.analysisId.toString())
        : null;

      return {
        _id: app._id,
        status: app.status,
        createdAt: app.createdAt,

        mentee: mentee
          ? {
            _id: mentee._id,
            full_name: mentee.user?.full_name || "",
            email: mentee.user?.email || "",
            phoneNumber: mentee.user?.phoneNumber || "",
            Country: mentee.user?.Country || "",
          }
          : null,

        cvScore: analysis?.score ?? null,
        atsScore: analysis?.atsScore ?? null,
        interviewScore: app.evaluation?.interviewScore ?? null,

        analysisId: app.analysisId || null,
        interviewId: app.interviewId || null,
      };
    });

    return NextResponse.json({ ok: true, applicants });
  } catch (err) {
    console.error("🔥 Applicants GET Error:", err);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}

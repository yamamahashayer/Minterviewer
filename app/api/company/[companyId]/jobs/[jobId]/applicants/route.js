import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import Mentee from "@/models/Mentee";
import CvAnalysis from "@/models/CvAnalysis";

export const dynamic = "force-dynamic";

const getParams = async (ctx) => {
  const p = ctx?.params;
  return p && typeof p.then === "function" ? await p : p;
};

export async function GET(req, ctx) {
  try {
    await connectDB();

    const p = await getParams(ctx);
    const companyId = p.companyId;
    const jobId = p.jobId;

    const job = await Job.findOne({ _id: jobId, companyId });

    if (!job) {
      return NextResponse.json(
        { ok: false, message: "Job not found for this company." },
        { status: 404 }
      );
    }

    // -----------------------------------------------------
    // 1) جمع كل IDs دفعة واحدة
    // -----------------------------------------------------
    const menteeIds = job.applicants.map((a) => a.menteeId);
    const analysisIds = job.applicants
      .map((a) => a.analysisId)
      .filter(Boolean); // احذف undefined

    // -----------------------------------------------------
    // 2) جلب البيانات دفعة واحدة
    // -----------------------------------------------------
    const mentees = await Mentee.find({ _id: { $in: menteeIds } });
    const analyses = await CvAnalysis.find({ _id: { $in: analysisIds } });

    // سهولة الوصول
    const menteeMap = new Map(mentees.map((m) => [m._id.toString(), m]));
    const analysisMap = new Map(
      analyses.map((a) => [a._id.toString(), a])
    );

    // -----------------------------------------------------
    // 3) بناء نتيجة applicants بطريقة مرتبة
    // -----------------------------------------------------
    const applicants = job.applicants.map((app) => ({
      _id: app._id,
      menteeId: app.menteeId,
      status: app.status,
      createdAt: app.createdAt,
      mentee: menteeMap.get(app.menteeId.toString()) || null,
      analysis: app.analysisId
        ? analysisMap.get(app.analysisId.toString())
        : null,
    }));

    return NextResponse.json({ ok: true, applicants });
  } catch (err) {
    console.error("Applicants GET Error:", err);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}


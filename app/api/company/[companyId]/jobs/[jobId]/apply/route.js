import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";

import Job from "@/models/Job";
import Mentee from "@/models/Mentee";
import CvAnalysis from "@/models/CvAnalysis";
import User from "@/models/User";
import Activity from "@/models/Activity"; // ✅ ACTIVITY

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

    const { menteeId, analysisId, phone, country } = await req.json();

    /* ================= VALIDATION ================= */

    if (!menteeId) {
      return NextResponse.json(
        { ok: false, message: "menteeId is required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(menteeId)) {
      return NextResponse.json(
        { ok: false, message: "Invalid menteeId" },
        { status: 400 }
      );
    }

    /* ================= FETCH JOB ================= */

    const job = await Job.findOne({ _id: jobId, companyId });
    if (!job) {
      return NextResponse.json(
        { ok: false, message: "Job not found for this company." },
        { status: 404 }
      );
    }

    /* ================= CV VALIDATION ================= */

    if (job.enableCVAnalysis) {
      if (!analysisId) {
        return NextResponse.json(
          { ok: false, message: "CV analysis is required for this job." },
          { status: 400 }
        );
      }

      if (!mongoose.Types.ObjectId.isValid(analysisId)) {
        return NextResponse.json(
          { ok: false, message: "Invalid analysisId" },
          { status: 400 }
        );
      }

      const analysis = await CvAnalysis.findById(analysisId);
      if (!analysis) {
        return NextResponse.json(
          { ok: false, message: "CV Analysis not found." },
          { status: 404 }
        );
      }
    }

    /* ================= DUPLICATE CHECK ================= */

    const alreadyApplied = job.applicants.some(
      (a) => a.menteeId.toString() === menteeId
    );

    if (alreadyApplied) {
      return NextResponse.json(
        { ok: false, message: "Applicant has already applied to this job." },
        { status: 400 }
      );
    }

    /* ================= UPDATE USER CONTACT ================= */

    if (phone || country) {
      const mentee = await Mentee.findById(menteeId);
      if (mentee?.user) {
        await User.findByIdAndUpdate(
          mentee.user,
          {
            ...(phone ? { phoneNumber: phone } : {}),
            ...(country ? { Country: country } : {}),
          },
          { new: true }
        );
      }
    }

    /* ================= ADD APPLICANT ================= */

    job.applicants.push({
      menteeId,
      analysisId: job.enableCVAnalysis ? analysisId : null,
      status: "pending",
      createdAt: new Date(),
    });

    await job.save();

    /* ===== ACTIVITY LOG ===== */
    await Activity.create({
      ownerModel: "Mentee",
      owner: menteeId,
      type: "achievement",
      title: `Applied for ${job.title}`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Apply Error:", err);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

import Job from "@/models/Job";
import Company from "@/models/Company";
import Mentee from "@/models/Mentee";

import { sendNotification } from "@/lib/sendNotification";

/* ============================================
   Helpers
==============================================*/
const unwrapParams = async (ctx) => {
  const p = ctx?.params;
  return p && typeof p.then === "function" ? await p : p;
};


/* ============================================
   GET — All Jobs
   - Auto Close Expired
   - Deadline Reminders
==============================================*/
export async function GET(req, ctx) {
  try {
    await connectDB();

    const p = await unwrapParams(ctx);
    const companyId = p.companyId;

    const companyExists = await Company.findById(companyId);
    if (!companyExists) {
      return NextResponse.json(
        { ok: false, message: "Company not found" },
        { status: 404 }
      );
    }

    // Simply return jobs without any deadline checking
    // Deadline notifications are now handled by the cron job
    const jobs = await Job.find({ companyId }).sort({ createdAt: -1 });
    
    return NextResponse.json({ ok: true, jobs });
  } catch (err) {
    console.error("Get Jobs Error:", err);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}

/* ============================================
   POST — Create Job
   + Notify Company
   + Notify ALL Mentees 🔥
==============================================*/
export async function POST(req, ctx) {
  try {
    await connectDB();

    const p = await unwrapParams(ctx);
    const companyId = p.companyId;

    const companyExists = await Company.findById(companyId);
    if (!companyExists) {
      return NextResponse.json(
        { ok: false, message: "Company not found" },
        { status: 404 }
      );
    }

    const companyUserId = companyExists.user.toString();

    const body = await req.json();
    const {
      title,
      type,
      location,
      level,
      salaryRange,
      description,
      skills,
      deadline,
      enableCVAnalysis,
      interviewType,
      aiFocus,
      aiQuestions,
      humanType,
    } = body;

    const job = await Job.create({
      companyId,
      title,
      type,
      location,
      level,
      salaryRange,
      description,
      skills,
      deadline,
      enableCVAnalysis,
      interviewType,
      aiFocus,
      aiQuestions,
      humanType,
    });

    /* ============================================
       🔔 Notify Company
    ===============================================*/
    await sendNotification({
      userId: companyUserId,
      title: "Job Published",
      message: `Your job "${job.title}" has been published successfully.`,
      type: "job",
      redirectTo: "/company?tab=jobs",
    });

    /* ============================================
       🔔 Notify ALL Mentees (NEW)
    ===============================================*/
    const mentees = await Mentee.find({}, "_id user");

    for (const mentee of mentees) {
      if (!mentee.user) continue;

      await sendNotification({
        userId: mentee.user.toString(),
        title: "New Job Opportunity 🚀",
        message: `${companyExists.name} has published a new job: "${job.title}"`,
        type: "job",
        redirectTo: `/jobs/${job._id}`,
      });
    }

    return NextResponse.json({ ok: true, job }, { status: 201 });
  } catch (err) {
    console.error("Create Job Error:", err);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}

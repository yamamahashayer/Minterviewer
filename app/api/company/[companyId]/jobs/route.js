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

    const userId = companyExists.user.toString();

    let jobs = await Job.find({ companyId }).sort({ createdAt: -1 });
    const now = new Date();

    for (const job of jobs) {
      /* ============================================
         🔔 Deadline Reminders
      ===============================================*/
      if (job.deadline && job.status === "active") {
        const deadline = new Date(job.deadline);
        const diffMs = deadline.getTime() - now.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        // 🔔 3 days before
        if (diffDays === 3 && !job.reminder3DaysSent) {
          await sendNotification({
            userId,
            title: "Job Deadline Coming Soon",
            message: `Your job "${job.title}" will expire in 3 days.`,
            type: "job",
            redirectTo: "/company?tab=jobs",
          });

          job.reminder3DaysSent = true;
          await job.save();
        }

        // 🔔 1 day before
        if (diffDays === 1 && !job.reminder1DaySent) {
          await sendNotification({
            userId,
            title: "Job Ending Tomorrow",
            message: `Your job "${job.title}" will expire tomorrow.`,
            type: "job",
            redirectTo: "/company?tab=jobs",
          });

          job.reminder1DaySent = true;
          await job.save();
        }
      }

      /* ============================================
         ⛔ Auto Close Expired Jobs
      ===============================================*/
      const expired =
        job.deadline &&
        new Date(job.deadline) < now &&
        job.status === "active";

      if (expired) {
        job.status = "closed";
        await job.save();

        await sendNotification({
          userId,
          title: "Job Closed Automatically",
          message: `Your job "${job.title}" has expired and was automatically closed.`,
          type: "job",
          redirectTo: "/company?tab=jobs",
        });
      }
    }

    jobs = await Job.find({ companyId }).sort({ createdAt: -1 });
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

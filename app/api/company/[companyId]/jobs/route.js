import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import Company from "@/models/Company";
import { sendNotification } from "@/lib/sendNotification"; // ⬅️ مهم

const unwrapParams = async (ctx) => {
  const p = ctx?.params;
  return p && typeof p.then === "function" ? await p : p;
};

/* ============================================
   GET — All Jobs (Auto Close Expired)
==============================================*/
/* ============================================
   GET — All Jobs (Auto Close + Deadline Reminders)
==============================================*/
export async function GET(req, ctx) {
  try {
    await connectDB();
    const p = await unwrapParams(ctx);
    const companyId = p.companyId;

    // جلب الشركة لمعرفة userId
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
          1️⃣ تذكير قبل انتهاء الوظيفة
      ===============================================*/

      if (job.deadline && job.status === "active") {
        const deadline = new Date(job.deadline);
        const diffMs = deadline.getTime() - now.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        // 🔔 قبل 3 أيام
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

        // 🔔 قبل يوم واحد
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
          2️⃣ إغلاق الوظائف المنتهية تلقائيًا
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

    // إعادة جلب النتائج بعد التحديث
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

    const userId = companyExists.user.toString(); // 🔥 user الحقيقي للشركة

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
       🔔 إشعار — تم نشر وظيفة جديدة
    ===============================================*/
    await sendNotification({
      userId,
      title: "Job Published",
      message: `Your job "${job.title}" has been published successfully.`,
      type: "job",
      redirectTo: "/company?tab=jobs",
    });

    return NextResponse.json({ ok: true, job }, { status: 201 });
  } catch (err) {
    console.error("Create Job Error:", err);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}

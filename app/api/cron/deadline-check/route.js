import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import Company from "@/models/Company";
import { sendNotification } from "@/lib/sendNotification";

/* ============================================
   CRON JOB - Daily Deadline Check
   Runs once per day to check job deadlines
   Call this endpoint from your cron service
=============================================*/
export async function GET() {
  try {
    await connectDB();
    
    console.log("🕐 Running daily deadline check cron job...");
    
    // Get all companies to process their jobs
    const companies = await Company.find({});
    
    for (const company of companies) {
      const userId = company.user.toString();
      const companyId = company._id;
      
      // Get all jobs for this company
      const jobs = await Job.find({ companyId }).sort({ createdAt: -1 });
      const now = new Date();

      for (const job of jobs) {
        /* ============================================
           🔔 Deadline Reminders
        ===============================================*/
        if (job.deadline && job.status === "active") {
          const deadline = new Date(job.deadline);
          const diffMs = deadline.getTime() - now.getTime();
          const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

          console.log(`Job "${job.title}" (${job._id}): ${diffDays} days until deadline`);

          // 🔔 3 days before
          if (diffDays === 3 && !job.reminder3DaysSent) {
            console.log(`Sending 3-day reminder for job "${job.title}"`);
            await sendNotification({
              userId,
              title: "Job Deadline Coming Soon",
              message: `Your job "${job.title}" will expire in 3 days.`,
              type: "job",
              redirectTo: "/company?tab=jobs",
            });

            job.reminder3DaysSent = true;
            await job.save();
            console.log(`3-day reminder flag set for job "${job.title}"`);
          }

          // 🔔 1 day before
          if (diffDays === 1 && !job.reminder1DaySent) {
            console.log(`Sending 1-day reminder for job "${job.title}"`);
            await sendNotification({
              userId,
              title: "Job Ending Tomorrow",
              message: `Your job "${job.title}" will expire tomorrow.`,
              type: "job",
              redirectTo: "/company?tab=jobs",
            });

            job.reminder1DaySent = true;
            await job.save();
            console.log(`1-day reminder flag set for job "${job.title}"`);
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
          console.log(`Job "${job.title}" (${job._id}) is expired`);
          job.status = "closed";
          await job.save();

          // Only send auto-close notification once
          if (!job.autoCloseNotificationSent) {
            console.log(`Sending auto-close notification for job "${job.title}"`);
            await sendNotification({
              userId,
              title: "Job Closed Automatically",
              message: `Your job "${job.title}" has expired and was automatically closed.`,
              type: "job",
              redirectTo: "/company?tab=jobs",
            });

            job.autoCloseNotificationSent = true;
            await job.save();
            console.log(`Auto-close notification flag set for job "${job.title}"`);
          }
        }
      }
    }

    console.log("✅ Daily deadline check completed successfully");
    return NextResponse.json({ 
      ok: true, 
      message: "Daily deadline check completed",
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error("❌ Daily deadline check error:", err);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}

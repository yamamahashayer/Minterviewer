import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import Activity from "@/models/Activity";
import CompanyInterview from "@/models/CompanyInterview";
import Company from "@/models/Company";
import Mentee from "@/models/Mentee";
import { getUserFromToken } from "@/lib/auth-helper";
import { sendNotification } from "@/lib/sendNotification";
import { sendBookingConfirmationEmail } from "@/lib/email";

const unwrapParams = async (ctx) => {
  const p = ctx?.params;
  return p && typeof p.then === "function" ? await p : p;
};

export async function POST(req, ctx) {
  try {
    await connectDB();

    const { companyId, jobId, applicantId } = await unwrapParams(ctx);
    const { date, time, duration, type, notes } = await req.json();

    const authData = await getUserFromToken(req);
    if (!authData || authData.role !== "company") {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const companyProfile = await Company.findOne({ user: authData.id }).populate({
      path: "user",
      select: "full_name email"
    });

    if (!companyProfile || companyProfile._id.toString() !== companyId) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    // Validate required fields
    if (!date || !time || !duration || !type) {
      return NextResponse.json(
        { ok: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const scheduledStart = new Date(`${date}T${time}`);
    if (Number.isNaN(scheduledStart.getTime())) {
      return NextResponse.json(
        { ok: false, message: "Invalid date/time" },
        { status: 400 }
      );
    }

    const durationMinutes = Number(duration);
    if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) {
      return NextResponse.json(
        { ok: false, message: "Invalid duration" },
        { status: 400 }
      );
    }

    const scheduledEnd = new Date(scheduledStart.getTime() + durationMinutes * 60000);

    // Find the job
    const job = await Job.findOne({ _id: jobId, companyId });
    if (!job) {
      return NextResponse.json(
        { ok: false, message: "Job not found" },
        { status: 404 }
      );
    }

    // Find the applicant
    const applicant = job.applicants.id(applicantId);
    if (!applicant) {
      return NextResponse.json(
        { ok: false, message: "Applicant not found" },
        { status: 404 }
      );
    }

    const mentee = await Mentee.findById(applicant.menteeId).populate({
      path: "user",
      select: "full_name email"
    });

    if (!mentee || !mentee.user) {
      return NextResponse.json(
        { ok: false, message: "Mentee not found" },
        { status: 404 }
      );
    }

    const menteeUser = mentee.user;
    const companyUser = companyProfile.user;

    const meetingLink = `https://meet.jit.si/Minterviewer-Company-${companyId}-${applicantId}-${Date.now().toString().slice(-6)}`;

    const interview = await CompanyInterview.create({
      companyId,
      jobId: job._id,
      applicantId: applicant._id,
      menteeId: applicant.menteeId,
      scheduledStart,
      scheduledEnd,
      duration: durationMinutes,
      status: "scheduled",
      meetingLink,
      notes: notes || "",
    });

    // Update applicant status
    applicant.status = "interview_pending";
    applicant.companyInterviewId = interview._id;
    applicant.interviewStartedAt = scheduledStart;
    applicant.updatedAt = new Date();

    // Add notes if provided
    if (notes) {
      applicant.notes = applicant.notes || [];
      applicant.notes.push({
        content: `Interview scheduled: ${notes}`,
        createdAt: new Date(),
        createdBy: 'company'
      });
    }

    await job.save();

    // Create activity log for mentee
    await Activity.create({
      ownerModel: "Mentee",
      owner: applicant.menteeId,
      type: "info",
      title: `Interview Scheduled for ${job.title}`,
      description: `Your ${type} interview is scheduled for ${date} at ${time}`,
      metadata: {
        interviewId: interview._id,
        type,
        date,
        time,
        meetingLink,
      }
    });

    try {
      await sendNotification({
        userId: menteeUser._id.toString(),
        title: "Interview Scheduled",
        message: `Your interview with ${companyProfile.name || "the company"} for "${job.title}" is scheduled on ${date} at ${time}. Meeting link: ${meetingLink}`,
        type: "job",
        redirectTo: "/mentee?tab=schedule",
      });
    } catch (e) {
      console.error("Failed to send mentee notification:", e);
    }

    try {
      await sendNotification({
        userId: companyUser?._id?.toString() || companyProfile.user?.toString(),
        title: "Interview Scheduled",
        message: `You scheduled an interview with ${menteeUser.full_name || "a candidate"} on ${date} at ${time}.`,
        type: "job",
        redirectTo: "/company?tab=schedule",
      });
    } catch (e) {
      console.error("Failed to send company notification:", e);
    }

    try {
      if (menteeUser.email) {
        await sendBookingConfirmationEmail(
          menteeUser.email,
          menteeUser.full_name || "Mentee",
          `Company Interview: ${job.title}`,
          date,
          time,
          meetingLink,
          "mentee",
          scheduledStart,
          durationMinutes
        );
      }
    } catch (e) {
      console.error("Failed to send mentee email:", e);
    }

    try {
      const companyEmail = companyUser?.email || companyProfile.workEmail;
      const companyName = companyProfile.name || companyUser?.full_name || "Company";

      if (companyEmail) {
        await sendBookingConfirmationEmail(
          companyEmail,
          companyName,
          `Company Interview: ${job.title}`,
          date,
          time,
          meetingLink,
          "mentor",
          scheduledStart,
          durationMinutes
        );
      }
    } catch (e) {
      console.error("Failed to send company email:", e);
    }

    return NextResponse.json({ 
      ok: true, 
      message: "Interview scheduled successfully",
      interview: {
        id: interview._id,
        date,
        time,
        duration,
        type,
        status: "scheduled",
        meetingLink,
      }
    });

  } catch (error) {
    console.error("Error scheduling interview:", error);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}

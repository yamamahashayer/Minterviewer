import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import JobInterview from "@/models/JobInterview";
import Activity from "@/models/Activity";

const unwrapParams = async (ctx) => {
  const p = ctx?.params;
  return p && typeof p.then === "function" ? await p : p;
};

export async function POST(req, ctx) {
  try {
    await connectDB();

    const { companyId, jobId, applicantId } = await unwrapParams(ctx);
    const { date, time, duration, type, notes } = await req.json();

    // Validate required fields
    if (!date || !time || !duration || !type) {
      return NextResponse.json(
        { ok: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

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

    // Create interview record
    const interview = new JobInterview({
      jobId: job._id,
      companyId,
      applicantId: applicant._id,
      menteeId: applicant.menteeId,
      type,
      scheduledDate: new Date(`${date}T${time}`),
      duration,
      status: "scheduled",
      notes: notes || "",
      createdAt: new Date(),
    });

    await interview.save();

    // Update applicant status
    applicant.status = "interview_pending";
    applicant.interviewId = interview._id;
    applicant.interviewStartedAt = new Date(`${date}T${time}`);
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
        time
      }
    });

    return NextResponse.json({ 
      ok: true, 
      message: "Interview scheduled successfully",
      interview: {
        id: interview._id,
        date,
        time,
        duration,
        type,
        status: "scheduled"
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

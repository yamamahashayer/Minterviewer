import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import Mentee from "@/models/Mentee";
import Activity from "@/models/Activity";

const unwrapParams = async (ctx) => {
  const p = ctx?.params;
  return p && typeof p.then === "function" ? await p : p;
};

export async function PATCH(req, ctx) {
  try {
    await connectDB();

    const { companyId, jobId, applicantId } = await unwrapParams(ctx);
    const { status, note } = await req.json();

    // Validate status
    const validStatuses = ["pending", "interview_pending", "interview_completed", "shortlisted", "rejected"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { ok: false, message: "Invalid status" },
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

    // Update status
    const oldStatus = applicant.status;
    applicant.status = status;
    applicant.updatedAt = new Date();

    // Add note if provided
    if (note) {
      applicant.notes = applicant.notes || [];
      applicant.notes.push({
        content: note,
        createdAt: new Date(),
        createdBy: 'company'
      });
    }

    await job.save();

    // Create activity log for mentee
    await Activity.create({
      ownerModel: "Mentee",
      owner: applicant.menteeId,
      type: status === "rejected" ? "warning" : status === "shortlisted" ? "achievement" : "info",
      title: `Application ${status.replace('_', ' ')} for ${job.title}`,
      description: note || `Your application status has been updated to ${status.replace('_', ' ')}`,
    });

    return NextResponse.json({ 
      ok: true, 
      message: "Application status updated successfully",
      oldStatus,
      newStatus: status
    });

  } catch (error) {
    console.error("Error updating application status:", error);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}

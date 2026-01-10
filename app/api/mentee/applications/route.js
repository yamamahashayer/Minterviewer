import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import Mentee from "@/models/Mentee";
import CvAnalysis from "@/models/CvAnalysis";
import JobInterview from "@/models/JobInterview";
import AiInterview from "@/models/AiInterview";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectDB();

    // Get mentee ID from session or authorization header
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      // Try to get from sessionStorage fallback
      const menteeId = req.nextUrl.searchParams.get("menteeId");
      if (!menteeId) {
        return NextResponse.json(
          { ok: false, message: "No authorization token provided" },
          { status: 401 }
        );
      }
    }

    // Get mentee from session
    let menteeId;
    if (token) {
      const sessionRes = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/session`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      const sessionData = await sessionRes.json();
      menteeId = sessionData?.mentee?._id || sessionData?.user?.mentee?._id || sessionData?.user?.menteeId || sessionData?.menteeId;
    } else {
      menteeId = req.nextUrl.searchParams.get("menteeId");
    }

    if (!menteeId) {
      return NextResponse.json(
        { ok: false, message: "Mentee not found" },
        { status: 404 }
      );
    }

    // Find all jobs where this mentee has applied
    const jobs = await Job.find({
      "applicants.menteeId": menteeId,
      status: { $in: ["active", "closed"] }
    })
    .populate("companyId", "name logo industry location website foundedYear description")
    .lean();

    // Extract all related IDs for batch fetching
    const applicantIds = [];
    const analysisIds = [];
    const interviewIds = [];
    
    jobs.forEach(job => {
      const applicant = job.applicants.find(app => app.menteeId.toString() === menteeId.toString());
      if (applicant) {
        applicantIds.push(applicant._id);
        if (applicant.analysisId) analysisIds.push(applicant.analysisId);
        if (applicant.interviewId) interviewIds.push(applicant.interviewId);
      }
    });

    // Batch fetch analyses and interviews
    const analyses = analysisIds.length > 0 ? await CvAnalysis.find({ _id: { $in: analysisIds } }).lean() : [];
    const interviews = interviewIds.length > 0 ? await JobInterview.find({ _id: { $in: interviewIds } }).lean() : [];
    const legacyInterviews = interviewIds.length > 0 ? await AiInterview.find({ _id: { $in: interviewIds } }).lean() : [];
    
    // Create maps for quick lookup
    const analysisMap = new Map(analyses.map(a => [a._id.toString(), a]));
    const interviewMap = new Map([...interviews, ...legacyInterviews].map(i => [i._id.toString(), i]));

    // Extract and format the applications
    const applications = jobs.map(job => {
      const applicant = job.applicants.find(app => app.menteeId.toString() === menteeId.toString());
      const analysis = applicant.analysisId ? analysisMap.get(applicant.analysisId.toString()) : null;
      const interview = applicant.interviewId ? interviewMap.get(applicant.interviewId.toString()) : null;
      
      return {
        _id: applicant._id,
        jobId: job._id,
        jobTitle: job.title,
        jobType: job.type,
        jobLevel: job.level,
        jobLocation: job.location,
        jobStatus: job.status,
        salaryRange: job.salaryRange,
        deadline: job.deadline,
        skills: job.skills,
        company: job.companyId,
        applicationStatus: applicant.status,
        cvScore: analysis?.score ?? null,
        atsScore: analysis?.atsScore ?? null,
        interviewScore: applicant.evaluation?.interviewScore ?? interview?.overallScore ?? null,
        interviewId: applicant.interviewId || null,
        analysisId: applicant.analysisId || null,
        interviewStartedAt: applicant.interviewStartedAt,
        interviewCompletedAt: applicant.interviewCompletedAt,
        appliedAt: applicant.createdAt,
        updatedAt: applicant.updatedAt,
        enableCVAnalysis: job.enableCVAnalysis,
        interviewType: job.interviewType
      };
    });

    // Sort by application date (most recent first)
    applications.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

    return NextResponse.json({ 
      ok: true, 
      applications,
      stats: {
        total: applications.length,
        pending: applications.filter(app => app.applicationStatus === "pending").length,
        interview_pending: applications.filter(app => app.applicationStatus === "interview_pending").length,
        interview_completed: applications.filter(app => app.applicationStatus === "interview_completed").length,
        shortlisted: applications.filter(app => app.applicationStatus === "shortlisted").length,
        rejected: applications.filter(app => app.applicationStatus === "rejected").length
      }
    });

  } catch (error) {
    console.error("Error fetching mentee applications:", error);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}

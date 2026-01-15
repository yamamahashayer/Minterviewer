import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

import Job from "@/models/Job";
import Mentee from "@/models/Mentee";
import CvAnalysis from "@/models/CvAnalysis";
import JobInterview from "@/models/JobInterview";
import AiInterview from "@/models/AiInterview";
import "@/models/User";

export const dynamic = "force-dynamic";

/* ================= UTILS ================= */
const unwrapParams = async (ctx) => {
  const p = ctx?.params;
  return p && typeof p.then === "function" ? await p : p;
};

/* ================= GET ================= */
export async function GET(req, ctx) {
  try {
    console.log("🟡 [APPLICANTS] API HIT");

    await connectDB();
    console.log("🟢 DB connected");

    const { companyId, jobId } = await unwrapParams(ctx);
    console.log("📌 Params:", { companyId, jobId });

    /* ================= FETCH JOB ================= */
    const job = await Job.findOne({ _id: jobId, companyId }).lean();

    if (!job) {
      return NextResponse.json(
        { ok: false, message: "Job not found for this company." },
        { status: 404 }
      );
    }

    /* ================= IDS ================= */
    const menteeIds = job.applicants.map((a) => a.menteeId);
    const analysisIds = job.applicants
      .map((a) => a.analysisId)
      .filter(Boolean);
    const interviewIds = job.applicants
      .map((a) => a.interviewId)
      .filter(Boolean);

    /* ================= MENTEES ================= */
    const mentees = await Mentee.find({ _id: { $in: menteeIds } })
      .populate({
        path: "user",
        select: "full_name email phoneNumber Country",
      })
      .lean();

    const analyses = await CvAnalysis.find({
      _id: { $in: analysisIds },
    }).lean();

    // Fetch interviews by ID (if applicant has interviewId set)
    const interviews = interviewIds.length > 0 
      ? await JobInterview.find({
          _id: { $in: interviewIds }
        }).lean()
      : [];
    
    // ALSO fetch JobInterviews by jobId+menteeId (for applicants without interviewId set)
    const jobInterviewsByMentee = await JobInterview.find({
      jobId: jobId,
      menteeId: { $in: menteeIds }
    }).lean();
    
    // Fallback to AiInterview for older records
    const legacyInterviews = interviewIds.length > 0
      ? await AiInterview.find({
          _id: { $in: interviewIds }
        }).lean()
      : [];

    // Combine all interviews
    const allInterviews = [...interviews, ...jobInterviewsByMentee, ...legacyInterviews];

    /* ================= MAPS ================= */
    const menteeMap = new Map(
      mentees.map((m) => [m._id.toString(), m])
    );

    const analysisMap = new Map(
      analyses.map((a) => [a._id.toString(), a])
    );

    // Create maps: one by _id and one by menteeId for fallback
    const interviewMapById = new Map(
      allInterviews.map((i) => [i._id.toString(), i])
    );
    
    const interviewMapByMentee = new Map();
    allInterviews.forEach((i) => {
      if (i.menteeId) {
        interviewMapByMentee.set(i.menteeId.toString(), i);
      }
    });

    /* ================= RESPONSE ================= */
    const applicants = job.applicants.map((app) => {
      const mentee = menteeMap.get(app.menteeId.toString());
      const analysis = app.analysisId
        ? analysisMap.get(app.analysisId.toString())
        : null;
      
      // Try to find interview by interviewId first, then by menteeId
      let interview = null;
      if (app.interviewId) {
        interview = interviewMapById.get(app.interviewId.toString());
      }
      if (!interview) {
        // Fallback: find by menteeId if interviewId is missing
        interview = interviewMapByMentee.get(app.menteeId.toString());
      }

      console.log(`📊 Applicant ${app.menteeId} - Interview Scores:`, {
        interviewId: app.interviewId,
        found: !!interview,
        overallScore: interview?.overallScore,
        technicalScore: interview?.technicalScore,
        communicationScore: interview?.communicationScore,
        confidenceScore: interview?.confidenceScore,
      });

      return {
        _id: app._id,
        status: app.status,
        createdAt: app.createdAt,

        mentee: mentee
          ? {
            _id: mentee._id,
            full_name: mentee.user?.full_name || "",
            email: mentee.user?.email || "",
            phoneNumber: mentee.user?.phoneNumber || "",
            Country: mentee.user?.Country || "",
            overall_score: mentee.overall_score || 0,
          }
          : null,

        cvScore: analysis?.score ?? null,
        atsScore: analysis?.atsScore ?? null,
        interviewScore: interview?.overallScore ?? null,
        
        // Interview performance metrics
        interviewPerformance: interview ? {
          overallScore: interview.overallScore || null,
          technicalScore: interview.technicalScore || null,
          communicationScore: interview.communicationScore || null,
          confidenceScore: interview.confidenceScore || null,
          strengths: interview.strengths || [],
          improvements: interview.improvements || [],
          feedback: interview.feedback || null,
          duration: interview.duration || null,
          completedAt: interview.completedAt || null,
          status: interview.status || null,
        } : null,

        analysisId: app.analysisId || null,
        interviewId: app.interviewId || null,
      };
    });

    return NextResponse.json({ ok: true, applicants });
  } catch (err) {
    console.error("🔥 Applicants GET Error:", err);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}

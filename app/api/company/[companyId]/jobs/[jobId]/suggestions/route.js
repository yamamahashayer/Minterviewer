import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

import Job from "@/models/Job";
import Mentee from "@/models/Mentee";

/* ================= HELPERS ================= */

const normalize = (s = "") =>
  s.toString().toLowerCase().trim();

function calculateMatch(jobSkills = [], menteeSkills = []) {
  if (!jobSkills.length || !menteeSkills.length) {
    return { score: 0, matched: [] };
  }

  const job = jobSkills.map(normalize);
  const mentee = menteeSkills.map(normalize);

  const matched = job.filter((js) => mentee.includes(js));

  const score = Math.round(
    (matched.length / job.length) * 100
  );

  return { score, matched };
}

/* ================= GET ================= */

export async function GET(req, { params }) {
  try {
    await connectDB();

    // ✅ IMPORTANT FIX
    const { companyId, jobId } = await params;

    /* ================= GET JOB ================= */
    const job = await Job.findOne({
      _id: jobId,
      companyId,
    }).lean();

    if (!job) {
      return NextResponse.json(
        { ok: false, message: "Job not found" },
        { status: 404 }
      );
    }

    const jobSkills = job.skills || [];

    /* ================= GET MENTEES ================= */
    const mentees = await Mentee.find({
      skills: { $exists: true, $ne: [] },
      active: true,
    })
      .populate("user", "full_name Country profile_photo")
      .lean();

    /* ================= BUILD SUGGESTIONS ================= */
    const suggestions = mentees
      .map((mentee) => {
        const menteeSkillNames = (mentee.skills || [])
          .map((s) => s.name)
          .filter(Boolean);

        const { score, matched } = calculateMatch(
          jobSkills,
          menteeSkillNames
        );

        return {
          menteeId: mentee._id,
          userId: mentee.user?._id,

          // ✅ الاسم والمكان الصح
          full_name: mentee.user?.full_name || "Unknown",
          Country: mentee.user?.Country || "Not specified",
          profile_photo: mentee.user?.profile_photo || null,

          skills: menteeSkillNames,
          matchScore: score,
          matchedSkills: matched,
          performanceScore: mentee.overall_score || 0,
        };
      })
      .filter((m) => m.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json({
      ok: true,
      job: {
        _id: job._id,
        title: job.title,
        skills: job.skills,
      },
      suggestions,
    });
  } catch (error) {
    console.error("Suggestions error:", error);
    return NextResponse.json(
      { ok: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

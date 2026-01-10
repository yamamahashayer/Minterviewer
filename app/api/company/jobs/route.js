import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

import "@/models/Company"; 
import Job from "@/models/Job";
import Mentee from "@/models/Mentee";

export async function GET() {
  try {
    await connectDB();

    const jobs = await Job.find({ status: "active" })
      .populate(
        "companyId",
        "name logo industry location website hiringStatus foundedYear description social"
      )
      .sort({ createdAt: -1 })
      .lean();

    // Populate applicants with mentee information
    for (const job of jobs) {
      job.applicantCount = job.applicants?.length || 0;
      
      // If there are applicants, populate their mentee information
      if (job.applicants && job.applicants.length > 0) {
        const menteeIds = job.applicants.map(applicant => applicant.menteeId).filter(Boolean);
        const mentees = await Mentee.find({ _id: { $in: menteeIds } });
        
        const menteeMap = mentees.reduce((map, mentee) => {
          map[mentee._id.toString()] = mentee;
          return map;
        }, {});
        
        job.applicants = job.applicants.map(applicant => ({
          ...applicant,
          mentee: applicant.menteeId ? menteeMap[applicant.menteeId.toString()] : null
        }));
      }
    }

    return NextResponse.json({ ok: true, jobs });

  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { ok: false, message: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

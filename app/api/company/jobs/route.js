import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

import "@/models/Company"; 
import Job from "@/models/Job";

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

    // Count applicants
    jobs.forEach((job) => {
      job.applicantCount = job.applicants?.length || 0;
    });

    return NextResponse.json({ ok: true, jobs });

  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { ok: false, message: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import Company from "@/models/Company";

export async function GET(req) {
  try {
    await connectDB();

    const companyId = req.headers.get("x-company-id");
    if (!companyId) {
      return NextResponse.json(
        { ok: false, message: "Missing company id" },
        { status: 400 }
      );
    }

    const company = await Company.findById(companyId).lean();
    if (!company) {
      return NextResponse.json(
        { ok: false, message: "Company not found" },
        { status: 404 }
      );
    }

    const jobs = await Job.find({ companyId }).lean();

    const totalJobs = jobs.length;
    const totalCandidates = jobs.reduce(
      (sum, j) => sum + (j.applicants?.length || 0),
      0
    );

    return NextResponse.json({
      ok: true,
      overview: {
        name: company.name,
        hiringStatus: company.hiringStatus,
        isVerified: company.isVerified,
        industry: company.industry,
        totalJobs,
        totalCandidates,
        jobs,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

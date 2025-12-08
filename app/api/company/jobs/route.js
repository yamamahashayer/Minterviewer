import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import Company from "@/models/Company";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      companyId,
      title,
      type,
      location,
      level,
      salaryRange,
      description,
      skills,
      deadline,
    } = body;

    // basic validation
    if (!companyId || !title) {
      return NextResponse.json(
        { ok: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // verify company exists
    const companyExists = await Company.findById(companyId);
    if (!companyExists) {
      return NextResponse.json(
        { ok: false, message: "Company not found" },
        { status: 404 }
      );
    }

    const job = await Job.create({
      companyId,
      title,
      type,
      location,
      level,
      salaryRange,
      description,
      skills,
      deadline,
    });

    return NextResponse.json({ ok: true, job }, { status: 201 });
  } catch (err) {
    console.error("Create Job Error:", err);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const jobs = await Job.find().sort({ createdAt: -1 });

    return NextResponse.json({ ok: true, jobs });
  } catch (err) {
    console.error("Get Jobs Error:", err);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}

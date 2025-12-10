import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import Company from "@/models/Company";

const unwrapParams = async (ctx) => {
  const p = ctx?.params;
  return p && typeof p.then === "function" ? await p : p;
};

export async function GET(req, ctx) {
  try {
    await connectDB();

    // 🔥 حل مشكلة params promise
    const p = await unwrapParams(ctx);
    const companyId = p.companyId;

    const jobs = await Job.find({ companyId }).sort({ createdAt: -1 });

    return NextResponse.json({ ok: true, jobs });
  } catch (err) {
    console.error("Get Jobs Error:", err);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(req, ctx) {
  try {
    await connectDB();

    // 🔥 حل مشكلة params promise
    const p = await unwrapParams(ctx);
    const companyId = p.companyId;

    const body = await req.json();
    const {
      title,
      type,
      location,
      level,
      salaryRange,
      description,
      skills,
      deadline,
    } = body;

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

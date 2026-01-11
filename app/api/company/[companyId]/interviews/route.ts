import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import connectDB from "@/lib/mongodb";
import { getUserFromToken } from "@/lib/auth-helper";

import Company from "@/models/Company";
import CompanyInterview from "@/models/CompanyInterview";

export const dynamic = "force-dynamic";

async function unwrapParams(ctx: any) {
  const p = ctx?.params;
  return p && typeof p.then === "function" ? await p : p;
}

export async function GET(req: NextRequest, ctx: any) {
  try {
    await connectDB();

    const authData = await getUserFromToken(req);
    if (!authData || authData.role !== "company") {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const { companyId } = await unwrapParams(ctx);
    if (!mongoose.isValidObjectId(companyId)) {
      return NextResponse.json({ ok: false, message: "Invalid companyId" }, { status: 400 });
    }

    const companyProfile = await Company.findOne({ user: authData.id }).select("_id");
    if (!companyProfile || companyProfile._id.toString() !== companyId) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const query: any = { companyId };
    if (status) query.status = status;

    const interviews = await CompanyInterview.find(query)
      .populate({ path: "jobId", select: "title" })
      .populate({
        path: "menteeId",
        populate: { path: "user", select: "full_name email profile_photo" },
      })
      .sort({ scheduledStart: 1 })
      .lean();

    const formatted = interviews.map((i: any) => ({
      id: i._id,
      jobId: i.jobId?._id || null,
      jobTitle: i.jobId?.title || "Job Interview",
      applicantId: i.applicantId,
      menteeId: i.menteeId?._id || i.menteeId,
      mentee: {
        id: i.menteeId?._id || i.menteeId,
        full_name: i.menteeId?.user?.full_name || "",
        email: i.menteeId?.user?.email || "",
        profile_photo: i.menteeId?.user?.profile_photo || "",
      },
      scheduledStart: i.scheduledStart,
      scheduledEnd: i.scheduledEnd,
      duration: i.duration,
      status: i.status,
      meetingLink: i.meetingLink || null,
      notes: i.notes || "",
      createdAt: i.createdAt,
    }));

    return NextResponse.json({ ok: true, interviews: formatted });
  } catch (error: any) {
    console.error("Error fetching company interviews:", error);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}

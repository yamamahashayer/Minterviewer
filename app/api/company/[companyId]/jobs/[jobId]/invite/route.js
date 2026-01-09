import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

import Job from "@/models/Job";
import Mentee from "@/models/Mentee";
import Invite from "@/models/Invite";
import Company from "@/models/Company";

import { sendNotification } from "@/lib/sendNotification";

/* ================= HELPERS ================= */

const unwrapParams = async (ctx) => {
  const p = ctx?.params;
  return p && typeof p.then === "function" ? await p : p;
};

const normalizeUserId = (user) => {
  if (!user) return null;
  if (typeof user === "string") return user;
  if (user._id) return user._id.toString();
  return user.toString();
};

/* ================= POST ================= */

export async function POST(req, ctx) {
  try {
    await connectDB();

    /* ===== unwrap params ===== */
    const p = await unwrapParams(ctx);
    const { companyId, jobId } = p;

    /* ===== safe body parsing ===== */
    let body = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const { menteeId } = body;

    if (!menteeId) {
      return NextResponse.json(
        { ok: false, message: "menteeId is required" },
        { status: 400 }
      );
    }

    /* ===== job ===== */
    const job = await Job.findOne({ _id: jobId, companyId }).lean();
    if (!job) {
      return NextResponse.json(
        { ok: false, message: "Job not found" },
        { status: 404 }
      );
    }

    /* ===== mentee ===== */
    const mentee = await Mentee.findById(menteeId).populate("user").lean();
    if (!mentee) {
      return NextResponse.json(
        { ok: false, message: "Mentee not found" },
        { status: 404 }
      );
    }

    /* ===== company ===== */
    const company = await Company.findById(companyId).lean();
    const companyName = company?.name || "A Company";

    /* ===== prevent duplicate invite ===== */
    const existingInvite = await Invite.findOne({
      jobId,
      menteeId,
      companyId,
    }).lean();

    if (existingInvite) {
      return NextResponse.json(
        { ok: false, message: "Invite already sent" },
        { status: 409 }
      );
    }

    /* ===== create invite ===== */
    const invite = await Invite.create({
      jobId,
      menteeId,
      companyId,
      status: "pending",
      createdAt: new Date(),
    });

    /* ===== notification ===== */
    const userId = normalizeUserId(mentee.user);

    if (userId) {
      const result = await sendNotification({
        userId,
        title: "Job Invitation",
        message: `${companyName} invited you to apply for "${job.title}"`,
        type: "job",
        redirectTo: "/mentee?tab=explore-jobs",
      });

      if (!result?.ok) {
        console.error("Notification failed:", result?.error);
      }
    }

    return NextResponse.json({
      ok: true,
      message: "Invite sent successfully",
      invite: {
        _id: invite._id,
        jobId,
        menteeId,
        status: invite.status,
        createdAt: invite.createdAt,
      },
    });
  } catch (err) {
    console.error("Invite error:", err);
    return NextResponse.json(
      { ok: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

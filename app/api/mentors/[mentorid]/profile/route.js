// app/api/mentors/[mentorId]/profile/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";

import User from "@/models/User";
import Mentor from "@/models/Mentor";
import Background from "@/models/Background";
import MentorFeedback from "@/models/MentorFeedback";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

/* ----------------------- helpers ----------------------- */
async function resolveParams(ctx) {
  const p = ctx?.params;
  return p && typeof p.then === "function" ? await p : p;
}

const isObjectId = (id) => /^[a-fA-F0-9]{24}$/.test(String(id ?? "").trim());

const cleanUser = (u) => {
  if (!u) return u;
  const { password_hash, resetPasswordToken, resetPasswordExpires, ...rest } =
    u;
  return rest;
};

async function safeFindOneAndUpdate(Model, filter, update, options) {
  try {
    if (!update || (update.$set && Object.keys(update.$set).length === 0)) {
      return await Model.findOne(filter).lean();
    }
    return await Model.findOneAndUpdate(filter, update, {
      new: true,
      runValidators: true,
      ...options,
    }).lean();
  } catch (err) {
    console.warn(`[safeUpdate ${Model.modelName}]`, err?.message);
    return await Model.findOne(filter).lean();
  }
}

/* ========================= GET PROFILE ========================= */

export async function GET(req, ctx) {
  try {
    const p = (await resolveParams(ctx)) ?? {};
    const mentorId = String(p.mentorId ?? p.mentorid ?? p.id ?? "").trim();

    if (!isObjectId(mentorId)) {
      return NextResponse.json(
        { ok: false, message: "Invalid mentorId", received: mentorId },
        { status: 400 }
      );
    }

    await connectDB();
    const _mentorId = new mongoose.Types.ObjectId(mentorId);

    /* -------- Mentor Document -------- */
    const mentor = await Mentor.findById(_mentorId).populate("user").lean();

    if (!mentor) {
      return NextResponse.json(
        { ok: false, message: "Mentor not found" },
        { status: 404 }
      );
    }

    /* -------- Background (Work + Education) -------- */
    const background = await Background.find({
      owner: mentorId,
      ownerModel: "Mentor",
    })
      .sort({ start_date: -1 })
      .lean();

    /* -------- Reviews -------- */
    const reviews = await MentorFeedback.find({
      mentor: mentorId,
    })
      .populate("mentee")
      .populate("session")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        ok: true,
        mentor,
        user: cleanUser(mentor.user),
        background,
        reviews,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET mentor profile error:", err);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}

/* ========================= UPDATE PROFILE ========================= */

export async function PUT(req, ctx) {
  try {
    const p = (await resolveParams(ctx)) ?? {};
    const mentorId = String(p.mentorId ?? p.mentorid ?? p.id ?? "").trim();

    if (!isObjectId(mentorId)) {
      return NextResponse.json(
        { ok: false, message: "Invalid mentorId", received: mentorId },
        { status: 400 }
      );
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { ok: false, message: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const payload = body?.profile ?? body ?? {};
    const has = (k) => Object.prototype.hasOwnProperty.call(payload, k);

    /* -------- USER Updates -------- */
    const userSet = {};
    if (has("full_name"))
      userSet.full_name = String(payload.full_name ?? "").trim();

    if (has("phone")) userSet.phoneNumber = String(payload.phone ?? "").trim();

    if (has("location"))
      userSet.Country = String(payload.location ?? "").trim();

    if (has("linkedin"))
      userSet.linkedin_url = String(payload.linkedin ?? "").trim();

    if (has("bio")) userSet.short_bio = String(payload.bio ?? "").trim();

    /* -------- MENTOR Updates -------- */
    const mentorSet = {};

    if (has("title")) mentorSet.title = String(payload.title ?? "").trim();

    if (has("yearsOfExperience"))
      mentorSet.yearsOfExperience = Number(payload.yearsOfExperience ?? 0);

    if (has("tags"))
      mentorSet.tags = Array.isArray(payload.tags) ? payload.tags : [];

    if (has("languages"))
      mentorSet.languages = Array.isArray(payload.languages)
        ? payload.languages
        : [];

    if (has("industries"))
      mentorSet.industries = Array.isArray(payload.industries)
        ? payload.industries
        : [];

    if (has("social")) mentorSet.social = payload.social;

    if (has("expertise")) mentorSet.expertise = payload.expertise;

    if (has("certifications"))
      mentorSet.certifications = payload.certifications;

    if (has("sessionTypes")) mentorSet.sessionTypes = payload.sessionTypes;

    if (has("availability")) mentorSet.availability = payload.availability;

    if (has("achievements")) mentorSet.achievements = payload.achievements;

    if (
      Object.keys(userSet).length === 0 &&
      Object.keys(mentorSet).length === 0
    ) {
      return NextResponse.json(
        { ok: false, message: "Nothing to update" },
        { status: 400 }
      );
    }

    await connectDB();
    const _mentorId = new mongoose.Types.ObjectId(mentorId);

    /* ------------------ Update Mentor ------------------ */
    const mentorDoc = await Mentor.findById(_mentorId).lean();
    if (!mentorDoc) {
      return NextResponse.json(
        { ok: false, message: "Mentor not found" },
        { status: 404 }
      );
    }

    const updatedMentor = await safeFindOneAndUpdate(
      Mentor,
      { _id: _mentorId },
      { $set: mentorSet }
    );

    /* ------------------ Update User ------------------ */
    let updatedUser = null;

    if (mentorDoc.user && Object.keys(userSet).length > 0) {
      updatedUser = await safeFindOneAndUpdate(
        User,
        { _id: mentorDoc.user },
        { $set: userSet }
      );
    }

    /* -------- fresh data -------- */
    const freshMentor =
      updatedMentor ??
      (await Mentor.findById(_mentorId).populate("user").lean());

    const freshUser =
      updatedUser ?? (await User.findById(mentorDoc.user).lean());

    return NextResponse.json(
      {
        ok: true,
        mentor: freshMentor,
        user: cleanUser(freshUser),
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("PUT mentor profile error:", err);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}

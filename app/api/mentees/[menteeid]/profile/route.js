// app/api/mentees/[menteeId]/profile/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Mentee from "@/models/Mentee";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

/* ----------------------- helpers ----------------------- */
async function resolveParams(ctx) {
  const p = ctx?.params;
  return p && typeof p.then === "function" ? await p : p;
}
const isObjectId = (id) => /^[a-fA-F0-9]{24}$/.test(String(id ?? "").trim());
const clean = (u) => {
  if (!u) return u;
  const { password_hash, ...rest } = u;
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
  } catch (e) {
    console.warn(`[safeUpdate ${Model.modelName}]`, e?.message);
    return await Model.findOne(filter).lean();
  }
}

/* ================= GET /api/mentees/[menteeId]/profile ================= */
export async function GET(req, ctx) {
  try {
    const url = new URL(req.url);
    const debug = url.searchParams.get("debug") === "1";

    const p = (await resolveParams(ctx)) ?? {};
    const menteeId = String(p.menteeId ?? p.menteeid ?? p.id ?? "").trim();

    if (!isObjectId(menteeId)) {
      return NextResponse.json(
        {
          message: "Invalid menteeId",
          received: menteeId,
          ...(debug && { params: p }),
        },
        { status: 400 }
      );
    }

    await connectDB();
    const _menteeId = new mongoose.Types.ObjectId(menteeId);

    const mentee = await Mentee.findById(_menteeId).lean();
    if (!mentee) {
      return NextResponse.json(
        { message: "Mentee not found" },
        { status: 404 }
      );
    }

    const user = mentee.user
      ? await User.findById(mentee.user).select("-password_hash").lean()
      : null;

    return NextResponse.json({ user: clean(user), mentee }, { status: 200 });
  } catch (err) {
    console.error("GET mentee profile error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

/* ================= PUT /api/mentees/[menteeId]/profile ================= */
export async function PUT(req, ctx) {
  try {
    const url = new URL(req.url);
    const debug = url.searchParams.get("debug") === "1";

    const p0 = (await resolveParams(ctx)) ?? {};
    const menteeId = String(p0.menteeId ?? p0.menteeid ?? p0.id ?? "").trim();

    if (!isObjectId(menteeId)) {
      return NextResponse.json(
        {
          message: "Invalid menteeId",
          received: menteeId,
          ...(debug && { params: p0 }),
        },
        { status: 400 }
      );
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { message: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const payload =
      body && typeof body === "object" ? body.profile ?? body : {};
    const has = (k) => Object.prototype.hasOwnProperty.call(payload, k);

    /* -------- USER updates -------- */
    const userSet = {};
    if (has("name")) userSet.full_name = String(payload.name ?? "").trim();
    if (has("phone")) userSet.phoneNumber = String(payload.phone ?? "").trim();
    if (has("location"))
      userSet.Country = String(payload.location ?? "").trim();
    if (has("expertise"))
      userSet.area_of_expertise = String(payload.expertise ?? "").trim();
    if (has("bio")) userSet.short_bio = String(payload.bio ?? "").trim();

    /* -------- MENTEE updates -------- */
    const menteeSet = {};
    if (has("phone")) menteeSet.phone = String(payload.phone ?? "").trim();
    if (has("location"))
      menteeSet.location = String(payload.location ?? "").trim();
    if (has("name")) menteeSet.name = String(payload.name ?? "").trim();
    if (has("expertise"))
      menteeSet.expertise = String(payload.expertise ?? "").trim();

    if (
      Object.keys(userSet).length === 0 &&
      Object.keys(menteeSet).length === 0
    ) {
      return NextResponse.json(
        { message: "Nothing to update" },
        { status: 400 }
      );
    }

    await connectDB();
    const _menteeId = new mongoose.Types.ObjectId(menteeId);

    const menteeDoc = await Mentee.findById(_menteeId).lean();
    if (!menteeDoc) {
      return NextResponse.json(
        { message: "Mentee not found" },
        { status: 404 }
      );
    }

    const menteeUpd = await safeFindOneAndUpdate(
      Mentee,
      { _id: _menteeId },
      { $set: menteeSet }
    );

    let userUpd = null;
    if (menteeDoc.user && Object.keys(userSet).length > 0) {
      userUpd = await safeFindOneAndUpdate(
        User,
        { _id: menteeDoc.user },
        { $set: userSet }
      );
    }

    const freshMentee = menteeUpd ?? (await Mentee.findById(_menteeId).lean());
    const freshUser =
      userUpd ??
      (menteeDoc.user
        ? await User.findById(menteeDoc.user).select("-password_hash").lean()
        : null);

    return NextResponse.json(
      { user: clean(freshUser), mentee: freshMentee ?? null },
      { status: 200 }
    );
  } catch (err) {
    if (err?.code === 11000 && err?.keyPattern?.email) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 409 }
      );
    }
    console.error("PUT mentee profile error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

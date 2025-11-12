import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Mentee from "@/models/Mentee";
import bcrypt from "bcryptjs";

/* ----------------------- Helpers ----------------------- */
async function resolveParams(ctx: any) {
  const p = ctx?.params;
  return p && typeof p.then === "function" ? await p : p;
}

const isObjectId = (id?: string) => /^[a-fA-F0-9]{24}$/.test(String(id ?? "").trim());

const clean = (u: any) => {
  if (!u) return u;
  const { password_hash, ...rest } = u;
  return rest;
};

async function safeFindOneAndUpdate(Model: any, filter: any, update: any, options?: any) {
  try {
    if (!update || (update.$set && Object.keys(update.$set).length === 0)) {
      return await Model.findOne(filter).lean();
    }
    return await Model.findOneAndUpdate(filter, update, {
      new: true,
      runValidators: true,
      ...options,
    }).lean();
  } catch (e: any) {
    console.warn(`[safeUpdate ${Model.modelName}]`, e?.message);
    return await Model.findOne(filter).lean();
  }
}

/* ======================== GET ======================== */
export async function GET(req: Request, ctx: any) {
  try {
    const url = new URL(req.url);
    const debug = url.searchParams.get("debug") === "1";

    const p = (await resolveParams(ctx)) ?? {};
    const menteeId = String(p.menteeId ?? p.menteeid ?? p.id ?? "").trim();

    if (!isObjectId(menteeId)) {
      return NextResponse.json(
        { message: "Invalid menteeId", received: menteeId, ...(debug && { params: p }) },
        { status: 400 }
      );
    }

    await connectDB();
    const _menteeId = new mongoose.Types.ObjectId(menteeId);
    const mentee = await Mentee.findById(_menteeId).populate("user").lean();

    if (!mentee) {
      return NextResponse.json({ message: "Mentee not found" }, { status: 404 });
    }

    const user = mentee.user || {};

    return NextResponse.json(
      {
        ok: true,
        user: {
          name: user.full_name ?? "",
          email: user.email ?? "",
          phone: user.phoneNumber ?? "",
          location: mentee.location ?? user.Country ?? user.location ?? "",
          bio:
            user.short_bio ??
            user.bio ??
            user.description ??
            user.about ??
            user.about_me ??
            "",
        },
        preferences: mentee.preferences ?? {
          theme: "dark",
          language: "en",
          timezone: "UTC+0",
          dateFormat: "MM/DD/YYYY",
        },
        notifications: mentee.notifications ?? {
          emailNotifications: true,
          practiceReminders: true,
          achievementAlerts: true,
          weeklyReport: true,
          messageNotifications: true,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ GET mentee settings error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

/* ======================== PUT ======================== */
export async function PUT(req: Request, ctx: any) {
  try {
    const url = new URL(req.url);
    const debug = url.searchParams.get("debug") === "1";

    const p = (await resolveParams(ctx)) ?? {};
    const menteeId = String(p.menteeId ?? p.menteeid ?? p.id ?? "").trim();

    if (!isObjectId(menteeId)) {
      return NextResponse.json(
        { message: "Invalid menteeId", received: menteeId, ...(debug && { params: p }) },
        { status: 400 }
      );
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
    }

    await connectDB();

    /* 🟣 1️⃣: Password Change Logic */
    if (body.currentPassword && body.newPassword) {
      const _menteeId = new mongoose.Types.ObjectId(menteeId);
      const mentee = await Mentee.findById(_menteeId).populate("user");

      if (!mentee || !mentee.user) {
        return NextResponse.json({ ok: false, message: "User not found" }, { status: 404 });
      }

      const match = await bcrypt.compare(body.currentPassword, mentee.user.password_hash);
      if (!match) {
        return NextResponse.json(
          { ok: false, message: "Incorrect current password" },
          { status: 401 }
        );
      }

      const hashed = await bcrypt.hash(body.newPassword, 10);
      mentee.user.password_hash = hashed;
      await mentee.user.save();

      console.log(`✅ Password updated for user: ${mentee.user._id}`);

      return NextResponse.json(
        { ok: true, message: "Password updated successfully ✅" },
        { status: 200 }
      );
    }

    /* 🟣 2️⃣: Account / Preferences / Notifications Update Logic */
    const _menteeId = new mongoose.Types.ObjectId(menteeId);
    const menteeDoc = await Mentee.findById(_menteeId).lean();

    if (!menteeDoc) {
      return NextResponse.json({ message: "Mentee not found" }, { status: 404 });
    }

    const userSet: any = {};
    const menteeSet: any = {};

    if (body.user) {
      const u = body.user;
      if (u.name) userSet.full_name = u.name.trim();
      if (u.email) userSet.email = u.email.trim();
      if (u.phone) userSet.phoneNumber = u.phone.trim();
      if (u.bio) userSet.short_bio = u.bio.trim();
      if (u.location) menteeSet.location = u.location.trim();
    }

    if (body.preferences) menteeSet.preferences = body.preferences;
    if (body.notifications) menteeSet.notifications = body.notifications;

    const menteeUpd = await safeFindOneAndUpdate(Mentee, { _id: _menteeId }, { $set: menteeSet });

    let userUpd = null;
    if (menteeDoc.user && Object.keys(userSet).length > 0) {
      userUpd = await safeFindOneAndUpdate(User, { _id: menteeDoc.user }, { $set: userSet });
    }

    const freshMentee = menteeUpd ?? (await Mentee.findById(_menteeId).lean());
    const freshUser =
      userUpd ??
      (menteeDoc.user
        ? await User.findById(menteeDoc.user).select("-password_hash").lean()
        : null);

    return NextResponse.json(
      { ok: true, user: clean(freshUser), mentee: freshMentee ?? null },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ PUT mentee settings error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

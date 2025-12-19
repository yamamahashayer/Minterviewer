import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Mentee from "@/models/Mentee";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const isObjectId = (id?: string) => /^[a-fA-F0-9]{24}$/.test(String(id ?? "").trim());
/* ======================== GET /api/mentees/[menteeid] ======================== */
export async function GET(req: Request, ctx: any) {
  try {
    const p = (await ctx?.params) ?? {};
    const menteeId = String(p.menteeId ?? p.menteeid ?? p.id ?? "").trim();

    if (!isObjectId(menteeId)) {
      return NextResponse.json(
        { ok: false, message: "Invalid menteeId" },
        { status: 400 }
      );
    }

    await connectDB();

    const mentee = await Mentee.findById(menteeId)
      .populate({
        path: "user",
        select: "full_name Country profile_photo short_bio",
      })
      .lean();

    if (!mentee) {
      return NextResponse.json(
        { ok: false, message: "Mentee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      profile: {
        name: mentee.user?.full_name,
        title: "Mentee",
        bio: mentee.user?.short_bio,
        location: mentee.user?.Country,
        profile_photo: mentee.user?.profile_photo,
        active: mentee.active,
      },
      skills: mentee.skills ?? [],
      stats: {
        interviews: mentee.total_interviews,
        score: mentee.overall_score,
        points: mentee.points_earned,
      },
      joinedDate: mentee.joined_date,
    });
  } catch (err) {
    console.error("❌ GET mentee error:", err);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}


/* ======================== DELETE /api/mentees/[menteeid] ======================== */
export async function DELETE(req: Request, ctx: any) {
  try {
    const p = (await ctx?.params) ?? {};
    const menteeId = String(p.menteeId ?? p.menteeid ?? p.id ?? "").trim();

    if (!isObjectId(menteeId)) {
      return NextResponse.json({ ok: false, message: "Invalid menteeId" }, { status: 400 });
    }

    await connectDB();
    const _id = new mongoose.Types.ObjectId(menteeId);

    const mentee = await Mentee.findById(_id).populate("user");
    if (!mentee) {
      return NextResponse.json({ ok: false, message: "Mentee not found" }, { status: 404 });
    }

    if (mentee.user) {
      await User.deleteOne({ _id: mentee.user._id });
    }
    await Mentee.deleteOne({ _id });

    console.log(`🗑 Deleted mentee ${menteeId} and linked user`);

    const response = NextResponse.json({
      ok: true,
      message: "Account deleted successfully",
    });
    response.cookies.set("token", "", { maxAge: 0, path: "/" });

    return response;
  } catch (err) {
    console.error("❌ DELETE mentee error:", err);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}

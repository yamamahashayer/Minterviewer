import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Mentee from "@/models/Mentee";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

const isObjectId = (id) => /^[a-fA-F0-9]{24}$/.test(String(id ?? "").trim());

export async function GET(req, ctx) {
  const { uid } = await ctx.params;   // <-- المهم

  const url = new URL(req.url);
  const debug = url.searchParams.get("debug") === "1";

  try {
    if (!isObjectId(uid)) {
      return NextResponse.json({ message: "Invalid userId", uid }, { status: 400 });
    }

    await connectDB();

    const mentee = await Mentee.findOne({
      user: new mongoose.Types.ObjectId(uid),
    }).lean();

    if (!mentee) {
      return NextResponse.json({ message: "Mentee not found for this user", uid }, { status: 404 });
    }

    return NextResponse.json({ mentee }, { status: 200 });
  } catch (err) {
    const payload = {
      message: "Server error",
      ...(debug && {
        errorName: err?.name,
        errorMessage: err?.message,
        stack: err?.stack,
      }),
    };
    console.error("GET /api/mentees/by-user/[uid] error:", err);
    return NextResponse.json(payload, { status: 500 });
  }
}

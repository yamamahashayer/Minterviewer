import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose, { isValidObjectId } from "mongoose";
import dbConnect from "@/lib/mongodb";

import Mentee from "@/models/Mentee";
import Mentor from "@/models/Mentor";
import Company from "@/models/Company"; // ✨ مضافة هون
import User from "@/models/User";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

type TokenPayload = JwtPayload & {
  id?: string;
  _id?: string;
  email?: string;
  full_name?: string;
  role?: string;
};

export async function GET(req: Request) {
  try {
    await dbConnect();

    /* ========================= Token ========================= */
    let token: string | null = null;
    const auth = req.headers.get("authorization") || "";
    if (auth.startsWith("Bearer ")) token = auth.slice(7);

    if (!token) {
      return NextResponse.json({
        ok: true,
        token: null,
        user: null,
        mentee: null,
        mentor: null,
        company: null, // ✨ added
      });
    }

    /* ========================= Verify JWT ========================= */
    const secret = process.env.JWT_SECRET!;
    let payload: TokenPayload;

    try {
      payload = jwt.verify(token, secret) as TokenPayload;
    } catch (e: any) {
      return NextResponse.json(
        { ok: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    /* ========================= User ========================= */
    const userId = String(payload.id || payload._id || "");
    if (!isValidObjectId(userId)) {
      return NextResponse.json(
        { ok: false, message: "Invalid token payload" },
        { status: 401 }
      );
    }

    const userObjId = new mongoose.Types.ObjectId(userId);

    const user = await User.findById(userObjId)
      .select(`
        full_name email phoneNumber Country linkedin_url github 
        profile_photo role short_bio area_of_expertise
      `)
      .lean();

    /* ========================= Mentee ========================= */
    const mentee = await Mentee.findOne({ user: userObjId })
      .select("_id")
      .lean();

    /* ========================= Mentor ========================= */
    const mentor = await Mentor.findOne({ user: userObjId })
      .select(`
        _id yearsOfExperience hourlyRate focusAreas availabilityType 
        languages sessionTypes certifications achievements rating 
        reviewsCount sessionsCount menteesCount
      `)
      .lean();

    /* ========================= Company ========================= */
    const company = await Company.findOne({ user: userObjId }) // ✨ المهم
      .select(`
        _id name logo workEmail industry website location 
        isVerified hiringStatus
      `)
      .lean();

    /* ========================= Response ========================= */
    return NextResponse.json({
      ok: true,
      token,
      user,
      mentee,
      mentor,
      company, // ✨ رجّعنا الشركة
    });
  } catch (err: any) {
    console.error("⚠ session error:", err);
    return NextResponse.json(
      { ok: false, message: err?.message || "Server error" },
      { status: 500 }
    );
  }
}

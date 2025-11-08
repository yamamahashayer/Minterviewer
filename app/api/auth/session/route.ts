import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose, { Types, isValidObjectId } from "mongoose";
import dbConnect from "@/lib/mongodb";
import Mentee from "@/models/Mentee";
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

    // ===== Extract Bearer token =====
    const auth = req.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) {
      return NextResponse.json({ ok: false, message: "Missing Bearer token" }, { status: 401 });
    }

    // ===== Verify JWT =====
    const secret = process.env.JWT_SECRET as string;
    let payload: TokenPayload;
    try {
      payload = jwt.verify(token, secret) as TokenPayload;
    } catch (e: any) {
      const name = e?.name || "";
      const msg =
        name === "TokenExpiredError"
          ? "Token expired"
          : name === "JsonWebTokenError"
          ? "Invalid token"
          : "Unauthorized";
      return NextResponse.json({ ok: false, message: msg }, { status: 401 });
    }

    // ===== Resolve userId from token payload =====
    const userId = String(payload.id || payload._id || "");
    if (!isValidObjectId(userId)) {
      return NextResponse.json({ ok: false, message: "Invalid token payload" }, { status: 401 });
    }
    const userObjId = new mongoose.Types.ObjectId(userId);

    // ===== Fetch user data =====
    const u = await User.findById(userObjId)
      .select("full_name email phoneNumber Country linkedin_url profile_photo role")
      .lean();

    // ===== Fetch mentee linked to this user =====
    const mentee = await Mentee.findOne({ user: userObjId }).select("_id").lean();
    const menteeId = mentee?._id?.toString() || null;

    // ===== Response =====
    return NextResponse.json({
      ok: true,
      menteeId,
      user: {
        id: userId,
        menteeId: menteeId ?? null, // ✅ تأكيد وجود المفتاح دائمًا
        role: u?.role ?? payload.role ?? null,
        full_name: u?.full_name ?? payload.full_name ?? null,
        email: u?.email ?? payload.email ?? null,
        phoneNumber: u?.phoneNumber ?? null,
        Country: u?.Country ?? null,
        linkedin_url: u?.linkedin_url ?? null,
        profile_photo: u?.profile_photo ?? null,
      },
    });
  } catch (e: any) {
    console.error("⚠️ session error:", e);
    return NextResponse.json({ ok: false, message: e?.message || "Server error" }, { status: 500 });
  }
}

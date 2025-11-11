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

    // ===== Extract token (from header OR cookie) =====
    let token: string | null = null;
    const auth = req.headers.get("authorization") || "";

    if (auth.startsWith("Bearer ")) token = auth.slice(7);
    else {
      // ⬇️ fallback: try to read from cookies (if stored there)
      const cookieHeader = req.headers.get("cookie") || "";
      const match = cookieHeader.match(/token=([^;]+)/);
      if (match) token = match[1];
    }

    // ===== If no token at all, just return anonymous session =====
    if (!token) {
      return NextResponse.json({
        ok: true,
        token: null,
        user: null,
        menteeId: null,
      });
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
      return NextResponse.json({ ok: false, message: msg, token: null }, { status: 401 });
    }

    // ===== Resolve userId =====
    const userId = String(payload.id || payload._id || "");
    if (!isValidObjectId(userId)) {
      return NextResponse.json({ ok: false, message: "Invalid token payload" }, { status: 401 });
    }
    const userObjId = new mongoose.Types.ObjectId(userId);

    // ===== Fetch user + mentee =====
    const u = await User.findById(userObjId)
      .select("full_name email phoneNumber Country linkedin_url profile_photo role")
      .lean();

    const mentee = await Mentee.findOne({ user: userObjId }).select("_id").lean();
    const menteeId = mentee?._id?.toString() || null;

    // ===== Response =====
    return NextResponse.json({
      ok: true,
      token, // ✅ نُعيد التوكن حتى تقدر الواجهة تستخدمه
      menteeId,
      user: {
        id: userId,
        menteeId,
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

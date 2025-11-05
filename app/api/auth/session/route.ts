// app/api/auth/session/route.ts
import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose, { Types, isValidObjectId } from "mongoose";
import dbConnect from "@/lib/mongodb";
import Mentee from "@/models/Mentee";
import User from "@/models/User"; // 👈 أضف هذا

export async function GET(req: Request) {
  try {
    await dbConnect();

    const auth = req.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return NextResponse.json({ ok: false, message: "Missing Bearer token" }, { status: 401 });

    const secret = process.env.JWT_SECRET as string;
    const payload = jwt.verify(token, secret) as JwtPayload & {
      id?: string; _id?: string; email?: string; full_name?: string; role?: string;
    };

    const userId = String(payload.id || payload._id || "");
    if (!isValidObjectId(userId)) {
      return NextResponse.json({ ok: false, message: "Invalid token payload" }, { status: 401 });
    }

    // 👇 اجلب المستخدم من القاعدة لتجهيز الحقول الإضافية
    const u = await User.findById(userId)
      .select("full_name email phoneNumber Country linkedin_url profile_photo role")
      .lean<{
        role?: string;
        full_name?: string;
        email?: string;
        phoneNumber?: string;
        Country?: string;
        linkedin_url?: string;
        profile_photo?: string;
      } | null>();

    const mentee = await Mentee.findOne({ user: userId }).select("_id").lean<{ _id: Types.ObjectId } | null>();
    const menteeId = mentee?._id?.toString() || null;

    return NextResponse.json({
      ok: true,
      user: {
        id: userId,
        role: u?.role ?? payload.role,
        full_name: u?.full_name ?? payload.full_name,
        email: u?.email ?? payload.email,
        menteeId,
        phoneNumber: u?.phoneNumber ?? null,
        Country: u?.Country ?? null,
        linkedin_url: u?.linkedin_url ?? null,
        profile_photo: u?.profile_photo ?? null,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || "Server error" }, { status: 500 });
  }
}

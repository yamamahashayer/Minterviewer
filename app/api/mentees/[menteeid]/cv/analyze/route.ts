import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";
import Mentee from "@/models/Mentee";
import jwt from "jsonwebtoken";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const isObjectId = (id?: string) => !!id && mongoose.Types.ObjectId.isValid(String(id));

export async function POST(req: NextRequest, ctx: any) {
  try {
    await connectDB();

    const params = await ctx?.params;
    const menteeId = params?.menteeId as string | undefined;
    if (!menteeId || !isObjectId(menteeId)) {
      return NextResponse.json({ ok: false, error: "Invalid menteeId" }, { status: 400 });
    }

    const auth = req.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token)
      return NextResponse.json({ ok: false, error: "Missing Bearer token" }, { status: 401 });

    const secret = process.env.JWT_SECRET!;
    let payload: any;
    try {
      payload = jwt.verify(token, secret);
    } catch (err: any) {
      return NextResponse.json({ ok: false, error: "Invalid or expired token" }, { status: 401 });
    }

    const userId = String(payload.id || payload._id);
    if (!isObjectId(userId)) {
      return NextResponse.json({ ok: false, error: "Invalid userId in token" }, { status: 400 });
    }

    // ✅ تحقق من أن هذا المنتي تابع فعلاً لهذا اليوزر
    const mentee = await Mentee.findOne({ _id: menteeId, user: userId }).select("_id");
    if (!mentee) {
      return NextResponse.json(
        { ok: false, error: "Mentee not linked to this user" },
        { status: 403 }
      );
    }

    // 🧾 قراءة body
    const { resumeId } = await req.json();
    if (!resumeId || !isObjectId(resumeId)) {
      return NextResponse.json({ ok: false, error: "Invalid resumeId" }, { status: 400 });
    }

    // 🧠 جلب السيرة الذاتية
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return NextResponse.json({ ok: false, error: "Resume not found" }, { status: 404 });
    }

    // ✨ تحليل بسيط (placeholder للـ AI)
    const fakeAnalysis = {
      score: 85,
      atsScore: 78,
      strengths: ["Well-structured", "Relevant experience"],
      weaknesses: ["Missing summary section"],
      improvements: ["Add measurable achievements", "Include more keywords"],
      redFlags: [],
      recommendedJobTitles: ["Frontend Developer", "UI Engineer"],
      keywordCoverage: { matched: ["React", "JavaScript"], missing: ["TypeScript", "Unit Testing"] },
    };

    console.log("🤖 ANALYZE route hit — mentee:", menteeId, "resume:", resumeId);

    return NextResponse.json({ ok: true, analysis: fakeAnalysis });
  } catch (err: any) {
    console.error("💥 ANALYZE error:", err.message || err);
    return NextResponse.json({ ok: false, error: err.message || "Server error" }, { status: 500 });
  }
}

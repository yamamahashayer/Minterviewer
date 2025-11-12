import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";
import Mentee from "@/models/Mentee";
import CvAnalysisModel from "@/models/CvAnalysis";
import jwt from "jsonwebtoken";

// 🧠 أدوات الذكاء الاصطناعي (Gemini)
import { analyzeWithGemini } from "@/lib/cvAnalysis/gemini";
import { buildCvPrompt } from "@/lib/cvAnalysis/prompt";
import { CvSchema } from "@/lib/cvAnalysis/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const isObjectId = (id?: string) =>
  !!id && mongoose.Types.ObjectId.isValid(String(id));

export async function POST(req: NextRequest, ctx: any) {
  try {
    await connectDB();

    // 🟣 جلب الـ menteeId من المسار
    const { menteeid } = await ctx.params;
    const menteeId = menteeid as string | undefined;

    if (!menteeId || !isObjectId(menteeId)) {
      return NextResponse.json(
        { ok: false, error: "Invalid menteeId" },
        { status: 400 }
      );
    }

    // 🛡️ التحقق من التوكن
    const auth = req.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token)
      return NextResponse.json(
        { ok: false, error: "Missing Bearer token" },
        { status: 401 }
      );

    const secret = process.env.JWT_SECRET!;
    let payload: any;
    try {
      payload = jwt.verify(token, secret);
    } catch (err: any) {
      return NextResponse.json(
        { ok: false, error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const userId = String(payload.id || payload._id);
    if (!isObjectId(userId))
      return NextResponse.json(
        { ok: false, error: "Invalid userId in token" },
        { status: 400 }
      );

    // ✅ تأكيد أن الـ mentee يخص هذا المستخدم
    const mentee = await Mentee.findOne({ _id: menteeId, user: userId }).select(
      "_id"
    );
    if (!mentee)
      return NextResponse.json(
        { ok: false, error: "Mentee not linked to this user" },
        { status: 403 }
      );

    // 🧾 قراءة body
    const { resumeId, affindaJson } = await req.json();
    if (!resumeId || !isObjectId(resumeId))
      return NextResponse.json(
        { ok: false, error: "Invalid resumeId" },
        { status: 400 }
      );

    const resume = await Resume.findById(resumeId);
    if (!resume)
      return NextResponse.json(
        { ok: false, error: "Resume not found" },
        { status: 404 }
      );

    // ⚙️ fallback ذكي — في حال affindaJson فاضي
    let parsedData = affindaJson || resume.parsed || {};
    if (!parsedData || Object.keys(parsedData).length === 0) {
      console.warn("⚠️ affindaJson is empty, using minimal fallback data for analysis.");
      parsedData = {
        name: "Anonymous",
        summary: "No parsed data available.",
        skills: [],
      };
    }

    // 🧠 بناء البرومبت وإرسال الطلب إلى Gemini
    const prompt = buildCvPrompt(parsedData);

    console.log("🚀 Sending CV analysis request to Gemini...");
    let geminiResult;
    try {
      geminiResult = await analyzeWithGemini(parsedData);
    } catch (err: any) {
      // 🧠 في حال السيرفر مشغول
      if (err.message?.includes("overloaded") || err.message?.includes("UNAVAILABLE")) {
        console.warn("⚠️ Gemini AI is currently overloaded. Please retry later.");
        return NextResponse.json(
          { ok: false, error: "Gemini AI is currently busy. Please try again later." },
          { status: 503 }
        );
      }

      throw err;
    }

    console.log("✅ Gemini structured result:", geminiResult);

    // 🧩 تعبئة القيم الناقصة من Gemini قبل التحقق
    const filled = {
      score: geminiResult.score ?? 0,
      atsScore: geminiResult.atsScore ?? 0,
      strengths: geminiResult.strengths ?? [],
      weaknesses: geminiResult.weaknesses ?? [],
      improvements: geminiResult.improvements ?? [],
      redFlags: geminiResult.redFlags ?? [],
      recommendedJobTitles: geminiResult.recommendedJobTitles ?? [],
      keywordCoverage: geminiResult.keywordCoverage ?? { matched: [], missing: [] },
      categories: geminiResult.categories ?? {
        formatting: { title: "Formatting & Structure", score: 0, insights: [] },
        content: { title: "Content Quality", score: 0, insights: [] },
        keywords: { title: "Keywords & ATS", score: 0, insights: [] },
        experience: { title: "Experience & Impact", score: 0, insights: [] },
      },
    };

    // ✅ تحقق من البيانات بـ Zod Schema
    const analysis = CvSchema.parse(filled);

    // 💾 حفظ النتيجة في قاعدة البيانات
    const saved = await CvAnalysisModel.create({
      resume: resume._id,
      mentee: mentee._id,
      ...analysis,
    });

    console.log("📦 Saved CV analysis:", saved._id);

    // 🔍 طباعة الفئات في اللوج لتتأكدي
    if (analysis.categories) {
      console.log("🧱 Categories Breakdown:");
      Object.entries(analysis.categories).forEach(([key, val]: any) => {
        console.log(`  • ${key}: ${val.score}/10 (${val.insights?.length || 0} insights)`);
      });
    }

    // 🟢 إرجاع النتيجة النهائية
    return NextResponse.json({
      ok: true,
      analysis,
      savedId: saved._id,
    });
  } catch (err: any) {
    console.error("💥 ANALYZE error:", err.message || err);
    return NextResponse.json(
      { ok: false, error: err.message || "Server error" },
      { status: 500 }
    );
  }
}

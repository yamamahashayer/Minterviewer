// import { NextRequest, NextResponse } from "next/server";
// import mongoose from "mongoose";
// import jwt from "jsonwebtoken";

// import connectDB from "@/lib/mongodb";
// import Resume from "@/models/Resume";
// import Mentee from "@/models/Mentee";
// import CvAnalysisModel from "@/models/CvAnalysis";

// import { analyzeWithGemini } from "@/lib/cvAnalysis/gemini";
// import { CvSchema } from "@/lib/cvAnalysis/schema";

// export const runtime = "nodejs";
// export const dynamic = "force-dynamic";

// /* ================= Helpers ================= */
// const isObjectId = (id?: string) =>
//   !!id && mongoose.Types.ObjectId.isValid(String(id));

// /* ================= POST ================= */
// export async function POST(req: NextRequest, ctx: any) {
//   try {
//     await connectDB();

//     /* ================= Params ================= */
//     const params = await ctx.params; // ⭐ IMPORTANT
//     const menteeid = params.menteeid as string;

//     if (!menteeid || !isObjectId(menteeid)) {
//       return NextResponse.json(
//         { ok: false, error: "Invalid menteeId" },
//         { status: 400 }
//       );
//     }

//     /* ================= Auth ================= */
//     const auth = req.headers.get("authorization") || "";
//     const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

//     if (!token) {
//       return NextResponse.json(
//         { ok: false, error: "Missing Bearer token" },
//         { status: 401 }
//       );
//     }

//     let payload: any;
//     try {
//       payload = jwt.verify(token, process.env.JWT_SECRET!);
//     } catch {
//       return NextResponse.json(
//         { ok: false, error: "Invalid or expired token" },
//         { status: 401 }
//       );
//     }

//     const userId = String(payload.id || payload._id);
//     if (!isObjectId(userId)) {
//       return NextResponse.json(
//         { ok: false, error: "Invalid userId in token" },
//         { status: 400 }
//       );
//     }

//     /* ================= Ownership ================= */
//     const mentee = await Mentee.findOne({
//       _id: menteeid,
//       user: userId,
//     }).select("_id");

//     if (!mentee) {
//       return NextResponse.json(
//         { ok: false, error: "Mentee not linked to this user" },
//         { status: 403 }
//       );
//     }

//     /* ================= Body ================= */
//     const { resumeId, affindaJson, userNotes } = await req.json();

//     if (!resumeId || !isObjectId(resumeId)) {
//       return NextResponse.json(
//         { ok: false, error: "Invalid resumeId" },
//         { status: 400 }
//       );
//     }

//     const resume = await Resume.findById(resumeId);
//     if (!resume) {
//       return NextResponse.json(
//         { ok: false, error: "Resume not found" },
//         { status: 404 }
//       );
//     }

//     /* ================= Parsed Data ================= */
//     let parsedData = affindaJson || resume.parsed || {};

//     if (!parsedData || Object.keys(parsedData).length === 0) {
//       parsedData = {
//         name: "Anonymous",
//         summary: "No parsed data available.",
//         skills: [],
//       };
//     }

//     /* ================= AI ================= */
//     console.log("🚀 Sending CV analysis request to Gemini...");

//     let geminiResult;
//     try {
//       geminiResult = await analyzeWithGemini(parsedData, {
//         userNotes, // ⭐ HERE
//       });
//     } catch (err: any) {
//       if (
//         err.message?.includes("overloaded") ||
//         err.message?.includes("UNAVAILABLE")
//       ) {
//         return NextResponse.json(
//           { ok: false, error: "AI service is busy. Please try again later." },
//           { status: 503 }
//         );
//       }
//       throw err;
//     }

//     /* ================= Normalize ================= */
//     const filled = {
//       score: geminiResult.score ?? 0,
//       atsScore: geminiResult.atsScore ?? 0,
//       strengths: geminiResult.strengths ?? [],
//       weaknesses: geminiResult.weaknesses ?? [],
//       improvements: geminiResult.improvements ?? [],
//       redFlags: geminiResult.redFlags ?? [],
//       recommendedJobTitles: geminiResult.recommendedJobTitles ?? [],
//       keywordCoverage:
//         geminiResult.keywordCoverage ?? { matched: [], missing: [] },
//       categories:
//         geminiResult.categories ?? {
//           formatting: {
//             title: "Formatting & Structure",
//             score: 0,
//             insights: [],
//           },
//           content: {
//             title: "Content Quality",
//             score: 0,
//             insights: [],
//           },
//           keywords: {
//             title: "Keywords & ATS",
//             score: 0,
//             insights: [],
//           },
//           experience: {
//             title: "Experience & Impact",
//             score: 0,
//             insights: [],
//           },
//         },
//     };

//     const analysis = CvSchema.parse(filled);

//     /* ================= Save ================= */
//     const saved = await CvAnalysisModel.create({
//       resume: resume._id,
//       mentee: mentee._id,
//       userNotes: userNotes || null, // optional
//       ...analysis,
//     });

//     return NextResponse.json({
//       ok: true,
//       analysis,
//       savedId: saved._id,
//     });
//   } catch (err: any) {
//     console.error("💥 ANALYZE error:", err);
//     return NextResponse.json(
//       { ok: false, error: err.message || "Server error" },
//       { status: 500 }
//     );
//   }
// }







import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";
import Mentee from "@/models/Mentee";
import CvAnalysisModel from "@/models/CvAnalysis";
import Activity from "@/models/Activity"; // ✅ ACTIVITY

import { analyzeWithGemini } from "@/lib/cvAnalysis/gemini";
import { CvSchema } from "@/lib/cvAnalysis/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ================= Helpers ================= */
const isObjectId = (id?: string) =>
  !!id && mongoose.Types.ObjectId.isValid(String(id));

/* ================= POST ================= */
export async function POST(req: NextRequest, ctx: any) {
  try {
    await connectDB();

    /* ================= Params ================= */
    const params = await ctx.params; // ⭐ IMPORTANT
    const menteeid = params.menteeid as string;

    if (!menteeid || !isObjectId(menteeid)) {
      return NextResponse.json(
        { ok: false, error: "Invalid menteeId" },
        { status: 400 }
      );
    }

    /* ================= Auth ================= */
    const auth = req.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

    if (!token) {
      return NextResponse.json(
        { ok: false, error: "Missing Bearer token" },
        { status: 401 }
      );
    }

    let payload: any;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json(
        { ok: false, error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const userId = String(payload.id || payload._id);
    if (!isObjectId(userId)) {
      return NextResponse.json(
        { ok: false, error: "Invalid userId in token" },
        { status: 400 }
      );
    }

    /* ================= Ownership ================= */
    const mentee = await Mentee.findOne({
      _id: menteeid,
      user: userId,
    }).select("_id");

    if (!mentee) {
      return NextResponse.json(
        { ok: false, error: "Mentee not linked to this user" },
        { status: 403 }
      );
    }

    /* ================= Body ================= */
    const { resumeId, affindaJson, userNotes } = await req.json();

    if (!resumeId || !isObjectId(resumeId)) {
      return NextResponse.json(
        { ok: false, error: "Invalid resumeId" },
        { status: 400 }
      );
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return NextResponse.json(
        { ok: false, error: "Resume not found" },
        { status: 404 }
      );
    }

    /* ================= Parsed Data ================= */
    let parsedData = affindaJson || resume.parsed || {};

    if (!parsedData || Object.keys(parsedData).length === 0) {
      parsedData = {
        name: "Anonymous",
        summary: "No parsed data available.",
        skills: [],
      };
    }

    /* ================= AI ================= */
    console.log("🚀 Sending CV analysis request to Gemini...");

    let geminiResult;
    try {
      geminiResult = await analyzeWithGemini(parsedData, {
        userNotes, // ⭐ HERE
      });
    } catch (err: any) {
      if (
        err.message?.includes("overloaded") ||
        err.message?.includes("UNAVAILABLE")
      ) {
        return NextResponse.json(
          { ok: false, error: "AI service is busy. Please try again later." },
          { status: 503 }
        );
      }
      throw err;
    }

    /* ================= Normalize ================= */
    const filled = {
      score: geminiResult.score ?? 0,
      atsScore: geminiResult.atsScore ?? 0,
      strengths: geminiResult.strengths ?? [],
      weaknesses: geminiResult.weaknesses ?? [],
      improvements: geminiResult.improvements ?? [],
      redFlags: geminiResult.redFlags ?? [],
      recommendedJobTitles: geminiResult.recommendedJobTitles ?? [],
      keywordCoverage:
        geminiResult.keywordCoverage ?? { matched: [], missing: [] },
      categories:
        geminiResult.categories ?? {
          formatting: {
            title: "Formatting & Structure",
            score: 0,
            insights: [],
          },
          content: {
            title: "Content Quality",
            score: 0,
            insights: [],
          },
          keywords: {
            title: "Keywords & ATS",
            score: 0,
            insights: [],
          },
          experience: {
            title: "Experience & Impact",
            score: 0,
            insights: [],
          },
        },
    };

    const analysis = CvSchema.parse(filled);

    /* ================= Save ================= */
    const saved = await CvAnalysisModel.create({
      resume: resume._id,
      mentee: mentee._id,
      userNotes: userNotes || null,
      ...analysis,
    });

    /* ===== ACTIVITY LOG ===== */
    await Activity.create({
      ownerModel: "Mentee",
      owner: mentee._id,
      type: "practice",
      title: "AI CV analysis completed",
      score: analysis.score,
    });

    return NextResponse.json({
      ok: true,
      analysis,
      savedId: saved._id,
    });
  } catch (err: any) {
    console.error("💥 ANALYZE error:", err);
    return NextResponse.json(
      { ok: false, error: err.message || "Server error" },
      { status: 500 }
    );
  }
}


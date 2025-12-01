import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";

import User from "@/models/User";
import Mentor from "@/models/Mentor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { user: userId } = body;

    /* -------------------- Validate userId -------------------- */
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return NextResponse.json(
        { ok: false, message: "Invalid or missing userId" },
        { status: 400 }
      );
    }

    /* -------------------- Prevent duplicate mentor -------------------- */
    const exists = await Mentor.findOne({ user: userId }).lean();
    if (exists) {
      return NextResponse.json(
        { ok: false, message: "Mentor already exists", mentor: exists },
        { status: 409 }
      );
    }

    /* ============================================================
       CREATE MENTOR (NEW SCHEMA FIELDS)
       ============================================================ */

    const mentor = await Mentor.create({
      user: new mongoose.Types.ObjectId(userId),

      // BASIC
      yearsOfExperience: Number(body.yearsOfExperience || 0),
      hourlyRate: Number(body.hourlyRate || 0),

      // SPECIALIZATION (NEW)
      focusAreas: Array.isArray(body.focusAreas)
        ? body.focusAreas
        : body.focusArea
        ? [body.focusArea]
        : [],

      availabilityType: body.availabilityType || "",

      // LISTS
      languages: Array.isArray(body.languages) ? body.languages : [],
      sessionTypes: Array.isArray(body.sessionTypes) ? body.sessionTypes : [],
      certifications: Array.isArray(body.certifications) ? body.certifications : [],
      achievements: Array.isArray(body.achievements) ? body.achievements : [],

      // SOCIAL (optional)
      social: {
        github: body.github || "",
        linkedin: body.linkedin_url || "",
      },

      // STATS
      rating: 0,
      reviewsCount: 0,
      sessionsCount: 0,
      menteesCount: 0,
      profileCompletion: 0,
    });

    return NextResponse.json({ ok: true, mentor }, { status: 201 });
  } catch (err) {
    console.error("CREATE MENTOR ERROR:", err);
    return NextResponse.json(
      { ok: false, message: "Server Error" },
      { status: 500 }
    );
  }
}

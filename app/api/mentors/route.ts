import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";

import User from "@/models/User";
import Mentor from "@/models/Mentor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const { userId } = body;

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return NextResponse.json(
        { ok: false, message: "Invalid or missing userId" },
        { status: 400 }
      );
    }

    // Check if mentor already exists
    const exists = await Mentor.findOne({ user: userId }).lean();
    if (exists) {
      return NextResponse.json(
        { ok: false, message: "Mentor already exists", mentor: exists },
        { status: 409 }
      );
    }

    const mentor = await Mentor.create({
      user: new mongoose.Types.ObjectId(userId),
      title: body.title || "",
      yearsOfExperience: body.yearsOfExperience || 0,
      tags: body.tags || [],
      languages: body.languages || [],
      industries: body.industries || [],
      expertise: body.expertise || [],
      certifications: body.certifications || [],
      sessionTypes: body.sessionTypes || [],
      social: body.social || {},
      achievements: body.achievements || [],
      availability: body.availability || [],
    });

    return NextResponse.json(
      { ok: true, mentor },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE MENTOR ERROR:", error);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}

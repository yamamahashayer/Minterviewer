import User from "@/models/User";
import Mentor from "@/models/Mentor";
import Mentee from "@/models/Mentee";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { getRedirectForRole } from "@/lib/notifications/roleRedirect";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const {
      full_name,
      email,
      password,
      role,

      // USER FIELDS
      profile_photo,
      linkedin_url,
      github,
      area_of_expertise, // array now
      short_bio,
      phoneNumber,
      Country,

      // MENTOR FIELDS
      yearsOfExperience,
      focusAreas, // array now
      availabilityType,
      languages, // array
    } = await req.json();

    // ============================
    // VALIDATION
    // ============================
    if (!full_name || !email || !password || !role) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["mentor", "mentee"].includes(role)) {
      return NextResponse.json(
        { message: "Invalid role" },
        { status: 400 }
      );
    }

    // Check existing user
    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 400 }
      );
    }

    // ============================
    // CREATE USER
    // ============================
    const password_hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      full_name,
      email,
      password_hash,
      role,
      profile_photo,
      linkedin_url,
      github,
      area_of_expertise: Array.isArray(area_of_expertise)
        ? area_of_expertise
        : [],
      short_bio,
      phoneNumber,
      Country,
    });

    // ============================
    // SEND WELCOME NOTIFICATION
    // ============================
    const origin = new URL(req.url).origin;

    await fetch(`${origin}/api/notifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: newUser._id.toString(),
        title: "🎉 Welcome to Minterviewer!",
        message: `Welcome ${full_name}! Your account has been created successfully.`,
        type: "system",
        redirectTo: getRedirectForRole(role, "overview"),
      }),
    });

    // ============================
    // CREATE MENTOR / MENTEE RECORD
    // ============================
    let roleDoc = null;

    if (role === "mentor") {
      roleDoc = await Mentor.create({
        user: newUser._id,
        yearsOfExperience: yearsOfExperience || 0,
        focusAreas: Array.isArray(focusAreas) ? focusAreas : [],
        availabilityType: availabilityType || "",
        languages: Array.isArray(languages) ? languages : [],
        social: {
          github: github || "",
          linkedin: linkedin_url || "",
        },
      });
    }

    if (role === "mentee") {
      roleDoc = await Mentee.create({
        user: newUser._id,
        overall_score: 0,
        total_interviews: 0,
        points_earned: 0,
        joined_date: new Date(),
        active: true,
      });
    }

    // ============================
    // PROFILE COMPLETION SCORE
    // ============================
    let score = 0;

    // USER fields — 70%
    if (full_name) score += 10;
    if (Country) score += 10;
    if (phoneNumber) score += 10;
    if (profile_photo) score += 10;
    if (linkedin_url) score += 10;
    if (area_of_expertise?.length > 0) score += 10;
    if (short_bio) score += 10;

    // Mentor fields — 30%
    if (role === "mentor") {
      if (yearsOfExperience) score += 10;
      if (focusAreas?.length > 0) score += 10;
      if (languages?.length > 0) score += 10;
    }

    if (score < 100) {
      await fetch(`${origin}/api/notifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: newUser._id.toString(),
          title: "📝 Complete Your Profile",
          message: `Your profile is ${score}% complete. Add more details to improve your recommendations!`,
          type: "system",
          redirectTo: getRedirectForRole(role, "profile"),
        }),
      });
    }

    // ============================
    // RESPONSE
    // ============================
    return NextResponse.json(
      {
        message: `${role === "mentor" ? "Mentor" : "Mentee"} registered successfully!`,
        user: {
          id: newUser._id,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[REGISTER_ERROR]", err);

    return NextResponse.json(
      { message: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

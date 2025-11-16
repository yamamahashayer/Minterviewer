import User from "@/models/User";
import Mentor from "@/models/Mentor";
import Mentee from "@/models/Mentee";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { getRedirectForRole } from "@/lib/notifications/roleRedirect";

export async function POST(req: Request) {
  try {
    const {
      full_name,
      email,
      password,
      role,
      profile_photo,
      linkedin_url,
      area_of_expertise,
      short_bio,
      phoneNumber,
      Country,
      yearsOfExperience,
      field,
      availabilities,
    } = await req.json();

    if (!full_name || !email || !password || !role) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (role !== "mentor" && role !== "mentee") {
      return NextResponse.json(
        { message: "Invalid role" },
        { status: 400 }
      );
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 400 }
      );
    }

    const password_hash = await bcrypt.hash(password, 10);

    const userData = {
      full_name,
      email,
      password_hash,
      role,
      profile_photo,
      linkedin_url,
      area_of_expertise,
      short_bio,
      phoneNumber,
      Country,
    };

    // CREATE USER
    const newUser = await User.create(userData);

    // === ORIGIN (WORKS LOCAL + DEPLOY) ===
    const origin = new URL(req.url).origin;

    // === WELCOME NOTIFICATION ===
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

    // CREATE ROLE DOCS
    let roleDoc = null;

    if (role === "mentor") {
      roleDoc = await Mentor.create({
        user: newUser._id,
        totalEarnings: 0,
        totalSessions: 0,
        totalMentees: 0,
        feedback: [],
        rating: 0,
        yearsOfExperience: yearsOfExperience || 0,
        field: field || area_of_expertise,
        availabilities: availabilities || [],
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

    // === PROFILE COMPLETION SCORE ===
    let score = 0;

    // User fields (70%)
    if (full_name) score += 10;
    if (Country) score += 10;
    if (phoneNumber) score += 10;
    if (profile_photo) score += 10;
    if (linkedin_url) score += 10;
    if (area_of_expertise) score += 10;
    if (short_bio) score += 10;

    // Extra mentee fields (30%)
    if (role === "mentee") {
      if (roleDoc?.skills?.length > 0) score += 30;
    }

    // Extra mentor fields (30%)
    if (role === "mentor") {
      if (roleDoc?.yearsOfExperience) score += 10;
      if (roleDoc?.field) score += 10;
      if (roleDoc?.availabilities?.length > 0) score += 10;
    }

    // SEND PROFILE INCOMPLETE NOTIFICATION
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

    // RETURN RESPONSE
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

    if (err.code === 11000) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

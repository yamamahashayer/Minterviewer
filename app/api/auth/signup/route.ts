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
      area_of_expertise,
      short_bio,
      phoneNumber,
      Country,

      // MENTOR FIELDS
      yearsOfExperience,
      focusArea,
      availabilityType,
      languages,
    } = await req.json();

    if (!full_name || !email || !password || !role)
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );

    if (role !== "mentor" && role !== "mentee")
      return NextResponse.json(
        { message: "Invalid role" },
        { status: 400 }
      );

    // Check existing user
    const exists = await User.findOne({ email });
    if (exists)
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 400 }
      );

    // Create User
    const password_hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      full_name,
      email,
      password_hash,
      role,
      profile_photo,
      linkedin_url,
      github,
      area_of_expertise,
      short_bio,
      phoneNumber,
      Country,
    });

    // Origin
    const origin = new URL(req.url).origin;

    // Welcome Notification
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

    // Create ROLE record
    let roleDoc = null;

    if (role === "mentor") {
      roleDoc = await Mentor.create({
        user: newUser._id,
        yearsOfExperience: yearsOfExperience || 0,
        focusArea: focusArea || "",
        availabilityType: availabilityType || "",
        languages: languages || [],
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

    // Compute Profile Completion Score
    let score = 0;

    // Base USER fields (70%)
    if (full_name) score += 10;
    if (Country) score += 10;
    if (phoneNumber) score += 10;
    if (profile_photo) score += 10;
    if (linkedin_url) score += 10;
    if (area_of_expertise) score += 10;
    if (short_bio) score += 10;

    // Mentor extra (30%)
    if (role === "mentor") {
      if (yearsOfExperience) score += 10;
      if (focusArea) score += 10;
      if (languages?.length > 0) score += 10;
    }

    // Send "Profile incomplete" notification
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
      {
        message: err?.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

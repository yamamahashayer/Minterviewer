import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Mentee from "@/models/Mentee";
import Mentor from "@/models/Mentor"; 

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getRedirectForRole(role: string) {
  switch (role) {
    case "mentee":
      return "/mentee?tab=overview";
    case "mentor":
      return "/mentor?tab=overview";
    case "admin":
      return "/admin";
    default:
      return "/";
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { message: "Missing email or password" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const secret = process.env.JWT_SECRET!;
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
      secret,
      { expiresIn: "7d" }
    );

    // Get Mentee ID
    const mentee = await Mentee.findOne({ user: user._id }).select("_id");
    const menteeId = mentee?._id?.toString() || null;

    // Get Mentor ID
    const mentor = await Mentor.findOne({ user: user._id }).select("_id");
    const mentorId = mentor?._id?.toString() || null;

    return NextResponse.json({
      ok: true,
      message: "Login successful",
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        full_name: user.full_name,
        role: user.role,

        // NEW FIELDS
        github: user.github || "",
        linkedin_url: user.linkedin_url || "",

        menteeId,
        mentorId,
      },
      redirectUrl: getRedirectForRole(user.role),
    });

  } catch (err: any) {
    console.error("💥 Signin error:", err);
    return NextResponse.json(
      { message: err.message || "Server error" },
      { status: 500 }
    );
  }
}

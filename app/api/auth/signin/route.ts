import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Mentee from "@/models/Mentee";
import Mentor from "@/models/Mentor";
import Company from "@/models/Company";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getRedirectForRole(role: string, isVerified?: boolean) {
  switch (role) {
    case "company":
      if (isVerified === false) return "/company/pending";
      return "/company?tab=overview";

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

    // 1) Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 2) Check password
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 3) Role-specific IDs
    const mentee = await Mentee.findOne({ user: user._id }).select("_id");
    const mentor = await Mentor.findOne({ user: user._id }).select("_id");
    const company = await Company.findOne({ user: user._id }).select(
      "_id isVerified"
    );

    const menteeId = mentee?._id?.toString() || null;
    const mentorId = mentor?._id?.toString() || null;
    const companyId = company?._id?.toString() || null;

    const companyVerified = company ? company.isVerified : undefined;

    // 4) Build token payload
    const payload: any = {
      id: user._id.toString(),
      email: user.email,
      full_name: user.full_name,
      role: user.role,
    };

    // If this user is a company → add companyId to token
    if (user.role === "company" && companyId) {
      payload.companyId = companyId;
    }

    // 5) Create JWT
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    // 6) Response
    return NextResponse.json({
      ok: true,
      message: "Login successful",
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        full_name: user.full_name,
        role: user.role,

        github: user.github || "",
        linkedin_url: user.linkedin_url || "",

        menteeId,
        mentorId,
        companyId,
        isVerified: companyVerified,
      },

      redirectUrl: getRedirectForRole(user.role, companyVerified),
    });
  } catch (err: any) {
    console.error("💥 Signin error:", err);
    return NextResponse.json(
      { message: err.message || "Server error" },
      { status: 500 }
    );
  }
}

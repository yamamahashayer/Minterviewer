import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Company from "@/models/Company";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      full_name,
      workEmail, // login email
      password,
      country,

      name,
      industry,
      website,
      location,
    } = body;

    // =============================
    // VALIDATION
    // =============================
    if (!full_name || !workEmail || !password) {
      return NextResponse.json(
        { ok: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!name || !industry) {
      return NextResponse.json(
        { ok: false, message: "Missing company details" },
        { status: 400 }
      );
    }

    // check if user exists
    const exists = await User.findOne({ email: workEmail });
    if (exists) {
      return NextResponse.json(
        { ok: false, message: "Email already in use" },
        { status: 400 }
      );
    }

    // =============================
    // CREATE USER (role: company)
    // =============================
    const password_hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      full_name,
      email: workEmail, // login email
      password_hash,
      role: "company",
      country,
    });

    // =============================
    // CREATE COMPANY
    // =============================
    const company = await Company.create({
      user: newUser._id,
      name,
      workEmail,
      industry,
      website,
      location,

      isVerified: false,   // ⛔ VERY IMPORTANT
      description: "",
      companySize: "",
      foundedYear: null,
      social: {},
      hiringStatus: "open",
    });

    return NextResponse.json(
      {
        ok: true,
        message: "Company created and pending admin verification",
        companyId: company._id,
        userId: newUser._id,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Company Signup Error:", err);
    return NextResponse.json(
      { ok: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}

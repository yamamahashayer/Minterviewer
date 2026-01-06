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
      workEmail,
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

    // Check if exists
    const exists = await User.findOne({ email: workEmail });
    if (exists) {
      return NextResponse.json(
        { ok: false, message: "Email already in use" },
        { status: 400 }
      );
    }

    // =============================
    // CREATE USER
    // =============================
    const password_hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      full_name,
      email: workEmail,
      password_hash,
      role: "company",
      Country: country,
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
      isVerified: false,
      approvalStatus: 'pending', // Explicitly set approval status
      description: "",
      companySize: "",
      foundedYear: null,
      social: {},
      hiringStatus: "open",
    });

    // =============================
    // SEND NOTIFICATIONS
    // =============================
    const origin = new URL(req.url).origin;

    // 🔔 1) Welcome Notification
    await fetch(`${origin}/api/notifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: newUser._id.toString(),
        title: "🎉 Welcome to Minterviewer!",
        message: `Welcome ${full_name}! Your company account is pending admin approval.`,
        type: "system",
        redirectTo: "/company/overview",
      }),
    });

    // 🔔 2) Notify ALL Admins about new company registration
    const admins = await User.find({ role: "admin" });
    for (const admin of admins) {
      await fetch(`${origin}/api/notifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: admin._id.toString(),
          title: "🏢 New Company Registration",
          message: `${name} (${industry}) has registered and is awaiting approval.`,
          type: "system",
          redirectTo: "/admin/companies",
        }),
      });
    }

    // =============================
    // RESPONSE
    // =============================
    return NextResponse.json(
      {
        ok: true,
        message: "Company account created successfully",
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

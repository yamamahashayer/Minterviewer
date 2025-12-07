import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Company from "@/models/Company";
import jwt from "jsonwebtoken";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getUserId(req) {
  const auth = req.headers.get("authorization");
  if (!auth) return null;

  const token = auth.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch {
    return null;
  }
}

export async function GET(req) {
  try {
    await connectDB();

    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json(
        { ok: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const company = await Company.findOne({ user: userId }).lean();

    if (!company) {
      return NextResponse.json(
        { ok: false, message: "Company not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(company, { status: 200 });

  } catch (err) {
    return NextResponse.json(
      { ok: false, message: err.message },
      { status: 500 }
    );
  }
}


/* ==========================================================
   PUT — Update company profile
========================================================== */
export async function PUT(req) {
  try {
    await connectDB();

    const auth = req.headers.get("authorization");
    if (!auth) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });

    const token = auth.replace("Bearer ", "");
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
    const userId = payload.id;

    const { profile } = await req.json();
    if (!profile)
      return NextResponse.json({ ok: false, message: "Missing profile" }, { status: 400 });

    // Update the company fields
    const updatedCompany = await Company.findOneAndUpdate(
      { user: userId },
      {
        name: profile.name,
        website: profile.website,
        industry: profile.industry,
        location: profile.location,
        description: profile.description,
        foundedYear: profile.foundedYear || undefined,
        hiringStatus: profile.hiringStatus || undefined,
        social: {
          linkedin: profile.social?.linkedin || "",
          twitter: profile.social?.twitter || "",
          facebook: profile.social?.facebook || "",
          instagram: profile.social?.instagram || "",
        },
      },
      { new: true }
    ).populate("user", "short_bio full_name email");

    return NextResponse.json({ ok: true, company: updatedCompany }, { status: 200 });

  } catch (err) {
    console.error("PUT company error:", err);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }}
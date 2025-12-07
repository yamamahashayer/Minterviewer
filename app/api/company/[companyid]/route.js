import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Company from "@/models/Company";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req, ctx) {
  try {
    await connectDB();

    const params = await ctx.params;
    const companyId = params.companyid;

    if (!companyId) {
      return NextResponse.json(
        { ok: false, message: "Missing companyId" },
        { status: 400 }
      );
    }

    const company = await Company.findById(companyId).lean();

    if (!company) {
      return NextResponse.json(
        { ok: false, message: "Company not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, company }, { status: 200 });
  } catch (err) {
    console.error("GET COMPANY ERROR:", err);
    return NextResponse.json(
      { ok: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}

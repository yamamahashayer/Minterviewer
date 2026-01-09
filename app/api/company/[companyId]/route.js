import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Company from "@/models/Company";

/* ================= HELPER ================= */
const unwrapParams = async (ctx) => {
  const p = ctx?.params;
  return p && typeof p.then === "function" ? await p : p;
};

/* ================= GET COMPANY ================= */
export async function GET(req, ctx) {
  try {
    await connectDB();

    const params = await unwrapParams(ctx);
    const companyId = params?.companyId;

    /* ===== VALIDATION ===== */
    if (!companyId || !mongoose.Types.ObjectId.isValid(companyId)) {
      return NextResponse.json(
        { ok: false, message: "Invalid companyId" },
        { status: 400 }
      );
    }

    /* ===== QUERY ===== */
    const company = await Company.findById(companyId)
      .populate("user", "_id")
      .select("-__v -createdAt -updatedAt");

    if (!company) {
      return NextResponse.json(
        { ok: false, message: "Company not found" },
        { status: 404 }
      );
    }

    /* ===== SUCCESS ===== */
    return NextResponse.json({ ok: true, company });
  } catch (err) {
    console.error("Get Company Error:", err);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}

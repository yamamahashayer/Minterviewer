import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Company from "@/models/Company";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { companyId } = params;

    const company = await Company.findById(companyId)
  .populate("user", "_id")
  .select("-__v -createdAt -updatedAt");

    if (!company) {
      return NextResponse.json(
        { ok: false, message: "Company not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, company });
  } catch (err) {
    console.error("Get Company Error:", err);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}

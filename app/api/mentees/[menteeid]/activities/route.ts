import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Activity from "@/models/Activity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const isObjectId = (id: any) => /^[a-f\d]{24}$/i.test(String(id ?? "").trim());
const getParams = async (ctx: any) => {
  const p = ctx?.params; return p && typeof p.then === "function" ? await p : p;
};

export async function GET(req: Request, ctx: any) {
  try {
    const url = new URL(req.url);
    const limit = Math.max(1, Math.min(50, parseInt(url.searchParams.get("limit") || "8", 10)));

    const p = await getParams(ctx);
    const menteeId = String(p?.menteeId ?? p?.menteeid ?? "").trim();
    if (!isObjectId(menteeId)) {
      return NextResponse.json({ message: "Invalid menteeId" }, { status: 400 });
    }

    await connectDB();

    const rows = await Activity.find({
      owner: new mongoose.Types.ObjectId(menteeId),
      ownerModel: "Mentee",
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const items = (rows || []).map((r: any) => ({
      _id: String(r._id),
      type: r.type ?? r.category ?? "activity",
      title: r.title ?? r.name ?? r.action ?? "Activity",
      score: typeof r.score === "number"
        ? r.score
        : (typeof r.resultScore === "number" ? r.resultScore : null),
      timestamp: r.timestamp ?? r.performedAt ?? r.createdAt,
    }));

    return NextResponse.json({ items }, { status: 200 });
  } catch (err) {
    console.error("GET mentee activities error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

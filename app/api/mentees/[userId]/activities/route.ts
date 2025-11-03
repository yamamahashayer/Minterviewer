import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Activity from "@/models/Activity";

const MONGODB_URI = process.env.MONGODB_URI as string;

async function db() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI);
  }
}

export async function GET(req: Request, context: { params: Promise<{ userId: string }> }) {
  try {
    await db();

    const params = await context.params;
    const { userId } = params; 
    const url = new URL(req.url);
    const limit = Math.max(1, Math.min(50, Number(url.searchParams.get("limit") || 8)));

    const items = await Activity.find({ owner: userId }) 
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ ok: true, items });
  } catch (e: any) {
    console.error("Activities GET error:", e?.message || e);
    return NextResponse.json({ ok: false, items: [] }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Mentee from "@/models/Mentee";
import Background from "@/models/Background";

const isObjectId = (id: string) => /^[a-fA-F0-9]{24}$/.test(String(id ?? ""));

// يفك params لو كانت Promise (سلوك Next App Router)
async function resolveParams(ctx: any): Promise<{ userId?: string } | undefined> {
  const p = ctx?.params;
  return (p && typeof p.then === "function") ? await p : p;
}

/** GET /api/mentees/:userId/background  */
export async function GET(
  _req: Request,
  ctx: { params: { userId: string } } | { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = (await resolveParams(ctx)) ?? {};
    if (!userId || !isObjectId(userId)) {
      return NextResponse.json({ ok: false, message: "Invalid ID" }, { status: 400 });
    }

    await connectDB();

    // نحصل على mentee._id من user._id
    const mentee = await Mentee.findOne({ user: new mongoose.Types.ObjectId(userId) }).lean();
    if (!mentee) return NextResponse.json({ ok: false, message: "Mentee not found" }, { status: 404 });

    const items = await Background
      .find({ ownerModel: "Mentee", owner: mentee._id })
      .sort({ start_date: -1, createdAt: -1 })
      .lean();

    return NextResponse.json({ ok: true, items }, { status: 200 });
  } catch (err) {
    console.error("GET mentee background error:", err);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}

/** POST /api/mentees/:userId/background  */
export async function POST(
  req: Request,
  ctx: { params: { userId: string } } | { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = (await resolveParams(ctx)) ?? {};
    if (!userId || !isObjectId(userId)) {
      return NextResponse.json({ ok: false, message: "Invalid ID" }, { status: 400 });
    }

    let body: any;
    try { body = await req.json(); }
    catch { return NextResponse.json({ ok: false, message: "Invalid JSON" }, { status: 400 }); }

    if (body.entry_type !== "work" && body.entry_type !== "education") {
      return NextResponse.json({ ok: false, message: "entry_type must be 'work' or 'education'" }, { status: 400 });
    }

    await connectDB();

    const mentee = await Mentee.findOne({ user: new mongoose.Types.ObjectId(userId) }).lean();
    if (!mentee) return NextResponse.json({ ok: false, message: "Mentee not found" }, { status: 404 });

    const payload: any = {
      ownerModel: "Mentee",
      owner: mentee._id,
      entry_type: body.entry_type,
      company_name: body.company_name ?? "—",
      position: body.position ?? "—",
      school: body.school ?? "—",
      degree: body.degree ?? "—",
      start_date: body.start_date ? new Date(body.start_date) : undefined,
      end_date: body.end_date ? new Date(body.end_date) : undefined,
      description: body.description ?? "",
    };

    const item = await Background.create(payload);
    return NextResponse.json({ ok: true, item }, { status: 201 });
  } catch (err) {
    console.error("POST mentee background error:", err);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}

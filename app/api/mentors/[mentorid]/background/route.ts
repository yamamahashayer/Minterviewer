import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Background from "@/models/Background";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const isObjectId = (id: any) =>
  /^[a-f\d]{24}$/i.test(String(id ?? "").trim());

const getParams = async (ctx: any) => {
  const p = ctx?.params;
  return p && typeof p.then === "function" ? await p : p;
};

const parseDate = (v: any) => {
  if (!v) return undefined;
  const d = new Date(v);
  return isNaN(+d) ? undefined : d;
};

/* ========================= GET ========================= */
export async function GET(_req: Request, ctx: any) {
  try {
    const p = await getParams(ctx);

    // 🔥 استخدمي mentorid فقط !
    const mentorId = String(p?.mentorid ?? "").trim();

    if (!isObjectId(mentorId)) {
      return NextResponse.json({ message: "Invalid mentorId" }, { status: 400 });
    }

    await connectDB();

    const items = await Background.find({
      owner: new mongoose.Types.ObjectId(mentorId),
      ownerModel: "Mentor",
    })
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json({ items: items ?? [] }, { status: 200 });
  } catch (err) {
    console.error("GET mentor background error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

/* ========================= POST ========================= */
export async function POST(req: Request, ctx: any) {
  try {
    const p = await getParams(ctx);

    // 🔥 نفس الشي هون
    const mentorId = String(p?.mentorid ?? "").trim();

    if (!isObjectId(mentorId)) {
      return NextResponse.json({ message: "Invalid mentorId" }, { status: 400 });
    }

    const body = await req.json();

    await connectDB();

    const doc = await Background.create({
      owner: new mongoose.Types.ObjectId(mentorId),
      ownerModel: "Mentor",

      entry_type: body.entry_type,
      company_name: body.company_name,
      position: body.position,
      school: body.school,
      degree: body.degree,
      start_date: parseDate(body.start_date),
      end_date: parseDate(body.end_date),
      description: body.description,
    });

    return NextResponse.json({ ok: true, item: doc }, { status: 201 });
  } catch (err) {
    console.error("POST mentor background error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Background from "@/models/Background";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const isObjectId = (id: any) => /^[a-f\d]{24}$/i.test(String(id ?? "").trim());
const getParams = async (ctx: any) => {
  const p = ctx?.params; return p && typeof p.then === "function" ? await p : p;
};
const parseDate = (v: any) => {
  if (!v) return undefined;
  const d = new Date(v);
  return isNaN(+d) ? undefined : d;
};

/** GET /api/mentees/:menteeId/background */
export async function GET(_req: Request, ctx: any) {
  try {
    const p = await getParams(ctx);
    const menteeId = String(p?.menteeId ?? p?.menteeid ?? "").trim();
    if (!isObjectId(menteeId)) {
      return NextResponse.json({ message: "Invalid menteeId" }, { status: 400 });
    }

    await connectDB();

    // ✅ الاستعلام حسب الحقول المطلوبة من السكيمة
    const items = await Background.find({
      owner: new mongoose.Types.ObjectId(menteeId),
      ownerModel: "Mentee",
    })
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json({ items: items ?? [] }, { status: 200 });
  } catch (err) {
    console.error("GET mentee background error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

/** POST /api/mentees/:menteeId/background */
export async function POST(req: Request, ctx: any) {
  try {
    const p = await getParams(ctx);
    const menteeId = String(p?.menteeId ?? p?.menteeid ?? "").trim();
    if (!isObjectId(menteeId)) {
      return NextResponse.json({ message: "Invalid menteeId" }, { status: 400 });
    }

    let body: any = {};
    try { body = await req.json(); }
    catch { return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 }); }

    await connectDB();

    // ✅ خزّن owner/ownerModel المطلوبة من السكيمة
    const doc = await Background.create({
      owner: new mongoose.Types.ObjectId(menteeId),
      ownerModel: "Mentee",

      // لو سكيمتك تحتوي على هذه الحقول (عدّلي الأسماء حسب موديلك)
      entry_type: body.entry_type,            // "work" | "education"
      company_name: body.company_name,
      position: body.position,
      school: body.school,
      degree: body.degree,
      start_date: parseDate(body.start_date),
      end_date: parseDate(body.end_date),
      description: body.description,
    });

    return NextResponse.json({ ok: true, item: doc }, { status: 201 });
  } catch (err: any) {
    console.error("POST mentee background error:", err);
    if (err?.name === "ValidationError") {
      return NextResponse.json(
        { message: "Validation error", details: err?.errors ?? {} },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

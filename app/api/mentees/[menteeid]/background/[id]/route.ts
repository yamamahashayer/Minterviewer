import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Background from "@/models/Background";
import Activity from "@/models/Activity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const isObjectId = (id: string) =>
  /^[a-fA-F0-9]{24}$/.test(String(id ?? ""));

const getParams = async (ctx: any) => {
  const p = ctx?.params;
  return p && typeof p.then === "function" ? await p : p;
};

/* =========================
   UPDATE BACKGROUND (PUT)
========================= */
export async function PUT(req: Request, ctx: any) {
  try {
    const { id } = (await getParams(ctx)) ?? {};
    if (!id || !isObjectId(id)) {
      return NextResponse.json(
        { ok: false, message: "Invalid id" },
        { status: 400 }
      );
    }

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { ok: false, message: "Invalid JSON" },
        { status: 400 }
      );
    }

    await connectDB();

    const patch: any = {};
    if (body.entry_type !== undefined) patch.entry_type = body.entry_type;
    if (body.company_name !== undefined) patch.company_name = body.company_name;
    if (body.position !== undefined) patch.position = body.position;
    if (body.school !== undefined) patch.school = body.school;
    if (body.degree !== undefined) patch.degree = body.degree;
    if (body.start_date !== undefined)
      patch.start_date = body.start_date
        ? new Date(body.start_date)
        : undefined;
    if (body.end_date !== undefined)
      patch.end_date = body.end_date
        ? new Date(body.end_date)
        : undefined;
    if (body.description !== undefined) patch.description = body.description;

    const updated = await Background.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id),
      { $set: patch },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return NextResponse.json(
        { ok: false, message: "Not found" },
        { status: 404 }
      );
    }

    /* ===== ACTIVITY LOG ===== */
    await Activity.create({
      ownerModel: updated.ownerModel, // "Mentee" | "Mentor"
      owner: updated.owner,
      type: "custom",
      title:
        updated.entry_type === "work"
          ? "Updated work experience"
          : "Updated education background",
    });

    return NextResponse.json(
      { ok: true, item: updated },
      { status: 200 }
    );
  } catch (err) {
    console.error("PUT background error:", err);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}

/* =========================
   DELETE BACKGROUND (DELETE)
========================= */
export async function DELETE(_req: Request, ctx: any) {
  try {
    const { id } = (await getParams(ctx)) ?? {};
    if (!id || !isObjectId(id)) {
      return NextResponse.json(
        { ok: false, message: "Invalid id" },
        { status: 400 }
      );
    }

    await connectDB();

    const del = await Background.findByIdAndDelete(
      new mongoose.Types.ObjectId(id)
    ).lean();

    if (!del) {
      return NextResponse.json(
        { ok: false, message: "Not found" },
        { status: 404 }
      );
    }

    /* ===== ACTIVITY LOG ===== */
    await Activity.create({
      ownerModel: del.ownerModel,
      owner: del.owner,
      type: "custom",
      title:
        del.entry_type === "work"
          ? "Deleted work experience"
          : "Deleted education background",
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("DELETE background error:", err);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Background from "@/models/Background";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const isObjectId = (id: any) =>
  /^[a-f\d]{24}$/i.test(String(id ?? "").trim());

const getParams = async (ctx: any) => {
  const p = ctx?.params;
  return p && typeof p.then === "function" ? await p : p;
};

/** DELETE /api/mentors/:mentorid/background/:id */
export async function DELETE(req: Request, ctx: any) {
  try {
    const p = await getParams(ctx);

    const mentorId = String(p?.mentorid ?? "").trim();
    const itemId = String(p?.id ?? "").trim();

    if (!isObjectId(mentorId) || !isObjectId(itemId)) {
      return NextResponse.json(
        { ok: false, message: "Invalid IDs" },
        { status: 400 }
      );
    }

    await connectDB();

    const deleted = await Background.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(itemId),
      owner: new mongoose.Types.ObjectId(mentorId),
      ownerModel: "Mentor",
    });

    if (!deleted) {
      return NextResponse.json(
        { ok: false, message: "Not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("DELETE mentor background error:", err);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}

/** PUT /api/mentors/:mentorid/background/:id */
export async function PUT(req: Request, ctx: any) {
  try {
    const p = await getParams(ctx);

    const mentorId = String(p?.mentorid ?? "").trim();
    const itemId = String(p?.id ?? "").trim();

    if (!isObjectId(mentorId) || !isObjectId(itemId)) {
      return NextResponse.json(
        { ok: false, message: "Invalid IDs" },
        { status: 400 }
      );
    }

    const body = await req.json();

    await connectDB();

    const updated = await Background.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(itemId),
        owner: new mongoose.Types.ObjectId(mentorId),
        ownerModel: "Mentor",
      },
      { $set: body },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { ok: false, message: "Not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, item: updated });
  } catch (err) {
    console.error("PUT mentor background error:", err);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}

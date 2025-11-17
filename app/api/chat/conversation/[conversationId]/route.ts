import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Message from "@/models/Message";
import mongoose from "mongoose";

export async function GET(
  req: Request,
  context: { params: Promise<{ conversationId: string }> }
) {
  try {
    await connectDB();

    // ⬅️ FIX: await params
    const { conversationId } = await context.params;

    console.log("📨 Fetching messages for conversation:", conversationId);

    const messages = await Message.find({
      conversation: new mongoose.Types.ObjectId(conversationId),
    })
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json({ ok: true, messages });
  } catch (err: any) {
    console.error("❌ Error fetching messages:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

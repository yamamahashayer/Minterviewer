import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Message from "@/models/Message";
import Conversation from "@/models/Conversation";

export async function GET(
  req: Request,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    await connectDB();

    const { userId } = await context.params;
    console.log("📌 Fetching conversations for:", userId);

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // ==============================
    // FETCH Conversations
    // ==============================
    const conversations = await Conversation.find({
      participants: userObjectId,
    })
      .populate("participants", "full_name email")
      .populate("lastMessage")
      .sort({ updatedAt: -1 })
      .lean(); // 👈 يجعل _id = unknown بالنسبة لـ TS

    // ==============================
    // ADD unreadCount + lastActivity
    // ==============================
    for (const convo of conversations) {
      const convoId = String(convo._id); // 👈 FIXED: avoids TS errors

      // Count unread messages for THIS user
      const unread = await Message.countDocuments({
        conversation: convoId,
        toUser: userId,
        read: false,
      });

      convo.unreadCount = unread;

      // last activity = lastMessage or updatedAt
      convo.lastActivity =
        convo.lastMessage?.createdAt ?? convo.updatedAt ?? null;
    }

    return NextResponse.json({ ok: true, conversations });
  } catch (err: any) {
    console.error("❌ Error loading conversations:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

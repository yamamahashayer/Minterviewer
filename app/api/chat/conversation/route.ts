import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Conversation from "@/models/Conversation";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { user1, user2 } = await req.json();

    if (!user1 || !user2) {
      return NextResponse.json(
        { ok: false, error: "Missing user1 or user2" },
        { status: 400 }
      );
    }

    // Convert to ObjectId
    const user1Id = new mongoose.Types.ObjectId(user1);
    const user2Id = new mongoose.Types.ObjectId(user2);

    // Check if conversation already exists
    let existing = await Conversation.findOne({
      participants: { $all: [user1Id, user2Id] }
    });

    if (existing) {
      return NextResponse.json({ ok: true, conversation: existing });
    }

    // Create new conversation
    const convo = await Conversation.create({
      participants: [user1Id, user2Id],
      lastMessage: null,
    });

    return NextResponse.json({ ok: true, conversation: convo });
  } catch (err: any) {
    console.error("Conversation error:", err);
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { conversationId, fromUser, toUser, text } = await req.json();

    if (!fromUser || !toUser || !text) {
      return NextResponse.json(
        { ok: false, error: "Missing fields" },
        { status: 400 }
      );
    }

    // Convert to ObjectId
    const fromId = new mongoose.Types.ObjectId(fromUser);
    const toId = new mongoose.Types.ObjectId(toUser);

    let convo;

    // If no conversationId → create one
    if (!conversationId) {
      convo = await Conversation.create({
        participants: [fromId, toId],
        lastMessage: null,
      });
    } else {
      convo = await Conversation.findById(
        new mongoose.Types.ObjectId(conversationId)
      );
    }

    if (!convo) {
      return NextResponse.json(
        { ok: false, error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Save message to MongoDB
    const msg = await Message.create({
      conversation: convo._id,
      fromUser: fromId,
      toUser: toId,
      text,
      read: false,
    });

    // Update lastMessage
    convo.lastMessage = msg._id;
    await convo.save();

    // Save message to Firestore for realtime updates
    const ref = doc(
      collection(db, "messages", convo._id.toString(), "items"),
      msg._id.toString()
    );

    await setDoc(ref, {
      mongoId: msg._id.toString(),
      text,
      fromUser,
      toUser,
      createdAt: serverTimestamp(),
      read: false,
    });

    

    return NextResponse.json({
      ok: true,
      message: msg,
      conversationId: convo._id.toString(),
    });
  } catch (err: any) {
    console.error("Message error:", err);
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}

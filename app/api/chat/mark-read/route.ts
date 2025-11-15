import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Message from "@/models/Message";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { conversationId, userId } = body;

    if (!conversationId || !userId) {
      return NextResponse.json(
        { ok: false, error: "Missing conversationId or userId" },
        { status: 400 }
      );
    }

    // ============================
    // 1) UPDATE MONGODB
    // ============================
    await Message.updateMany(
      {
        conversation: conversationId,
        toUser: userId,
        read: { $ne: true },
      },
      { $set: { read: true } }
    );

    // ============================
    // 2) UPDATE FIRESTORE
    // ============================
    const itemsRef = collection(db, "messages", conversationId, "items");

    const q1 = query(itemsRef, where("toUser", "==", userId));

    const snap = await getDocs(q1);

    const batchUpdates = snap.docs.map(async (d) => {
      const ref = doc(db, "messages", conversationId, "items", d.id);
      await updateDoc(ref, { read: true });
    });

    await Promise.all(batchUpdates);

    return NextResponse.json({ ok: true, count: snap.size });
  } catch (err) {
    console.error("❌ mark-read error:", err);
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}

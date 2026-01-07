import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { updateDoc, doc } from "firebase/firestore";

export async function PUT(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();
    const { notificationId, userId } = body;

    if (!notificationId || !userId) {
      return NextResponse.json(
        { ok: false, error: "Missing notificationId or userId" },
        { status: 400 }
      );
    }

    // Update notification in Firestore
    const notificationRef = doc(db, "notifications", notificationId);
    await updateDoc(notificationRef, {
      read: true,
      readAt: new Date()
    });

    return NextResponse.json({
      ok: true,
      message: "Notification marked as read",
    });
  } catch (error: any) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import connectDB from "@/lib/mongodb";
import Notification from "@/models/Notification";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

// =======================================================
// 📥 GET - استرجاع إشعارات user معيّن
// =======================================================
export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { ok: false, error: "Missing userId in query" },
        { status: 400 }
      );
    }

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      ok: true,
      count: notifications.length,
      notifications,
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}

// =======================================================
// 📨 POST - إنشاء إشعار جديد
// =======================================================
export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();
    const { userId, title, message, type, redirectTo } = body; // 👈 تمت إضافة redirectTo

    if (!userId || !title || !message) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 🔥 Firestore (Realtime)
    const docRef = await addDoc(collection(db, "notifications"), {
      userId,
      title,
      message,
      type: type || "system",
      redirectTo: redirectTo || null,       // 👈 مهم جداً
      read: false,
      createdAt: serverTimestamp(),
    });

    // 🔹 MongoDB (Persistent)
    const mongoNotification = await Notification.create({
      user: userId,
      title,
      message,
      type: type || "system",
      redirectTo: redirectTo || null,       // 👈 مهم جداً
      read: false,
      firebaseId: docRef.id,
    });

    return NextResponse.json({
      ok: true,
      message: "Notification created successfully",
      firebaseId: docRef.id,
      mongoId: mongoNotification._id,
    });
  } catch (error: any) {
    console.error("❌ Error creating notification:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}

// =======================================================
// ✏️ PUT - تحديث حالة read
// =======================================================
export async function PUT(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();
    const { id, read } = body;

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "Missing notification id" },
        { status: 400 }
      );
    }

    await updateDoc(doc(db, "notifications", id), { read });
    await Notification.findOneAndUpdate({ firebaseId: id }, { read });

    return NextResponse.json({ ok: true, message: "Notification updated" });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}

// =======================================================
// 🗑️ DELETE - حذف الإشعار
// =======================================================
export async function DELETE(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "Missing notification id" },
        { status: 400 }
      );
    }

    await deleteDoc(doc(db, "notifications", id));
    await Notification.findOneAndDelete({ firebaseId: id });

    return NextResponse.json({ ok: true, message: "Notification deleted" });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}

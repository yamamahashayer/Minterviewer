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
// 📥 GET - استرجاع جميع الإشعارات الخاصة بالـ mentee من MongoDB
// =======================================================
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ menteeid: string }> }
) {
  const { menteeid } = await context.params;
  await connectDB();

  try {
    console.log("📬 Fetching notifications for mentee:", menteeid);

    const notifications = await Notification.find({ mentee: menteeid })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      ok: true,
      count: notifications.length,
      notifications,
    });
  } catch (error: any) {
    console.error("❌ Error fetching notifications:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}

// =======================================================
// 📨 POST - إنشاء إشعار جديد في Mongo + Firestore
// =======================================================
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ menteeid: string }> }
) {
  const { menteeid } = await context.params;
  await connectDB();

  try {
    const body = await req.json();
    const { title, message, type } = body;

    if (!title || !message) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const docRef = await addDoc(collection(db, "notifications"), {
      userId: menteeid,
      title,
      message,
      type: type || "system",
      read: false,
      createdAt: serverTimestamp(),
    });

    // 🔹 حفظ في MongoDB (تاريخ دائم)
    const mongoNotification = await Notification.create({
      mentee: menteeid,
      title,
      message,
      type: type || "system",
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
// ✏️ PUT - تحديث حالة الإشعار (مقروء / غير مقروء)
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

    // تحديث في Firestore
    const docRef = doc(db, "notifications", id);
    await updateDoc(docRef, { read });

    // تحديث في MongoDB
    await Notification.findOneAndUpdate({ firebaseId: id }, { read });

    return NextResponse.json({ ok: true, message: "Notification updated" });
  } catch (error: any) {
    console.error("❌ Error updating notification:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}

// =======================================================
// 🗑️ DELETE - حذف إشعار من Mongo + Firestore
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

    // حذف من Firestore
    const docRef = doc(db, "notifications", id);
    await deleteDoc(docRef);

    // حذف من Mongo
    await Notification.findOneAndDelete({ firebaseId: id });

    return NextResponse.json({ ok: true, message: "Notification deleted" });
  } catch (error: any) {
    console.error("❌ Error deleting notification:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}

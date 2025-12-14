// lib/notifications/sendNotification.ts
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import Notification from "@/models/Notification";
import connectDB from "@/lib/mongodb";

/**
 * Send notification to ANY user (mentee / mentor / company)
 * Adds to Firestore + MongoDB
 */
export async function sendNotification({
  userId,
  title,
  message,
  type = "system",
  redirectTo = null,
}) {
  try {
    if (!userId || !title || !message) {
      throw new Error("Missing required fields");
    }

    // =====================================
    // 1️⃣ Firestore — unified notifications collection
    // notifications/{docId}
    // =====================================
    const firebaseRef = await addDoc(
      collection(db, "notifications"), // <<<<<< FIXED HERE
      {
        userId,
        title,
        message,
        type,
        redirectTo,
        read: false,
        createdAt: serverTimestamp(),
      }
    );

    // =====================================
    // 2️⃣ MongoDB — save permanently
    // =====================================
    await connectDB();

    const notification = await Notification.create({
      user: userId,
      title,
      message,
      type,
      redirectTo,
      read: false,
      firebaseId: firebaseRef.id,
    });

    return {
      ok: true,
      firebaseId: firebaseRef.id,
      mongoId: notification._id,
    };
  } catch (err: any) {
    console.error("❌ sendNotification Error:", err);
    return { ok: false, error: err.message };
  }
}

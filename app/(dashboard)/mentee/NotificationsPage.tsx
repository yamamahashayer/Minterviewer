"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase"; 

import NotificationsHeader from "@/app/components/MenteePages/MenteeNotifications/NotificationsHeader";
import NotificationsStats from "@/app/components/MenteePages/MenteeNotifications/NotificationsStats";
import NotificationsTabs from "@/app/components/MenteePages/MenteeNotifications/NotificationsTabs";
import NotificationsList from "@/app/components/MenteePages/MenteeNotifications/NotificationsList";
import NotificationPreferences from "@/app/components/MenteePages/MenteeNotifications/NotificationPreferences";

export default function NotificationsPage({
  theme = "dark",
}: {
  theme?: "dark" | "light";
}) {
  const isDark = theme === "dark";
  const [notifications, setNotifications] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (!userData) {
      console.warn("⚠️ No user data found in sessionStorage");
      return;
    }

    const mentee = JSON.parse(userData);
    const menteeId = mentee?.menteeId;

    if (!menteeId) {
      console.error("❌ No menteeId found in user session");
      return;
    }

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", menteeId),
      orderBy("createdAt", "desc")
    );


    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(list);
        setLoading(false);
      },
      (error) => {
        console.error("❌ Firestore listener error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filtered = notifications.filter((n) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !n.read;
    return n.type === activeTab;
  });

  return (
    <div
      className={`min-h-screen p-8 ${
        isDark ? "bg-[#0a0f1e] text-white" : "bg-[#f5f3ff] text-[#2e1065]"
      }`}
    >
      <NotificationsHeader
        theme={theme}
        notifications={notifications}
        onMarkAllRead={() => {}}
        onClearAll={() => {}}
      />
      <NotificationsStats theme={theme} notifications={notifications} />
      <NotificationsTabs
        theme={theme}
        notifications={notifications}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {loading ? (
        <div className="text-center mt-10 text-gray-400">
          Loading notifications...
        </div>
      ) : (
        <NotificationsList
          theme={theme}
          notifications={filtered}
          activeTab={activeTab}
        />
      )}

      <NotificationPreferences theme={theme} />
    </div>
  );
}

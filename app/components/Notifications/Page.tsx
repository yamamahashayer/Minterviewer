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

import NotificationsHeader from "@/app/components/Notifications/NotificationsHeader";
import NotificationsStats from "@/app/components/Notifications/NotificationsStats";
import NotificationsTabs from "@/app/components/Notifications/NotificationsTabs";
import NotificationsList from "@/app/components/Notifications/NotificationsList";
import NotificationPreferences from "@/app/components/Notifications/NotificationPreferences";

export default function NotificationsPage({ theme = "dark" }) {
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

  const user = JSON.parse(userData);

  // 🔥 الحل بدون تعديل اللوج إن
  const userId = user?._id || user?.id;

  if (!userId) {
    console.error("❌ No userId found in user session");
    return;
  }

  const q = query(
    collection(db, "notifications"),
    where("userId", "==", userId),
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
      <NotificationsHeader notifications={notifications} theme={theme} />

      <NotificationsStats notifications={notifications} theme={theme} />

      <NotificationsTabs
        notifications={notifications}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
      />

      {loading ? (
        <div className="text-center mt-10 text-gray-400">
          Loading notifications...
        </div>
      ) : (
        <NotificationsList
          notifications={filtered}
          activeTab={activeTab}
          theme={theme}
        />
      )}

      <NotificationPreferences theme={theme} />
    </div>
  );
}

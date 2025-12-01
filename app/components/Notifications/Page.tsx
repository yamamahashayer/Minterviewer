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
    const raw = sessionStorage.getItem("user");
    if (!raw) return;

    const user = JSON.parse(raw);

    // 🔥 متوافق مع login الحالي
    const userId = user?._id || user?.id;
    if (!userId) return;

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const arr = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setNotifications(arr);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore error:", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const filtered = notifications.filter((n) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !n.read;
    return n.type === activeTab;
  });

  return (
    <div
      className="min-h-screen p-8"
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      {/* HEADER */}
      <NotificationsHeader
        notifications={notifications}
        theme={theme}
      />

      {/* STATS */}
      <NotificationsStats
        notifications={notifications}
        theme={theme}
      />

      {/* TABS */}
      <NotificationsTabs
        notifications={notifications}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
      />

      {/* LIST */}
      {loading ? (
        <div
          className="text-center mt-10"
          style={{ color: "var(--text-muted)" }}
        >
          Loading notifications...
        </div>
      ) : (
        <NotificationsList
          notifications={filtered}
          activeTab={activeTab}
          theme={theme}
        />
      )}

      {/* PREFERENCES */}
      <NotificationPreferences theme={theme} />
    </div>
  );
}

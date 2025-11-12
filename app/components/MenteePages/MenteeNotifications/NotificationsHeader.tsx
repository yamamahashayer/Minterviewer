"use client";

import { Bell, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; 
import { useState } from "react";

export default function NotificationsHeader({
  notifications,
  theme = "dark",
}: {
  notifications: any[];
  theme?: "dark" | "light";
}) {
  const isDark = theme === "dark";
  const [loading, setLoading] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = async () => {
    try {
      setLoading(true);
      const unread = notifications.filter((n) => !n.read && n.id);
      for (const n of unread) {
        await updateDoc(doc(db, "notifications", n.id), { read: true });
      }
    } catch (err) {
      console.error("❌ Failed to mark all as read:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    try {
      setLoading(true);
      for (const n of notifications) {
        if (n.id) await deleteDoc(doc(db, "notifications", n.id));
      }
    } catch (err) {
      console.error("❌ Failed to clear notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1
          className={`text-2xl font-bold flex items-center gap-2 ${
            isDark ? "text-white" : "text-[#3b0764]"
          }`}
        >
          Notifications{" "}
          <Bell
            className={isDark ? "text-teal-400" : "text-purple-500"}
          />
        </h1>

        {unreadCount > 0 && (
          <Badge
            className={
              isDark
                ? "bg-teal-500 text-white border-none mt-1"
                : "bg-purple-200 text-purple-800 border border-purple-300 mt-1"
            }
          >
            {unreadCount} new
          </Badge>
        )}
      </div>

      <div className="flex gap-2">
        {unreadCount > 0 && (
          <Button
            onClick={handleMarkAllRead}
            disabled={loading}
            className={
              isDark
                ? "bg-teal-500/20 border border-teal-400/50 hover:bg-teal-500/30 text-teal-200"
                : "bg-purple-100 border border-purple-300 hover:bg-purple-200 text-purple-700 font-semibold"
            }
          >
            <CheckCircle2 size={16} className="mr-1" />
            {loading ? "Marking..." : "Mark all as read"}
          </Button>
        )}

        {notifications.length > 0 && (
          <Button
            onClick={handleClearAll}
            disabled={loading}
            className={
              isDark
                ? "bg-red-500/20 border border-red-400/50 hover:bg-red-500/30 text-red-200"
                : "bg-red-100 border border-red-300 hover:bg-red-200 text-red-700 font-semibold"
            }
          >
            <Trash2 size={16} className="mr-1" />
            {loading ? "Clearing..." : "Clear all"}
          </Button>
        )}
      </div>
    </div>
  );
}

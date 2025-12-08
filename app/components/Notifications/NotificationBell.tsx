"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Check,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Button } from "@/app/components/ui/button";

/* ===========================================================
   Helpers
===========================================================*/

// ألوان حسب نوع الإشعار
function getTypeColor(t: string) {
  switch (t) {
    case "system": return "text-purple-500";
    case "message": return "text-blue-500";
    case "achievement": return "text-yellow-500";
    case "warning": return "text-red-500";
    default: return "text-gray-400";
  }
}

// Grouping
function formatGroup(date: any) {
  if (!date) return "Other";
  const d = new Date(date);

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  )
    return "Today";

  if (
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear()
  )
    return "Yesterday";

  return "Older";
}

/* ===========================================================
   MAIN COMPONENT
===========================================================*/

export default function NotificationBell({
  theme = "dark",
  onViewAll,
}: {
  theme?: "dark" | "light";
  onViewAll?: () => void;
}) {
  const isDark = theme === "dark";
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [pulse, setPulse] = useState(false);

  /* -------------------------------------------
     FETCH REAL-TIME FROM FIRESTORE
  --------------------------------------------*/
  useEffect(() => {
    const raw = sessionStorage.getItem("user");
    if (!raw) return;

    const user = JSON.parse(raw);
    const userId = user?._id || user?.id;
    if (!userId) return;

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      // Pulse animation عند إشعار جديد
      if (arr.length > notifications.length) {
        setPulse(true);
        setTimeout(() => setPulse(false), 600);
      }

      setNotifications(arr);
    });

    return () => unsub();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read)?.length;

  /* -------------------------------------------
     Redirect When Clicking Notification
  --------------------------------------------*/
  const handleClick = (n: any) => {
    if (n.redirectTo) {
      router.push(n.redirectTo);
      setIsOpen(false);
    }
  };

  /* -------------------------------------------
     Mark Specific Notification As Read
  --------------------------------------------*/
  const markAsRead = async (id: string) => {
    await fetch("/api/notifications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read: true }),
    });
  };

  /* -------------------------------------------
     Remove Notification
  --------------------------------------------*/
  const removeNotification = async (id: string) => {
    await fetch("/api/notifications", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  };

  /* ===========================================================
      RENDER
  ===========================================================*/

  return (
    <div className="relative">
      {/* Bell Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 sm:p-3 rounded-xl border transition-all ${
          isDark
            ? "hover:bg-white/10 border-white/20"
            : "hover:bg-purple-100 border-purple-300"
        }`}
      >
        <Bell
          className={`w-5 h-5 ${
            isDark ? "text-teal-300" : "text-purple-700"
          } ${pulse ? "animate-pulse" : ""}`}
        />

        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center 
              text-[10px] font-bold 
              ${isDark ? "bg-teal-500 text-white" : "bg-purple-500 text-white"}
            `}
          >
            {unreadCount}
          </motion.div>
        )}
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* BACKDROP */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* PANEL */}
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className={`absolute right-0 top-full mt-2 w-[360px] rounded-xl shadow-2xl z-50 overflow-hidden
                border ${
                  isDark
                    ? "bg-[#0f172a] border-white/10 text-white"
                    : "bg-white border-purple-200 text-[#2e1065]"
                }`}
            >
              {/* HEADER */}
              <div
                className="p-4 flex items-center justify-between"
                style={{
                  background: isDark ? "rgba(255,255,255,0.05)" : "#faf5ff",
                }}
              >
                <div>
                  <h3 className="text-sm font-semibold">Notifications</h3>
                  {unreadCount > 0 && (
                    <p className="text-xs opacity-70 mt-1">
                      {unreadCount} unread
                    </p>
                  )}
                </div>

                {unreadCount > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      notifications.forEach((n) => markAsRead(n.id))
                    }
                    className="text-purple-400 hover:text-purple-300"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Mark all
                  </Button>
                )}
              </div>

              {/* LIST */}
              <ScrollArea className="h-[400px]">
                {notifications.length === 0 ? (
                  <div className="p-10 text-center opacity-70">
                    <Bell className="w-10 h-10 mx-auto mb-3" />
                    No notifications
                  </div>
                ) : (
                  <div>
                    {(() => {
                      let lastGroup = "";

                      return notifications.map((notif) => {
                        const g = formatGroup(
                          notif.createdAt?.toDate
                            ? notif.createdAt.toDate()
                            : notif.createdAt
                        );

                        const showHeader = g !== lastGroup;
                        lastGroup = g;

                        return (
                          <div key={notif.id}>
                            {/* GROUP HEADER */}
                            {showHeader && (
                              <div className="px-4 py-2 text-xs font-bold opacity-70">
                                {g}
                              </div>
                            )}

                            {/* ITEM */}
                            <motion.div
                              initial={{ opacity: 0, y: -6 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`p-4 border-b cursor-pointer group ${
                                notif.read
                                  ? ""
                                  : isDark
                                  ? "bg-white/5"
                                  : "bg-purple-50"
                              }`}
                              onClick={() => handleClick(notif)}
                            >
                              <div className="flex items-start gap-3">
                                {/* LEFT COLOR BAR */}
                                <div
                                  className={`w-2 rounded-full mt-1 h-8 ${
                                    notif.read
                                      ? "bg-gray-300/20"
                                      : getTypeColor(notif.type)
                                  }`}
                                />

                                {/* CONTENT */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <h4
                                      className={`text-sm font-semibold ${getTypeColor(
                                        notif.type
                                      )}`}
                                    >
                                      {notif.title}
                                    </h4>

                                    {!notif.read && (
                                      <div className="w-2 h-2 bg-purple-400 rounded-full shadow-lg" />
                                    )}
                                  </div>

                                  <p className="text-xs opacity-80 mt-1">
                                    {notif.message}
                                  </p>

                                  <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs opacity-60">
                                      {notif.createdAt?.toDate
                                        ? notif.createdAt
                                            .toDate()
                                            .toLocaleString()
                                        : ""}
                                    </span>

                                    {/* ACTION BUTTONS */}
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      {!notif.read && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            markAsRead(notif.id);
                                          }}
                                          title="Mark as read"
                                          className="opacity-70 hover:opacity-100"
                                        >
                                          <Check className="w-4 h-4" />
                                        </button>
                                      )}

                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          removeNotification(notif.id);
                                        }}
                                        title="Remove"
                                        className="opacity-70 hover:opacity-100"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                )}
              </ScrollArea>

              {/* FOOTER */}
              {notifications.length > 0 && (
                <div
                  className="p-3 text-center cursor-pointer text-sm"
                  style={{
                    background: isDark ? "rgba(255,255,255,0.05)" : "#faf5ff",
                  }}
                  onClick={() => {
                    setIsOpen(false);
                    onViewAll?.();
                  }}
                >
                  View all notifications
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

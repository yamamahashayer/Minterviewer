"use client";

import { Clock, Mail, MailOpen } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotificationsList({
  theme,
  notifications,
  activeTab,
}) {
  const isDark = theme === "dark";
  const router = useRouter();

  if (!notifications || notifications.length === 0) {
    return (
      <div
        className={`rounded-xl p-12 text-center mt-8 ${
          isDark
            ? "bg-[#0b1020]/60 border border-[#1f2937] text-gray-400"
            : "bg-white border-[#ddd6fe] text-purple-500 shadow-sm"
        }`}
      >
        <MailOpen size={42} className="mx-auto mb-3 opacity-60" />
        <h3 className="font-semibold text-lg">No notifications found</h3>
        <p className="text-sm opacity-75">You're all caught up! 🎉</p>
      </div>
    );
  }

  const filtered = notifications.filter((n) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !n.read;
    return n.type === activeTab;
  });

  const markAsRead = async (id: string) => {
    await fetch("/api/notifications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read: true }),
    });
  };

  const handleClick = async (notif) => {
    // 1) Mark as read
    if (!notif.read) await markAsRead(notif.id);

    // 2) Redirect إذا في redirectTo
    if (notif.redirectTo) {
      router.push(notif.redirectTo);
    }
  };

  return (
    <div className="space-y-3 mt-6">
      {filtered.map((n) => (
        <div
          key={n.id}
          onClick={() => handleClick(n)}
          className={`cursor-pointer p-5 rounded-xl border transition-all ${
            isDark
              ? n.read
                ? "bg-[#0b1020]/60 border-[#1f2937]"
                : "bg-[#050a18] border-teal-500/50 shadow-[0_0_10px_rgba(94,234,212,0.15)] hover:border-teal-400"
              : n.read
              ? "bg-white border-[#ddd6fe]"
              : "bg-[#f0e6ff] border-purple-500/60"
          }`}
        >
          {/* header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {n.read ? (
                <MailOpen
                  size={18}
                  className={isDark ? "text-gray-400" : "text-purple-500"}
                />
              ) : (
                <Mail
                  size={18}
                  className={isDark ? "text-teal-400" : "text-purple-600"}
                />
              )}

              <h4
                className={`font-semibold ${
                  isDark ? "text-white" : "text-[#2e1065]"
                }`}
              >
                {n.title}
              </h4>
            </div>

            {!n.read && (
              <div
                className={`w-2 h-2 rounded-full ${
                  isDark ? "bg-teal-400" : "bg-purple-500"
                } animate-pulse`}
              />
            )}
          </div>

          <p
            className={`text-sm ${
              isDark ? "text-gray-300" : "text-purple-700"
            }`}
          >
            {n.message}
          </p>

          <div
            className={`flex items-center justify-between mt-4 pt-3 border-t ${
              isDark ? "border-[#1f2937]" : "border-purple-200"
            }`}
          >
            <div
              className={`flex items-center gap-2 text-xs ${
                isDark ? "text-gray-500" : "text-purple-500"
              }`}
            >
              <Clock size={12} />
              {(() => {
                const raw = n.createdAt;
                const date =
                  raw?.toDate && typeof raw.toDate === "function"
                    ? raw.toDate()
                    : new Date(raw);
                return date.toLocaleString();
              })()}
            </div>

            <div
              className={`text-xs font-medium px-3 py-1 rounded-full ${
                isDark
                  ? "bg-teal-500/10 text-teal-300 border border-teal-500/30"
                  : "bg-purple-100 text-purple-700 border border-purple-300"
              }`}
            >
              {n.type?.toUpperCase() || "SYSTEM"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

"use client";

import { Badge } from "@/app/components/ui/badge";

export default function MessagesHeader({
  unreadCount,
  isDark
}: {
  unreadCount: number;
  isDark: boolean;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1
            className={isDark ? "text-white" : "text-[#2e1065]"}
            style={{ marginBottom: "0.5rem", fontWeight: 700 }}
          >
            Messages & Feedback 💬
          </h1>

          <p className={isDark ? "text-[#99a1af]" : "text-[#6b21a8]"}>
            Communication from AI coaches and system updates
          </p>
        </div>

        <Badge
          className={
            isDark
              ? "bg-teal-500/20 text-teal-300 border-teal-500/30"
              : "bg-purple-100 text-purple-700 border-purple-300 font-semibold"
          }
        >
          {unreadCount} Unread
        </Badge>
      </div>

      <div
        className={`h-1 w-[200px] rounded-full mt-4 ${
          isDark
            ? "bg-gradient-to-r from-[#5eead4] to-transparent shadow-[0px_0px_10px_0px_rgba(94,234,212,0.5)]"
            : "bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-transparent shadow-[0px_0px_15px_0px_rgba(124,58,237,0.4)]"
        }`}
      />
    </div>
  );
}

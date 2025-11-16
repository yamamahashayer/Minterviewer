"use client";

import { Badge } from "@/app/components/ui/badge";

interface HeaderProps {
  unreadCount: number;
  isDark: boolean;
}

export default function MessagesHeader({ unreadCount, isDark }: HeaderProps) {
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
    </div>
  );
}

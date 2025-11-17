"use client";

import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import type { IConversation } from "./helpers";

interface MessageItemProps {
  convo: IConversation;
  selected: boolean;
  onClick: () => void;
  isDark: boolean;
  currentUserId: string | null;
}

export default function MessageItem({
  convo,
  selected,
  onClick,
  isDark,
  currentUserId,
}: MessageItemProps) {
  const otherUser = convo.participants.find((p) => p._id !== currentUserId);

  const last = convo.lastMessage;

  const preview = last
    ? last.text.length > 35
      ? last.text.slice(0, 35) + "..."
      : last.text
    : "No messages yet";

  const isUnread =
    last && last.toUser === currentUserId && !last.read;

  const timestamp = last
    ? new Date(last.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 border-b transition-all
        ${
          isDark
            ? "border-[rgba(94,234,212,0.1)] hover:bg-[rgba(94,234,212,0.05)]"
            : "border-[#ddd6fe] hover:bg-purple-50"
        }
        ${
          selected
            ? isDark
              ? "bg-[rgba(94,234,212,0.1)]"
              : "bg-purple-100"
            : ""
        }
      `}
    >
      <div className="flex items-start gap-3">
        <Avatar className="w-10 h-10 shrink-0">
          <AvatarFallback
            className={
              isDark
                ? "bg-gradient-to-br from-teal-400 to-emerald-400 text-white"
                : "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
            }
          >
            {otherUser?.full_name?.charAt(0)?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4
              className={`text-sm font-medium truncate ${
                isDark ? "text-white" : "text-[#2e1065]"
              }`}
            >
              {otherUser?.full_name || "User"}
            </h4>

            <span
              className={`text-xs ${
                isDark ? "text-[#6a7282]" : "text-purple-600"
              }`}
            >
              {timestamp}
            </span>
          </div>

          <p
            className={`text-sm truncate ${
              isUnread
                ? isDark
                  ? "text-teal-200"
                  : "text-purple-900 font-semibold"
                : isDark
                ? "text-[#d1d5dc]"
                : "text-[#6b21a8]"
            }`}
          >
            {preview}
          </p>

          {isUnread && (
            <div
              className={`w-2 h-2 rounded-full mt-2 ${
                isDark ? "bg-teal-400" : "bg-purple-600"
              }`}
            />
          )}
        </div>
      </div>
    </button>
  );
}

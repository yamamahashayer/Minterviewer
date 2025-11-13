"use client";

import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { Star, Bot } from "lucide-react";
import { getCategoryColor, getCategoryIcon } from "./helpers";

type MessageItemProps = {
  message: any;
  selectedMessage: any;
  isDark: boolean;
  onClick: () => void;
};

export default function MessageItem({
  message,
  selectedMessage,
  isDark,
  onClick
}: MessageItemProps) {

  const CategoryIcon = getCategoryIcon(message.category);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 border-b transition-all
        ${isDark ? "border-[rgba(94,234,212,0.1)] hover:bg-[rgba(94,234,212,0.05)]"
                 : "border-[#ddd6fe] hover:bg-purple-50"}
        ${selectedMessage?.id === message.id ? (isDark ? "bg-[rgba(94,234,212,0.1)]" : "bg-purple-100") : ""}
        ${!message.read ? (isDark ? "bg-[rgba(94,234,212,0.03)]" : "bg-purple-50/50") : ""}
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
            {message.fromType === "ai" ? <Bot size={18} /> : "S"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4
              className={`text-sm truncate font-medium ${
                !message.read
                  ? isDark
                    ? "text-white"
                    : "text-[#2e1065]"
                  : isDark
                    ? "text-[#d1d5dc]"
                    : "text-[#6b21a8]"
              }`}
            >
              {message.from}
            </h4>

            {message.starred && (
              <Star
                className={
                  isDark
                    ? "text-amber-400 fill-amber-400"
                    : "text-orange-500 fill-orange-500"
                }
                size={14}
              />
            )}
          </div>

          <p
            className={`text-sm truncate ${
              !message.read
                ? isDark
                  ? "text-white"
                  : "text-[#2e1065]"
                : isDark
                  ? "text-[#99a1af]"
                  : "text-[#6b21a8]"
            }`}
          >
            {message.subject}
          </p>

          <p
            className={`text-xs truncate ${
              isDark ? "text-[#6a7282]" : "text-[#7c3aed]"
            }`}
          >
            {message.preview}
          </p>

          <div className="flex items-center gap-2 mt-2">
            <CategoryIcon className={`${getCategoryColor(message.category, isDark)}`} size={12} />
            <span
              className={`${
                isDark ? "text-[#6a7282]" : "text-[#7c3aed]"
              } text-xs`}
            >
              {message.timestamp}
            </span>

            {!message.read && (
              <div
                className={`w-2 h-2 rounded-full ${
                  isDark ? "bg-teal-400" : "bg-purple-600"
                } ml-auto`}
              />
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

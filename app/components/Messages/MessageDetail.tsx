"use client";

import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { motion } from "framer-motion";
import type { IMessage, MessageDetailProps } from "./helpers";

export default function MessageDetail({
  messages,
  conversation,
  isDark,
  currentUserId,
  isTyping,
  chatRef,
  handleScroll,
}: MessageDetailProps) {
  if (!conversation) return null;

  const otherUser = conversation.participants.find(
    (p) => String(p._id) !== String(currentUserId)
  );

  // ============================
  // GROUP BY DATE
  // ============================
  function groupByDate(msgs: IMessage[]) {
    const groups: Record<string, IMessage[]> = {};

    msgs.forEach((m) => {
      const d = new Date(m.createdAt);
      const key = d.toDateString();
      if (!groups[key]) groups[key] = [];
      groups[key].push(m);
    });

    return Object.entries(groups).map(([date, items]) => ({
      label: formatGroupDate(date),
      items,
    }));
  }

  function formatGroupDate(dateString: string): string {
    const today = new Date();
    const d = new Date(dateString);

    if (d.toDateString() === today.toDateString()) return "Today";

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";

    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  const groupedMessages = groupByDate(messages);

  function formatTime(ts: string | number | Date) {
    if (!ts) return "";
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  // ============================
  // RENDER
  // ============================
  return (
    <div
      className={`flex flex-col h-[700px] ${
        isDark
          ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]"
          : "bg-white shadow-lg"
      } border ${
        isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"
      } rounded-xl overflow-hidden`}
    >
      {/* HEADER */}
      <div
        className={`p-4 border-b flex items-center gap-3 ${
          isDark ? "border-[rgba(94,234,212,0.1)]" : "border-[#ddd6fe]"
        }`}
      >
        <Avatar className="w-10 h-10">
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

        <div>
          <h3
            className={`${
              isDark ? "text-white" : "text-[#2e1065]"
            } font-semibold`}
          >
            {otherUser?.full_name || "User"}
          </h3>

          {isTyping ? (
            <p className="text-green-500 text-sm">Typing...</p>
          ) : (
            <p className={isDark ? "text-[#99a1af]" : "text-purple-600"}>
              Online
            </p>
          )}
        </div>
      </div>

      {/* CHAT BODY */}
      <div
        id="chat-box"
        ref={chatRef}
        onScroll={handleScroll}
        className="flex-1 p-6 overflow-y-auto"
      >
        {groupedMessages.map((group) => (
          <div key={group.label} className="mb-4">
            <p className="text-center text-xs text-gray-400 mb-3">
              {group.label}
            </p>

            {group.items.map((msg) => {
              const fromSelf = msg.fromSelf;

              return (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex mb-3 ${
                    fromSelf ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-2xl shadow-sm
                      ${
                        fromSelf
                          ? isDark
                            ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white"
                            : "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                          : isDark
                          ? "bg-[rgba(255,255,255,0.06)] text-white border border-[rgba(255,255,255,0.08)]"
                          : "bg-purple-50 text-[#2e1065] border border-purple-200"
                      }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.text}</p>

                    <div className="flex justify-end items-center gap-2 mt-1">
                      <span
                        className={`text-xs ${
                          isDark ? "text-[#d1d5dc]" : "text-purple-700/70"
                        }`}
                      >
                        {formatTime(msg.createdAt)}
                      </span>

                      {/* READ STATUS */}
                      {fromSelf && (
                        <span
                          className={`text-xs ${
                            msg.read === true
                              ? "text-blue-400"
                              : msg.read === false
                              ? "text-gray-400"
                              : "text-transparent"
                          }`}
                        >
                          ✔✔
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ))}

        {/* TYPING BUBBLE */}
        {isTyping && (
          <div className="flex justify-start mb-3">
            <div
              className={`px-4 py-2 rounded-2xl shadow-sm flex items-center gap-2
                ${
                  isDark
                    ? "bg-[rgba(255,255,255,0.06)] text-teal-300 border border-[rgba(255,255,255,0.1)]"
                    : "bg-purple-100 text-purple-700 border border-purple-200"
                }`}
            >
              <div className="flex gap-1">
                <span
                  className={`w-2 h-2 rounded-full animate-bounce ${
                    isDark ? "bg-teal-300" : "bg-purple-500"
                  }`}
                ></span>
                <span
                  className={`w-2 h-2 rounded-full animate-bounce ${
                    isDark ? "bg-teal-300" : "bg-purple-500"
                  }`}
                  style={{ animationDelay: "0.15s" }}
                ></span>
                <span
                  className={`w-2 h-2 rounded-full animate-bounce ${
                    isDark ? "bg-teal-300" : "bg-purple-500"
                  }`}
                  style={{ animationDelay: "0.3s" }}
                ></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

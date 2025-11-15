"use client";

import { useState } from "react";
import { Input } from "@/app/components/ui/input";
import { Search } from "lucide-react";
import MessageItem from "./MessageItem";
import type { IConversation } from "./helpers";

interface MessagesListProps {
  conversations: IConversation[];
  selectedConvo: IConversation | null;
  onSelect: (c: IConversation) => void;
  isDark: boolean;
  currentUserId: string | null;
}

export default function MessagesList({
  conversations,
  selectedConvo,
  onSelect,
  isDark,
  currentUserId,
}: MessagesListProps) {
  const [filter, setFilter] = useState<"all" | "unread" | "recent">("all");
  const [search, setSearch] = useState("");

  // =============== 1) SEARCH FILTER ===============
  const filteredBySearch = conversations.filter((c) => {
    const other = c.participants.find(
      (p) => String(p._id) !== String(currentUserId)
    );

    return other?.full_name
      ?.toLowerCase()
      .includes(search.toLowerCase());
  });

  // =============== 2) FILTER BUTTONS ===============
  const filtered = filteredBySearch.filter((c) => {
    if (filter === "unread") return c.unreadCount > 0;

    if (filter === "recent") {
      const last = new Date(c.lastActivity).getTime();
      const now = Date.now();
      return now - last < 24 * 60 * 60 * 1000; // 24h
    }

    return true; // ALL
  });

  return (
    <div
      className={`col-span-1 h-[700px] overflow-hidden 
        ${
          isDark
            ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]"
            : "bg-white shadow-lg"
        }
        border ${
          isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"
        } rounded-xl`}
    >
      {/* SEARCH BOX */}
      <div
        className={`p-4 border-b ${
          isDark ? "border-[rgba(94,234,212,0.1)]" : "border-[#ddd6fe]"
        }`}
      >
        <div className="relative">
          <Search
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${
              isDark ? "text-[#6a7282]" : "text-purple-400"
            }`}
            size={16}
          />

          <Input
            placeholder="Search conversation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`pl-10 ${
              isDark
                ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.1)] text-white"
                : "bg-white border-[#ddd6fe] text-[#2e1065]"
            }`}
          />
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div
        className={`flex items-center gap-2 px-4 py-2 border-b ${
          isDark ? "border-[rgba(94,234,212,0.1)]" : "border-[#ddd6fe]"
        }`}
      >
        {["all", "unread", "recent"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-3 py-1 rounded-lg text-sm capitalize
              ${
                filter === f
                  ? isDark
                    ? "bg-teal-500 text-white"
                    : "bg-purple-600 text-white"
                  : isDark
                  ? "text-[#a6b0c3]"
                  : "text-purple-600"
              }
            `}
          >
            {f}
          </button>
        ))}
      </div>

      {/* LIST */}
      <div className="max-h-[600px] overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="p-6 text-center">
            <p className={isDark ? "text-[#99a1af]" : "text-[#6b21a8]"}>
              No conversations found
            </p>
          </div>
        ) : (
          filtered.map((convo) => (
            <MessageItem
              key={convo._id}
              convo={convo}
              selected={selectedConvo?._id === convo._id}
              onClick={() => onSelect(convo)}
              isDark={isDark}
              currentUserId={currentUserId}
            />
          ))
        )}
      </div>
    </div>
  );
}

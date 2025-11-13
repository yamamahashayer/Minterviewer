"use client";

import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Star, Archive, Trash2, Bot } from "lucide-react";
import { getCategoryColor, getPriorityBadge } from "./helpers";

type MessageDetailProps = {
  message: any;
  isDark: boolean;
};

export default function MessageDetail({ message, isDark }: MessageDetailProps) {
  if (!message) return null;

  return (
    <div
      className={`flex flex-col h-[700px] ${
        isDark
          ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]"
          : "bg-white shadow-lg"
      } border ${
        isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"
      } rounded-xl overflow-hidden backdrop-blur-sm`}
    >
      {/* Header */}
      <div
        className={`p-6 border-b ${
          isDark ? "border-[rgba(94,234,212,0.1)]" : "border-[#ddd6fe]"
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback
                className={
                  isDark
                    ? "bg-gradient-to-br from-teal-400 to-emerald-400 text-white"
                    : "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                }
              >
                {message.fromType === "ai" ? <Bot size={20} /> : "S"}
              </AvatarFallback>
            </Avatar>

            <div>
              <h3
                className={`${
                  isDark ? "text-white" : "text-[#2e1065]"
                } mb-1 font-semibold`}
              >
                {message.from}
              </h3>
              <p
                className={`${
                  isDark ? "text-[#99a1af]" : "text-[#6b21a8]"
                } text-sm`}
              >
                {message.timestamp}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={
                isDark
                  ? "text-teal-300 hover:bg-[rgba(94,234,212,0.1)]"
                  : "text-purple-600 hover:bg-purple-100"
              }
            >
              <Star
                className={
                  message.starred
                    ? isDark
                      ? "fill-amber-400 text-amber-400"
                      : "fill-orange-500 text-orange-500"
                    : ""
                }
                size={18}
              />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className={
                isDark
                  ? "text-teal-300 hover:bg-[rgba(94,234,212,0.1)]"
                  : "text-purple-600 hover:bg-purple-100"
              }
            >
              <Archive size={18} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className={
                isDark
                  ? "text-red-400 hover:bg-[rgba(220,38,38,0.1)]"
                  : "text-red-600 hover:bg-red-100"
              }
            >
              <Trash2 size={18} />
            </Button>
          </div>
        </div>

        {/* Subject */}
        <h2
          className={`${
            isDark ? "text-white" : "text-[#2e1065]"
          } mb-2 font-semibold`}
        >
          {message.subject}
        </h2>

        {/* Badges */}
        <div className="flex items-center gap-2">
          <Badge className={getPriorityBadge(message.priority, isDark)}>
            {message.priority}
          </Badge>

          <Badge
            className={`${getCategoryColor(message.category, isDark)} ${
              isDark
                ? "bg-[rgba(94,234,212,0.1)] border-[rgba(94,234,212,0.2)]"
                : "bg-purple-50 border-purple-300"
            }`}
          >
            {message.category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div
          className={`${
            isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"
          } whitespace-pre-line leading-relaxed`}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
}

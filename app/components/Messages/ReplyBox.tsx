"use client";

import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import { Send } from "lucide-react";

type ReplyBoxProps = {
  replyText: string;
  setReplyText: (v: string) => void;
  isDark: boolean;
};

export default function ReplyBox({ replyText, setReplyText, isDark }: ReplyBoxProps) {
  return (
    <div
      className={`p-6 border-t ${
        isDark ? "border-[rgba(94,234,212,0.1)]" : "border-[#ddd6fe]"
      }`}
    >
      <Textarea
        placeholder="Type your reply..."
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        className={`mb-3 min-h-[100px] ${
          isDark
            ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.2)] text-white"
            : "bg-white border-[#ddd6fe] text-[#2e1065]"
        }`}
      />

      <div className="flex justify-end gap-2">
        {/* Cancel */}
        <Button
          variant="outline"
          className={
            isDark
              ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white"
              : "bg-white border-2 border-[#ddd6fe] text-purple-700 hover:bg-purple-50 hover:border-[#a855f7] font-medium"
          }
          onClick={() => setReplyText("")}
        >
          Cancel
        </Button>

        {/* Send */}
        <Button
          className={`${
            isDark
              ? "bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
              : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 font-semibold shadow-md"
          } text-white`}
        >
          <Send size={16} className="mr-2" />
          Send Reply
        </Button>
      </div>
    </div>
  );
}

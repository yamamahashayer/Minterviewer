"use client";

import { useRef } from "react";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import { Send } from "lucide-react";

import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import type { ReplyBoxProps } from "./helpers";

export default function ReplyBox({
  replyText,
  setReplyText,
  sendMessage,
  isDark,
  selectedConvo,
  currentUserId,
}: ReplyBoxProps) {
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  // WRITE TYPING INTO Firestore
  async function setTypingState(isTyping: boolean) {
    if (!selectedConvo || !currentUserId) return;

    // this MUST match the listener in MessagesPage
    const myTypingDoc = doc(
      db,
      "messages",
      selectedConvo._id,
      "meta",
      currentUserId
    );

    await setDoc(myTypingDoc, { typing: isTyping }, { merge: true });
  }

  // USER STARTED/STOPPED TYPING
  function handleTyping(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setReplyText(e.target.value);

    // instantly set typing true
    setTypingState(true);

    // reset timer
    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    // stop typing after 1s
    typingTimeout.current = setTimeout(() => {
      setTypingState(false);
    }, 1000);
  }

  return (
    <div
      className={`p-6 border-t ${
        isDark ? "border-[rgba(94,234,212,0.1)]" : "border-[#ddd6fe]"
      }`}
    >
      <Textarea
        placeholder="Type your message..."
        value={replyText}
        onChange={handleTyping}
        className={`mb-3 min-h-[100px] ${
          isDark
            ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.2)] text-white"
            : "bg-white border-[#ddd6fe] text-[#2e1065]"
        }`}
      />

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          className={
            isDark
              ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white"
              : "bg-white border-2 border-[#ddd6fe] text-purple-700 hover:bg-purple-50 hover:border-[#a855f7] font-medium"
          }
          onClick={() => {
            setReplyText("");
            setTypingState(false);
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={() => {
            sendMessage();
            setTypingState(false); // stop typing after sending
          }}
          className={`flex items-center ${
            isDark
              ? "bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
              : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          } text-white font-semibold shadow-md`}
        >
          <Send size={16} className="mr-2" />
          Send
        </Button>
      </div>
    </div>
  );
}

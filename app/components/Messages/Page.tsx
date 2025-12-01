"use client";

import { useEffect, useState, useRef } from "react";
import MessagesList from "./MessagesList";
import MessageDetail from "./MessageDetail";
import ReplyBox from "./ReplyBox";

import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { MessageSquare } from "lucide-react";
import type { IConversation, IMessage } from "./helpers";

export default function MessagesPage({ theme = "light" }) {
  const isDark = theme === "dark";

  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [selectedConvo, setSelectedConvo] = useState<IConversation | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [replyText, setReplyText] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const unsubscribeRef = useRef<(() => void) | null>(null);

  const chatRef = useRef<HTMLDivElement | null>(null);
  const shouldAutoScrollRef = useRef(true);

  // LOAD USER
  useEffect(() => {
    const raw = sessionStorage.getItem("user");
    if (raw) {
      const u = JSON.parse(raw);
      setCurrentUserId(u._id || u.id);
    }
  }, []);

  // SCROLL HANDLER
  const handleScroll = () => {
    const box = chatRef.current;
    if (!box) return;

    const distance =
      box.scrollHeight - box.scrollTop - box.clientHeight;

    shouldAutoScrollRef.current = distance < 120;
  };

  // AUTO SCROLL
  useEffect(() => {
    const box = chatRef.current;
    if (!box) return;

    const distance =
      box.scrollHeight - box.scrollTop - box.clientHeight;

    const isNearBottom = distance < 150;

    if (shouldAutoScrollRef.current || isNearBottom) {
      box.scrollTop = box.scrollHeight;
    }
  }, [messages]);

  // LOAD CONVERSATIONS
  async function loadConversations() {
    if (!currentUserId) return;

    const res = await fetch(`/api/chat/user/${currentUserId}`);
    const json = await res.json();
    if (json.ok) setConversations(json.conversations);
  }

  useEffect(() => {
    if (currentUserId) loadConversations();
  }, [currentUserId]);

  // OPEN CONVO
  async function openConversation(convo: IConversation) {
    setSelectedConvo(convo);

    const res = await fetch(`/api/chat/conversation/${convo._id}`);
    const json = await res.json();

    if (json.ok) {
      const initial = json.messages.map((msg: any) => ({
        ...msg,
        fromSelf: msg.fromUser === currentUserId,
      }));

      const sorted = initial.sort(
        (a: IMessage, b: IMessage) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
      );

      setMessages(sorted);
      shouldAutoScrollRef.current = true;
    }

    listenRealTime(convo._id);
    listenTyping(convo);
    markAsRead(convo._id);
  }

  // MARK READ
  async function markAsRead(convoId: string) {
    await fetch(`/api/chat/mark-read`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId: convoId,
        userId: currentUserId,
      }),
    });
  }

  // REALTIME FIRESTORE
  function listenRealTime(convoId: string) {
    if (unsubscribeRef.current) unsubscribeRef.current();

    const q = query(
      collection(db, "messages", convoId, "items"),
      orderBy("createdAt", "asc")
    );

    unsubscribeRef.current = onSnapshot(q, (snapshot) => {
      const realtime = snapshot.docs.map((d) => {
        const m = d.data();
        return {
          _id: m.mongoId || d.id,
          text: m.text,
          createdAt: m.createdAt?.toMillis?.() ?? Date.now(),
          fromUser: m.fromUser,
          toUser: m.toUser,
          fromSelf: m.fromUser === currentUserId,
          read: m.read === true,
        };
      });

      setMessages(realtime);
    });
  }

  // LISTEN TYPING
  function listenTyping(convo: IConversation) {
    const other = convo.participants.find(
      (p) => String(p._id) !== String(currentUserId)
    );

    if (!other) return;

    const typingDoc = doc(
      db,
      "messages",
      convo._id,
      "meta",
      String(other._id)
    );

    return onSnapshot(typingDoc, (snap) => {
      setIsTyping(snap.data()?.typing || false);
    });
  }

  // SEND MESSAGE
  async function sendMessage() {
    if (!replyText.trim() || !selectedConvo || !currentUserId) return;

    const other = selectedConvo.participants.find(
      (p) => p._id !== currentUserId
    );
    if (!other) return;

    await fetch(`/api/chat/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId: selectedConvo._id,
        fromUser: currentUserId,
        toUser: other._id,
        text: replyText,
      }),
    });

    setReplyText("");
    shouldAutoScrollRef.current = true;
  }

  
  return (
    <div className="grid grid-cols-3 gap-6 p-4">
      <MessagesList
        conversations={conversations}
        selectedConvo={selectedConvo}
        onSelect={openConversation}
        isDark={isDark}
        currentUserId={currentUserId}
      />

      <div className="col-span-2">
        {selectedConvo ? (
          <>
            <MessageDetail
              messages={messages}
              conversation={selectedConvo}
              isDark={isDark}
              currentUserId={currentUserId}
              isTyping={isTyping}
              chatRef={chatRef}
              handleScroll={handleScroll}
            />

            <ReplyBox
              replyText={replyText}
              setReplyText={setReplyText}
              sendMessage={sendMessage}
              isDark={isDark}
              selectedConvo={selectedConvo}
              currentUserId={currentUserId}
            />
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-purple-600">
            <MessageSquare size={36} />
            <p>No conversation selected</p>
          </div>
        )}
      </div>
    </div>
  );
}

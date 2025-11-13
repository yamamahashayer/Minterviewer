"use client";

import { useState } from "react";
import { Badge } from "@/app/components/ui/badge";
import { MessageSquare } from "lucide-react";

// Components
import MessagesList from "./MessagesList";
import MessageDetail from "./MessageDetail";
import ReplyBox from "./ReplyBox";
import MessagesHeader from "@/app/components/Messages/MessagesHeader";

// Types
interface Message {
  id: number;
  from: string;
  fromType: "ai" | "system";
  subject: string;
  preview: string;
  content: string;
  timestamp: string;
  read: boolean;
  starred: boolean;
  category: "feedback" | "achievement" | "reminder" | "tip";
  priority: "high" | "normal" | "low";
}

export default function MessagesPage({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const isDark = theme === "dark";

  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [replyText, setReplyText] = useState("");

  // =======================
  // STATIC SAMPLE MESSAGES
  // =======================
  const messages: Message[] = [
    {
      id: 1,
      from: "AI Coach Sarah",
      fromType: "ai",
      subject: "Great Progress on Technical Interview!",
      preview: "You've shown excellent improvement in your technical interview skills...",
      content:
        "Hi Yamamah,\n\nCongratulations on your recent technical interview performance! You scored 9.2/10.\n\nKey Strengths:\n• Excellent problem-solving\n• Clear communication\n• Strong understanding of data structures\n\nAreas for Growth:\n• Optimize time complexity further\n• Practice edge case identification\n\nKeep going 🚀",
      timestamp: "2 hours ago",
      read: false,
      starred: true,
      category: "feedback",
      priority: "high",
    },
    {
      id: 2,
      from: "Minterviewer System",
      fromType: "system",
      subject: "New Achievement Unlocked: Top Performer",
      preview: "Congratulations! You've unlocked a new achievement...",
      content:
        "Congratulations Yamamah!\n\nYou've unlocked the 'Top Performer' achievement for ranking in the top 10% of users.\nReward: +300 points 🎉",
      timestamp: "5 hours ago",
      read: false,
      starred: false,
      category: "achievement",
      priority: "normal",
    },
    {
      id: 3,
      from: "AI Coach Mike",
      fromType: "ai",
      subject: "System Design Session Feedback",
      preview: "Your system design session showed strong architectural thinking...",
      content:
        "Hello Yamamah,\n\nThank you for completing the e-commerce platform system design session.\nScore: 8.8/10\n\nHighlights:\n• Scalability\n• Database choices\n• Component design\n\nSuggestions:\n• Caching deeper\n• Add load balancing details\n\nKeep practicing!",
      timestamp: "1 day ago",
      read: true,
      starred: false,
      category: "feedback",
      priority: "normal",
    },
    {
      id: 4,
      from: "Minterviewer System",
      fromType: "system",
      subject: "Reminder: Scheduled Interview Today",
      preview: "You have a technical interview scheduled for today...",
      content:
        "Hi Yamamah,\n\nReminder for your practice interview at 10:00AM.\n\nFocus: DSA\nDuration: 60 mins\nJoin early and prepare well 🙌",
      timestamp: "1 day ago",
      read: true,
      starred: false,
      category: "reminder",
      priority: "high",
    },
    {
      id: 5,
      from: "AI Coach Emma",
      fromType: "ai",
      subject: "Behavioral Interview Tips",
      preview: "Here are some tips to improve your STAR method responses...",
      content:
        "Hi Yamamah,\n\nBased on your last session, here are personalized tips:\n\n• Improve Result section\n• Prepare 5 stories\n• Show growth mindset\n\nRecommended topics:\nLeadership, conflict resolution, innovation.\n\nLet's practice soon!",
      timestamp: "2 days ago",
      read: true,
      starred: true,
      category: "tip",
      priority: "normal",
    },
        {
      id: 6,
      from: "AI Coach Sarah",
      fromType: "ai",
      subject: "Great Progress on Technical Interview!",
      preview: "You've shown excellent improvement in your technical interview skills...",
      content:
        "Hi Yamamah,\n\nCongratulations on your recent technical interview performance! You scored 9.2/10.\n\nKey Strengths:\n• Excellent problem-solving\n• Clear communication\n• Strong understanding of data structures\n\nAreas for Growth:\n• Optimize time complexity further\n• Practice edge case identification\n\nKeep going 🚀",
      timestamp: "2 hours ago",
      read: false,
      starred: true,
      category: "feedback",
      priority: "high",
    },
  ];

  // =======================
  // FILTERS
  // =======================
  const filteredMessages = messages.filter(
    (msg) =>
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = messages.filter((m) => !m.read).length;
  const starredMessages = messages.filter((m) => m.starred);

  return (
    <div
      className={`min-h-screen p-8 ${
        isDark
          ? "bg-gradient-to-b from-[#0a0f1e] to-[#000000]"
          : "bg-[#f5f3ff]"
      }`}
    >
      {/* HEADER */}
     <MessagesHeader unreadCount={unreadCount} isDark={isDark} />


      {/* GRID */}
      <div className="grid grid-cols-3 gap-6">
        
        {/* LEFT: Messages List */}
        <MessagesList
          messages={messages}
          filteredMessages={filteredMessages}
          starredMessages={starredMessages}
          unreadCount={unreadCount}
          selectedMessage={selectedMessage}
          setSelectedMessage={setSelectedMessage}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isDark={isDark}
        />

        {/* RIGHT: Message Detail + Reply */}
        <div className="col-span-2">
          {selectedMessage ? (
            <>
              <MessageDetail message={selectedMessage} isDark={isDark} />

              <ReplyBox
                replyText={replyText}
                setReplyText={setReplyText}
                isDark={isDark}
              />
            </>
          ) : (
            <div className="h-[700px] flex items-center justify-center">
              <div className="text-center">
                <MessageSquare
                  className={isDark ? "text-[#6a7282]" : "text-purple-300"}
                  size={64}
                />
                <h3
                  className={`${
                    isDark ? "text-white" : "text-[#2e1065]"
                  } mb-2 font-semibold`}
                >
                  No message selected
                </h3>
                <p
                  className={
                    isDark ? "text-[#99a1af]" : "text-[#6b21a8]"
                  }
                >
                  Select a message from the list to view its content
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

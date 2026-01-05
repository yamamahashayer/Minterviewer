import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";
import { useAuth } from "./AuthContext";

/* ================= TYPES ================= */

export type Conversation = {
  _id: string;
  participants: any[];
  lastMessage?: {
    text: string;
    fromUser: string;
    toUser: string;
    read: boolean;
    createdAt: string;
  };
  lastActivity: string;
};

type MessageContextType = {
  conversations: Conversation[];
  unreadMessagesCount: number;
  refreshConversations: () => Promise<void>;
  markConversationAsRead: (conversationId: string) => Promise<void>;
};

/* ================= CONTEXT ================= */

const MessageContext = createContext<MessageContextType>(
  {} as MessageContextType
);

/* ================= PROVIDER ================= */

export const MessageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, isAuthenticated } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  const userId = (user as any)?._id || (user as any)?.id;

  /* ================= LOAD CONVERSATIONS ================= */

  const refreshConversations = async () => {
    if (!userId) return;

    try {
      const res = await api.get(`/api/chat/user/${userId}`);
      const json = res.data;

      if (json.ok && json.conversations) {
        setConversations(json.conversations);

        // 🔢 unread count (نفس منطق الويب)
        const unread = json.conversations.filter((c: Conversation) => {
          const last = c.lastMessage;
          return (
            last &&
            last.toUser === userId &&
            last.read === false
          );
        }).length;

        setUnreadMessagesCount(unread);
      }
    } catch (err) {
      console.error("refreshConversations error", err);
    }
  };

  /* ================= MARK AS READ ================= */

  const markConversationAsRead = async (conversationId: string) => {
    if (!userId) return;

    try {
      // Backend (MongoDB)
      await api.post("/api/chat/mark-read", {
        conversationId,
        userId,
      });

      // Update local state (instant UI)
      setConversations((prev) =>
        prev.map((c) =>
          c._id === conversationId && c.lastMessage
            ? {
                ...c,
                lastMessage: {
                  ...c.lastMessage,
                  read: true,
                },
              }
            : c
        )
      );

      // Recalculate unread
      setUnreadMessagesCount((prev) =>
        prev > 0 ? prev - 1 : 0
      );
    } catch (err) {
      console.error("markConversationAsRead error", err);
    }
  };

  /* ================= AUTO LOAD ================= */

  useEffect(() => {
    if (isAuthenticated && userId) {
      refreshConversations();
    }
  }, [isAuthenticated, userId]);

  return (
    <MessageContext.Provider
      value={{
        conversations,
        unreadMessagesCount,
        refreshConversations,
        markConversationAsRead,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

/* ================= HOOK ================= */

export function useMessages() {
  return useContext(MessageContext);
}

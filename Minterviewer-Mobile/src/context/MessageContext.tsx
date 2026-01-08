import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { messageService } from "../services/messageService";
import { useAuth } from "./AuthContext";

/* ================= TYPES ================= */

export type Conversation = {
  _id: string;
  participants: any[];
  lastMessage?: {
    text: string;
    createdAt: string;
  };
  lastActivity: string;
  unreadCount?: number;
};

type MessageContextType = {
  conversations: Conversation[];
  unreadMessagesCount: number;
  loading: boolean;
  error: string | null;
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = (user as any)?._id || (user as any)?.id;

  /* ================= LOAD CONVERSATIONS ================= */

  const refreshConversations = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      
      const json = await messageService.getConversations(userId);
      setConversations(json.conversations);

      // 🔢 unread count (نفس منطق الويب)
      const unread = json.conversations.filter((c: Conversation) => {
        return c.unreadCount && c.unreadCount > 0;
      }).reduce((sum, c) => sum + (c.unreadCount || 0), 0);

      setUnreadMessagesCount(unread);
    } catch (err: any) {
      console.error("refreshConversations error", err);
      
      // Handle 401 errors specifically
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
      } else {
        setError(`Failed to load conversations: ${err.message || 'Unknown error'}`);
      }
      
      // Set empty state on error
      setConversations([]);
      setUnreadMessagesCount(0);
    } finally {
      setLoading(false);
    }
  };

  /* ================= MARK AS READ ================= */

  const markConversationAsRead = async (conversationId: string) => {
    if (!userId) return;

    try {
      // Backend (MongoDB)
      await messageService.markAsRead({
        conversationId,
        userId,
      });

      // Update local state (instant UI)
      setConversations((prev) =>
        prev.map((c) =>
          c._id === conversationId
            ? {
                ...c,
                unreadCount: 0,
              }
            : c
        )
      );

      setUnreadMessagesCount(0);
    } catch (err) {
      console.error("markConversationAsRead error", err);
    }
  };

  /* ================= AUTO LOAD ================= */

  useEffect(() => {
    if (isAuthenticated && userId) {
      refreshConversations();
    } else if (!isAuthenticated) {
      // Reset state when not authenticated
      setConversations([]);
      setUnreadMessagesCount(0);
      setError(null);
      setLoading(false);
    }
  }, [isAuthenticated, userId]);

  return (
    <MessageContext.Provider
      value={{
        conversations,
        unreadMessagesCount,
        loading,
        error,
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

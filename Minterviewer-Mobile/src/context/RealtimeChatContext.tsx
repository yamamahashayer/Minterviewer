import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { messageService } from '../services/messageService';

// ================= TYPES ================= */
export interface Message {
  _id: string;
  text: string;
  createdAt: any;
  fromUser: string;
  toUser: string;
  fromSelf: boolean;
  read: boolean;
}

export interface Conversation {
  _id: string;
  participants: Array<{
    _id: string;
    name?: string;
  }>;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

export interface RealtimeChatContextType {
  conversations: Conversation[];
  messages: Message[];
  currentConversation: Conversation | null;
  unreadCount: number;
  loading: boolean;
  error: string | null;
  sendMessage: (text: string, toUser: string, conversationId: string) => Promise<void>;
  markAsRead: (conversationId: string) => Promise<void>;
  markAllAsRead: (conversationId: string) => Promise<void>;
  removeConversation: (conversationId: string) => Promise<void>;
  loadMessages: (conversationId: string) => Promise<void>;
}

// ================= CONTEXT ================= */
const RealtimeChatContext = createContext<RealtimeChatContextType>({
  conversations: [],
  messages: [],
  currentConversation: null,
  unreadCount: 0,
  loading: false,
  error: null,
  sendMessage: async () => {},
  markAsRead: async () => {},
  markAllAsRead: async () => {},
  removeConversation: async () => {},
  loadMessages: async () => {},
});

// ================= PROVIDER ================= */
export const RealtimeChatProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, isAuthenticated } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = (user as any)?._id || (user as any)?.id;

  // ================= DATA LOADING ================= */
  const loadConversations = async () => {
    if (!userId || !isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      console.log('Loading conversations for user:', userId);
      
      const response = await messageService.getConversations(userId);
      console.log('Conversations response:', response);
      
      // Transform the data to match our interface
      const transformedConversations = response.conversations.map(conv => ({
        _id: conv._id,
        participants: conv.participants.map(p => ({
          _id: p._id,
          name: p.full_name || p.email || 'Unknown'
        })),
        lastMessage: conv.lastMessage?.text,
        lastMessageTime: conv.lastActivity,
        unreadCount: conv.unreadCount
      }));
      
      setConversations(transformedConversations);
      
      // Calculate total unread count
      const totalUnread = transformedConversations.reduce((total, conv) => total + (conv.unreadCount || 0), 0);
      setUnreadCount(totalUnread);
      
    } catch (err: any) {
      console.error('Failed to load conversations:', err);
      setError(err.message || 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    if (!conversationId) return;
    
    try {
      console.log('Loading messages for conversation:', conversationId);
      
      const response = await messageService.getConversation(conversationId);
      console.log('Messages response:', response);
      
      // Transform messages to match our interface
      const transformedMessages = response.messages.map(msg => ({
        _id: msg._id,
        text: msg.text,
        createdAt: msg.createdAt,
        fromUser: msg.fromUser,
        toUser: msg.toUser,
        fromSelf: msg.fromUser === userId,
        read: msg.read
      }));
      
      setMessages(transformedMessages);
      
    } catch (err: any) {
      console.error('Failed to load messages:', err);
      setError(err.message || 'Failed to load messages');
    }
  };

  // Load conversations when user is authenticated
  useEffect(() => {
    if (isAuthenticated && userId) {
      loadConversations();
    }
  }, [isAuthenticated, userId]);

  // ================= ACTIONS ================= */
  const sendMessage = async (text: string, toUser: string, conversationId: string) => {
    try {
      console.log('Sending message:', { text, toUser, conversationId });
      
      // Send message via API
      const response = await messageService.sendMessage({
        conversationId,
        fromUser: userId,
        toUser,
        text
      });
      console.log('Message sent:', response);
      
      // Add message locally for immediate feedback
      const newMessage: Message = {
        _id: Date.now().toString(),
        text,
        fromUser: userId,
        toUser,
        createdAt: new Date(),
        fromSelf: true,
        read: true,
      };

      setMessages(prev => [...prev, newMessage]);
      
      // Update conversation's last message
      setConversations(prev => 
        prev.map(conv => 
          conv._id === conversationId 
            ? { ...conv, lastMessage: text, lastMessageTime: new Date().toISOString() }
            : conv
        )
      );
    } catch (err: any) {
      console.error("sendMessage error", err);
    }
  };

  const markAsRead = async (conversationId: string) => {
    try {
      console.log('Marking conversation as read:', conversationId);
      
      // Update local state
      setConversations(prev => 
        prev.map(conv => 
          conv._id === conversationId 
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev.filter(c => c._id !== conversationId).reduce((total, conv) => total + (conv.unreadCount || 0), 0) - 1));
    } catch (err: any) {
      console.error("markAsRead error", err);
    }
  };

  const markAllAsRead = async (conversationId: string) => {
    try {
      console.log('Marking all conversations as read');
      
      // Update local state
      setConversations(prev => 
        prev.map(conv => ({ ...conv, unreadCount: 0 }))
      );
      
      setUnreadCount(0);
    } catch (err: any) {
      console.error("markAllAsRead error", err);
    }
  };

  const removeConversation = async (conversationId: string) => {
    try {
      console.log('Removing conversation:', conversationId);
      
      // Find the conversation to be removed before updating state
      const removedConv = conversations.find(conv => conv._id === conversationId);
      
      // Update local state
      setConversations(prev => prev.filter(conv => conv._id !== conversationId));
      
      // Update unread count if the removed conversation had unread messages
      if (removedConv && removedConv.unreadCount) {
        setUnreadCount(prev => Math.max(0, prev - (removedConv.unreadCount as number)));
      }
    } catch (err: any) {
      console.error("removeConversation error", err);
    }
  };

  return (
    <RealtimeChatContext.Provider
      value={{
        conversations,
        messages,
        currentConversation,
        unreadCount,
        loading,
        error,
        sendMessage,
        markAsRead,
        markAllAsRead,
        removeConversation,
        loadMessages,
      }}
    >
      {children}
    </RealtimeChatContext.Provider>
  );
};

/* ================= HOOK ================= */
export function useRealtimeChat() {
  return useContext(RealtimeChatContext);
}
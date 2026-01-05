import { BaseService } from './baseService';

export interface Message {
  _id: string;
  text: string;
  createdAt: string;
  fromUser: string;
  toUser: string;
  fromSelf: boolean;
  read: boolean;
}

export interface Conversation {
  _id: string;
  participants: Array<{
    _id: string;
    full_name?: string;
    email?: string;
  }>;
  lastMessage?: {
    text: string;
    createdAt: string;
  };
  lastActivity: string;
  unreadCount?: number;
}

export class MessageService extends BaseService {
  async getConversations(userId: string): Promise<{ conversations: Conversation[] }> {
    return this.get(`/api/chat/user/${userId}`);
  }

  async getConversation(conversationId: string): Promise<{ messages: Message[] }> {
    return this.get(`/api/chat/conversation/${conversationId}`);
  }

  async sendMessage(data: {
    conversationId: string;
    fromUser: string;
    toUser: string;
    text: string;
  }): Promise<{ ok: boolean; message: Message }> {
    return this.post('/api/chat/messages', data);
  }

  async markAsRead(data: {
    conversationId: string;
    userId: string;
  }): Promise<{ ok: boolean }> {
    return this.post('/api/chat/mark-read', data);
  }

  async createConversation(data: {
    user1: string;
    user2: string;
  }): Promise<{ ok: boolean; conversation: Conversation }> {
    return this.post('/api/chat/conversation', data);
  }
}

export const messageService = new MessageService();

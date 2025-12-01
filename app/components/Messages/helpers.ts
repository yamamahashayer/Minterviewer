export interface IUser {
  _id: string;
  full_name: string;
}

export interface IMessage {
  _id: string;
  text: string;
  createdAt: number | string | Date;
  fromUser: string;
  toUser: string;
  fromSelf: boolean;
  read?: boolean;
}

export interface IConversation {
  _id: string;
  participants: IUser[];
  lastMessage?: IMessage;
}

export interface ReplyBoxProps {
  replyText: string;
  setReplyText: (value: string) => void;
  sendMessage: () => void;
  isDark: boolean;
  selectedConvo: IConversation | null;
  currentUserId: string | null;
}

export interface MessageDetailProps {
  messages: IMessage[];
  conversation: IConversation | null;
  isDark: boolean;
  currentUserId: string | null;
  isTyping: boolean;
}

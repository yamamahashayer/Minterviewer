import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  TouchableOpacity, 
  TextInput, 
  FlatList, 
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import MentorLayout from '../../layouts/MentorLayout';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useRealtimeChat } from '../../context/RealtimeChatContext';
import { colors } from '../../theme';

interface Message {
  _id: string;
  text: string;
  createdAt: string | number;
  fromUser: string;
  toUser: string;
  fromSelf: boolean;
  read: boolean;
}

interface Conversation {
  _id: string;
  participants: Array<{ _id: string; name?: string }>;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

const MentorMessagesScreen = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { 
    conversations, 
    messages, 
    currentConversation, 
    unreadCount, 
    loading, 
    error, 
    sendMessage: sendRealtimeMessage, 
    markAsRead, 
    markAllAsRead, 
    removeConversation,
    loadMessages
  } = useRealtimeChat();

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const currentUserId = user?.id || (user as any)?._id;

  const [replyText, setReplyText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesListRef = useRef<FlatList>(null);

  const openConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    await markAsRead(conversation._id);
    await loadMessages(conversation._id);
  };

  const sendMessage = async () => {
    if (!replyText.trim() || !currentConversation || !user?.id) return;

    const otherParticipant = currentConversation?.participants?.find(
      (p) => p._id !== user?.id
    );

    if (!otherParticipant) return;

    try {
      await sendRealtimeMessage(replyText, otherParticipant._id, currentConversation._id);
      setReplyText('');
    } catch (err: any) {
      console.error('Failed to send message:', err);
    }
  };

  const ConversationItem = ({ conversation }: { conversation: Conversation }) => (
    <TouchableOpacity
      style={[
        styles.conversationItem,
        { 
          backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'white',
          borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#e5e7eb'
        }
      ]}
      onPress={() => openConversation(conversation)}
    >
      <View style={styles.conversationHeader}>
        <View style={styles.participantInfo}>
          <Text style={[styles.participantName, { color: isDark ? 'white' : '#111827' }]}>
            {conversation.participants.find(p => p._id !== currentUserId)?.name || 'Unknown'}
          </Text>
          {conversation.lastMessage && (
            <Text style={[styles.lastMessage, { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }]} numberOfLines={1}>
              {conversation.lastMessage}
            </Text>
          )}
        </View>
        <View style={styles.conversationMeta}>
          {conversation.lastMessageTime && (
            <Text style={[styles.messageTime, { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }]}>
              {new Date(conversation.lastMessageTime).toLocaleDateString()}
            </Text>
          )}
          {conversation.unreadCount && conversation.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{conversation.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const MessageItem = ({ message }: { message: Message }) => (
    <View style={[
      styles.messageItem,
      message.fromSelf ? styles.selfMessage : null
    ]}>
      {!message.fromSelf && (
        <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
          <Text style={[styles.avatarText, { color: colors.primary }]}>
            {selectedConversation?.participants.find(p => p._id === message.fromUser)?.name?.charAt(0) || '?'}
          </Text>
        </View>
      )}
      <View style={[
        styles.messageContent,
        { 
          backgroundColor: message.fromSelf 
            ? colors.primary 
            : isDark ? 'rgba(255,255,255,0.1)' : 'white',
          borderColor: message.fromSelf 
            ? colors.primary 
            : isDark ? 'rgba(255,255,255,0.2)' : '#e5e7eb'
        }
      ]}>
        <Text style={[
          styles.messageText,
          { color: message.fromSelf ? 'white' : isDark ? 'white' : '#111827' }
        ]}>
          {message.text}
        </Text>
        <Text style={[
          styles.messageTime,
          { color: message.fromSelf ? 'rgba(255,255,255,0.7)' : isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }
        ]}>
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      {message.fromSelf && (
        <View style={[styles.avatar, { backgroundColor: 'rgba(107, 114, 128, 0.2)' }]}>
          <Text style={[styles.avatarText, { color: 'rgba(107, 114, 128, 0.7)' }]}>
            YOU
          </Text>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <MentorLayout>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }]}>
            Loading conversations...
          </Text>
        </View>
      </MentorLayout>
    );
  }

  if (error) {
    return (
      <MentorLayout>
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: colors.danger }]}>
            {error}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => window.location.reload()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </MentorLayout>
    );
  }

  if (selectedConversation) {
    return (
      <MentorLayout>
        <View style={styles.chatContainer}>
          {/* Chat Header */}
          <View style={[
            styles.chatHeader,
            { 
              backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'white',
              borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#e5e7eb'
            }
          ]}>
            <TouchableOpacity onPress={() => setSelectedConversation(null)}>
              <Ionicons name="arrow-back" size={24} color={isDark ? 'white' : '#111827'} />
            </TouchableOpacity>
            <View style={styles.chatHeaderInfo}>
              <Text style={[styles.chatTitle, { color: isDark ? 'white' : '#111827' }]}>
                {selectedConversation.participants.find(p => p._id !== currentUserId)?.name || 'Unknown'}
              </Text>
              {isTyping && (
                <Text style={[styles.typingIndicator, { color: colors.primary }]}>
                  typing...
                </Text>
              )}
            </View>
          </View>

          {/* Messages List */}
          <FlatList
            ref={messagesListRef}
            data={messages || []}
            renderItem={({ item }) => <MessageItem message={item} />}
            keyExtractor={(item) => item._id}
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContainer}
            inverted={false}
          />

          {/* Message Input */}
          <View style={[
            styles.messageInputContainer,
            { 
              backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'white',
              borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#e5e7eb'
            }
          ]}>
            <TextInput
              style={[
                styles.messageInput,
                { 
                  backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'white',
                  color: isDark ? 'white' : '#111827'
                }
              ]}
              placeholder="Type a message..."
              placeholderTextColor={isDark ? 'rgba(255,255,255,0.5)' : '#9ca3af'}
              value={replyText}
              onChangeText={setReplyText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                { backgroundColor: replyText.trim() ? colors.primary : 'rgba(107, 114, 128, 0.3)' }
              ]}
              onPress={sendMessage}
              disabled={!replyText.trim()}
            >
              <Ionicons name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </MentorLayout>
    );
  }

  return (
    <MentorLayout>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: isDark ? 'white' : '#111827' }]}>
            Messages
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }]}>
            Chat with students and admins
          </Text>
        </View>

        <ScrollView style={styles.conversationsList} showsVerticalScrollIndicator={false}>
          {conversations && conversations.length > 0 ? (
            conversations.map((conversation) => (
              <ConversationItem key={conversation._id} conversation={conversation} />
            ))
          ) : (
            <View style={styles.noDataContainer}>
              <Ionicons name="chatbubble-outline" size={48} color={isDark ? 'rgba(255,255,255,0.3)' : '#d1d5db'} />
              <Text style={[styles.noDataText, { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }]}>
                No conversations yet
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </MentorLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#000',
    fontWeight: '600',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  conversationsList: {
    flex: 1,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  conversationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  participantInfo: {
    flex: 1,
    marginRight: 12,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    opacity: 0.8,
  },
  conversationMeta: {
    alignItems: 'flex-end',
  },
  messageTime: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadCount: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
  },
  chatContainer: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  chatHeaderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  typingIndicator: {
    fontSize: 14,
    fontStyle: 'italic',
    opacity: 0.7,
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
  },
  messageItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  selfMessage: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '600',
  },
  messageContent: {
    maxWidth: '70%',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  noDataText: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 16,
  },
});

export default MentorMessagesScreen;

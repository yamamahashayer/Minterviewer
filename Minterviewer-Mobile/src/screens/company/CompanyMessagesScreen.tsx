import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

import CompanyLayout from '../../layouts/CompanyLayout';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme';

interface Message {
  _id: string;
  text: string;
  createdAt: string;
  fromUser: string;
  toUser: string;
  read: boolean;
}

interface Conversation {
  _id: string;
  participant: {
    _id: string;
    name: string;
    type: 'mentee' | 'company';
  };
  lastMessage: Message;
  unreadCount: number;
  jobTitle?: string;
}

export default function CompanyMessagesScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const { user, isAuthenticated } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!isAuthenticated || !user?.companyId) {
      setLoading(false);
      return;
    }

    fetchConversations();
  }, [isAuthenticated, user]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!user?.companyId) {
        setError('Company ID not found');
        return;
      }

      console.log('CompanyMessagesScreen: Fetching conversations for companyId:', user.companyId);
      const response = await api.get(`/api/chat/user/${user.companyId}`);
      const data = response.data;
      
      if (data.ok) {
        setConversations(data.conversations || []);
      } else {
        setError(data.message || 'Failed to load conversations');
      }
    } catch (e: any) {
      console.error('CompanyMessagesScreen: Error fetching conversations:', e);
      setError(e.message || 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    setLoadingMessages(true);
    try {
      console.log('CompanyMessagesScreen: Fetching messages for conversation:', conversationId);
      const response = await api.get(`/messages/${conversationId}`);
      const data = response.data;
      
      if (data.ok) {
        setMessages(data.messages || []);
      } else {
        console.error('Failed to load messages:', data.message);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation._id);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return;

    try {
      setSending(true);
      if (!user?.companyId) return;

      console.log('CompanyMessagesScreen: Sending message to:', selectedConversation.participant._id);
      const response = await api.post('/messages', {
        recipientId: selectedConversation.participant._id,
        content: messageText.trim(),
        senderType: 'company',
      });
      const data = response.data;
      
      if (data.ok) {
        const newMsg: Message = {
          _id: data.messageId,
          text: messageText.trim(),
          createdAt: new Date().toISOString(),
          fromUser: user.companyId,
          toUser: selectedConversation.participant._id,
          read: false,
        };

        setMessages([...messages, newMsg]);
        setMessageText('');
        
        // Update conversation's last message
        setConversations(conversations.map(conv => 
          conv._id === selectedConversation._id 
            ? { ...conv, lastMessage: newMsg }
            : conv
        ));
      } else {
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleBack = () => {
    setSelectedConversation(null);
    setMessages([]);
    fetchConversations();
  };

  const renderMessageItem = ({ item }: { item: Message }) => {
    const isMe = item.fromUser === user?.companyId;
    
    return (
      <View style={[
        styles.messageContainer,
        isMe ? styles.messageRight : styles.messageLeft
      ]}>
        <View style={[
          styles.messageBubble,
          {
            backgroundColor: isMe ? colors.primary : (isDark ? 'rgba(255,255,255,0.1)' : '#f3f4f6'),
            borderTopRightRadius: isMe ? 4 : 18,
            borderTopLeftRadius: isMe ? 18 : 4,
          }
        ]}>
          <Text style={[
            styles.messageText,
            { color: isMe ? 'white' : (isDark ? 'white' : '#1f2937') }
          ]}>
            {item.text}
          </Text>
          <Text style={[
            styles.messageTime,
            { color: isMe ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)' }
          ]}>
            {formatTime(item.createdAt)}
          </Text>
        </View>
      </View>
    );
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <CompanyLayout>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[
            styles.loadingText,
            { color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }
          ]}>
            Loading messages...
          </Text>
        </View>
      </CompanyLayout>
    );
  }

  if (error) {
    return (
      <CompanyLayout>
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={48} color={colors.danger} />
          <Text style={[styles.errorText, { color: colors.danger }]}>
            {error}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={fetchConversations}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </CompanyLayout>
    );
  }

  if (selectedConversation) {
    const other = selectedConversation.participant;
    
    return (
      <CompanyLayout>
        <View style={styles.chatContainer}>
          {/* Chat Header */}
          <View style={[
            styles.chatHeader,
            { borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb' }
          ]}>
            <TouchableOpacity onPress={handleBack}>
              <Ionicons name="arrow-back" size={24} color={isDark ? 'white' : 'black'} />
            </TouchableOpacity>
            <View style={styles.chatHeaderInfo}>
              <Text style={[
                styles.chatName,
                { color: isDark ? 'white' : '#1f2937' }
              ]}>
                {other.name}
              </Text>
              <Text style={[
                styles.chatStatus,
                { color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }
              ]}>
                Online
              </Text>
            </View>
          </View>

          {/* Messages */}
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item._id}
            renderItem={renderMessageItem}
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContainer}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => {
              setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
              }, 100);
            }}
          />

          {/* Message Input */}
          <View style={[
            styles.inputContainer,
            { borderTopColor: isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb' }
          ]}>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6',
                  color: isDark ? 'white' : 'black',
                }
              ]}
              placeholder="Type a message..."
              placeholderTextColor={isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'}
              value={messageText}
              onChangeText={setMessageText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                { backgroundColor: messageText.trim() ? colors.primary : (isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb') }
              ]}
              onPress={handleSendMessage}
              disabled={!messageText.trim() || sending}
            >
              {sending ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Ionicons 
                  name="send" 
                  size={20} 
                  color={messageText.trim() ? 'white' : (isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)')} 
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </CompanyLayout>
    );
  }

  return (
    <CompanyLayout>
      {/* Header */}
      <View style={styles.headerSection}>
        <Text style={[
          styles.title,
          { color: isDark ? 'white' : '#1f2937' }
        ]}>
          Messages
        </Text>
        <Text style={[
          styles.subtitle,
          { color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }
        ]}>
          Communicate with candidates and team members
        </Text>
      </View>

      {/* Conversations List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {conversations.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubble-ellipses-outline" size={48} color={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'} />
            <Text style={[
              styles.emptyText,
              { color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }
            ]}>
              No conversations yet
            </Text>
          </View>
        ) : (
          conversations.map((conversation) => {
            const other = conversation.participant;
            
            return (
              <TouchableOpacity
                key={conversation._id}
                style={[
                  styles.conversationItem,
                  {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'white',
                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
                  }
                ]}
                onPress={() => handleSelectConversation(conversation)}
              >
                <View style={styles.conversationHeader}>
                  <View style={styles.avatar}>
                    <Text style={[
                      styles.avatarText,
                      { color: isDark ? '#9ca3af' : '#6b7280' }
                    ]}>
                      {other.name?.charAt(0)?.toUpperCase() || 'U'}
                    </Text>
                  </View>
                  <View style={styles.conversationInfo}>
                    <Text style={[
                      styles.participantName,
                      { color: isDark ? 'white' : '#1f2937' }
                    ]}>
                      {other.name || 'Unknown User'}
                    </Text>
                    <Text style={[
                      styles.lastMessage,
                      { color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }
                    ]}>
                      {conversation.lastMessage?.text || 'No messages yet'}
                    </Text>
                  </View>
                  <Text style={[
                      styles.conversationTime,
                      { color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }
                    ]}>
                      {conversation.lastMessage?.createdAt
                        ? new Date(conversation.lastMessage.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : ''}
                    </Text>
                  {conversation.unreadCount > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>
                        {conversation.unreadCount}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </CompanyLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  headerSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 16,
  },
  content: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  conversationItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  conversationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  conversationInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  lastMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
  conversationTime: {
    fontSize: 12,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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
    marginLeft: 16,
  },
  chatName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  chatStatus: {
    fontSize: 14,
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  messageLeft: {
    alignSelf: 'flex-start',
  },
  messageRight: {
    alignSelf: 'flex-end',
  },
  messageBubble: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 18,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  messageTime: {
    fontSize: 12,
    paddingHorizontal: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    borderColor: 'transparent',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

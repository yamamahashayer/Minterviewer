import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import MenteeLayout from '../../layouts/MenteeLayout';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useMessages } from '../../context/MessageContext';
import { colors } from '../../theme';

interface Message {
  _id: string;
  text: string;
  createdAt: string;
  fromUser: string;
  toUser: string;
  fromSelf: boolean;
  read: boolean;
}

interface Conversation {
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

export default function MessagesScreen() {
  const { isDark } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const { conversations, loading, error, refreshConversations, markConversationAsRead } = useMessages();

  // State
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'recent'>('all');

  const flatListRef = useRef<FlatList>(null);

  // Get current user ID from AuthContext
  const currentUserId = (user as any)?._id || (user as any)?.id;

  // Refresh conversations when authentication changes
  useEffect(() => {
    if (isAuthenticated && currentUserId) {
      refreshConversations();
    }
  }, [isAuthenticated, currentUserId]);

  // Open conversation
  const openConversation = async (convo: Conversation) => {
    setActiveConversation(convo);

    try {
      const { messageService } = await import('../../services/messageService');
      const response = await messageService.getConversation(convo._id);

      if (response.messages) {
        const initial = response.messages.map((msg: any) => ({
          ...msg,
          fromSelf: msg.fromUser === currentUserId,
        }));

        const sorted = initial.sort(
          (a: Message, b: Message) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        setMessages(sorted);
        markConversationAsRead(convo._id);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
      Alert.alert('Error', 'Failed to load messages');
    }
  };

  // Mark conversation as read
  const markAsRead = async (convoId: string) => {
    try {
      const { messageService } = await import('../../services/messageService');
      await messageService.markAsRead({
        conversationId: convoId,
        userId: currentUserId,
      });
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!messageText.trim() || !activeConversation || !currentUserId) return;

    const other = activeConversation.participants.find(
      (p) => p._id !== currentUserId
    );
    if (!other) return;

    try {
      const { messageService } = await import('../../services/messageService');
      await messageService.sendMessage({
        conversationId: activeConversation._id,
        fromUser: currentUserId,
        toUser: other._id,
        text: messageText.trim(),
      });

      // Add message to local state for immediate feedback
      const newMessage: Message = {
        _id: Date.now().toString(),
        text: messageText.trim(),
        createdAt: new Date().toISOString(),
        fromUser: currentUserId,
        toUser: other._id,
        fromSelf: true,
        read: false,
      };

      setMessages(prev => [...prev, newMessage]);
      setMessageText('');

      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err) {
      console.error('Failed to send message:', err);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  // Filter conversations
  const filteredConversations = conversations.filter(convo => {
    const other = convo.participants.find(p => p._id !== currentUserId);
    
    const matchesSearch = !searchQuery || 
      other?.full_name?.toLowerCase().includes(searchQuery.toLowerCase());

    if (filter === 'unread') return convo.unreadCount && convo.unreadCount > 0;
    if (filter === 'recent') {
      const last = new Date(convo.lastActivity).getTime();
      const now = Date.now();
      return now - last < 24 * 60 * 60 * 1000; // 24h
    }

    return matchesSearch;
  });

  // Render conversation item
  const renderConversationItem = ({ item: convo }: { item: Conversation }) => {
    const other = convo.participants.find(p => p._id !== currentUserId);
    const isSelected = activeConversation?._id === convo._id;

    return (
      <TouchableOpacity
        style={[
          styles.conversationItem,
          {
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'white',
            borderColor: isSelected ? colors.primary : (isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'),
            borderWidth: isSelected ? 2 : 1,
          }
        ]}
        onPress={() => openConversation(convo)}
      >
        <View style={styles.conversationHeader}>
          <View style={[
            styles.avatar,
            { backgroundColor: isDark ? '#1f2937' : '#f3f4f6' }
          ]}>
            <Text style={[
              styles.avatarText,
              { color: isDark ? '#9ca3af' : '#6b7280' }
            ]}>
              {other?.full_name?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.conversationInfo}>
            <Text style={[
              styles.conversationName,
              { color: isDark ? 'white' : '#1f2937' }
            ]}>
              {other?.full_name || 'Unknown User'}
            </Text>
            <Text style={[
              styles.conversationTime,
              { color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }
            ]}>
              {convo.lastMessage?.createdAt
                ? new Date(convo.lastMessage.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : ''}
            </Text>
          </View>
          {convo.unreadCount && convo.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{convo.unreadCount}</Text>
            </View>
          )}
        </View>
        <Text style={[
          styles.lastMessage,
          { color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }
        ]}>
          {convo.lastMessage?.text || 'No messages yet'}
        </Text>
      </TouchableOpacity>
    );
  };

  // Render message item
  const renderMessageItem = ({ item: message }: { item: Message }) => {
    const isMe = message.fromSelf;

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
            {message.text}
          </Text>
        </View>
        <Text style={[
          styles.messageTime,
          { color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }
        ]}>
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    );
  };

  // Chat view
  if (activeConversation) {
    const other = activeConversation.participants.find(
      (p) => p._id !== currentUserId
    );

    return (
      <MenteeLayout>
        <View style={styles.chatContainer}>
          {/* Chat Header */}
          <View style={[
            styles.chatHeader,
            { borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb' }
          ]}>
            <TouchableOpacity onPress={() => setActiveConversation(null)}>
              <Ionicons name="arrow-back" size={24} color={isDark ? 'white' : 'black'} />
            </TouchableOpacity>
            <View style={styles.chatHeaderInfo}>
              <Text style={[
                styles.chatName,
                { color: isDark ? 'white' : 'black' }
              ]}>
                {other?.full_name || 'Unknown User'}
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
              onPress={sendMessage}
              disabled={!messageText.trim()}
            >
              <Ionicons 
                name="send" 
                size={20} 
                color={messageText.trim() ? 'white' : (isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)')} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </MenteeLayout>
    );
  }

  // Conversations list view
  if (loading) {
    return (
      <MenteeLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[
            styles.loadingText,
            { color: isDark ? colors.text.primaryDark : colors.text.primaryLight }
          ]}>
            Loading conversations...
          </Text>
        </View>
      </MenteeLayout>
    );
  }

  return (
    <MenteeLayout>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
            Stay connected with mentors and peers
          </Text>
        </View>

        {/* Search Bar */}
        <View style={[
          styles.searchBar,
          {
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'white',
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
          }
        ]}>
          <Ionicons name="search-outline" size={20} color={isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'} />
          <TextInput
            style={[
              styles.searchInput,
              { color: isDark ? 'white' : 'black' }
            ]}
            placeholder="Search conversations..."
            placeholderTextColor={isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          {(['all', 'unread', 'recent'] as const).map((filterType) => (
            <TouchableOpacity
              key={filterType}
              style={[
                styles.filterTab,
                {
                  backgroundColor: filter === filterType ? colors.primary : (isDark ? 'rgba(255,255,255,0.05)' : 'white'),
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
                }
              ]}
              onPress={() => setFilter(filterType)}
            >
              <Text style={[
                styles.filterTabText,
                { color: filter === filterType ? 'white' : (isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)') }
              ]}>
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Conversations List */}
        {filteredConversations.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubble-ellipses-outline" size={48} color={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'} />
            <Text style={[
              styles.emptyText,
              { color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }
            ]}>
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredConversations}
            keyExtractor={(item) => item._id}
            renderItem={renderConversationItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.conversationsList}
          />
        )}
      </ScrollView>
    </MenteeLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
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
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  filterTabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  conversationsList: {
    paddingBottom: 20,
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
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
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
  lastMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
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
    gap: 12,
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
});
                
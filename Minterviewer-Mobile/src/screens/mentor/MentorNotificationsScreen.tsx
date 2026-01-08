import React, { useMemo, useState } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { colors } from '../../theme';

import MentorLayout from '../../layouts/MentorLayout';

export default function MentorNotificationsScreen() {
  const { theme, isDark } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const { notifications, unreadCount, loading, error, refreshNotifications, markAsRead, markAllAsRead } = useNotifications();

  const [activeTab, setActiveTab] = useState('all');

  /* ================= FILTER (MEMO) ================= */
  const filtered = useMemo(() => {
    if (!notifications || notifications.length === 0) return [];
    
    if (activeTab === 'all') return notifications;
    if (activeTab === 'unread')
      return notifications.filter((n) => !n.read);
    return notifications.filter((n) => n.type === activeTab);
  }, [notifications, activeTab]);

  /* ================= RENDER NOTIFICATION ITEM ================= */
  const renderNotificationItem = ({ item }: { item: any }) => (
    <View style={[
      styles.notificationItem,
      {
        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'white',
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
      }
    ]}>
      <View style={styles.notificationHeader}>
        <View style={[
          styles.notificationIcon,
          { backgroundColor: item.read ? 'transparent' : `${colors.primary}20` }
        ]}>
          <Ionicons 
            name="notifications-outline" 
            size={20} 
            color={item.read ? (isDark ? '#9ca3af' : '#6b7280') : colors.primary} 
          />
        </View>
        <View style={styles.notificationContent}>
          <Text style={[
            styles.notificationTitle,
            { 
              color: isDark ? 'white' : '#1f2937',
              fontWeight: item.read ? 'normal' : '600'
            }
          ]}>
            {item.title}
          </Text>
          <Text style={[
            styles.notificationMessage,
            { color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }
          ]}>
            {item.message}
          </Text>
          <Text style={[
            styles.notificationTime,
            { color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }
          ]}>
            {item.createdAt ? 
              (item.createdAt.toDate ? 
                new Date(item.createdAt.toDate()).toLocaleDateString() : 
                new Date(item.createdAt).toLocaleDateString()
              ) : 
              ''
            }
          </Text>
        </View>
        {!item.read && (
          <TouchableOpacity
            style={[styles.markReadButton, { backgroundColor: colors.primary }]}
            onPress={() => markAsRead(item.id)}
          >
            <Ionicons name="checkmark" size={16} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  /* ================= UI ================= */
  return (
    <MentorLayout>
      {/* Header */}
      <View style={styles.headerSection}>
        <Text style={[
          styles.title,
          { color: isDark ? 'white' : '#1f2937' }
        ]}>
          Notifications
        </Text>
        <Text style={[
          styles.subtitle,
          { color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }
        ]}>
          {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
        </Text>
        {unreadCount > 0 && (
          <TouchableOpacity
            style={[styles.markAllReadButton, { backgroundColor: colors.primary }]}
            onPress={markAllAsRead}
          >
            <Text style={styles.markAllReadText}>Mark all as read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        {(['all', 'unread'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.filterTab,
              {
                backgroundColor: activeTab === tab ? colors.primary : (isDark ? 'rgba(255,255,255,0.05)' : 'white'),
                borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
              }
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[
              styles.filterTabText,
              { 
                color: activeTab === tab ? 'white' : (isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)')
              }
            ]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'unread' && unreadCount > 0 && ` (${unreadCount})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[
            styles.loadingText,
            { color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }
          ]}>
            Loading notifications...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={48} color={colors.danger} />
          <Text style={[styles.errorText, { color: colors.danger }]}>
            {error}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={refreshNotifications}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderNotificationItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Ionicons name="notifications-off-outline" size={48} color={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'} />
              <Text style={[
                styles.emptyText,
                { color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }
              ]}>
                No notifications yet
              </Text>
            </View>
          )}
          contentContainerStyle={styles.content}
          refreshing={loading}
          onRefresh={refreshNotifications}
        />
      )}
    </MentorLayout>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  content: { paddingBottom: 20 },
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
    padding: 16,
    paddingBottom: 8,
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
  markAllReadButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  markAllReadText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
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
  notificationItem: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    opacity: 0.6,
  },
  markReadButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
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
});

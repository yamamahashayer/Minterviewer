import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
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
import { companyService } from '../../services/companyService';

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

interface Notification {
  _id: string;
  type: 'application' | 'interview' | 'message' | 'system' | 'job';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: string;
  id?: string; // Add id for FlatList keyExtractor
}

export default function CompanyNotificationsScreen() {
  const { theme, isDark } = useTheme();
  const { user, isAuthenticated } = useAuth();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    if (!isAuthenticated || !user?.companyId) {
      setLoading(false);
      return;
    }

    loadNotifications();
  }, [isAuthenticated, user]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!user?.companyId) {
        setError('Company ID not found');
        return;
      }
      
      console.log('CompanyNotificationsScreen: Loading notifications for companyId:', user.companyId);
      const notificationsData = await companyService.getNotifications(user.companyId);
      console.log('CompanyNotificationsScreen: Notifications data:', notificationsData);
      setNotifications(notificationsData.notifications || []);
    } catch (e: any) {
      console.error('CompanyNotificationsScreen: Error loading notifications:', e);
      setError(e.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      if (!user?.companyId) return;
      
      const response = await api.put(`/company/${user.companyId}/notifications/${notificationId}/read`);
      
      if (response.data.ok) {
        setNotifications(notifications.map(notif =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        ));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      if (!user?.companyId) return;
      
      const response = await api.put(`/company/${user.companyId}/notifications/read-all`);
      
      if (response.data.ok) {
        setNotifications(notifications.map(notif => ({ ...notif, read: true })));
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      Alert.alert('Error', 'Failed to mark all notifications as read');
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      const response = await api.delete(`/notifications/${notificationId}`);

      if (response.data.ok) {
        setNotifications(notifications.filter(notif => notif._id !== notificationId));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      Alert.alert('Error', 'Failed to delete notification');
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification._id);
    }
    // Navigation removed - notifications are handled locally
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
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
            {formatTime(item.createdAt)}
          </Text>
        </View>
        {!item.read && (
          <TouchableOpacity
            style={[styles.markReadButton, { backgroundColor: colors.primary }]}
            onPress={() => handleMarkAsRead(item._id || item.id || '')}
          >
            <Ionicons name="checkmark" size={16} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

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

  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(n => !n.read);
      default:
        return notifications;
    }
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <CompanyLayout>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[
            styles.loadingText,
            { color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }
          ]}>
            Loading notifications...
          </Text>
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
            onPress={handleMarkAllAsRead}
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
                backgroundColor: filter === tab ? colors.primary : (isDark ? 'rgba(255,255,255,0.05)' : 'white'),
                borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
              }
            ]}
            onPress={() => setFilter(tab as any)}
          >
            <Text style={[
              styles.filterTabText,
              { 
                color: filter === tab ? 'white' : (isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)')
              }
            ]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'unread' && unreadCount > 0 && ` (${unreadCount})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={48} color={colors.danger} />
          <Text style={[styles.errorText, { color: colors.danger }]}>
            {error}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={loadNotifications}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredNotifications}
          keyExtractor={(item) => item._id || item.id || ''}
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
          onRefresh={loadNotifications}
        />
      )}
    </CompanyLayout>
  );
}

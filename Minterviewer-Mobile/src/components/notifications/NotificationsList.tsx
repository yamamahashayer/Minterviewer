import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { colors } from '../../theme';
import { useNotifications } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';

export default function NotificationsList({
  notifications,
  activeTab,
}: {
  notifications: any[];
  activeTab: string;
}) {
  const navigation = useNavigation<any>();
  const { isDark } = useTheme();
  const { markAsRead } = useNotifications();

  /* ================= PRESS HANDLER ================= */
  const handlePress = async (item: any) => {
    // ✅ علّمها read
    if (!item.read && item.id) {
      await markAsRead(item.id);
    }

    // ✅ انتقل إذا في لينك
    if (item.link) {
      navigation.navigate(item.link);
    }
  };

  /* ================= RENDER ITEM ================= */
  const renderItem = ({ item }: { item: any }) => {
    const unread = !item.read;

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => handlePress(item)}
        style={[
          styles.card,
          {
            backgroundColor: isDark
              ? unread
                ? '#020617'
                : '#020617cc'
              : unread
              ? '#ffffff'
              : '#f8fafc',
            borderColor: unread
              ? colors.primary
              : isDark
              ? '#334155'
              : '#e5e7eb',
          },
        ]}
      >
        {/* ICON */}
        <View
          style={[
            styles.iconWrap,
            {
              backgroundColor:
                item.type === 'success'
                  ? 'rgba(34,197,94,0.15)'
                  : item.type === 'warning'
                  ? 'rgba(234,179,8,0.15)'
                  : item.type === 'error'
                  ? 'rgba(239,68,68,0.15)'
                  : 'rgba(59,130,246,0.15)',
            },
          ]}
        >
          <Ionicons
            name={
              item.type === 'success'
                ? 'checkmark-circle'
                : item.type === 'warning'
                ? 'warning'
                : item.type === 'error'
                ? 'close-circle'
                : 'information-circle'
            }
            size={22}
            color={
              item.type === 'success'
                ? '#22c55e'
                : item.type === 'warning'
                ? '#eab308'
                : item.type === 'error'
                ? '#ef4444'
                : '#3b82f6'
            }
          />
        </View>

        {/* CONTENT */}
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.title,
              {
                color: isDark ? '#fff' : '#111',
                fontWeight: unread ? '700' : '600',
              },
            ]}
          >
            {item.title}
          </Text>

          <Text
            style={[
              styles.message,
              { color: isDark ? '#cbd5f5' : '#555' },
            ]}
            numberOfLines={2}
          >
            {item.message}
          </Text>

          {item.createdAt && (
            <Text
              style={[
                styles.time,
                { color: isDark ? '#64748b' : '#888' },
              ]}
            >
              {new Date(
                item.createdAt.seconds * 1000
              ).toLocaleString()}
            </Text>
          )}
        </View>

        {/* UNREAD DOT */}
        {unread && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  /* ================= EMPTY STATE ================= */
  if (!notifications.length) {
    return (
      <View style={{ marginTop: 40, alignItems: 'center' }}>
        <Text
          style={{
            color: isDark ? '#94a3b8' : '#777',
            fontSize: 14,
          }}
        >
          No notifications found
        </Text>
      </View>
    );
  }

  /* ================= LIST ================= */
  return (
    <FlatList
      data={notifications}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={{ gap: 12 }}
      showsVerticalScrollIndicator={false}
    />
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'flex-start',
  },

  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },

  title: {
    fontSize: 15,
  },

  message: {
    fontSize: 13,
    marginTop: 2,
  },

  time: {
    fontSize: 11,
    marginTop: 6,
  },

  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginTop: 6,
  },
});

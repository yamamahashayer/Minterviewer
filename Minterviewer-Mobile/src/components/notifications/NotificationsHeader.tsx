import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../theme';
import { db } from '../../lib/firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';

export default function NotificationsHeader({
  notifications,
  theme = 'dark',
}: {
  notifications: any[];
  theme?: 'dark' | 'light';
}) {
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  /* ================= ACTIONS ================= */

  const handleMarkAllRead = async () => {
    setLoading(true);
    try {
      const unread = notifications.filter((n) => !n.read && n.id);

      for (const n of unread) {
        await updateDoc(doc(db, 'notifications', n.id), {
          read: true,
        });
      }
    } catch (e) {
      console.error('Mark all read error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    setLoading(true);
    try {
      for (const n of notifications) {
        if (!n.id) continue;
        await deleteDoc(doc(db, 'notifications', n.id));
      }
    } catch (e) {
      console.error('Clear all error:', e);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <View style={styles.container}>
      {/* LEFT */}
      <View>
        <View style={styles.titleRow}>
          <Text
            style={[
              styles.title,
              { color: isDark ? '#fff' : '#3b0764' },
            ]}
          >
            Notifications
          </Text>

          <Ionicons
            name="notifications-outline"
            size={22}
            color={isDark ? '#2dd4bf' : '#7c3aed'}
            style={{ marginLeft: 6 }}
          />
        </View>

        {unreadCount > 0 && (
          <View
            style={[
              styles.badge,
              {
                backgroundColor: isDark
                  ? '#14b8a6'
                  : '#e9d5ff',
                borderColor: isDark
                  ? 'transparent'
                  : '#c4b5fd',
              },
            ]}
          >
            <Text
              style={{
                color: isDark ? '#fff' : '#6b21a8',
                fontWeight: '600',
              }}
            >
              {unreadCount} new
            </Text>
          </View>
        )}
      </View>

      {/* RIGHT ACTIONS */}
      <View style={styles.actions}>
        {unreadCount > 0 && (
          <TouchableOpacity
            onPress={handleMarkAllRead}
            disabled={loading}
            style={[
              styles.button,
              {
                backgroundColor: isDark
                  ? 'rgba(20,184,166,0.15)'
                  : '#ede9fe',
                borderColor: isDark
                  ? 'rgba(45,212,191,0.5)'
                  : '#c4b5fd',
              },
            ]}
          >
            {loading ? (
              <ActivityIndicator size="small" />
            ) : (
              <>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={16}
                  color={isDark ? '#5eead4' : '#6d28d9'}
                />
                <Text
                  style={[
                    styles.buttonText,
                    { color: isDark ? '#5eead4' : '#6d28d9' },
                  ]}
                >
                  Mark all
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {notifications.length > 0 && (
          <TouchableOpacity
            onPress={handleClearAll}
            disabled={loading}
            style={[
              styles.button,
              {
                backgroundColor: isDark
                  ? 'rgba(239,68,68,0.15)'
                  : '#fee2e2',
                borderColor: isDark
                  ? 'rgba(248,113,113,0.5)'
                  : '#fecaca',
              },
            ]}
          >
            {loading ? (
              <ActivityIndicator size="small" />
            ) : (
              <>
                <Ionicons
                  name="trash-outline"
                  size={16}
                  color={isDark ? '#fca5a5' : '#b91c1c'}
                />
                <Text
                  style={[
                    styles.buttonText,
                    { color: isDark ? '#fca5a5' : '#b91c1c' },
                  ]}
                >
                  Clear
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  title: {
    fontSize: 22,
    fontWeight: '800',
  },

  badge: {
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },

  actions: {
    flexDirection: 'row',
    gap: 8,
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },

  buttonText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

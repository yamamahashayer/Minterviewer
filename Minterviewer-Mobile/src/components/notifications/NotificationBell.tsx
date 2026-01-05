import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { colors } from '../../theme';
import { useNotifications } from '../../context/NotificationContext';

export default function NotificationBell({ isDark }: { isDark: boolean }) {
  const navigation = useNavigation<any>();
  const { notifications, unreadCount } = useNotifications();

  const [open, setOpen] = useState(false);

  const preview = notifications.slice(0, 3);

  return (
    <>
      {/* 🔔 BELL BUTTON */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setOpen((v) => !v)}
        style={[
          styles.bellButton,
          {
            backgroundColor: isDark
              ? 'rgba(255,255,255,0.08)'
              : 'rgba(0,0,0,0.05)',
          },
        ]}
      >
        <Ionicons
          name="notifications-outline"
          size={22}
          color={isDark ? colors.text.primaryDark : colors.text.primaryLight}
        />

        {unreadCount > 0 && <View style={styles.badge} />}
      </TouchableOpacity>

      {/* 🔽 NOTIFICATION POLL */}
      {open && (
        <>
          {/* OVERLAY – click outside = close */}
          <Pressable
            style={styles.overlay}
            onPress={() => setOpen(false)}
          />

          <View
            style={[
              styles.poll,
              {
                backgroundColor: isDark ? '#0f172a' : '#fff',
                borderColor: isDark ? '#334155' : '#e5e7eb',
              },
            ]}
          >
            {preview.length === 0 ? (
              <Text
                style={{
                  textAlign: 'center',
                  color: isDark ? '#cbd5f5' : '#666',
                }}
              >
                No notifications
              </Text>
            ) : (
              preview.map((n) => (
                <TouchableOpacity
                  key={n.id}
                  style={styles.item}
                  onPress={() => {
                    setOpen(false);
                    navigation.navigate('Notifications');
                  }}
                >
                  <Text
                    style={[
                      styles.title,
                      { color: isDark ? '#fff' : '#111' },
                    ]}
                  >
                    {n.title}
                  </Text>

                  <Text
                    style={[
                      styles.message,
                      { color: isDark ? '#cbd5f5' : '#555' },
                    ]}
                    numberOfLines={2}
                  >
                    {n.message}
                  </Text>
                </TouchableOpacity>
              ))
            )}

            <TouchableOpacity
              style={styles.viewAll}
              onPress={() => {
                setOpen(false);
                navigation.navigate('Notifications');
              }}
            >
              <Text style={{ color: colors.primary, fontWeight: '600' }}>
                View all notifications →
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  bellButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.danger,
  },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 998,
  },

  poll: {
    position: 'absolute',
    top: 56,
    right: 16,
    width: 300,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    zIndex: 999,
    elevation: 10,
  },

  item: {
    paddingVertical: 8,
  },

  title: {
    fontSize: 14,
    fontWeight: '600',
  },

  message: {
    fontSize: 13,
    marginTop: 2,
  },

  viewAll: {
    marginTop: 10,
    alignItems: 'center',
  },
});

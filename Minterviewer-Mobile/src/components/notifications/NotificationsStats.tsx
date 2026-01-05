import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme';

export default function NotificationsStats({
  notifications,
  theme = 'dark',
}: {
  notifications: any[];
  theme?: 'dark' | 'light';
}) {
  const isDark = theme === 'dark';

  const unread = notifications.filter((n) => !n.read).length;
  const achievements = notifications.filter(
    (n) => n.type === 'achievement'
  ).length;
 

  const StatBox = ({
    icon,
    title,
    value,
    badge,
    color,
  }: {
    icon: any;
    title: string;
    value: number;
    badge: string;
    color: string;
  }) => (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark
            ? 'rgba(255,255,255,0.05)'
            : '#fff',
          borderColor: isDark
            ? 'rgba(255,255,255,0.1)'
            : '#ddd6fe',
        },
      ]}
    >
      {/* HEADER */}
      <View style={styles.cardHeader}>
        <Ionicons
          name={icon}
          size={20}
          color={color}
        />

        <View
          style={[
            styles.badge,
            {
              backgroundColor: isDark
                ? `${color}33`
                : `${color}22`,
              borderColor: `${color}55`,
            },
          ]}
        >
          <Text style={[styles.badgeText, { color }]}>
            {badge}
          </Text>
        </View>
      </View>

      {/* VALUE */}
      <Text
        style={[
          styles.value,
          { color: isDark ? '#fff' : '#3b0764' },
        ]}
      >
        {value}
      </Text>

      {/* LABEL */}
      <Text
        style={[
          styles.label,
          { color: isDark ? '#94a3b8' : '#6b21a8' },
        ]}
      >
        {title}
      </Text>
    </View>
  );

  return (
    <View style={styles.grid}>
      <StatBox
        icon="notifications-outline"
        title="Total"
        value={notifications.length}
        badge="All"
        color={colors.primary}
      />

      <StatBox
        icon="mail-outline"
        title="Unread"
        value={unread}
        badge="Unread"
        color="#3b82f6"
      />

      
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },

  card: {
    width: '48%',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },

  value: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 2,
  },

  label: {
    fontSize: 12,
    marginTop: 2,
  },
});

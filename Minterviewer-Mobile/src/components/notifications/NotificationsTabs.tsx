import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { colors } from '../../theme';
import { useTheme } from '../../context/ThemeContext';

export default function NotificationsTabs({
  activeTab,
  setActiveTab,
  notifications,
}: {
  activeTab: string;
  setActiveTab: (value: string) => void;
  notifications: any[];
}) {
  const { isDark } = useTheme();

  const tabs = [
    {
      id: 'all',
      label: 'All',
      count: notifications.length,
    },
    {
      id: 'unread',
      label: 'Unread',
      count: notifications.filter((n) => !n.read).length,
    },
    
  ];

  return (
    <View
      style={[
        styles.wrapper,
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
      {tabs.map((tab) => {
        const active = activeTab === tab.id;

        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            style={[
              styles.tab,
              active && {
                backgroundColor: isDark
                  ? 'rgba(45,212,191,0.2)'
                  : '#ede9fe',
              },
            ]}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.label,
                {
                  color: active
                    ? isDark
                      ? '#5eead4'
                      : '#6d28d9'
                    : isDark
                    ? '#cbd5f5'
                    : '#4c1d95',
                },
              ]}
            >
              {tab.label}
            </Text>

            {tab.count > 0 && (
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: isDark
                      ? 'rgba(45,212,191,0.35)'
                      : '#ddd6fe',
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '600',
                    color: isDark ? '#99f6e4' : '#6d28d9',
                  }}
                >
                  {tab.count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 1,
    borderRadius: 14,
    padding: 6,
    gap: 6,
    marginBottom: 20,
  },

  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
  },

  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
});

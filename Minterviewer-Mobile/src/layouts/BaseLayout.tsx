import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme';
import NotificationBell from '../components/notifications/NotificationBell';
import { useTheme } from '../context/ThemeContext';

interface BaseLayoutProps {
  children: React.ReactNode;
  roleTitle: string;
  roleSubtitle: string;
}

export default function BaseLayout({
  children,
  roleTitle,
  roleSubtitle,
}: BaseLayoutProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: isDark
            ? colors.background.dark
            : colors.background.light,
        },
      ]}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View
        style={[
          styles.header,
          {
            backgroundColor: isDark
              ? colors.background.headerDark
              : colors.background.headerLight,
            borderBottomColor: isDark
              ? colors.border.dark
              : colors.border.light,
          },
        ]}
      >
        {/* LEFT */}
        <View>
          <Text
            style={[
              styles.title,
              { color: isDark ? colors.text.primaryDark : colors.text.primaryLight },
            ]}
          >
            Minterviewer
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: isDark ? colors.text.secondaryDark : colors.text.secondaryLight },
            ]}
          >
            {roleSubtitle}
          </Text>
        </View>

        {/* RIGHT */}
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={toggleTheme}
            style={[
              styles.iconButton,
              {
                backgroundColor: isDark
                  ? 'rgba(255,255,255,0.08)'
                  : 'rgba(0,0,0,0.05)',
              },
            ]}
          >
            <Ionicons
              name={isDark ? 'sunny-outline' : 'moon-outline'}
              size={22}
              color={isDark ? '#facc15' : colors.primary}
            />
          </TouchableOpacity>

          <NotificationBell isDark={isDark} />
        </View>
      </View>

      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 16,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.4,
  },

  subtitle: {
    fontSize: 13,
    marginTop: 2,
    opacity: 0.85,
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

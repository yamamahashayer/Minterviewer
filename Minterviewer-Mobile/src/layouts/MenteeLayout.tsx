import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme';

type Theme = 'dark' | 'light';

export default function MenteeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /* ================= THEME ================= */
  const [theme, setTheme] = useState<Theme>('dark');
  const isDark = theme === 'dark';

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') {
        setTheme(saved);
      }
    })();
  }, []);

  const toggleTheme = async () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    await AsyncStorage.setItem('theme', next);
  };

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
      {/* ========== HEADER ========== */}
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
        <Text
          style={[
            styles.title,
            {
              color: isDark
                ? colors.text.primaryDark
                : colors.text.primaryLight,
            },
          ]}
        >
          Minterviewer
        </Text>

        <View style={styles.headerRight}>
          {/* Theme Toggle */}
          <TouchableOpacity
            onPress={toggleTheme}
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isDark ? 'sunny-outline' : 'moon-outline'}
              size={26}
              color={isDark ? '#facc15' : colors.primary}
            />
          </TouchableOpacity>

          {/* Notification */}
          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name="notifications-outline"
              size={26}
              color={
                isDark
                  ? colors.text.primaryDark
                  : colors.text.primaryLight
              }
            />
            <View style={styles.badge} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ========== CONTENT ========== */}
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
    height: 90,                // ⬆️ أكبر
    paddingHorizontal: 20,     // ⬆️ أوسع
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    fontSize: 27,              // ⬆️ أوضح
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  headerRight: {
    flexDirection: 'row',
    gap: 3,
  },

  iconButton: {
    padding: 15,               // ⬆️ أسهل بالكبس
    borderRadius: 14,
    position: 'relative',
  },

  badge: {
    position: 'absolute',
    top: 10,
    right: 6,
    width: 10,                 // ⬆️ أكبر
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.danger,
  },

  content: {
    flex: 1,
    paddingHorizontal: 80,     // ⬆️ أريح
    paddingVertical: 50,
  },
});

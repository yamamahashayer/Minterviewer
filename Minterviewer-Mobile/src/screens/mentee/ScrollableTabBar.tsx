import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../../theme';
import { useTheme } from '../../context/ThemeContext';

export default function ScrollableTabBar({
  state,
  descriptors,
  navigation,
}: any) {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const [expanded, setExpanded] = useState(false);

  // ⭐ تحكم ذكي بحجم الأيقونات
  const iconSize = expanded
    ? { focused: 28, normal: 24 }   // مفتوح
    : { focused: 24, normal: 20 };  // مسكّر

  return (
    <View
      style={[
        styles.wrapper,
        {
          paddingBottom: insets.bottom,
          backgroundColor: isDark
            ? colors.background.dark
            : colors.background.light,
          borderTopColor: isDark
            ? colors.border.dark
            : colors.border.light,
          height: expanded ? 260 : undefined, // ⭐ يفتح لفوق
        },
      ]}
    >
      {/* 🔼 زر التوسيع */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setExpanded(!expanded)}
        style={styles.handle}
      >
        <Ionicons
          name={expanded ? 'chevron-down' : 'chevron-up'}
          size={22}
          color={isDark ? colors.text.secondary : colors.text.muted}
        />
      </TouchableOpacity>

      <ScrollView
        horizontal={!expanded}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          expanded && styles.scrollExpanded,
        ]}
      >
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? route.name;
        const iconName =
          options.tabBarIconName ||
          options.tabBarIcon ||
          'ellipse-outline'; 
          const focused = state.index === index;

          return (
            <TouchableOpacity
              key={route.key}
              activeOpacity={0.85}
              onPress={() => {
                navigation.navigate(route.name);
                setExpanded(false); // ⭐ يسكر بعد الاختيار
              }}
              style={[
                styles.tab,
                expanded && styles.tabExpanded,
                focused && {
                  backgroundColor: isDark
                    ? 'rgba(255,255,255,0.08)'
                    : 'rgba(124,58,237,0.1)',
                },
              ]}
            >
              <Ionicons
                name={iconName}
                size={focused ? iconSize.focused : iconSize.normal}
                color={
                  focused
                    ? colors.primary
                    : isDark
                    ? colors.text.secondary
                    : colors.text.muted
                }
              />

              <Text
                style={[
                  styles.label,
                  {
                    color: focused
                      ? colors.primary
                      : isDark
                      ? colors.text.secondary
                      : colors.text.muted,
                  },
                ]}
              >
                {label}
              </Text>

              {focused && <View style={styles.indicator} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: 1,
    paddingTop: 6,

    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: -4 },
      },
      android: {
        elevation: 12,
      },
    }),
  },

  handle: {
    alignItems: 'center',
    paddingVertical: 6,
  },

  scroll: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  scrollExpanded: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingVertical: 8,
  },

  tab: {
    width: 86,
    height: 60,
    marginHorizontal: 6,
    marginBottom: 8,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tabExpanded: {
    width: 100,
  },

  label: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
  },

  indicator: {
    marginTop: 6,
    width: 18,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
});
 
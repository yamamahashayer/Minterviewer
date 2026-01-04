import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme';

export default function ScrollableTabBar({
  state,
  descriptors,
  navigation,
  theme = 'dark',
}: any) {
  const isDark = theme === 'dark';

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: isDark
            ? colors.background.dark     // 🌙 web dark
            : colors.background.light,   // ☀️ web light
          borderTopColor: isDark
            ? colors.border.dark
            : colors.border.light,
        },
      ]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        decelerationRate="fast"
        snapToAlignment="center"
      >
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? route.name;
          const iconName = options.tabBarIconName;
          const focused = state.index === index;

          return (
            <TouchableOpacity
              key={route.key}
              activeOpacity={0.8}
              onPress={() => navigation.navigate(route.name)}
              style={[
                styles.tab,
                focused && {
                  backgroundColor: isDark
                    ? 'rgba(255,255,255,0.06)' // web dark card
                    : 'rgba(124,58,237,0.08)', // web light tint
                },
              ]}
            >
              <Ionicons
                name={iconName}
                size={focused ? 26 : 24}
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

              {focused && (
                <View
                  style={[
                    styles.indicator,
                    { backgroundColor: colors.primary },
                  ]}
                />
              )}
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
    height: 86,
    borderTopWidth: 1,

    // نفس إحساس الويب
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: -4 },
      },
      android: {
        elevation: 10,
      },
    }),
  },

  scroll: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  tab: {
    width: 86,
    height: 70,
    marginHorizontal: 6,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
});

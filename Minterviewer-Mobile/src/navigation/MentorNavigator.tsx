import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import MentorDashboardScreen from '../screens/mentor/MentorDashboardScreen';
import MentorProfileScreen from '../screens/mentor/MentorProfileScreen';
import MentorSessionsScreen from '../screens/mentor/MentorSessionsScreen';
import MentorCalendarScreen from '../screens/mentor/MentorCalendarScreen';
import MentorMessagesScreen from '../screens/mentor/MentorMessagesScreen';
import MentorSettingsScreen from '../screens/mentor/MentorSettingsScreen';
import MentorAnalyticsScreen from '../screens/mentor/MentorAnalyticsScreen';
import MentorStudentsScreen from '../screens/mentor/MentorStudentsScreen';
import MentorReviewsScreen from '../screens/mentor/MentorReviewsScreen';
import MentorNotificationsScreen from '../screens/mentor/MentorNotificationsScreen';

import ScrollableTabBar from '../screens/mentee/ScrollableTabBar';

const Tab = createBottomTabNavigator();

/* ================= TAB CONFIG ================= */
const tabs = [
  { name: 'Dashboard', label: 'Dashboard', icon: 'home-outline', component: MentorDashboardScreen },
  { name: 'Profile', label: 'Profile', icon: 'person-outline', component: MentorProfileScreen },
  { name: 'Sessions', label: 'Sessions', icon: 'videocam-outline', component: MentorSessionsScreen },
  { name: 'Calendar', label: 'Calendar', icon: 'calendar-outline', component: MentorCalendarScreen },
  { name: 'Students', label: 'Students', icon: 'people-outline', component: MentorStudentsScreen },
  { name: 'Analytics', label: 'Analytics', icon: 'analytics-outline', component: MentorAnalyticsScreen },
  { name: 'Reviews', label: 'Reviews', icon: 'star-outline', component: MentorReviewsScreen },
  { name: 'Messages', label: 'Messages', icon: 'chatbubble-ellipses-outline', component: MentorMessagesScreen, badge: 2 },
  { name: 'Notifications', label: 'Alerts', icon: 'notifications-outline', component: MentorNotificationsScreen },
  { name: 'Settings', label: 'Settings', icon: 'settings-outline', component: MentorSettingsScreen },
];

/* ================= NAVIGATOR ================= */
export default function MentorNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <ScrollableTabBar {...props} />}
    >
      {tabs.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            tabBarLabel: tab.label,
            tabBarBadge: tab.badge,
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import OverviewScreen from '../screens/mentee/OverviewScreen';
import ProfileScreen from '../screens/mentee/ProfileScreen';
import CVReviewScreen from '../screens/mentee/CVReviewScreen';
import ExploreJobsScreen from '../screens/mentee/ExploreJobsScreen';
import MessagesScreen from '../screens/mentee/MessagesScreen';

import InterviewPracticeScreen from '../screens/mentee/InterviewPracticeScreen';
import NotificationsScreen from '../screens/mentee/NotificationsScreen';
import ScheduleScreen from '../screens/mentee/ScheduleScreen';
import BrowseSessionsScreen from '../screens/mentee/BrowseSessionsScreen';

import ScrollableTabBar from '../screens/mentee/ScrollableTabBar';

const Tab = createBottomTabNavigator();

/* ================= TAB CONFIG ================= */
const tabs = [
  { name: 'Overview', label: 'Overview', icon: 'home-outline', component: OverviewScreen },
  { name: 'Profile', label: 'Profile', icon: 'person-outline', component: ProfileScreen },
  { name: 'CV', label: 'CV', icon: 'document-text-outline', component: CVReviewScreen },
  { name: 'Jobs', label: 'Jobs', icon: 'briefcase-outline', component: ExploreJobsScreen },
  { name: 'Interview', label: 'Interview', icon: 'mic-outline', component: InterviewPracticeScreen },
  { name: 'Schedule', label: 'Schedule', icon: 'calendar-outline', component: ScheduleScreen },
  { name: 'Sessions', label: 'Sessions', icon: 'search-outline', component: BrowseSessionsScreen },
  { name: 'Messages', label: 'Messages', icon: 'chatbubble-ellipses-outline', component: MessagesScreen, badge: 3 },
  { name: 'Notifications', label: 'Alerts', icon: 'notifications-outline', component: NotificationsScreen },
];

/* ================= NAVIGATOR ================= */
export default function MenteeNavigator() {
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
            tabBarIconName: tab.icon,
            tabBarBadge: tab.badge,
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

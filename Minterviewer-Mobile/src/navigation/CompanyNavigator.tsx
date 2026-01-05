import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import CompanyDashboardScreen from '../screens/company/CompanyDashboardScreen';
import CompanyProfileScreen from '../screens/company/CompanyProfileScreen';
import CompanyJobsScreen from '../screens/company/CompanyJobsScreen';
import CompanyCandidatesScreen from '../screens/company/CompanyCandidatesScreen';
import CompanyInterviewsScreen from '../screens/company/CompanyInterviewsScreen';
import CompanyMessagesScreen from '../screens/company/CompanyMessagesScreen';
import CompanySettingsScreen from '../screens/company/CompanySettingsScreen';
import CompanyAnalyticsScreen from '../screens/company/CompanyAnalyticsScreen';
import CompanyTeamScreen from '../screens/company/CompanyTeamScreen';
import CompanyReviewsScreen from '../screens/company/CompanyReviewsScreen';
import CompanyNotificationsScreen from '../screens/company/CompanyNotificationsScreen';

import ScrollableTabBar from '../screens/mentee/ScrollableTabBar';

const Tab = createBottomTabNavigator();

/* ================= TAB CONFIG ================= */
const tabs = [
  { name: 'Dashboard', label: 'Dashboard', icon: 'home-outline', component: CompanyDashboardScreen },
  { name: 'Profile', label: 'Profile', icon: 'business-outline', component: CompanyProfileScreen },
  { name: 'Jobs', label: 'Jobs', icon: 'briefcase-outline', component: CompanyJobsScreen },
  { name: 'Candidates', label: 'Candidates', icon: 'people-outline', component: CompanyCandidatesScreen },
  { name: 'Interviews', label: 'Interviews', icon: 'videocam-outline', component: CompanyInterviewsScreen },
  { name: 'Team', label: 'Team', icon: 'people-circle-outline', component: CompanyTeamScreen },
  { name: 'Analytics', label: 'Analytics', icon: 'analytics-outline', component: CompanyAnalyticsScreen },
  { name: 'Reviews', label: 'Reviews', icon: 'star-outline', component: CompanyReviewsScreen },
  { name: 'Messages', label: 'Messages', icon: 'chatbubble-ellipses-outline', component: CompanyMessagesScreen, badge: 5 },
  { name: 'Notifications', label: 'Alerts', icon: 'notifications-outline', component: CompanyNotificationsScreen },
  { name: 'Settings', label: 'Settings', icon: 'settings-outline', component: CompanySettingsScreen },
];

/* ================= NAVIGATOR ================= */
export default function CompanyNavigator() {
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

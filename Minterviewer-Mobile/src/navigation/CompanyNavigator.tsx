import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import CompanyDashboardScreen from '../screens/company/CompanyDashboardScreen';
import CompanyProfileScreen from '../screens/company/CompanyProfileScreen';
import CompanyJobsScreen from '../screens/company/CompanyJobsScreen';
import CompanyCandidatesScreen from '../screens/company/CompanyCandidatesScreen';
import CompanyMessagesScreen from '../screens/company/CompanyMessagesScreen';
import CompanyNotificationsScreen from '../screens/company/CompanyNotificationsScreen';

import ScrollableTabBar from '../screens/mentee/ScrollableTabBar';

const Tab = createBottomTabNavigator();

/* ================= TAB CONFIG ================= */
const tabs = [
  { name: 'Dashboard', label: 'Dashboard', icon: 'home-outline', component: CompanyDashboardScreen },
  { name: 'Profile', label: 'Profile', icon: 'business-outline', component: CompanyProfileScreen },
  { name: 'Jobs', label: 'Jobs', icon: 'briefcase-outline', component: CompanyJobsScreen },
  { name: 'Candidates', label: 'Candidates', icon: 'people-outline', component: CompanyCandidatesScreen },
  { name: 'Messages', label: 'Messages', icon: 'chatbubble-ellipses-outline', component: CompanyMessagesScreen, badge: 5 },
  { name: 'Notifications', label: 'Alerts', icon: 'notifications-outline', component: CompanyNotificationsScreen },
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
            tabBarIconName: tab.icon,          }}
        />
      ))}
    </Tab.Navigator>
  );
}

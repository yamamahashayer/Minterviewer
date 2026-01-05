import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabConfig } from './types';
import ScrollableTabBar from '../screens/mentee/ScrollableTabBar';

const Tab = createBottomTabNavigator();

interface BaseNavigatorProps {
  tabs: TabConfig[];
}

export default function BaseNavigator({ tabs }: BaseNavigatorProps) {
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

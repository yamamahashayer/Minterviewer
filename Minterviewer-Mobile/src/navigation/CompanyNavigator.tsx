import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CompanyDashboardScreen from '../screens/company/CompanyDashboardScreen';

const Tab = createBottomTabNavigator();

export default function CompanyNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Dashboard"
        component={CompanyDashboardScreen}
      />
    </Tab.Navigator>
  );
}

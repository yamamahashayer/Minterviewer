import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MentorDashboardScreen from '../screens/mentor/MentorDashboardScreen';

const Tab = createBottomTabNavigator();

export default function MentorNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Dashboard"
        component={MentorDashboardScreen}
      />
    </Tab.Navigator>
  );
}

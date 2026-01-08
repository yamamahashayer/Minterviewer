import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme';
import { TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

import DashboardScreen from '../screens/admin/DashboardScreen';
import UsersScreen from '../screens/admin/UsersScreen';
import CompaniesScreen from '../screens/admin/CompaniesScreen';
import NotificationsScreen from '../screens/admin/NotificationsScreen';

const Tab = createBottomTabNavigator();

const AdminNavigator = () => {
    const { signOut } = useAuth();

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', onPress: signOut, style: 'destructive' },
        ]);
    };

    return (
        <Tab.Navigator
            screenOptions={{
                headerRight: () => (
                    <TouchableOpacity onPress={handleLogout} style={{ marginRight: 16 }}>
                        <Feather name="log-out" size={24} color={colors.text.secondary} />
                    </TouchableOpacity>
                ),
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.text.secondary,
                tabBarStyle: {
                    borderTopColor: '#E5E7EB',
                    paddingBottom: 5,
                    paddingTop: 5,
                },
            }}
        >
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="grid" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Users"
                component={UsersScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="users" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Companies"
                component={CompaniesScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="briefcase" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Notifications"
                component={NotificationsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="bell" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default AdminNavigator;

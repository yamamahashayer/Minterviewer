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
import AdminScrollableTabBar from '../components/admin/AdminScrollableTabBar';

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
            tabBar={(props) => <AdminScrollableTabBar {...props} />}
            screenOptions={{
                headerRight: () => (
                    <TouchableOpacity onPress={handleLogout} style={{ marginRight: 16 }}>
                        <Feather name="log-out" size={24} color={colors.text.secondary} />
                    </TouchableOpacity>
                ),
            }}
        >
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{
                    iconName: 'grid',
                    tabBarLabel: 'Dashboard',
                } as any}
            />
            <Tab.Screen
                name="Users"
                component={UsersScreen}
                options={{
                    iconName: 'people',
                    tabBarLabel: 'Users',
                } as any}
            />
            <Tab.Screen
                name="Companies"
                component={CompaniesScreen}
                options={{
                    iconName: 'business',
                    tabBarLabel: 'Companies',
                } as any}
            />
            <Tab.Screen
                name="Notifications"
                component={NotificationsScreen}
                options={{
                    iconName: 'notifications',
                    tabBarLabel: 'Notifications',
                } as any}
            />
        </Tab.Navigator>
    );
};

export default AdminNavigator;

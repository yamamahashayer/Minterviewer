import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
// import SignupScreen from '../screens/auth/SignupScreen';

// Dashboard Screens
import MenteeDashboardScreen from '../screens/mentee/MenteeDashboardScreen';
import MentorDashboardScreen from '../screens/mentor/MentorDashboardScreen';
import CompanyDashboardScreen from '../screens/company/CompanyDashboardScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Role-based Navigators (Placeholder for now, just one screen)
const MenteeNavigator = () => (
    <Tab.Navigator>
        <Tab.Screen name="Overview" component={MenteeDashboardScreen} />
        {/* Add more tabs later: Browse Mentors, Sessions, etc. */}
    </Tab.Navigator>
);

const MentorNavigator = () => (
    <Tab.Navigator>
        <Tab.Screen name="Dashboard" component={MentorDashboardScreen} />
        {/* Add more tabs later: Mentees, Sessions, etc. */}
    </Tab.Navigator>
);

const CompanyNavigator = () => (
    <Tab.Navigator>
        <Tab.Screen name="Dashboard" component={CompanyDashboardScreen} />
        {/* Add more tabs later: Jobs, Applicants, etc. */}
    </Tab.Navigator>
);

const RootNavigator = () => {
    const { isAuthenticated, isLoading, user } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!isAuthenticated ? (
                    // Auth Stack
                    <Stack.Group>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        {/* <Stack.Screen name="Signup" component={SignupScreen} /> */}
                    </Stack.Group>
                ) : (
                    // App Stack based on Role
                    <Stack.Group>
                        {user?.role === 'mentee' && (
                            <Stack.Screen name="MenteeApp" component={MenteeNavigator} />
                        )}
                        {user?.role === 'mentor' && (
                            <Stack.Screen name="MentorApp" component={MentorNavigator} />
                        )}
                        {user?.role === 'company' && (
                            <Stack.Screen name="CompanyApp" component={CompanyNavigator} />
                        )}
                        {/* Fallback or Admin */}
                        {!['mentee', 'mentor', 'company'].includes(user?.role || '') && (
                            <Stack.Screen name="MenteeApp" component={MenteeNavigator} /> // Default fallback
                        )}
                    </Stack.Group>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default RootNavigator;

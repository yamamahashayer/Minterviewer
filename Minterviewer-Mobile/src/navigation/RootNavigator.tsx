import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';

/* Auth */
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';

/* Navigators */
import MenteeNavigator from './MenteeNavigator';
import MentorNavigator from './MentorNavigator';
import CompanyNavigator from './CompanyNavigator';
import AdminNavigator from './AdminNavigator';

const Stack = createStackNavigator();

const RootNavigator = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : (
          <>
            {user?.role === 'mentee' && (
              <Stack.Screen name="MenteeApp" component={MenteeNavigator} />
            )}

            {user?.role === 'mentor' && (
              <Stack.Screen name="MentorApp" component={MentorNavigator} />
            )}

            {user?.role === 'company' && (
              <Stack.Screen name="CompanyApp" component={CompanyNavigator} />
            )}

            {user?.role === 'admin' && (
              <Stack.Screen name="AdminApp" component={AdminNavigator} />
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;

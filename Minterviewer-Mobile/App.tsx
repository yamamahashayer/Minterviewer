import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import { NotificationProvider } from './src/context/NotificationContext';
import { MessageProvider } from './src/context/MessageContext';
import RootNavigator from './src/navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/context/ThemeContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NotificationProvider>
          <MessageProvider>
            <ThemeProvider>
              <RootNavigator />
            </ThemeProvider>
          </MessageProvider>
        </NotificationProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

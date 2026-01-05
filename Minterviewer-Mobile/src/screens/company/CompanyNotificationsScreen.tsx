import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CompanyLayout from '../../layouts/CompanyLayout';

export default function CompanyNotificationsScreen() {
  return (
    <CompanyLayout>
      <View style={styles.container}>
        <Text style={styles.title}>Company Notifications</Text>
        <Text style={styles.subtitle}>View company alerts and updates</Text>
      </View>
    </CompanyLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
});

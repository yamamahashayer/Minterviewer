import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MentorLayout from '../../layouts/MentorLayout';

export default function MentorStudentsScreen() {
  return (
    <MentorLayout>
      <View style={styles.container}>
        <Text style={styles.title}>Mentor Students</Text>
        <Text style={styles.subtitle}>View and manage your students</Text>
      </View>
    </MentorLayout>
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

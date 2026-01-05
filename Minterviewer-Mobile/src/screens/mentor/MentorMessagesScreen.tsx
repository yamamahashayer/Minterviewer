import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MentorLayout from '../../layouts/MentorLayout';

export default function MentorMessagesScreen() {
  return (
    <MentorLayout>
      <View style={styles.container}>
        <Text style={styles.title}>Mentor Messages</Text>
        <Text style={styles.subtitle}>Chat with students and admins</Text>
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

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

import MentorLayout from '../../layouts/MentorLayout';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme';
import { mentorService } from '../../services/mentorService';

export default function MentorProfileScreen() {
  const { isDark } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mentorId = user?.mentorId;
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated || !mentorId) return;

    (async () => {
      try {
        setLoading(true);
        const { user, mentor } = await mentorService.getProfile(mentorId);
        setProfile({ user, mentor });
        setError(null);
      } catch (e: any) {
        setError(String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [isAuthenticated, mentorId]);

  if (loading) {
    return (
      <MentorLayout>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: 12 }}>Loading profile...</Text>
        </View>
      </MentorLayout>
    );
  }

  if (error) {
    return (
      <MentorLayout>
        <View style={styles.center}>
          <Text style={{ color: colors.danger }}>
            Failed to load profile: {error}
          </Text>
        </View>
      </MentorLayout>
    );
  }

  return (
    <MentorLayout>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: isDark ? 'white' : 'black' }]}>
            Mentor Profile
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }]}>
            {profile?.user?.full_name || 'Mentor'}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'white' }]}>
          <Text style={[styles.label, { color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }]}>
            Email
          </Text>
          <Text style={[styles.value, { color: isDark ? 'white' : 'black' }]}>
            {profile?.user?.email || 'N/A'}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'white' }]}>
          <Text style={[styles.label, { color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }]}>
            Hourly Rate
          </Text>
          <Text style={[styles.value, { color: isDark ? 'white' : 'black' }]}>
            ${profile?.mentor?.hourlyRate || 'N/A'}/hour
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'white' }]}>
          <Text style={[styles.label, { color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }]}>
            Experience
          </Text>
          <Text style={[styles.value, { color: isDark ? 'white' : 'black' }]}>
            {profile?.mentor?.yearsOfExperience || 'N/A'} years
          </Text>
        </View>
      </View>
    </MentorLayout>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
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
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#6b7280',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
});

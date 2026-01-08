import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../context/AuthContext';
import { menteeService, type MenteeProfile } from '../../../services/menteeService';
import { useTheme } from '../../../context/ThemeContext';
import type { Personal } from '../types';

interface Props {
  value: Personal;
  onChange: (key: keyof Personal, val: string) => void;
}

export default function PersonalStep({ value, onChange }: Props) {
  const { isDark } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const prefilledOnce = useRef(false);
  const personalDataRef = useRef<Personal | null>(null);

  // Update ref when value changes
  useEffect(() => {
    personalDataRef.current = value;
  }, [value]);

  useEffect(() => {
    if (prefilledOnce.current || !isAuthenticated || !user) return;

    const prefillData = async () => {
      try {
        // First, pre-fill from AuthContext user data
        const safeSet = (k: keyof Personal, v?: string | null) => {
          if (!v) return;
          const cur = personalDataRef.current?.[k] || "";
          if (!cur.trim()) onChange(k, v);
        };

        safeSet("fullName", user.full_name);
        safeSet("email", user.email);

        // Then get detailed mentee profile
        if (user.menteeId) {
          try {
            const { mentee } = await menteeService.getProfile(user.menteeId);
            
            // Pre-fill additional fields from mentee profile
            safeSet("phone", mentee.phoneNumber || mentee.phone);
            safeSet("location", mentee.Country || mentee.location);
            safeSet("linkedin", mentee.linkedin_url);
            safeSet("github", mentee.github);
            safeSet("summary", mentee.short_bio);

          } catch (profileError) {
            console.log('Could not fetch mentee profile:', profileError);
          }
        }

      } catch (error) {
        console.error('Error pre-filling personal data:', error);
      } finally {
        prefilledOnce.current = true;
      }
    };

    prefillData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  const inputStyle = [
    styles.input,
    {
      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff',
      borderColor: isDark ? 'rgba(94,234,212,0.3)' : '#ddd6fe',
      color: isDark ? '#fff' : '#2e1065',
    }
  ];

  const labelStyle = [
    styles.label,
    { color: isDark ? '#d1d5dc' : '#2e1065' }
  ];

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#fff',
        borderColor: isDark ? 'rgba(94,234,212,0.2)' : '#ddd6fe',
      }
    ]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[
          styles.iconContainer,
          {
            backgroundColor: isDark ? 'rgba(94,234,212,0.2)' : 'rgba(124,58,237,0.1)',
            borderColor: isDark ? 'rgba(94,234,212,0.3)' : 'rgba(124,58,237,0.3)',
          }
        ]}>
          <Ionicons
            name="person"
            size={24}
            color={isDark ? '#5eead4' : '#7c3aed'}
          />
        </View>
        <View>
          <Text style={[
            styles.headerTitle,
            { color: isDark ? '#fff' : '#2e1065' }
          ]}>
            Personal Information
          </Text>
          <Text style={[
            styles.headerSubtitle,
            { color: isDark ? '#99a1af' : '#6b21a8' }
          ]}>
            Tell us about yourself
          </Text>
        </View>
      </View>

      {/* Form Fields */}
      <View style={styles.formGrid}>
        <View style={styles.formRow}>
          <View style={styles.field}>
            <Text style={labelStyle}>Full Name *</Text>
            <TextInput
              style={inputStyle}
              value={value.fullName}
              onChangeText={(text) => onChange("fullName", text)}
              placeholder="John Doe"
              placeholderTextColor={isDark ? '#6a7282' : '#7c3aed'}
            />
          </View>

          <View style={styles.field}>
            <Text style={labelStyle}>Email *</Text>
            <TextInput
              style={inputStyle}
              value={value.email}
              onChangeText={(text) => onChange("email", text)}
              placeholder="john@email.com"
              placeholderTextColor={isDark ? '#6a7282' : '#7c3aed'}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.formRow}>
          <View style={styles.field}>
            <Text style={labelStyle}>Phone *</Text>
            <TextInput
              style={inputStyle}
              value={value.phone}
              onChangeText={(text) => onChange("phone", text)}
              placeholder="+1 (555) 123-4567"
              placeholderTextColor={isDark ? '#6a7282' : '#7c3aed'}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.field}>
            <Text style={labelStyle}>Location *</Text>
            <TextInput
              style={inputStyle}
              value={value.location}
              onChangeText={(text) => onChange("location", text)}
              placeholder="New York, NY"
              placeholderTextColor={isDark ? '#6a7282' : '#7c3aed'}
            />
          </View>
        </View>

        <View style={styles.formRow}>
          <View style={styles.field}>
            <Text style={labelStyle}>LinkedIn</Text>
            <TextInput
              style={inputStyle}
              value={value.linkedin || ""}
              onChangeText={(text) => onChange("linkedin", text)}
              placeholder="linkedin.com/in/you"
              placeholderTextColor={isDark ? '#6a7282' : '#7c3aed'}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.field}>
            <Text style={labelStyle}>GitHub</Text>
            <TextInput
              style={inputStyle}
              value={value.github || ""}
              onChangeText={(text) => onChange("github", text)}
              placeholder="https://github.com/yourusername"
              placeholderTextColor={isDark ? '#6a7282' : '#7c3aed'}
              autoCapitalize="none"
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 32,
    borderRadius: 12,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  formGrid: {
    gap: 20,
  },
  formRow: {
    flexDirection: 'row',
    gap: 20,
  },
  field: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
});

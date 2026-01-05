import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HistoryList from './HistoryList';
import { getMenteeId } from '../../utils/auth';
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme';

interface Props {
  onUpload: () => void;
  onCreate: () => void;
  mode?: 'mentee' | 'company';
}

export default function ChoiceScreen({ onUpload, onCreate, mode = 'mentee' }: Props) {
  const { isDark } = useTheme();
  const [menteeId, setMenteeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMenteeId = async () => {
      if (mode === 'company') {
        setLoading(false);
        return;
      }

      try {
        const id = await getMenteeId();
        if (id) {
          setMenteeId(id);
        }
      } catch (err) {
        console.error('Failed to load menteeId', err);
      } finally {
        setLoading(false);
      }
    };

    loadMenteeId();
  }, [mode]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? '#0b0f19' : '#f4edf' }]}>
      <View style={styles.content}>
        {/* Title */}
        <Text style={[styles.title, { color: isDark ? '#fff' : '#2e1065' }]}>
          Your CV,{' '}
          <Text style={isDark ? styles.titleAccentDark : styles.titleAccentLight}>
            Smarter & Stronger
          </Text>
        </Text>

        {/* Badge */}
        <View style={[styles.badge, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#f3e8ff' }]}>
          <Text style={[styles.badgeText, { color: isDark ? '#5eead4' : '#7c3aed' }]}>
            Build, upload, and improve your CV using AI — tailored to your profile,
            skills, and experience.
          </Text>
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: isDark ? '#5eead4' : '#7c3aed' }]} />

        {/* Action Cards */}
        {mode === 'mentee' && (
          <View style={styles.cardsContainer}>
            {/* Upload Card */}
            <TouchableOpacity
              onPress={onUpload}
              style={[
                styles.card,
                {
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff',
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e9d5ff',
                }
              ]}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="cloud-upload" size={40} color={isDark ? '#5eead4' : '#7c3aed'} />
              </View>
              <Text style={[styles.cardTitle, { color: isDark ? '#fff' : '#2e1065' }]}>
                Upload Existing CV
              </Text>

              <View style={styles.featuresList}>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                  <Text style={[styles.featureText, { color: isDark ? '#fff' : '#2e1065' }]}>Instant AI analysis</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                  <Text style={[styles.featureText, { color: isDark ? '#fff' : '#2e1065' }]}>ATS compatibility check</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                  <Text style={[styles.featureText, { color: isDark ? '#fff' : '#2e1065' }]}>Improvement recommendations</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                  <Text style={[styles.featureText, { color: isDark ? '#fff' : '#2e1065' }]}>Download optimized version</Text>
                </View>
              </View>

              <View style={[styles.button, { backgroundColor: isDark ? '#5eead4' : '#7c3aed' }]}>
                <Ionicons name="cloud-upload" size={16} color={isDark ? '#0b0f19' : '#fff'} />
                <Text style={[styles.buttonText, { color: isDark ? '#0b0f19' : '#fff' }]}>Upload My CV</Text>
              </View>
            </TouchableOpacity>

            {/* Create Card */}
            <TouchableOpacity
              onPress={onCreate}
              style={[
                styles.card,
                {
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff',
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e9d5ff',
                }
              ]}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="create" size={40} color={isDark ? '#f472b6' : '#ec4899'} />
              </View>
              <Text style={[styles.cardTitle, { color: isDark ? '#fff' : '#2e1065' }]}>
                Create New CV
              </Text>

              <View style={styles.featuresList}>
                <View style={styles.featureItem}>
                  <Ionicons name="star" size={16} color="#fbbf24" />
                  <Text style={[styles.featureText, { color: isDark ? '#fff' : '#2e1065' }]}>Step-by-step guidance</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="star" size={16} color="#fbbf24" />
                  <Text style={[styles.featureText, { color: isDark ? '#fff' : '#2e1065' }]}>AI-powered suggestions</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="star" size={16} color="#fbbf24" />
                  <Text style={[styles.featureText, { color: isDark ? '#fff' : '#2e1065' }]}>Professional templates</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="star" size={16} color="#fbbf24" />
                  <Text style={[styles.featureText, { color: isDark ? '#fff' : '#2e1065' }]}>Export as PDF</Text>
                </View>
              </View>

              <View style={[styles.button, { backgroundColor: isDark ? '#f472b6' : '#ec4899' }]}>
                <Ionicons name="create" size={16} color={isDark ? '#0b0f19' : '#fff'} />
                <Text style={[styles.buttonText, { color: isDark ? '#0b0f19' : '#fff' }]}>Create My CV</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* History */}
        {mode === 'mentee' && (
          <View style={styles.historyContainer}>
            {loading ? (
              <ActivityIndicator size="small" color={isDark ? '#5eead4' : '#7c3aed'} />
            ) : menteeId ? (
              <HistoryList menteeId={menteeId} />
            ) : (
              <Text style={styles.errorText}>
                ⚠️ Mentee not found. Please log in again.
              </Text>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  titleAccentDark: {
    color: '#5eead4',
  },
  titleAccentLight: {
    color: '#7c3aed',
  },
  badge: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  divider: {
    height: 4,
    width: 192,
    alignSelf: 'center',
    borderRadius: 2,
    marginBottom: 56,
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    padding: 32,
    borderRadius: 16,
    borderWidth: 1,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  featuresList: {
    gap: 8,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
  },
  buttonText: {
    fontWeight: '600',
  },
  historyContainer: {
    marginTop: 80,
  },
  errorText: {
    fontSize: 14,
    color: '#ef4444',
    textAlign: 'center',
  },
});

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Modal, TextInput, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import MentorLayout from '../../layouts/MentorLayout';
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme';
import { mentorService, MentorSessionsResponse } from '../../services/mentorService';

const { width: screenWidth } = Dimensions.get('window');

const MentorSessionsScreen = () => {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionsData, setSessionsData] = useState<MentorSessionsResponse['data'] | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'upcoming' | 'past'>('upcoming');
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await mentorService.getSessions();
      if (response.success && response.data) {
        setSessionsData(response.data);
        setError(null);
      } else {
        setError('Failed to load sessions');
      }
    } catch (err: any) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleStartSession = (jitsiLink: string) => {
    if (jitsiLink) {
      Alert.alert('Start Session', `This would open the video session at: ${jitsiLink}`);
    } else {
      Alert.alert('Error', 'Video link not available');
    }
  };

  const handleAcceptSession = (sessionId: string) => {
    Alert.alert('Accept Session', 'Session acceptance functionality to be implemented');
  };

  const openFeedbackModal = (session: any) => {
    setSelectedSession(session);
    setFeedbackRating(0);
    setFeedbackText('');
    setFeedbackModalVisible(true);
  };

  const submitFeedback = async () => {
    if (!selectedSession || feedbackRating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    try {
      setSubmittingFeedback(true);
      await mentorService.submitFeedback({
        sessionId: selectedSession.id,
        menteeId: selectedSession.menteeId,
        rating: feedbackRating,
        feedback: feedbackText,
        strengths: [],
        improvements: []
      });
      
      Alert.alert('Success', 'Feedback submitted successfully');
      setFeedbackModalVisible(false);
      fetchSessions(); // Refresh sessions
    } catch (err: any) {
      Alert.alert('Error', 'Failed to submit feedback');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const SessionCard = ({ session, type }: { session: any; type: 'pending' | 'upcoming' | 'past' }) => (
    <View style={[
      styles.sessionCard,
      { 
        backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'white',
        borderColor: isDark ? 'rgba(255,255,255,0.15)' : '#e5e7eb',
        shadowColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.08)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }
    ]}>
      <View style={styles.sessionHeader}>
        <View style={styles.sessionInfo}>
          <Text style={[styles.sessionMentee, { color: isDark ? 'white' : '#111827' }]}>
            {session.mentee}
          </Text>
          <Text style={[styles.sessionType, { color: isDark ? 'rgba(255,255,255,0.6)' : '#6b7280' }]}>
            {session.type}
          </Text>
        </View>
        {type === 'past' && (
          <View style={[
            styles.statusBadge,
            { 
              backgroundColor: session.feedback 
                ? 'rgba(34, 197, 94, 0.1)' 
                : 'rgba(239, 68, 68, 0.1)',
              borderColor: session.feedback 
                ? 'rgba(34, 197, 94, 0.3)' 
                : 'rgba(239, 68, 68, 0.3)'
            }
          ]}>
            <Text style={[
              styles.statusText,
              { 
                color: session.feedback ? '#22c55e' : '#ef4444'
              }
            ]}>
              {session.feedback ? 'Completed' : 'Pending'}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.sessionDetails}>
        <View style={styles.sessionDetail}>
          <Ionicons name="calendar-outline" size={14} color={isDark ? 'rgba(255,255,255,0.6)' : '#6b7280'} />
          <Text style={[styles.sessionDetailText, { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }]}>
            {session.date}
          </Text>
        </View>
        <View style={styles.sessionDetail}>
          <Ionicons name="time-outline" size={14} color={isDark ? 'rgba(255,255,255,0.6)' : '#6b7280'} />
          <Text style={[styles.sessionDetailText, { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }]}>
            {session.time}
          </Text>
        </View>
      </View>

      <View style={styles.sessionActions}>
        {type === 'pending' && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.acceptButton]} 
            onPress={() => handleAcceptSession(session.id)}
          >
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
        )}
        
        {type === 'upcoming' && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.startButton]} 
            onPress={() => handleStartSession(session.jitsiLink)}
          >
            <Ionicons name="videocam-outline" size={14} color="white" />
            <Text style={styles.startButtonText}>Start Session</Text>
          </TouchableOpacity>
        )}
        
        {type === 'past' && (
          <TouchableOpacity 
            style={[
              styles.actionButton, 
              styles.feedbackButton,
              { 
                backgroundColor: session.feedback 
                  ? 'rgba(107, 114, 128, 0.1)' 
                  : colors.primary + '20',
                borderColor: session.feedback 
                  ? 'rgba(107, 114, 128, 0.3)' 
                  : colors.primary
              }
            ]} 
            onPress={() => openFeedbackModal(session)}
            disabled={session.feedback}
          >
            <Text style={[
              styles.feedbackButtonText,
              { 
                color: session.feedback 
                  ? 'rgba(107, 114, 128, 0.7)' 
                  : colors.primary
              }
            ]}>
              {session.feedback ? 'View Feedback' : 'Add Feedback'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const StarRating = ({ rating, onRate }: { rating: number; onRate: (rating: number) => void }) => (
    <View style={styles.starRating}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity 
          key={star} 
          onPress={() => onRate(star)}
          style={styles.starButton}
          activeOpacity={0.8}
        >
          <Ionicons 
            name={star <= rating ? 'star' : 'star-outline'} 
            size={36} 
            color={star <= rating ? '#fbbf24' : '#e5e7eb'} 
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  if (loading) {
    return (
      <MentorLayout>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }]}>
            Loading sessions...
          </Text>
        </View>
      </MentorLayout>
    );
  }

  if (error) {
    return (
      <MentorLayout>
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: colors.danger }]}>
            {error}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchSessions}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </MentorLayout>
    );
  }

  const getTabData = () => {
    switch (activeTab) {
      case 'pending': return sessionsData?.pending || [];
      case 'upcoming': return sessionsData?.upcoming || [];
      case 'past': return sessionsData?.past || [];
      default: return [];
    }
  };

  return (
    <MentorLayout>
      <View style={styles.container}>
        {/* Stats Cards - matching Web SessionsPage header */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'white' }]}>
            <View style={styles.statIcon}>
              <Ionicons name="people-outline" size={24} color="#3b82f6" />
            </View>
            <View>
              <Text style={[styles.statLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }]}>
                Total Sessions
              </Text>
              <Text style={[styles.statValue, { color: isDark ? 'white' : '#111827' }]}>
                {(sessionsData?.upcoming?.length || 0) + (sessionsData?.past?.length || 0)}
              </Text>
            </View>
          </View>

          <View style={[styles.statCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'white' }]}>
            <View style={styles.statIcon}>
              <Ionicons name="calendar-outline" size={24} color="#8b5cf6" />
            </View>
            <View>
              <Text style={[styles.statLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }]}>
                Upcoming
              </Text>
              <Text style={[styles.statValue, { color: isDark ? 'white' : '#111827' }]}>
                {sessionsData?.upcoming?.length || 0}
              </Text>
            </View>
          </View>

          <View style={[styles.statCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'white' }]}>
            <View style={styles.statIcon}>
              <Ionicons name="time-outline" size={24} color="#f59e0b" />
            </View>
            <View>
              <Text style={[styles.statLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }]}>
                Pending
              </Text>
              <Text style={[styles.statValue, { color: isDark ? 'white' : '#111827' }]}>
                {sessionsData?.pending?.length || 0}
              </Text>
            </View>
          </View>
        </View>

        {/* Tabs - matching Web SessionsPage tabs */}
        <View style={styles.tabContainer}>
          {(['pending', 'upcoming', 'past'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                { 
                  backgroundColor: activeTab === tab 
                    ? colors.primary 
                    : isDark ? 'rgba(255,255,255,0.1)' : 'white',
                  borderColor: activeTab === tab 
                    ? colors.primary 
                    : isDark ? 'rgba(255,255,255,0.2)' : '#e5e7eb'
                }
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[
                styles.tabText,
                { 
                  color: activeTab === tab 
                    ? 'black' 
                    : isDark ? 'rgba(255,255,255,0.7)' : '#6b7280'
                }
              ]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)} ({getTabData().length})
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sessions List */}
        <ScrollView style={styles.sessionsList} showsVerticalScrollIndicator={false}>
          {getTabData().length > 0 ? (
            getTabData().map((session, index) => (
              <SessionCard key={session.id || index} session={session} type={activeTab} />
            ))
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={[styles.noDataText, { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }]}>
                No {activeTab} sessions
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Feedback Modal */}
        <Modal
          visible={feedbackModalVisible}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={[
            styles.modalContainer,
            { backgroundColor: isDark ? '#0f172a' : 'white' }
          ]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDark ? 'white' : '#111827' }]}>
                Feedback for {selectedSession?.mentee}
              </Text>
              <TouchableOpacity onPress={() => setFeedbackModalVisible(false)}>
                <Ionicons name="close" size={24} color={isDark ? 'white' : '#111827'} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <Text style={[styles.feedbackLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }]}>
                How was the session?
              </Text>
              <StarRating rating={feedbackRating} onRate={setFeedbackRating} />

              <Text style={[styles.feedbackLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }]}>
                Review
              </Text>
              <TextInput
                style={[
                  styles.feedbackInput,
                  { 
                    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#f9fafb',
                    color: isDark ? 'white' : '#111827',
                    borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#e5e7eb'
                  }
                ]}
                placeholder="Share your thoughts on the mentee's performance..."
                placeholderTextColor={isDark ? 'rgba(255,255,255,0.5)' : '#9ca3af'}
                multiline
                numberOfLines={4}
                value={feedbackText}
                onChangeText={setFeedbackText}
              />

              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]} 
                  onPress={() => setFeedbackModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.modalButton, 
                    styles.submitButton,
                    { opacity: feedbackRating === 0 || submittingFeedback ? 0.5 : 1 }
                  ]} 
                  onPress={submitFeedback}
                  disabled={feedbackRating === 0 || submittingFeedback}
                >
                  <Text style={styles.submitButtonText}>
                    {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </MentorLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#000',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sessionsList: {
    flex: 1,
  },
  sessionCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionMentee: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  sessionType: {
    fontSize: 14,
    opacity: 0.7,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sessionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sessionDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionDetailText: {
    fontSize: 14,
    marginLeft: 6,
  },
  sessionActions: {
    flexDirection: 'row',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  acceptButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  startButton: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  feedbackButton: {
    flex: 1,
  },
  acceptButtonText: {
    color: '#000',
    fontWeight: '600',
  },
  startButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  feedbackButtonText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noDataText: {
    fontSize: 16,
    opacity: 0.8,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  feedbackLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  feedbackInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 100,
    marginBottom: 16,
  },
  starRating: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 8,
  },
  starButton: {
    padding: 4,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 'auto',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  submitButton: {
    backgroundColor: colors.primary,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});

export default MentorSessionsScreen;

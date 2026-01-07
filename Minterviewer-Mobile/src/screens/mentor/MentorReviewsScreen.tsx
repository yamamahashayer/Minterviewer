import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
  Dimensions,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MentorLayout from '../../layouts/MentorLayout';
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme';

const { width } = Dimensions.get('window');

interface PendingFeedback {
  id: string;
  menteeId: string;
  menteeName: string;
  sessionTitle: string;
  date: string;
  rawDate: string;
}

interface SubmittedFeedback {
  id: string;
  menteeName: string;
  sessionTitle: string;
  date: string;
  rating: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

interface ReceivedFeedback {
  id: string;
  studentName: string;
  sessionTitle: string;
  date: string;
  rating: number;
  feedback: string;
  tags: string[];
}

const aiSuggestions = [
  'Great improvement in technical problem-solving! Keep up the excellent work.',
  'Shows strong analytical thinking and attention to detail.',
  'Demonstrated excellent communication skills during the session.',
  'Ready to move to more advanced topics in the next session.',
  'Consider focusing more on edge cases and error handling.'
];

export default function MentorReviewsScreen() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'received' | 'given'>('received');
  const [pendingFeedback, setPendingFeedback] = useState<PendingFeedback[]>([]);
  const [completedFeedback, setCompletedFeedback] = useState<SubmittedFeedback[]>([]);
  const [receivedFeedback, setReceivedFeedback] = useState<ReceivedFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMentee, setSelectedMentee] = useState('all');

  // Form state
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [activeSession, setActiveSession] = useState<PendingFeedback | null>(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      // Simulate API calls
      setTimeout(() => {
        setPendingFeedback([
          {
            id: '1',
            menteeId: '1',
            menteeName: 'Sarah Mitchell',
            sessionTitle: 'React Development Basics',
            date: '2 days ago',
            rawDate: '2026-01-05',
          },
          {
            id: '2',
            menteeId: '2',
            menteeName: 'James Rodriguez',
            sessionTitle: 'Node.js Code Review',
            date: '5 days ago',
            rawDate: '2026-01-02',
          },
        ]);

        setCompletedFeedback([
          {
            id: '1',
            menteeName: 'Emily Chen',
            sessionTitle: 'JavaScript Fundamentals',
            date: '1 week ago',
            rating: 5,
            feedback: 'Excellent session! Very clear explanations and great examples.',
            strengths: ['Problem solving', 'Communication'],
            improvements: ['None'],
          },
        ]);

        setReceivedFeedback([
          {
            id: '1',
            studentName: 'Michael Brown',
            sessionTitle: 'Advanced React Patterns',
            date: '3 days ago',
            rating: 5,
            feedback: 'Amazing mentor! Really helped me understand complex concepts.',
            tags: ['helpful', 'knowledgeable'],
          },
          {
            id: '2',
            studentName: 'Lisa Anderson',
            sessionTitle: 'CSS Mastery',
            date: '1 week ago',
            rating: 4,
            feedback: 'Great session, learned a lot about modern CSS techniques.',
            tags: ['patient', 'thorough'],
          },
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading feedbacks:', error);
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFeedbacks();
    setRefreshing(false);
  };

  const handleSubmitFeedback = async () => {
    if (!activeSession || rating === 0 || !feedbackText) {
      Alert.alert('Error', 'Please provide a rating and feedback text.');
      return;
    }

    setSubmitting(true);
    try {
      // Simulate API call
      setTimeout(() => {
        Alert.alert('Success', 'Feedback submitted successfully!');
        setShowFeedbackForm(false);
        setFeedbackText('');
        setRating(0);
        setActiveSession(null);
        loadFeedbacks();
        setSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitting(false);
    }
  };

  const openFeedbackForm = (session: PendingFeedback) => {
    setActiveSession(session);
    setShowFeedbackForm(true);
  };

  const useAISuggestion = (suggestion: string) => {
    setFeedbackText(suggestion);
  };

  const renderStatCard = (title: string, value: string, icon: string, color: string) => (
    <View style={[styles.statCard, { borderColor: color }]}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View>
        <Text style={[styles.statTitle, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
          {title}
        </Text>
        <Text style={[styles.statValue, { color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}>
          {value}
        </Text>
      </View>
    </View>
  );

  const renderPendingFeedbackCard = (item: PendingFeedback, index: number) => (
    <View key={item.id} style={[styles.card, {
      backgroundColor: isDark ? 'rgba(251,146,60,0.1)' : 'rgba(251,146,60,0.05)',
      borderColor: '#fb923c',
    }]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={[styles.avatar, { backgroundColor: '#fb923c' }]}>
            <Text style={styles.avatarText}>{item.menteeName.charAt(0)}</Text>
          </View>
          <View style={styles.cardInfo}>
            <Text style={[styles.cardTitle, { color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}>
              {item.menteeName}
            </Text>
            <Text style={[styles.cardSubtitle, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
              {item.sessionTitle}
            </Text>
            <Text style={[styles.cardDate, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
              {item.date}
            </Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: '#fb923c' }]}>
          <Text style={styles.statusText}>Pending</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: '#fb923c' }]}
        onPress={() => openFeedbackForm(item)}
      >
        <Ionicons name="send-outline" size={16} color="white" />
        <Text style={styles.actionButtonText}>Give Feedback</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSubmittedFeedbackCard = (item: SubmittedFeedback, index: number) => (
    <View key={item.id} style={[styles.card, {
      backgroundColor: isDark ? colors.background.cardDark : 'white',
      borderColor: isDark ? colors.border.dark : colors.border.light,
    }]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>{item.menteeName.charAt(0)}</Text>
          </View>
          <View style={styles.cardInfo}>
            <Text style={[styles.cardTitle, { color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}>
              {item.menteeName}
            </Text>
            <Text style={[styles.cardSubtitle, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
              {item.sessionTitle}
            </Text>
            <Text style={[styles.cardDate, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
              {item.date}
            </Text>
          </View>
        </View>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#fbbf24" />
          <Text style={[styles.ratingText, { color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}>
            {item.rating}
          </Text>
        </View>
      </View>

      <Text style={[styles.feedbackText, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
        {item.feedback}
      </Text>
    </View>
  );

  const renderReceivedFeedbackCard = (item: ReceivedFeedback, index: number) => (
    <View key={item.id} style={[styles.card, {
      backgroundColor: isDark ? 'rgba(168,85,247,0.1)' : 'rgba(168,85,247,0.05)',
      borderColor: '#a855f7',
    }]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={[styles.avatar, { backgroundColor: '#a855f7' }]}>
            <Text style={styles.avatarText}>{item.studentName.charAt(0)}</Text>
          </View>
          <View style={styles.cardInfo}>
            <Text style={[styles.cardTitle, { color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}>
              {item.studentName}
            </Text>
            <Text style={[styles.cardSubtitle, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
              {item.sessionTitle}
            </Text>
            <Text style={[styles.cardDate, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
              {item.date}
            </Text>
          </View>
        </View>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#fbbf24" />
          <Text style={[styles.ratingText, { color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}>
            {item.rating}
          </Text>
        </View>
      </View>

      <Text style={[styles.feedbackText, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
        "{item.feedback}"
      </Text>

      {item.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {item.tags.map((tag, tagIndex) => (
            <View key={tagIndex} style={[styles.tag, { backgroundColor: '#a855f7' + '20' }]}>
              <Text style={[styles.tagText, { color: '#a855f7' }]}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <MentorLayout>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}>
            Feedbacks
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
            Manage feedbacks given and view reviews received.
          </Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {renderStatCard('Reviews Received', receivedFeedback.length.toString(), 'star-outline', '#a855f7')}
          {renderStatCard('Given Feedback', completedFeedback.length.toString(), 'chatbubble-outline', '#10b981')}
          {renderStatCard('Pending', pendingFeedback.length.toString(), 'time-outline', '#fb923c')}
        </View>

        {/* Tab Navigation */}
        <View style={[styles.tabContainer, {
          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
          borderColor: isDark ? colors.border.dark : colors.border.light,
        }]}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'received' && { backgroundColor: '#a855f7' + '20' }
            ]}
            onPress={() => setActiveTab('received')}
          >
            <Ionicons 
              name="star-outline" 
              size={20} 
              color={activeTab === 'received' ? '#a855f7' : (isDark ? colors.text.secondary : colors.text.muted)} 
            />
            <Text style={[
              styles.tabText,
              { color: activeTab === 'received' ? '#a855f7' : (isDark ? colors.text.secondary : colors.text.muted) }
            ]}>
              Reviews Received
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'given' && { backgroundColor: '#10b981' + '20' }
            ]}
            onPress={() => setActiveTab('given')}
          >
            <Ionicons 
              name="chatbubble-outline" 
              size={20} 
              color={activeTab === 'given' ? '#10b981' : (isDark ? colors.text.secondary : colors.text.muted)} 
            />
            <Text style={[
              styles.tabText,
              { color: activeTab === 'given' ? '#10b981' : (isDark ? colors.text.secondary : colors.text.muted) }
            ]}>
              Feedback Given
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
              Loading feedbacks...
            </Text>
          </View>
        ) : (
          <>
            {activeTab === 'received' ? (
              <View>
                {receivedFeedback.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Ionicons name="star-outline" size={48} color={isDark ? colors.text.secondary : colors.text.muted} />
                    <Text style={[styles.emptyText, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
                      No reviews received yet.
                    </Text>
                  </View>
                ) : (
                  receivedFeedback.map(renderReceivedFeedbackCard)
                )}
              </View>
            ) : (
              <View>
                {/* Pending Feedback */}
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}>
                    Pending Feedback
                  </Text>
                  {pendingFeedback.length === 0 ? (
                    <Text style={[styles.emptySectionText, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
                      No pending feedback tasks.
                    </Text>
                  ) : (
                    pendingFeedback.map(renderPendingFeedbackCard)
                  )}
                </View>

                {/* Submitted Feedback History */}
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}>
                    Feedback History
                  </Text>
                  {completedFeedback.length === 0 ? (
                    <Text style={[styles.emptySectionText, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
                      No feedbacks given yet.
                    </Text>
                  ) : (
                    completedFeedback.map(renderSubmittedFeedbackCard)
                  )}
                </View>
              </View>
            )}
          </>
        )}

        {/* AI Suggestions */}
        <View style={[styles.aiSuggestionsContainer, {
          backgroundColor: isDark ? 'rgba(168,85,247,0.1)' : 'rgba(168,85,247,0.05)',
          borderColor: '#a855f7',
        }]}>
          <View style={styles.aiSuggestionsHeader}>
            <View style={[styles.aiIcon, { backgroundColor: '#a855f7' + '20' }]}>
              <Ionicons name="sparkles-outline" size={24} color="#a855f7" />
            </View>
            <View>
              <Text style={[styles.aiTitle, { color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}>
                AI Suggestions
              </Text>
              <Text style={[styles.aiSubtitle, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
                Quick feedback phrases
              </Text>
            </View>
          </View>

          <View style={styles.suggestionsList}>
            {aiSuggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.suggestionItem, {
                  backgroundColor: isDark ? colors.background.cardDark : 'white',
                  borderColor: isDark ? colors.border.dark : colors.border.light,
                }]}
                onPress={() => useAISuggestion(suggestion)}
              >
                <Text style={[styles.suggestionText, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
                  "{suggestion}"
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Feedback Form Modal */}
        <Modal
          visible={showFeedbackForm}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={[styles.modalContainer, {
            backgroundColor: isDark ? colors.background.dark : 'white',
          }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}>
                Add Feedback for {activeSession?.menteeName}
              </Text>
              <TouchableOpacity onPress={() => setShowFeedbackForm(false)}>
                <Ionicons name="close" size={24} color={isDark ? colors.text.secondary : colors.text.muted} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
                  Session Rating
                </Text>
                <View style={styles.ratingStars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setRating(star)}
                    >
                      <Ionicons
                        name={rating >= star ? 'star' : 'star-outline'}
                        size={32}
                        color={rating >= star ? '#fbbf24' : (isDark ? colors.text.secondary : colors.text.muted)}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
                  Feedback
                </Text>
                <TextInput
                  style={[styles.textArea, {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    color: isDark ? colors.text.primaryDark : colors.text.primaryLight,
                    borderColor: isDark ? colors.border.dark : colors.border.light,
                  }]}
                  placeholder="Write your feedback here..."
                  placeholderTextColor={isDark ? colors.text.secondary : colors.text.muted}
                  value={feedbackText}
                  onChangeText={setFeedbackText}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
              </View>

              {/* AI Suggestions in Modal */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
                  Quick Suggestions
                </Text>
                <View style={styles.modalSuggestions}>
                  {aiSuggestions.slice(0, 3).map((suggestion, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.modalSuggestionItem, {
                        backgroundColor: isDark ? 'rgba(168,85,247,0.1)' : 'rgba(168,85,247,0.05)',
                        borderColor: '#a855f7',
                      }]}
                      onPress={() => useAISuggestion(suggestion)}
                    >
                      <Text style={[styles.modalSuggestionText, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
                        "{suggestion}"
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.cancelButton, {
                  backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                }]}
                onPress={() => setShowFeedbackForm(false)}
              >
                <Text style={[styles.cancelButtonText, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={handleSubmitFeedback}
                disabled={submitting}
              >
                <Text style={styles.saveButtonText}>
                  {submitting ? 'Submitting...' : 'Submit Feedback'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </MentorLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 48) / 2 - 6,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statTitle: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  emptySectionText: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
  },
  feedbackText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  aiSuggestionsContainer: {
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    borderWidth: 1,
  },
  aiSuggestionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  aiIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  aiSubtitle: {
    fontSize: 14,
  },
  suggestionsList: {
    gap: 12,
  },
  suggestionItem: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  suggestionText: {
    fontSize: 14,
    fontStyle: 'italic',
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
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  ratingStars: {
    flexDirection: 'row',
    gap: 12,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    height: 120,
  },
  modalSuggestions: {
    gap: 8,
  },
  modalSuggestionItem: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  modalSuggestionText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

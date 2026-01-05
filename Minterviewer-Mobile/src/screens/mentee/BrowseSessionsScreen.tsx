import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import MenteeLayout from '../../layouts/MenteeLayout';
import { SessionService } from '../../services/sessionService';
import type { 
  TimeSlot, 
  SessionFilters, 
  Mentor 
} from '../../types/sessionTypes';

export default function BrowseSessionsScreen() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  
  const sessionService = new SessionService();
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [filters, setFilters] = useState<SessionFilters>({
    topic: '',
    date: '',
    maxPrice: 200,
  });

  useEffect(() => {
    fetchSessions();
    fetchMentors();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await sessionService.browseSessions(filters);
      const newSlots = response.slots || [];
      setSlots(newSlots);
      setHasData(newSlots.length > 0);
      setError(null);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setError('Failed to load sessions');
      // Only show alert if there's no existing data
      if (!hasData) {
        Alert.alert('Error', 'Failed to load sessions');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchMentors = async () => {
    try {
      const response = await sessionService.getMentors();
      setMentors(response.mentors || []);
    } catch (error) {
      console.error('Error fetching mentors:', error);
    }
  };

  const handleSearch = () => {
    fetchSessions();
  };

  const handleBookSession = async (slot: TimeSlot) => {
    if (!user?.id) {
      Alert.alert('Error', 'Please log in to book a session');
      return;
    }

    setBookingId(slot._id);
    try {
      console.log('Starting booking process...');

      const response = await sessionService.bookSession({
        sessionId: slot._id,
        mentorId: slot.mentor._id,
        menteeId: user.id,
        price: slot.session.price,
        title: slot.session.title,
        mentorName: slot.mentor.name,
        mentorPhoto: slot.mentor.photo,
      });

      const { sessionId, url, error } = response;

      if (error) {
        throw new Error(error);
      }

      if (url) {
        // Open Stripe checkout in browser
        await Linking.openURL(url);
      } else {
        throw new Error('No checkout URL returned from server');
      }
    } catch (error: any) {
      console.error('Error booking session:', error);
      Alert.alert('Booking Error', error.message || 'Failed to book session');
    } finally {
      setBookingId(null);
    }
  };

  const handleMessageMentor = (mentor: Mentor) => {
    // Navigate to messages with mentor
    console.log('Message mentor:', mentor.userId);
    // This would navigate to messages screen with mentor pre-selected
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchSessions();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderSessionCard = ({ item }: { item: TimeSlot }) => {
    const renderSkillsChips = () => {
      const skills = item.mentor.focusAreas || [];
      const maxVisible = 3;
      const visibleSkills = skills.slice(0, maxVisible);
      const remainingCount = skills.length - maxVisible;

      return (
        <View style={styles.skillsContainer}>
          {visibleSkills.map((skill: string) => (
            <View key={skill} style={[
              styles.skillChip,
              { backgroundColor: isDark ? 'rgba(94,234,212,0.15)' : 'rgba(124,58,237,0.1)' }
            ]}>
              <Text style={[styles.skillChipText, { color: isDark ? '#5eead4' : '#7c3aed' }]}>
                {skill}
              </Text>
            </View>
          ))}
          {remainingCount > 0 && (
            <View style={[
              styles.skillChip,
              styles.moreChip,
              { backgroundColor: isDark ? 'rgba(156,163,175,0.15)' : 'rgba(107,114,128,0.1)' }
            ]}>
              <Text style={[styles.skillChipText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                +{remainingCount} more
              </Text>
            </View>
          )}
        </View>
      );
    };

    return (
    <View style={[
      styles.sessionCard,
      { backgroundColor: isDark ? '#1a1a2e' : '#fff', borderColor: isDark ? '#333' : '#e5e7eb' }
    ]}>
      {/* Mentor Info */}
      <View style={styles.mentorSection}>
        <View style={styles.mentorPhoto}>
          <Text style={styles.mentorInitial}>{item.mentor.name.charAt(0)}</Text>
        </View>
        <View style={styles.mentorInfo}>
          <Text style={[styles.mentorName, { color: isDark ? '#fff' : '#1a1a2e' }]}>
            {item.mentor.name}
          </Text>
          <View style={styles.mentorMeta}>
            <Text style={[styles.mentorExp, { color: isDark ? '#99a1af' : '#6b7280' }]}>
              {item.mentor.experience}+ years exp
            </Text>
            {item.mentor.rating > 0 && (
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={12} color="#fbbf24" />
                <Text style={[styles.ratingText, { color: isDark ? '#99a1af' : '#6b7280' }]}>
                  {item.mentor.rating} ({item.mentor.reviews})
                </Text>
              </View>
            )}
          </View>
          {renderSkillsChips()}
        </View>
      </View>

      {/* Session Info */}
      <View style={styles.sessionSection}>
        <Text style={[styles.sessionTitle, { color: isDark ? '#fff' : '#1a1a2e' }]}>
          {item.session?.title || "Mentorship Session"}
        </Text>
        <View style={styles.sessionTags}>
          <View style={[
            styles.sessionTag,
            { backgroundColor: isDark ? 'rgba(94,234,212,0.1)' : 'rgba(124,58,237,0.1)' }
          ]}>
            <Text style={[styles.sessionTagText, { color: isDark ? '#5eead4' : '#7c3aed' }]}>
              {item.session?.topic || "General"}
            </Text>
          </View>
          <View style={[
            styles.sessionTag,
            { backgroundColor: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.1)' }
          ]}>
            <Text style={[styles.sessionTagText, { color: isDark ? '#3b82f6' : '#3b82f6' }]}>
              {item.session?.type || "1:1 Session"}
            </Text>
          </View>
        </View>
        {item.notes && (
          <Text style={[styles.sessionNotes, { color: isDark ? '#99a1af' : '#6b7280' }]}>
            "{item.notes}"
          </Text>
        )}
      </View>

      {/* Time & Price Grouped */}
      <View style={styles.timePriceSection}>
        <View style={styles.timeInfo}>
          <View style={styles.timeRow}>
            <Ionicons name="calendar" size={14} color={isDark ? '#5eead4' : '#7c3aed'} />
            <Text style={[styles.timeText, { color: isDark ? '#fff' : '#1a1a2e' }]}>
              {formatDate(item.startTime)}
            </Text>
          </View>
          <View style={styles.timeRow}>
            <Ionicons name="time" size={14} color={isDark ? '#99a1af' : '#6b7280' } />
            <Text style={[styles.durationText, { color: isDark ? '#99a1af' : '#6b7280' }]}>
              {formatTime(item.startTime)} - {formatTime(item.endTime)}
            </Text>
          </View>
        </View>
        <View style={styles.priceContainer}>
          <Text style={[styles.price, { color: isDark ? '#06b6d4' : '#06b6d4' }]}>
            ${(item.session?.price / 100).toFixed(2) || "0.00"}
          </Text>
          <Text style={[styles.priceLabel, { color: isDark ? '#99a1af' : '#6b7280' }]}>
            per session
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionSection}>
        <TouchableOpacity
          style={[
            styles.messageButton,
            { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(124,58,237,0.05)' }
          ]}
          onPress={() => handleMessageMentor(item.mentor)}
        >
          <Ionicons name="chatbubble-outline" size={16} color={isDark ? '#6b7280' : '#9ca3af'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.bookButton,
            { 
              backgroundColor: bookingId === item._id ? '#99a1af' : (isDark ? '#5eead4' : '#7c3aed'),
              opacity: bookingId === item._id ? 0.7 : 1
            }
          ]}
          onPress={() => handleBookSession(item)}
          disabled={bookingId === item._id}
        >
          <Text style={[
            styles.bookButtonText,
            { color: isDark ? '#0a0f1e' : '#fff' }
          ]}>
            {bookingId === item._id ? 'Processing...' : 'Book Now'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  };

  return (
    <MenteeLayout>
      <View style={[styles.container, { backgroundColor: isDark ? '#0a0f1e' : '#f5f3ff' }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: isDark ? '#1a1a2e' : '#fff', borderBottomColor: isDark ? '#333' : '#e5e7eb' }]}>
          <Text style={[styles.title, { color: isDark ? '#fff' : '#2e1065' }]}>
            Find a Mentor
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? '#99a1af' : '#6b21a8' }]}>
            Browse available sessions and book your next step
          </Text>
        </View>

        {/* Filters Bar */}
        <View style={[
          styles.filtersBar,
          { backgroundColor: isDark ? '#1a1a2e' : '#fff', borderColor: isDark ? '#333' : '#e5e7eb' }
        ]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
            <TouchableOpacity
              style={[
                styles.filterChip,
                filters.topic === '' && styles.filterChipActive,
                { 
                  backgroundColor: filters.topic === '' 
                    ? (isDark ? '#5eead4' : '#7c3aed')
                    : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(124,58,237,0.1)')
                }
              ]}
              onPress={() => setFilters(prev => ({ ...prev, topic: '' }))}
            >
              <Text style={[
                styles.filterChipText,
                filters.topic === '' && styles.filterChipTextActive
              ]}>
                All Topics
              </Text>
            </TouchableOpacity>
            
            {['React', 'System Design', 'JavaScript', 'Node.js', 'Python'].map((topic) => (
              <TouchableOpacity
                key={topic}
                style={[
                  styles.filterChip,
                  filters.topic === topic && styles.filterChipActive,
                  { 
                    backgroundColor: filters.topic === topic 
                      ? (isDark ? '#5eead4' : '#7c3aed')
                      : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(124,58,237,0.1)')
                  }
                ]}
                onPress={() => setFilters(prev => ({ ...prev, topic: topic }))}
              >
                <Text style={[
                  styles.filterChipText,
                  filters.topic === topic && styles.filterChipTextActive
                ]}>
                  {topic}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <TouchableOpacity
            style={[
              styles.filterToggle,
              { backgroundColor: isDark ? '#1a1a2e' : '#fff', borderColor: isDark ? '#333' : '#e5e7eb' }
            ]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Ionicons name="filter" size={20} color={isDark ? '#5eead4' : '#7c3aed'} />
            <Text style={[styles.filterToggleText, { color: isDark ? '#5eead4' : '#7c3aed' }]}>
              Filters
            </Text>
          </TouchableOpacity>
        </View>

        {/* Filters */}
        {showFilters && (
          <View style={[
            styles.filtersContainer,
            { backgroundColor: isDark ? '#1a1a2e' : '#fff', borderColor: isDark ? '#333' : '#e5e7eb' }
          ]}>
            <View style={styles.filterGroup}>
              <Text style={[styles.filterLabel, { color: isDark ? '#fff' : '#1a1a2e' }]}>
                Topic or Skill
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  { 
                    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                    color: isDark ? '#fff' : '#1a1a2e',
                    borderColor: isDark ? '#333' : '#e5e7eb'
                  }
                ]}
                placeholder="React, System Design..."
                value={filters.topic}
                onChangeText={(text) => setFilters(prev => ({ ...prev, topic: text }))}
              />
            </View>

            <View style={styles.filterGroup}>
              <Text style={[styles.filterLabel, { color: isDark ? '#fff' : '#1a1a2e' }]}>
                Date
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  { 
                    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                    color: isDark ? '#fff' : '#1a1a2e',
                    borderColor: isDark ? '#333' : '#e5e7eb'
                  }
                ]}
                value={filters.date}
                onChangeText={(text) => setFilters(prev => ({ ...prev, date: text }))}
              />
            </View>

            <View style={styles.filterGroup}>
              <Text style={[styles.filterLabel, { color: isDark ? '#fff' : '#1a1a2e' }]}>
                Max Price: ${filters.maxPrice}
              </Text>
              <View style={styles.priceSlider}>
                <Text style={[styles.priceValue, { color: isDark ? '#5eead4' : '#7c3aed' }]}>
                  ${filters.maxPrice}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.applyFiltersButton,
                { backgroundColor: isDark ? '#5eead4' : '#7c3aed' }
              ]}
              onPress={handleSearch}
            >
              <Ionicons name="filter" size={16} color={isDark ? '#0a0f1e' : '#fff'} />
              <Text style={[styles.applyFiltersText, { color: isDark ? '#0a0f1e' : '#fff' }]}>
                Apply Filters
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={isDark ? '#5eead4' : '#7c3aed'} />
            <Text style={[styles.loadingText, { color: isDark ? '#99a1af' : '#6b21a8' }]}>
              Loading sessions...
            </Text>
          </View>
        ) : slots.length === 0 && !hasData ? (
          <View style={styles.emptyContainer}>
            <View style={[
              styles.emptyIcon,
              { backgroundColor: isDark ? 'rgba(94,234,212,0.1)' : 'rgba(124,58,237,0.1)' }
            ]}>
              <Ionicons name="search" size={32} color={isDark ? '#5eead4' : '#7c3aed'} />
            </View>
            <Text style={[styles.emptyTitle, { color: isDark ? '#fff' : '#1a1a2e' }]}>
              No sessions found
            </Text>
            <Text style={[styles.emptySubtitle, { color: isDark ? '#99a1af' : '#6b21a8' }]}>
              Try adjusting your filters to see more results.
            </Text>
          </View>
        ) : slots.length === 0 && hasData ? (
          <View style={styles.emptyContainer}>
            <View style={[
              styles.emptyIcon,
              { backgroundColor: isDark ? 'rgba(94,234,212,0.1)' : 'rgba(124,58,237,0.1)' }
            ]}>
              <Ionicons name="funnel" size={32} color={isDark ? '#5eead4' : '#7c3aed'} />
            </View>
            <Text style={[styles.emptyTitle, { color: isDark ? '#fff' : '#1a1a2e' }]}>
              No sessions match your filters
            </Text>
            <Text style={[styles.emptySubtitle, { color: isDark ? '#99a1af' : '#6b21a8' }]}>
              Try adjusting your filters to see more results.
            </Text>
          </View>
        ) : (
          <FlatList
            data={slots}
            renderItem={renderSessionCard}
            keyExtractor={(item) => item._id}
            numColumns={1}
            contentContainerStyle={styles.sessionsList}
            onRefresh={onRefresh}
            refreshing={refreshing}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
     </MenteeLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  filterToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 6,
  },
  filterToggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
  },
  filtersBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    gap: 12,
  },
  filtersScroll: {
    flexGrow: 1,
    paddingRight: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterChipActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748b',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  filtersContainer: {
    marginHorizontal: 20,
    marginVertical: 12,
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  filterGroup: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#ffffff',
    color: '#374151',
  },
  priceSlider: {
    paddingHorizontal: 8,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
    backgroundColor: '#f8fafc',
    paddingVertical: 4,
    borderRadius: 6,
  },
  applyFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 8,
  },
  applyFiltersText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  sessionsList: {
    paddingHorizontal: 8,
    paddingVertical: 7,
  },
  sessionCard: {
    borderRadius: 20,
    backgroundColor: '#ffffff',
    marginBottom: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden',
  },
  mentorSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    gap: 20,
  },
  mentorPhoto: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  mentorInitial: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3b82f6',
  },
  mentorInfo: {
    flex: 1,
    gap: 4,
  },
  mentorName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 6,
  },
  mentorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mentorExp: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
  },
  focusAreas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  focusArea: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  focusAreaText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#1d4ed8',
  },
  sessionSection: {
    marginBottom: 24,
    gap: 16,
  },
  sessionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
    lineHeight: 26,
  },
  sessionTags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sessionTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  sessionTagText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#0369a1',
  },
  sessionNotes: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#64748b',
    lineHeight: 18,
    marginTop: 8,
  },
  timePriceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1e293b',
  },
  durationText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
  },
  sessionMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sessionMetaText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748b',
  },
  sessionPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#06b6d4',
    textAlign: 'right',
  },
  price: {
    fontSize: 24,
    fontWeight: '800',
    color: '#06b6d4',
    textAlign: 'right',
  },
  priceLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748b',
    textAlign: 'right',
    marginTop: 2,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  timeInfo: {
    flex: 1,
  },
  actionSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    backgroundColor: '#7c3aed',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    gap: 8,
  },
  bookButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  messageButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  messageButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  // New styles for improved UI
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  skillChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  skillChipText: {
    fontSize: 11,
    fontWeight: '500',
  },
  moreChip: {
    opacity: 0.8,
  },
});

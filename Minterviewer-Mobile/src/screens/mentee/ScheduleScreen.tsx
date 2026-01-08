import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { SessionService, ScheduleEvent } from '../../services/sessionService';
import MenteeLayout from '../../layouts/MenteeLayout';
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  
  // Header
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitleText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6b7280',
  },
  refreshButton: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
  },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statContent: {
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 1,
  },
  statHelper: {
    fontSize: 10,
    color: '#9ca3af',
    fontStyle: 'italic',
    marginTop: 2,
  },

  // Filters
  filterContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterScrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 4,
  },
  filterChipActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },

  // Sessions
  sessionsContainer: {
    flex: 1,
  },
  sessionsList: {
    padding: 16,
    gap: 8,
  },
  sessionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  sessionCardToday: {
    borderColor: '#3b82f6',
    borderWidth: 2,
  },
  sessionHeader: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    gap: 10,
  },
  sessionDate: {
    alignItems: 'center',
    minWidth: 40,
  },
  sessionDay: {
    fontSize: 9,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 1,
  },
  sessionDateNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  sessionMeta: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 2,
  },
  sessionMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  sessionMetaText: {
    fontSize: 11,
    color: '#6b7280',
  },
  sessionInterviewer: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    minWidth: 50,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
    textTransform: 'capitalize',
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    gap: 6,
  },
  browseButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },

  // Loading
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 12,
  },
});

export default function ScheduleScreen() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [sessions, setSessions] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const sessionService = new SessionService();

  const filters = [
    { id: 'all', label: 'All', icon: 'grid-outline' },
    { id: 'technical', label: 'Technical', icon: 'code-outline' },
    { id: 'behavioral', label: 'Behavioral', icon: 'chatbubble-outline' },
    { id: 'system-design', label: 'System Design', icon: 'layers-outline' },
    { id: 'coding', label: 'Coding', icon: 'terminal-outline' },
    { id: 'mock', label: 'Mock', icon: 'videocam-outline' },
  ];

  const loadSessions = async () => {
    if (!user?.menteeId) return;

    try {
      const response = await sessionService.getMenteeSessions(user.menteeId);
      if (response.success) {
        setSessions(response.events);
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
      Alert.alert('Error', 'Failed to load your schedule. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, [user?.menteeId]);

  const onRefresh = () => {
    setRefreshing(true);
    loadSessions();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'technical': return 'code-outline';
      case 'behavioral': return 'chatbubble-outline';
      case 'system-design': return 'layers-outline';
      case 'coding': return 'terminal-outline';
      case 'mock': return 'videocam-outline';
      default: return 'calendar-outline';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'technical': return '#06b6d4';
      case 'behavioral': return '#a855f7';
      case 'system-design': return '#10b981';
      case 'coding': return '#f59e0b';
      case 'mock': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return '#10b981';
      case 'completed': return '#6b7280';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const filteredSessions = sessions.filter(session => 
    selectedFilter === 'all' || session.type === selectedFilter
  );

  const upcomingSessions = filteredSessions.filter(session => 
    session.status === 'upcoming'
  );

  const todaySessions = filteredSessions.filter(session => {
    const sessionDate = new Date(session.date);
    const today = new Date();
    return sessionDate.toDateString() === today.toDateString();
  });

  const hasSessions = sessions.length > 0;
  const hasFilteredSessions = filteredSessions.length > 0;

  const renderSessionCard = ({ item }: { item: ScheduleEvent }) => {
    const sessionDate = new Date(item.date);
    const isToday = sessionDate.toDateString() === new Date().toDateString();
    
    return (
      <View style={[styles.sessionCard, isToday && styles.sessionCardToday, isDark && { backgroundColor: colors.background.cardDark, borderColor: colors.border.dark }]}>
        <View style={styles.sessionHeader}>
          <View style={styles.sessionDate}>
            <Text style={[styles.sessionDay, isDark && { color: colors.text.secondaryDark }]}>
              {sessionDate.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
            </Text>
            <Text style={[styles.sessionDateNumber, isDark && { color: colors.text.primaryDark }]}>
              {sessionDate.getDate()}
            </Text>
          </View>
          <View style={styles.sessionInfo}>
            <Text style={[styles.sessionTitle, isDark && { color: colors.text.primaryDark }]}>
              {item.title}
            </Text>
            <View style={styles.sessionMeta}>
              <View style={styles.sessionMetaItem}>
                <Ionicons name="time-outline" size={12} color={isDark ? colors.text.secondaryDark : '#6b7280'} />
                <Text style={[styles.sessionMetaText, isDark && { color: colors.text.secondaryDark }]}>
                  {item.time}
                </Text>
              </View>
              <View style={styles.sessionMetaItem}>
                <Ionicons name="hourglass-outline" size={12} color={isDark ? colors.text.secondaryDark : '#6b7280'} />
                <Text style={[styles.sessionMetaText, isDark && { color: colors.text.secondaryDark }]}>
                  {item.duration}
                </Text>
              </View>
            </View>
            {item.interviewer && (
              <Text style={[styles.sessionInterviewer, isDark && { color: colors.text.secondaryDark }]}>
                with {item.interviewer}
              </Text>
            )}
          </View>
          <View style={[styles.statusBadge, {
            backgroundColor: item.status === 'upcoming' ? '#10b981' : 
                           item.status === 'completed' ? '#6b7280' : '#ef4444'
          }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIcon, isDark && { backgroundColor: colors.background.cardDark }]}>
        <Ionicons name="calendar-outline" size={40} color={isDark ? colors.text.secondaryDark : '#9ca3af'} />
      </View>
      <Text style={[styles.emptyTitle, isDark && { color: colors.text.primaryDark }]}>
        No sessions scheduled
      </Text>
      <Text style={[styles.emptySubtitle, isDark && { color: colors.text.secondaryDark }]}>
        {selectedFilter === 'all' 
          ? "Your calendar is empty. Start by booking your first session!"
          : `No ${selectedFilter} sessions found. Try other filters.`
        }
      </Text>
      <TouchableOpacity 
        style={styles.browseButton}
        onPress={() => {
          console.log('Navigate to Browse Sessions');
        }}
      >
        <Ionicons name="search" size={16} color="#ffffff" />
        <Text style={styles.browseButtonText}>Browse Sessions</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <MenteeLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={[styles.loadingText, isDark && { color: colors.text.secondaryDark }]}>
            Loading your schedule...
          </Text>
        </View>
      </MenteeLayout>
    );
  }

  return (
    <MenteeLayout>
      <View style={[styles.container, { backgroundColor: isDark ? '#0a0f1e' : '#f5f3ff' }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: isDark ? '#1a1a2e' : '#fff', borderBottomColor: isDark ? '#333' : '#e5e7eb' }]}>
          <View style={styles.headerTop}>
            <View style={styles.headerTitle}>
              <Ionicons name="calendar" size={20} color={isDark ? '#fff' : '#1f2937'} />
              <Text style={[styles.headerTitleText, { color: isDark ? '#fff' : '#1f2937' }]}>
                Schedule
              </Text>
            </View>
            <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
              <Ionicons name="refresh" size={18} color={isDark ? '#99a1af' : '#6b7280'} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.headerSubtitle, { color: isDark ? '#99a1af' : '#6b21a8' }]}>
            View your upcoming sessions
          </Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: isDark ? '#1a1a2e' : '#fff', borderColor: isDark ? '#333' : '#e5e7eb' }]}>
            <View style={styles.statIcon}>
              <Ionicons name="time-outline" size={16} color="#3b82f6" />
            </View>
            <View style={styles.statContent}>
              <Text style={[styles.statNumber, isDark && { color: colors.text.primaryDark }]}>
                {upcomingSessions.length}
              </Text>
              <Text style={[styles.statLabel, isDark && { color: colors.text.secondaryDark }]}>
                Upcoming
              </Text>
              {upcomingSessions.length === 0 && (
                <Text style={[styles.statHelper, isDark && { color: colors.text.secondaryDark }]}>
                  No upcoming sessions
                </Text>
              )}
            </View>
          </View>
          
          <View style={[styles.statCard, isDark && { backgroundColor: colors.background.cardDark, borderColor: colors.border.dark }]}>
            <View style={styles.statIcon}>
              <Ionicons name="today-outline" size={16} color="#10b981" />
            </View>
            <View style={styles.statContent}>
              <Text style={[styles.statNumber, isDark && { color: colors.text.primaryDark }]}>
                {todaySessions.length}
              </Text>
              <Text style={[styles.statLabel, isDark && { color: colors.text.secondaryDark }]}>
                Today
              </Text>
              {todaySessions.length === 0 && (
                <Text style={[styles.statHelper, isDark && { color: colors.text.secondaryDark }]}>
                  No sessions today
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Filter Tabs - Only show when there are sessions */}
        {hasSessions && (
          <View style={[styles.filterContainer, isDark && { backgroundColor: colors.background.headerLight, borderBottomColor: colors.border.light }]}>
            <FlatList
              data={filters}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => setSelectedFilter(item.id)}
                  style={[
                    styles.filterChip,
                    selectedFilter === item.id && styles.filterChipActive,
                    isDark && { backgroundColor: selectedFilter === item.id ? '#3b82f6' : colors.background.cardDark, borderColor: colors.border.dark }
                  ]}
                >
                  <Ionicons 
                    name={item.icon as any} 
                    size={12} 
                    color={selectedFilter === item.id ? '#ffffff' : (isDark ? colors.text.secondaryDark : '#6b7280')} 
                  />
                  <Text style={[
                    styles.filterChipText,
                    selectedFilter === item.id && styles.filterChipTextActive,
                    isDark && { color: selectedFilter === item.id ? '#ffffff' : colors.text.secondaryDark }
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.filterScrollContent}
            />
          </View>
        )}

        {/* Sessions List */}
        <View style={styles.sessionsContainer}>
          {!hasFilteredSessions ? (
            renderEmptyState()
          ) : (
            <FlatList
              data={filteredSessions}
              renderItem={renderSessionCard}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              contentContainerStyle={styles.sessionsList}
            />
          )}
        </View>
      </View>
    </MenteeLayout>
  );
}

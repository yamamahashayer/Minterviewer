import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MentorLayout from '../../layouts/MentorLayout';
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme';

const { width } = Dimensions.get('window');

interface Mentee {
  id: number;
  name: string;
  role: string;
  image: string;
  progress: number;
  aiConfidence: number;
  lastSession: string;
  status: 'active' | 'inactive';
  skillArea: string;
}

export default function MentorStudentsScreen() {
  const { isDark } = useTheme();
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('progress');
  const [selectedMentee, setSelectedMentee] = useState<Mentee | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - replace with actual API call
  useEffect(() => {
    loadMentees();
  }, []);

  const loadMentees = async () => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setMentees([
          {
            id: 1,
            name: 'Sarah Mitchell',
            role: 'Frontend Developer',
            image: '',
            progress: 75,
            aiConfidence: 85,
            lastSession: '1/6/2026',
            status: 'active',
            skillArea: 'React Development',
          },
          {
            id: 2,
            name: 'James Rodriguez',
            role: 'Backend Developer',
            image: '',
            progress: 60,
            aiConfidence: 78,
            lastSession: '12/28/2025',
            status: 'active',
            skillArea: 'Node.js Development',
          },
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading mentees:', error);
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMentees();
    setRefreshing(false);
  };

  const filteredMentees = mentees
    .filter((mentee) => {
      const matchesSearch = mentee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentee.skillArea.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || mentee.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'progress') return b.progress - a.progress;
      if (sortBy === 'confidence') return b.aiConfidence - a.aiConfidence;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const renderStatCard = (title: string, value: string, icon: any, color: string) => (
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

  const renderMenteeCard = ({ item, index }: { item: Mentee; index: number }) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.menteeCard, {
        backgroundColor: isDark ? colors.background.cardDark : 'white',
        borderColor: isDark ? colors.border.dark : colors.border.light,
      }]}
      onPress={() => setSelectedMentee(item)}
      activeOpacity={0.8}
    >
      {/* Header */}
      <View style={styles.menteeHeader}>
        <View style={styles.menteeProfile}>
          <View style={[styles.avatar, { borderColor: colors.primary }]}>
            <Text style={[styles.avatarText, { color: colors.primary }]}>
              {item.name.split(' ').map(n => n[0]).join('')}
            </Text>
            <View style={[styles.statusDot, { 
              backgroundColor: item.status === 'active' ? '#10b981' : '#6b7280',
              borderColor: isDark ? colors.background.cardDark : 'white'
            }]} />
          </View>
          <View style={styles.menteeInfo}>
            <Text style={[styles.menteeName, { color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}>
              {item.name}
            </Text>
            <Text style={[styles.menteeRole, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
              {item.role}
            </Text>
            <View style={[styles.skillBadge, { backgroundColor: colors.primary + '20' }]}>
              <Text style={[styles.skillText, { color: colors.primary }]}>
                {item.skillArea}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Progress Section */}
      <View style={styles.progressSection}>
        <View style={styles.progressRow}>
          <Text style={[styles.progressLabel, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
            Overall Progress
          </Text>
          <Text style={[styles.progressValue, { color: colors.primary }]}>
            {item.progress}%
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${item.progress}%`, backgroundColor: colors.primary }]} />
        </View>

        <View style={styles.progressRow}>
          <Text style={[styles.progressLabel, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
            AI Confidence Score
          </Text>
          <Text style={[styles.progressValue, { color: '#14b8a6' }]}>
            {item.aiConfidence}%
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${item.aiConfidence}%`, backgroundColor: '#14b8a6' }]} />
        </View>
      </View>

      {/* Last Session */}
      <View style={styles.lastSession}>
        <Ionicons name="calendar-outline" size={16} color={isDark ? colors.text.secondary : colors.text.muted} />
        <Text style={[styles.lastSessionText, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
          Last session: {item.lastSession}
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.viewButton, {
            backgroundColor: colors.primary + '20',
            borderColor: colors.primary,
          }]}
          onPress={() => Alert.alert('Profile', `View ${item.name}'s profile`)}
        >
          <Ionicons name="eye-outline" size={16} color={colors.primary} />
          <Text style={[styles.buttonText, { color: colors.primary }]}>View Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.sessionButton, { backgroundColor: colors.primary }]}
          onPress={() => Alert.alert('Session', `Start session with ${item.name}`)}
        >
          <Ionicons name="videocam-outline" size={16} color="white" />
          <Text style={styles.buttonTextWhite}>Start Session</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
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
            My Mentees
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
            View, analyze, and manage your mentee profiles and progress.
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={isDark ? colors.text.secondary : colors.text.muted} />
          <TextInput
            style={[styles.searchInput, {
              backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              color: isDark ? colors.text.primaryDark : colors.text.primaryLight,
            }]}
            placeholder="Search by name..."
            placeholderTextColor={isDark ? colors.text.secondary : colors.text.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Toggle */}
        <TouchableOpacity
          style={[styles.filterToggle, {
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
          }]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons name="filter-outline" size={20} color={colors.primary} />
          <Text style={[styles.filterText, { color: colors.primary }]}>Filters</Text>
          <Ionicons 
            name={showFilters ? "chevron-up" : "chevron-down"} 
            size={20} 
            color={colors.primary} 
          />
        </TouchableOpacity>

        {/* Filters */}
        {showFilters && (
          <View style={styles.filtersContainer}>
            <View style={styles.filterRow}>
              <Text style={[styles.filterLabel, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
                Status:
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {['all', 'active', 'inactive'].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.filterChip,
                      statusFilter === status && { backgroundColor: colors.primary }
                    ]}
                    onPress={() => setStatusFilter(status)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      { color: statusFilter === status ? 'white' : (isDark ? colors.text.secondary : colors.text.muted) }
                    ]}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.filterRow}>
              <Text style={[styles.filterLabel, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
                Sort by:
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {['progress', 'confidence', 'name'].map((sort) => (
                  <TouchableOpacity
                    key={sort}
                    style={[
                      styles.filterChip,
                      sortBy === sort && { backgroundColor: colors.primary }
                    ]}
                    onPress={() => setSortBy(sort)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      { color: sortBy === sort ? 'white' : (isDark ? colors.text.secondary : colors.text.muted) }
                    ]}>
                      {sort.charAt(0).toUpperCase() + sort.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        )}

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {renderStatCard('Total Mentees', mentees.length.toString(), 'people-outline', colors.primary)}
          {renderStatCard('Active Mentees', mentees.filter(m => m.status === 'active').length.toString(), 'trending-up-outline', '#10b981')}
          {renderStatCard('Avg Progress', 
            mentees.length > 0 ? Math.round(mentees.reduce((sum, m) => sum + m.progress, 0) / mentees.length) + '%' : '0%',
            'analytics-outline', '#8b5cf6')}
          {renderStatCard('Avg AI Score', 
            mentees.length > 0 ? Math.round(mentees.reduce((sum, m) => sum + m.aiConfidence, 0) / mentees.length) + '%' : '0%',
            'sparkles-outline', '#14b8a6')}
        </View>

        {/* Mentees List */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
              Loading mentees...
            </Text>
          </View>
        ) : (
          <View>
            {filteredMentees.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="people-outline" size={48} color={isDark ? colors.text.secondary : colors.text.muted} />
                <Text style={[styles.emptyText, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
                  No mentees found matching your filters.
                </Text>
              </View>
            ) : (
              filteredMentees.map((mentee, index) => renderMenteeCard({ item: mentee, index }))
            )}
          </View>
        )}

        {/* AI Insights Section */}
        <View style={[styles.insightsContainer, {
          backgroundColor: isDark ? 'rgba(139,92,246,0.1)' : 'rgba(139,92,246,0.05)',
          borderColor: '#8b5cf6',
        }]}>
          <View style={styles.insightsHeader}>
            <View style={[styles.insightsIcon, { backgroundColor: '#8b5cf620' }]}>
              <Ionicons name="sparkles-outline" size={24} color="#8b5cf6" />
            </View>
            <View>
              <Text style={[styles.insightsTitle, { color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}>
                AI Insights for Mentors
              </Text>
              <Text style={[styles.insightsSubtitle, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
                Smart analytics based on your mentees' performance
              </Text>
            </View>
          </View>
          <Text style={[styles.insightsText, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
            Insights require more session data to activate.
          </Text>
        </View>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
  },
  filterToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  filterText: {
    fontSize: 16,
    fontWeight: '600',
  },
  filtersContainer: {
    backgroundColor: 'rgba(0,0,0,0.02)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 12,
  },
  filterRow: {
    gap: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
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
  menteeCard: {
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
  menteeHeader: {
    marginBottom: 16,
  },
  menteeProfile: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
  },
  statusDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
  },
  menteeInfo: {
    flex: 1,
  },
  menteeName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  menteeRole: {
    fontSize: 14,
    marginBottom: 8,
  },
  skillBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  skillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressSection: {
    marginBottom: 16,
    gap: 12,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 14,
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  lastSession: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  lastSessionText: {
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  viewButton: {
    borderWidth: 1,
  },
  sessionButton: {
    shadowColor: '#00FFB2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  buttonTextWhite: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  insightsContainer: {
    borderRadius: 16,
    padding: 24,
    marginTop: 24,
    borderWidth: 1,
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  insightsIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  insightsSubtitle: {
    fontSize: 14,
  },
  insightsText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
});

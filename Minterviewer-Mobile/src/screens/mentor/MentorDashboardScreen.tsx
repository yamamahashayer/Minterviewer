import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import MentorLayout from '../../layouts/MentorLayout';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme';
import { mentorService, MentorOverviewResponse } from '../../services/mentorService';

const { width: screenWidth } = Dimensions.get('window');

const MentorDashboardScreen = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overviewData, setOverviewData] = useState<MentorOverviewResponse['data'] | null>(null);

  useEffect(() => {
    fetchOverviewData();
  }, []);

  const fetchOverviewData = async () => {
    try {
      setLoading(true);
      const response = await mentorService.getOverview();
      if (response.success && response.data) {
        setOverviewData(response.data);
        setError(null);
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (err: any) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon, title, value, color }: any) => (
    <TouchableOpacity style={[
      styles.statCard,
      { 
        backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'white',
        borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#e5e7eb'
      }
    ]}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]} >
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={[styles.statTitle, { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }]}>
          {title}
        </Text>
        <Text style={[styles.statValue, { color: isDark ? 'white' : '#111827' }]}>
          {value}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const SessionCard = ({ session }: any) => (
    <View style={[
      styles.sessionCard,
      { 
        backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'white',
        borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#e5e7eb'
      }
    ]}>
      <View style={styles.sessionHeader}>
        <View style={styles.sessionInfo}>
          <Text style={[styles.sessionMentee, { color: isDark ? 'white' : '#111827' }]}>
            {session.mentee}
          </Text>
          <Text style={[styles.sessionType, { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }]}>
            {session.type}
          </Text>
        </View>
        <View style={[styles.sessionDot, { backgroundColor: session.color || colors.primary }]} />
      </View>
      <View style={styles.sessionDetails}>
        <View style={styles.sessionDetail}>
          <Ionicons name="calendar-outline" size={16} color={isDark ? 'rgba(255,255,255,0.7)' : '#6b7280'} />
          <Text style={[styles.sessionDetailText, { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }]}>
            {session.date}
          </Text>
        </View>
        <View style={styles.sessionDetail}>
          <Ionicons name="time-outline" size={16} color={isDark ? 'rgba(255,255,255,0.7)' : '#6b7280'} />
          <Text style={[styles.sessionDetailText, { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }]}>
            {session.time}
          </Text>
        </View>
      </View>
    </View>
  );

  const WeeklyActivityBar = ({ week, progress, maxValue }: any) => (
    <View style={styles.weeklyBar}>
      <Text style={[styles.weekLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }]}>
        {week}
      </Text>
      <View style={styles.barContainer}>
        <View 
          style={[
            styles.bar, 
            { 
              width: `${maxValue > 0 ? (progress / maxValue) * 100 : 0}%`,
              backgroundColor: colors.primary 
            }
          ]} 
        />
      </View>
      <Text style={[styles.progressValue, { color: isDark ? 'white' : '#111827' }]}>
        {progress}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <MentorLayout>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }]}>
            Loading dashboard...
          </Text>
        </View>
      </MentorLayout>
    );
  }

  if (error) {
    return (
      <MentorLayout>
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: colors.danger }]} >
            {error}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchOverviewData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </MentorLayout>
    );
  }

  const maxProgress = Math.max(...(overviewData?.progressChart?.map(item => item.progress) || [1]));

  return (
    <MentorLayout>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.welcomeText, { color: isDark ? 'white' : '#111827' }]}>
            Welcome back,
          </Text>
          <Text style={[styles.userName, { color: isDark ? 'white' : '#111827' }]}>
            {user?.full_name || 'Mentor'}
          </Text>
        </View>

        {/* Stats Grid - matching Web MentorOverviewPage stats */}
        <View style={styles.statsGrid}>
          <StatCard
            icon="people-outline"
            title="Satisfaction"
            value={overviewData?.stats?.satisfaction || '0%'}
            color="#10b981"
          />
          <StatCard
            icon="calendar-outline"
            title="This Week"
            value={overviewData?.stats?.sessionsThisWeek?.toString() || '0'}
            color="#3b82f6"
          />
          <StatCard
            icon="trophy-outline"
            title="Rank"
            value={overviewData?.stats?.rank || '#1'}
            color="#f59e0b"
          />
          <StatCard
            icon="star-outline"
            title="Level"
            value={`Lv.${overviewData?.stats?.level || 1}`}
            color="#8b5cf6"
          />
        </View>

        {/* Progress Chart - matching Web MentorOverviewPage progress chart */}
        <View style={[
          styles.chartContainer,
          { 
            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'white',
            borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#e5e7eb'
          }
        ]}>
          <Text style={[styles.chartTitle, { color: isDark ? 'white' : '#111827' }]}>
            Weekly Activity
          </Text>
          {overviewData?.progressChart && overviewData.progressChart.length > 0 ? (
            <View style={styles.chartContent}>
              {overviewData.progressChart.map((item, index) => (
                <WeeklyActivityBar
                  key={index}
                  week={item.week}
                  progress={item.progress}
                  maxValue={maxProgress}
                />
              ))}
            </View>
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={[styles.noDataText, { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }]}>
                No activity data available
              </Text>
            </View>
          )}
        </View>

        {/* Upcoming Sessions - matching Web MentorOverviewPage upcoming sessions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? 'white' : '#111827' }]}>
            Upcoming Sessions
          </Text>
          {overviewData?.upcomingSessions && overviewData.upcomingSessions.length > 0 ? (
            overviewData.upcomingSessions.map((session, index) => (
              <SessionCard key={session.id || index} session={session} />
            ))
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={[styles.noDataText, { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }]}>
                No upcoming sessions
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </MentorLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  header: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 16,
    opacity: 0.7,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chartContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chartContent: {
    gap: 12,
  },
  weeklyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  weekLabel: {
    width: 60,
    fontSize: 12,
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
    marginHorizontal: 12,
  },
  bar: {
    height: '100%',
    borderRadius: 4,
    minWidth: 2,
  },
  progressValue: {
    width: 30,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noDataText: {
    fontSize: 16,
    opacity: 0.7,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sessionCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  sessionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  sessionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sessionDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionDetailText: {
    fontSize: 14,
    marginLeft: 6,
  },
});

export default MentorDashboardScreen;

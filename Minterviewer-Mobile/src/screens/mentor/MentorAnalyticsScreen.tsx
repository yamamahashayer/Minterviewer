import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import MentorLayout from '../../layouts/MentorLayout';
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme';
import { mentorService, MentorAnalyticsResponse } from '../../services/mentorService';

const { width: screenWidth } = Dimensions.get('window');

const MentorAnalyticsScreen = () => {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<MentorAnalyticsResponse['data'] | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState(6);

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPeriod]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await mentorService.getAnalytics(selectedPeriod);
      if (response.success && response.data) {
        setAnalyticsData(response.data);
        setError(null);
      } else {
        setError('Failed to load analytics');
      }
    } catch (err: any) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const KPICard = ({ icon, title, value, subtitle, color }: any) => (
    <View style={[
      styles.kpiCard,
      { 
        backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'white',
        borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#e5e7eb'
      }
    ]}>
      <View style={[styles.kpiIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.kpiContent}>
        <Text style={[styles.kpiTitle, { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }]}>
          {title}
        </Text>
        <Text style={[styles.kpiValue, { color: isDark ? 'white' : '#111827' }]}>
          {value}
        </Text>
        {subtitle && (
          <Text style={[styles.kpiSubtitle, { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }]}>
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );

  const EarningsBar = ({ month, earnings, maxValue }: any) => (
    <View style={styles.earningsBar}>
      <Text style={[styles.monthLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }]}>
        {month}
      </Text>
      <View style={styles.barContainer}>
        <View 
          style={[
            styles.bar, 
            { 
              width: `${maxValue > 0 ? (earnings / maxValue) * 100 : 0}%`,
              backgroundColor: colors.primary 
            }
          ]} 
        />
      </View>
      <Text style={[styles.earningsValue, { color: isDark ? 'white' : '#111827' }]}>
        ${earnings}
      </Text>
    </View>
  );

  const ReviewCard = ({ review }: any) => (
    <View style={[
      styles.reviewCard,
      { 
        backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'white',
        borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#e5e7eb'
      }
    ]}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewInfo}>
          <Text style={[styles.reviewName, { color: isDark ? 'white' : '#111827' }]}>
            {review.mentee.name}
          </Text>
          <Text style={[styles.reviewDate, { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }]}>
            {new Date(review.date).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.starRating}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons 
              key={star}
              name={star <= review.rating ? 'star' : 'star-outline'} 
              size={16} 
              color={star <= review.rating ? '#fbbf24' : '#d1d5db'} 
            />
          ))}
        </View>
      </View>
      {review.reviewText && (
        <Text style={[styles.reviewText, { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }]}>
          {review.reviewText}
        </Text>
      )}
    </View>
  );

  const MenteeCard = ({ mentee }: any) => (
    <View style={[
      styles.menteeCard,
      { 
        backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'white',
        borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#e5e7eb'
      }
    ]}>
      <View style={styles.menteeHeader}>
        <View style={styles.menteeInfo}>
          <Text style={[styles.menteeName, { color: isDark ? 'white' : '#111827' }]}>
            {mentee.name}
          </Text>
          <Text style={[styles.menteeSessions, { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }]}>
            {mentee.totalSessions} sessions
          </Text>
        </View>
        {mentee.averageRating && (
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>⭐ {mentee.averageRating}</Text>
          </View>
        )}
      </View>
      <View style={styles.menteeDetails}>
        <View style={styles.menteeDetail}>
          <Text style={[styles.detailLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }]}>
            Completed
          </Text>
          <Text style={[styles.detailValue, { color: isDark ? 'white' : '#111827' }]}>
            {mentee.completedSessions}
          </Text>
        </View>
        <View style={styles.menteeDetail}>
          <Text style={[styles.detailLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }]}>
            Last Session
          </Text>
          <Text style={[styles.detailValue, { color: isDark ? 'white' : '#111827' }]}>
            {mentee.lastSessionDate ? new Date(mentee.lastSessionDate).toLocaleDateString() : 'N/A'}
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <MentorLayout>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }]}>
            Loading analytics...
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
          <TouchableOpacity style={styles.retryButton} onPress={fetchAnalytics}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </MentorLayout>
    );
  }

  const maxEarnings = Math.max(...(analyticsData?.earnings?.trend?.map(item => item.earnings) || [1]));

  return (
    <MentorLayout>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          <Text style={[styles.sectionTitle, { color: isDark ? 'white' : '#111827' }]}>
            Analytics Period
          </Text>
          <View style={styles.periodButtons}>
            {[3, 6, 12].map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  { 
                    backgroundColor: selectedPeriod === period 
                      ? colors.primary 
                      : isDark ? 'rgba(255,255,255,0.1)' : 'white',
                    borderColor: selectedPeriod === period 
                      ? colors.primary 
                      : isDark ? 'rgba(255,255,255,0.2)' : '#e5e7eb'
                  }
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text style={[
                  styles.periodButtonText,
                  { 
                    color: selectedPeriod === period 
                      ? 'black' 
                      : isDark ? 'rgba(255,255,255,0.7)' : '#6b7280'
                  }
                ]}>
                  {period} months
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* KPIs Grid */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? 'white' : '#111827' }]}>
            Key Performance Indicators
          </Text>
          <View style={styles.kpiGrid}>
            <KPICard
              icon="cash-outline"
              title="Total Earnings"
              value={`$${analyticsData?.kpis?.totalEarnings?.toFixed(2) || '0'}`}
              color="#10b981"
            />
            <KPICard
              icon="calendar-outline"
              title="Total Sessions"
              value={analyticsData?.kpis?.totalSessions?.toString() || '0'}
              color="#3b82f6"
            />
            <KPICard
              icon="star-outline"
              title="Average Rating"
              value={analyticsData?.kpis?.averageRating?.toFixed(1) || '0'}
              subtitle={`${analyticsData?.kpis?.completedSessions || 0} reviews`}
              color="#f59e0b"
            />
            <KPICard
              icon="people-outline"
              title="Active Mentees"
              value={analyticsData?.kpis?.activeMentees?.toString() || '0'}
              color="#8b5cf6"
            />
          </View>
        </View>

        {/* Earnings Chart */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? 'white' : '#111827' }]}>
            Earnings Trend
          </Text>
          <View style={[
            styles.chartContainer,
            { 
              backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'white',
              borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#e5e7eb'
            }
          ]}>
            {analyticsData?.earnings?.trend && analyticsData.earnings.trend.length > 0 ? (
              <View style={styles.chartContent}>
                {analyticsData.earnings.trend.map((item, index) => (
                  <EarningsBar
                    key={index}
                    month={item.month}
                    earnings={item.earnings}
                    maxValue={maxEarnings}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={[styles.noDataText, { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }]}>
                  No earnings data available
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Session Types Breakdown */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? 'white' : '#111827' }]}>
            Session Types
          </Text>
          <View style={styles.breakdownContainer}>
            {analyticsData?.sessions?.byType?.map((type, index) => (
              <View key={index} style={[
                styles.breakdownItem,
                { 
                  backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'white',
                  borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#e5e7eb'
                }
              ]}>
                <Text style={[styles.breakdownType, { color: isDark ? 'white' : '#111827' }]}>
                  {type.type}
                </Text>
                <Text style={[styles.breakdownCount, { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }]}>
                  {type.count} sessions
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Reviews */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? 'white' : '#111827' }]}>
            Recent Reviews
          </Text>
          <ScrollView style={styles.reviewsList} showsVerticalScrollIndicator={false}>
            {analyticsData?.feedback?.recent && analyticsData.feedback.recent.length > 0 ? (
              analyticsData.feedback.recent.slice(0, 5).map((review, index) => (
                <ReviewCard key={review.id || index} review={review} />
              ))
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={[styles.noDataText, { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }]}>
                  No reviews available
                </Text>
              </View>
            )}
          </ScrollView>
        </View>

        {/* Top Mentees */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? 'white' : '#111827' }]}>
            Active Mentees
          </Text>
          <ScrollView style={styles.menteesList} showsVerticalScrollIndicator={false}>
            {analyticsData?.mentees?.list && analyticsData.mentees.list.length > 0 ? (
              analyticsData.mentees.list.slice(0, 5).map((mentee, index) => (
                <MenteeCard key={mentee.id || index} mentee={mentee} />
              ))
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={[styles.noDataText, { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }]}>
                  No mentees available
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </ScrollView>
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
  periodSelector: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  periodButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 32,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  kpiCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  kpiIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  kpiContent: {
    flex: 1,
  },
  kpiTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  kpiSubtitle: {
    fontSize: 12,
    opacity: 0.7,
  },
  chartContainer: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  chartContent: {
    gap: 12,
  },
  earningsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  monthLabel: {
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
  earningsValue: {
    width: 60,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
  },
  breakdownContainer: {
    gap: 12,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  breakdownType: {
    fontSize: 16,
    fontWeight: '600',
  },
  breakdownCount: {
    fontSize: 14,
    opacity: 0.7,
  },
  reviewsList: {
    maxHeight: 300,
  },
  reviewCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reviewInfo: {
    flex: 1,
  },
  reviewName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 14,
    opacity: 0.7,
  },
  starRating: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
  },
  menteesList: {
    maxHeight: 300,
  },
  menteeCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  menteeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  menteeInfo: {
    flex: 1,
  },
  menteeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  menteeSessions: {
    fontSize: 14,
    opacity: 0.7,
  },
  ratingBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  menteeDetails: {
    gap: 8,
  },
  menteeDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noDataText: {
    fontSize: 16,
    opacity: 0.7,
  },
});

export default MentorAnalyticsScreen;

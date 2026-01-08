import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import MentorLayout from '../../layouts/MentorLayout';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme';
import { mentorService } from '../../services/mentorService';

interface EarningsData {
  totalEarnings: number;
  totalSessions: number;
  avgPerSession: number;
  pendingEarnings: number;
  chartData: Array<{
    month: string;
    earnings: number;
  }>;
  transactions: Array<{
    id: string;
    menteeName: string;
    menteeAvatar: string;
    sessionType: string;
    amount: number;
    date: string;
    status: 'completed' | 'pending';
  }>;
  sessionsBreakdown: Array<{
    type: string;
    sessions: number;
    earnings: number;
    price: number;
  }>;
}

const MentorEarningsScreen = () => {
  const { isDark } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [earningsData, setEarningsData] = useState<EarningsData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState(6);

  useEffect(() => {
    if (!isAuthenticated) return;
    loadEarnings();
  }, [isAuthenticated, selectedPeriod]);

  const loadEarnings = async () => {
    try {
      setLoading(true);
      
      // Use the mentorService to get earnings data
      const response = await mentorService.getEarnings();
      
      if (response.success && response.data) {
        setEarningsData(response.data);
        setError(null);
      } else {
        setError('Failed to load earnings data');
      }
    } catch (err: any) {
      setError('Failed to load earnings data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon, title, value, subtitle, color }: any) => (
    <View style={[
      styles.statCard,
      { 
        backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'white',
        borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#e5e7eb'
      }
    ]}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={[styles.statTitle, { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }]}>
          {title}
        </Text>
        <Text style={[styles.statValue, { color: isDark ? 'white' : '#111827' }]}>
          {value}
        </Text>
        {subtitle && (
          <Text style={[styles.statSubtitle, { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }]}>
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

  const TransactionItem = ({ transaction }: { transaction: any }) => (
    <View style={[
      styles.transactionItem,
      { 
        backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'white',
        borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#e5e7eb'
      }
    ]}>
      <View style={styles.transactionHeader}>
        <View style={styles.transactionInfo}>
          <Text style={[styles.transactionDate, { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }]}>
            {new Date(transaction.date).toLocaleDateString()}
          </Text>
          <Text style={[styles.transactionDescription, { color: isDark ? 'white' : '#111827' }]}>
            {transaction.sessionType} with {transaction.menteeName}
          </Text>
        </View>
        <View style={styles.transactionAmount}>
          <Text style={[
            styles.amountText,
            { 
              color: transaction.status === 'pending'
                ? colors.warning
                : colors.success
            }
          ]}>
            ${transaction.amount}
          </Text>
        </View>
      </View>
      <View style={styles.transactionMeta}>
        <View style={[
          styles.transactionType,
          { 
            backgroundColor: colors.primary + '20',
            borderColor: colors.primary
          }
        ]}>
          <Text style={[
            styles.typeText,
            { 
              color: colors.primary
            }
          ]}>
            {transaction.sessionType?.charAt(0).toUpperCase() + transaction.sessionType?.slice(1) || 'Session'}
          </Text>
        </View>
        <View style={[
          styles.statusBadge,
          { 
            backgroundColor: transaction.status === 'completed'
              ? colors.success + '20'
              : colors.warning + '20',
            borderColor: transaction.status === 'completed'
              ? colors.success
              : colors.warning
          }
        ]}>
          <Text style={[
            styles.statusText,
            { 
              color: transaction.status === 'completed'
                ? colors.success
                : colors.warning
            }
          ]}>
            {transaction.status}
          </Text>
        </View>
      </View>
    </View>
  );

  const SessionTypeItem = ({ type }: { type: any }) => (
    <View style={[
      styles.sessionTypeItem,
      { 
        backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'white',
        borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#e5e7eb'
      }
    ]}>
      <Text style={[styles.sessionTypeName, { color: isDark ? 'white' : '#111827' }]}>
        {type.type}
      </Text>
      <View style={styles.sessionTypeStats}>
        <View style={styles.sessionTypeStat}>
          <Text style={[styles.statValue, { color: isDark ? 'white' : '#111827' }]}>
            {type.sessions}
          </Text>
          <Text style={[styles.statSubtitle, { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }]}>
            sessions
          </Text>
        </View>
        <View style={styles.sessionTypeStat}>
          <Text style={[styles.statValue, { color: isDark ? 'white' : '#111827' }]}>
            ${type.earnings}
          </Text>
          <Text style={[styles.statSubtitle, { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }]}>
            earned
          </Text>
        </View>
        <View style={styles.sessionTypeStat}>
          <Text style={[styles.statValue, { color: isDark ? 'white' : '#111827' }]}>
            ${type.price}
          </Text>
          <Text style={[styles.statSubtitle, { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }]}>
            avg rate
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
            Loading earnings...
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
          <TouchableOpacity style={styles.retryButton} onPress={loadEarnings}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </MentorLayout>
    );
  }

  const maxEarnings = Math.max(...(earningsData?.chartData?.map(item => item.earnings) || [1]));

  return (
    <MentorLayout>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: isDark ? 'white' : '#111827' }]}>
            Earnings
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }]}>
            Track your income and payments
          </Text>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          <Text style={[styles.sectionTitle, { color: isDark ? 'white' : '#111827' }]}>
            Earnings Period
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

        {/* Stats Grid */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? 'white' : '#111827' }]}>
            Earnings Overview
          </Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon="cash-outline"
              title="Total Earnings"
              value={`$${earningsData?.totalEarnings?.toFixed(2) || '0'}`}
              color="#10b981"
            />
            <StatCard
              icon="calendar-outline"
              title="Total Sessions"
              value={earningsData?.totalSessions?.toString() || '0'}
              color="#3b82f6"
            />
            <StatCard
              icon="trending-up-outline"
              title="Avg per Session"
              value={`$${earningsData?.avgPerSession?.toFixed(2) || '0'}`}
              color="#8b5cf6"
            />
            <StatCard
              icon="time-outline"
              title="Pending"
              value={`$${earningsData?.pendingEarnings?.toFixed(2) || '0'}`}
              subtitle="from 2 sessions"
              color="#f59e0b"
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
            {earningsData?.chartData && earningsData.chartData.length > 0 ? (
              <View style={styles.chartContent}>
                {earningsData.chartData.map((item, index) => (
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

        {/* Sessions Breakdown */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? 'white' : '#111827' }]}>
            Sessions Breakdown
          </Text>
          <View style={styles.sessionsBreakdown}>
            {earningsData?.sessionsBreakdown?.map((type, index) => (
              <SessionTypeItem key={index} type={type} />
            )) || []}
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? 'white' : '#111827' }]}>
            Recent Transactions
          </Text>
          <View style={styles.transactionsList}>
            {earningsData?.transactions?.slice(0, 10).map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            )) || []}
          </View>
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
  header: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 20,
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
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
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
  statIcon: {
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
    marginBottom: 2,
  },
  statSubtitle: {
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
  sessionsBreakdown: {
    gap: 12,
  },
  sessionTypeItem: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  sessionTypeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  sessionTypeStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionTypeStat: {
    alignItems: 'center',
  },
  transactionsList: {
    gap: 12,
  },
  transactionItem: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDate: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  transactionType: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
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
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noDataText: {
    fontSize: 16,
    opacity: 0.7,
  },
});

export default MentorEarningsScreen;

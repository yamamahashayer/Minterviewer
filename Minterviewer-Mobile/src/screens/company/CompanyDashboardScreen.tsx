import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import CompanyLayout from '../../layouts/CompanyLayout';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme';
import { companyService } from '../../services/companyService';
import HiringPipelineVisual from '../../components/company/HiringPipelineVisual';
import JobStatusChart from '../../components/company/JobStatusChart';

interface DashboardData {
  name: string;
  hiringStatus: string;
  isVerified: boolean;
  industry: string;
  totalJobs: number;
  totalCandidates: number;
  jobs: any[];
}

export default function CompanyDashboardScreen() {
  const { theme, isDark } = useTheme();
  const { user, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user?.companyId) {
      setLoading(false);
      return;
    }

    loadDashboardData();
  }, [isAuthenticated, user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      console.log('CompanyDashboardScreen: User data:', user);
      console.log('CompanyDashboardScreen: User companyId:', user?.companyId);
      
      if (!user?.companyId) {
        console.error('CompanyDashboardScreen: No companyId found in user data');
        setError('No company ID found. Please log in again.');
        return;
      }
      
      console.log('CompanyDashboardScreen: Calling analytics API...');
      const analyticsData = await companyService.getAnalytics(user.companyId);
      console.log('CompanyDashboardScreen: Analytics response:', analyticsData);
      
      // Handle different response structures
      if (analyticsData && (analyticsData as any).analytics) {
        setData((analyticsData as any).analytics);
      } else if (analyticsData && (analyticsData as any).overview) {
        setData((analyticsData as any).overview);
      } else if (analyticsData) {
        setData(analyticsData as any);
      } else {
        console.error('CompanyDashboardScreen: No analytics data found in response');
        setError('No analytics data available');
        return;
      }
      
      setError(null);
    } catch (e: any) {
      console.error('CompanyDashboardScreen: Error loading dashboard:', e);
      setError(`Failed to load dashboard: ${e.message || String(e)}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <CompanyLayout>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text.primaryDark }]}>Loading dashboard...</Text>
        </View>
      </CompanyLayout>
    );
  }

  if (error) {
    return (
      <CompanyLayout>
        <View style={styles.centerContainer}>
          <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
          <TouchableOpacity style={[styles.retryButton, { backgroundColor: colors.primary }]} onPress={loadDashboardData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </CompanyLayout>
    );
  }

  if (!data) {
    return (
      <CompanyLayout>
        <View style={styles.centerContainer}>
          <Text style={[styles.errorText, { color: colors.text.primaryDark }]}>No dashboard data available</Text>
        </View>
      </CompanyLayout>
    );
  }

  const StatCard = ({ icon, label, value }: any) => (
    <View style={[styles.statCard, { backgroundColor: isDark ? '#020617' : '#ffffff', borderColor: isDark ? '#374151' : '#e5e7eb' }]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statLabel, { color: isDark ? '#94a3b8' : '#6b7280' }]}>{label}</Text>
      <Text style={[styles.statValue, { color: isDark ? '#ffffff' : '#111827' }]}>{value}</Text>
    </View>
  );

  return (
    <CompanyLayout>
      <ScrollView style={[styles.container, { backgroundColor: isDark ? '#0f172a' : '#f5f3ff' }]} showsVerticalScrollIndicator={false}>
        {/* ================= HEADER ================= */}
        <View style={[styles.header, { backgroundColor: isDark ? '#0a1022' : '#ffffff', borderColor: isDark ? '#1e293b' : '#e5e7eb' }]}>
          {/* Background grid pattern */}
          <View style={styles.gridPattern} />
          
          <View style={styles.headerContent}>
            <View style={styles.leftColumn}>
              <Text style={[styles.headerTitle, { color: isDark ? '#ffffff' : '#111827' }]}>
                Hiring control center for{' '}
                <Text style={[styles.highlightText, { color: '#9333ea' }]}>{data.name}</Text>
              </Text>
              
              <Text style={[styles.headerSubtitle, { color: isDark ? '#cbd5e1' : '#6b7280' }]}>
                Manage jobs, candidates, CVs, and interviews from one intelligent
                dashboard powered by AI insights.
              </Text>
              
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.primaryButton]}
                >
                  <Text style={styles.primaryButtonText}>+ Post a new job</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton, { borderColor: isDark ? '#374151' : '#d1d5db' }]}
                >
                  <Text style={[styles.secondaryButtonText, { color: isDark ? '#e2e8f0' : '#374151' }]}>View candidates</Text>
                </TouchableOpacity>
              </View>
            </View>
          
          </View>
        </View>

        {/* ================= STATS ================= */}
        <View style={styles.statsGrid}>
          <StatCard
            icon="💼"
            label="Jobs Posted"
            value={data.totalJobs}
          />
          <StatCard
            icon="👥"
            label="Total Candidates"
            value={data.totalCandidates}
          />
          <StatCard
            icon="📊"
            label="Hiring Status"
            value={data.hiringStatus}
          />
          <StatCard
            icon="✅"
            label="Verification"
            value={data.isVerified ? "Verified" : "Pending"}
          />
        </View>
        
        {/* ================= QUICK ACTIONS ================= */}
        <View style={styles.quickActions}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#111827' }]}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: isDark ? '#020617' : '#ffffff', borderColor: isDark ? '#374151' : '#e5e7eb' }]}
            >
              <View style={[styles.actionIcon, { backgroundColor: 'rgba(147, 51, 234, 0.15)' }]}>
                <Text style={styles.emojiIcon}>💼</Text>
              </View>
              <Text style={[styles.actionTitle, { color: isDark ? '#ffffff' : '#111827' }]}>Job Management</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: isDark ? '#020617' : '#ffffff', borderColor: isDark ? '#374151' : '#e5e7eb' }]}
            >
              <View style={[styles.actionIcon, { backgroundColor: 'rgba(147, 51, 234, 0.15)' }]}>
                <Text style={styles.emojiIcon}>👥</Text>
              </View>
              <Text style={[styles.actionTitle, { color: isDark ? '#ffffff' : '#111827' }]}>Candidate Tracking</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ================= ANALYTICS ================= */}
        <View style={[styles.analyticsSection, { backgroundColor: isDark ? '#020617' : '#ffffff', borderColor: isDark ? '#1e293b' : '#e5e7eb' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#111827' }]}>Hiring Analytics</Text>
          
          <View style={styles.analyticsGrid}>
            <View style={[styles.analyticsCard, { backgroundColor: isDark ? '#0f172a' : '#ffffff', borderColor: isDark ? '#374151' : '#e5e7eb' }]}>
              <Text style={[styles.analyticsCardTitle, { color: isDark ? '#ffffff' : '#111827' }]}>Hiring Pipeline</Text>
              <HiringPipelineVisual jobs={data.jobs} isDark={isDark} />
            </View>
            
            <View style={[styles.analyticsCard, { backgroundColor: isDark ? '#0f172a' : '#ffffff', borderColor: isDark ? '#374151' : '#e5e7eb' }]}>
              <Text style={[styles.analyticsCardTitle, { color: isDark ? '#ffffff' : '#111827' }]}>Job Status Distribution</Text>
              <JobStatusChart jobs={data.jobs} isDark={isDark} />
            </View>
          </View>
        </View>
      </ScrollView>
    </CompanyLayout>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 120,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  header: {
    margin: 20,
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  gridPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.04,
    backgroundColor: 'transparent',
  },
  headerContent: {
    gap: 20,
  },
  leftColumn: {
    gap: 20,
    marginBottom: 28,
  },
  rightColumn: {
    gap: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  highlightText: {
    color: '#9333ea',
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 26,
    letterSpacing: 0.2,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
    marginTop: 8,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    minWidth: 160,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: '#9333ea',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.3,
  },
  secondaryButtonText: {
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 0.2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  statCard: {
    borderRadius: 20,
    padding: 20,
    width: width * 0.9,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  emojiIcon: {
    fontSize: 24,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500',
    opacity: 0.8,
    letterSpacing: 0.3,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  actionGrid: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  actionCard: {
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(147, 51, 234, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  actionDescription: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: 0.1,
  },
  recentSection: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  jobCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  jobMeta: {
    fontSize: 14,
  },
  analyticsSection: {
    margin: 20,
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
    marginBottom: 32,
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginTop: 28,
  },
  analyticsCard: {
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    width: (width - 72) / 2, // 2 columns with gaps
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  analyticsCardTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    letterSpacing: -0.2,
  },
});

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import MenteeLayout from "../../layouts/MenteeLayout";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { colors } from "../../theme";
import { menteeService, DashboardData } from "../../services/menteeService";

/* ================= SCREEN ================= */

export default function OverviewScreen() {
  const { isDark } = useTheme();
  const { user, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    loadDashboardData();
  }, [isAuthenticated]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await menteeService.getDashboard();
      setDashboardData(data);
      setError(null);
    } catch (e: any) {
      console.error("OverviewScreen: Error loading dashboard:", e);
      setError(`Failed to load dashboard: ${e.message || String(e)}`);
    } finally {
      setLoading(false);
    }
  };

  // Quick Actions
  const quickActions = [
    {
      id: "practice",
      title: "Start AI Interview",
      description: "Practice with AI-powered mock interviews",
      icon: "play-outline" as keyof typeof Ionicons.glyphMap,
      color: colors.primary,
    },
    {
      id: "cv",
      title: "Upload CV for Review",
      description: "Get AI feedback on your resume",
      icon: "document-text-outline" as keyof typeof Ionicons.glyphMap,
      color: "#10b981",
    },
    {
      id: "mentor",
      title: "Book Mentor Session",
      description: "Connect with industry experts",
      icon: "people-outline" as keyof typeof Ionicons.glyphMap,
      color: "#8b5cf6",
    },
    {
      id: "schedule",
      title: "Schedule Interview",
      description: "Book your next mock interview",
      icon: "calendar-outline" as keyof typeof Ionicons.glyphMap,
      color: "#f59e0b",
    },
  ];

  // Stats Cards
  const getStatsCards = () => {
    if (!dashboardData) return [];

    const stats = dashboardData.stats;
    return [
      {
        label: "Overall Score",
        value: `${(stats.overallScore <= 10 ? stats.overallScore : stats.overallScore / 10).toFixed(1)}/10`,
        icon: "trophy-outline" as keyof typeof Ionicons.glyphMap,
        color: "#14b8a6",
      },
      {
        label: "Total Interviews",
        value: stats.totalInterviews.toString(),
        icon: "checkmark-circle-outline" as keyof typeof Ionicons.glyphMap,
        color: "#10b981",
      },
      {
        label: "Active Days",
        value: (stats.activeDays || 0).toString(),
        icon: "flash-outline" as keyof typeof Ionicons.glyphMap,
        color: "#f59e0b",
      },
      {
        label: "Total Hours",
        value: `${stats.totalHours}h`,
        icon: "time-outline" as keyof typeof Ionicons.glyphMap,
        color: "#8b5cf6",
      },
    ];
  };

  // Helper functions
  const formatScore = (score: number) => {
    return score <= 10 ? score.toFixed(1) : (score / 10).toFixed(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  /* ================= STATES ================= */

  if (loading) {
    return (
      <MenteeLayout>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, themedText(isDark)]}>
            Loading Dashboard...
          </Text>
        </View>
      </MenteeLayout>
    );
  }

  if (error) {
    return (
      <MenteeLayout>
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: colors.danger }]}>
            {error}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={loadDashboardData}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </MenteeLayout>
    );
  }

  /* ================= UI ================= */

  return (
    <MenteeLayout>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={[styles.headerTitle, themedText(isDark)]}>
            Dashboard Overview
          </Text>
          <Text style={[styles.headerSubtitle, themedText(isDark)]}>
            Your interview preparation journey at a glance
          </Text>
          <View style={[styles.headerAccent, { backgroundColor: colors.primary }]} />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, themedText(isDark)]}>
            Quick Actions
          </Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.quickActionCard, themedCard(isDark)]}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}20` }]}>
                  <Ionicons name={action.icon} size={24} color={action.color} />
                </View>
                <Text style={[styles.quickActionTitle, themedText(isDark)]}>
                  {action.title}
                </Text>
                <Text style={[styles.quickActionDescription, themedText(isDark)]}>
                  {action.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, themedText(isDark)]}>
            Your Progress
          </Text>
          <View style={styles.statsGrid}>
            {getStatsCards().map((stat, index) => (
              <View key={index} style={[styles.statCard, themedCard(isDark)]}>
                <View style={styles.statHeader}>
                  <Ionicons name={stat.icon} size={28} color={stat.color} />
                  <Ionicons name="trending-up-outline" size={16} color="#10b981" />
                </View>
                <Text style={[styles.statValue, themedText(isDark)]}>
                  {stat.value}
                </Text>
                <Text style={[styles.statLabel, themedText(isDark)]}>
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Weekly Performance */}
        {dashboardData?.weeklyData && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, themedText(isDark)]}>
              Weekly Performance
            </Text>
            <View style={[styles.card, themedCard(isDark)]}>
              <View style={styles.weeklyHeader}>
                <Ionicons name="trending-up-outline" size={20} color={colors.primary} />
                <Text style={[styles.weeklyTitle, themedText(isDark)]}>
                  Score Trends
                </Text>
              </View>
              <View style={styles.weeklyChart}>
                {dashboardData.weeklyData.map((day, index) => (
                  <View key={index} style={styles.weeklyBar}>
                    <View style={styles.weeklyDay}>
                      <Text style={[styles.weeklyDayText, themedText(isDark)]}>
                        {day.day}
                      </Text>
                    </View>
                    <View style={styles.weeklyBarContainer}>
                      <View
                        style={[
                          styles.weeklyBarFill,
                          {
                            height: `${Math.max((day.score / 10) * 100, 10)}%`,
                            backgroundColor: colors.primary,
                          },
                        ]}
                      />
                    </View>
                    <Text style={[styles.weeklyScore, themedText(isDark)]}>
                      {formatScore(day.score)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Latest Interview Insights */}
        {dashboardData?.lastInterviewFeedback && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, themedText(isDark)]}>
              Latest Interview Insights
            </Text>
            <View style={[styles.card, themedCard(isDark)]}>
              <View style={styles.insightsHeader}>
                <Ionicons name="bulb-outline" size={20} color={colors.primary} />
                <Text style={[styles.insightsTitle, themedText(isDark)]}>
                  Performance Analysis
                </Text>
              </View>
              
              <View style={styles.insightsMeta}>
                <Text style={[styles.insightsDate, themedText(isDark)]}>
                  {dashboardData.lastInterviewFeedback.date}
                </Text>
                <View style={[styles.scoreBadge, { backgroundColor: `${colors.primary}20` }]}>
                  <Text style={[styles.scoreText, { color: colors.primary }]}>
                    Score: {Math.round(dashboardData.lastInterviewFeedback.score)}%
                  </Text>
                </View>
              </View>

              {dashboardData.lastInterviewFeedback.strengths.length > 0 && (
                <View style={styles.insightSection}>
                  <Text style={[styles.insightSectionTitle, { color: "#10b981" }]}>
                    💪 Strengths
                  </Text>
                  {dashboardData.lastInterviewFeedback.strengths.slice(0, 2).map((strength, index) => (
                    <Text key={index} style={[styles.insightItem, themedText(isDark)]}>
                      • {strength}
                    </Text>
                  ))}
                </View>
              )}

              {dashboardData.lastInterviewFeedback.improvements.length > 0 && (
                <View style={styles.insightSection}>
                  <Text style={[styles.insightSectionTitle, { color: "#f59e0b" }]}>
                    💡 Suggestions
                  </Text>
                  {dashboardData.lastInterviewFeedback.improvements.slice(0, 2).map((improvement, index) => (
                    <Text key={index} style={[styles.insightItem, themedText(isDark)]}>
                      • {improvement}
                    </Text>
                  ))}
                </View>
              )}

              <View style={styles.skillsContainer}>
                {dashboardData.lastInterviewFeedback.skills.map((skill, index) => (
                  <View key={index} style={[styles.skillTag, { backgroundColor: `${colors.primary}10` }]}>
                    <Text style={[styles.skillText, { color: colors.primary }]}>
                      {skill}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Upcoming Interviews */}
        {dashboardData?.upcomingInterviews && dashboardData.upcomingInterviews.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, themedText(isDark)]}>
              Upcoming Interviews
            </Text>
            {dashboardData.upcomingInterviews.map((interview) => (
              <View key={interview.id} style={[styles.card, themedCard(isDark)]}>
                <View style={styles.interviewHeader}>
                  <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                  <Text style={[styles.interviewTitle, themedText(isDark)]}>
                    {interview.title}
                  </Text>
                </View>
                <View style={styles.interviewDetails}>
                  <Text style={[styles.interviewTime, themedText(isDark)]}>
                    {interview.time}
                  </Text>
                  <Text style={[styles.interviewDuration, themedText(isDark)]}>
                    Duration: {interview.duration}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Current Goals */}
        {dashboardData?.currentGoals && dashboardData.currentGoals.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, themedText(isDark)]}>
              Current Goals
            </Text>
            {dashboardData.currentGoals.map((goal) => (
              <View key={goal.id} style={[styles.card, themedCard(isDark)]}>
                <Text style={[styles.goalTitle, themedText(isDark)]}>
                  {goal.title}
                </Text>
                <View style={styles.goalProgress}>
                  <Text style={[styles.goalProgressText, themedText(isDark)]}>
                    {goal.current} / {goal.target}
                  </Text>
                  <Text style={[styles.goalPercent, themedText(isDark)]}>
                    {goal.progress}%
                  </Text>
                </View>
                <View style={styles.goalProgressBar}>
                  <View
                    style={[
                      styles.goalProgressBarFill,
                      {
                        width: `${goal.progress}%`,
                        backgroundColor: colors.primary,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Recent Achievements */}
        {dashboardData?.recentAchievements && dashboardData.recentAchievements.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, themedText(isDark)]}>
              Recent Achievements
            </Text>
            <View style={styles.achievementsContainer}>
              {dashboardData.recentAchievements.map((achievement) => (
                <View key={achievement.id} style={[styles.achievementCard, themedCard(isDark)]}>
                  <View style={[styles.achievementIcon, { backgroundColor: `${colors.primary}20` }]}>
                    <Ionicons name="trophy-outline" size={20} color={colors.primary} />
                  </View>
                  <Text style={[styles.achievementTitle, themedText(isDark)]}>
                    {achievement.title}
                  </Text>
                  <Text style={[styles.achievementDate, themedText(isDark)]}>
                    {formatDate(achievement.date)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

      </ScrollView>
    </MenteeLayout>
  );
}

/* ================= HELPERS ================= */

const themedCard = (isDark: boolean) => ({
  backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#fff",
  borderColor: isDark ? "rgba(94,234,212,0.2)" : "#ddd6fe",
});

const themedText = (isDark: boolean) => ({
  color: isDark ? colors.text.primaryDark : colors.text.primaryLight,
});

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, fontSize: 16 },
  errorText: { fontSize: 16, textAlign: "center", marginBottom: 16 },
  retryButton: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  retryButtonText: { color: "#fff", fontWeight: "600" },

  // Header
  headerSection: { marginBottom: 24 },
  headerTitle: { fontSize: 28, fontWeight: "bold", marginBottom: 8 },
  headerSubtitle: { fontSize: 16, opacity: 0.7, marginBottom: 16 },
  headerAccent: { height: 4, width: 60, borderRadius: 2 },

  // Sections
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },

  // Quick Actions
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickActionCard: {
    width: "48%",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  quickActionDescription: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: "center",
  },

  // Stats
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statValue: { fontSize: 24, fontWeight: "bold", marginBottom: 4 },
  statLabel: { fontSize: 12, opacity: 0.7 },

  // Cards
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },

  // Weekly Performance
  weeklyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  weeklyTitle: { fontSize: 16, fontWeight: "600" },
  weeklyChart: { flexDirection: "row", justifyContent: "space-between" },
  weeklyBar: { alignItems: "center", flex: 1 },
  weeklyDay: { marginBottom: 8 },
  weeklyDayText: { fontSize: 12, textAlign: "center" },
  weeklyBarContainer: {
    height: 60,
    width: 20,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    justifyContent: "flex-end",
    marginHorizontal: 4,
  },
  weeklyBarFill: { borderRadius: 4 },
  weeklyScore: { fontSize: 10, marginTop: 4 },

  // Interview Insights
  insightsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  insightsTitle: { fontSize: 16, fontWeight: "600" },
  insightsMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  insightsDate: { fontSize: 14, opacity: 0.7 },
  scoreBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  scoreText: { fontSize: 12, fontWeight: "600" },
  insightSection: { marginBottom: 16 },
  insightSectionTitle: { fontSize: 14, fontWeight: "600", marginBottom: 8 },
  insightItem: { fontSize: 14, lineHeight: 20, marginBottom: 4 },
  skillsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  skillTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  skillText: { fontSize: 12, fontWeight: "500" },

  // Upcoming Interviews
  interviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  interviewTitle: { fontSize: 16, fontWeight: "600" },
  interviewDetails: { flexDirection: "row", justifyContent: "space-between" },
  interviewTime: { fontSize: 14, opacity: 0.7 },
  interviewDuration: { fontSize: 14, opacity: 0.7 },

  // Goals
  goalTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  goalProgress: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  goalProgressText: { fontSize: 14, opacity: 0.7 },
  goalPercent: { fontSize: 14, fontWeight: "600" },
  goalProgressBar: {
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
  },
  goalProgressBarFill: { borderRadius: 4 },

  // Achievements
  achievementsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  achievementCard: {
    width: "48%",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    alignItems: "center",
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  achievementDate: { fontSize: 12, opacity: 0.7 },
});

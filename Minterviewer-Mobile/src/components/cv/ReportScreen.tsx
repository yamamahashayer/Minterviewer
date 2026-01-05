import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  data?: any;
  menteeId?: string;
  resumeId?: string;
  onBack: () => void;
  mode?: 'mentee' | 'company';
}

export default function ReportScreen({ 
  data, 
  menteeId, 
  resumeId, 
  onBack, 
  mode = 'mentee' 
}: Props) {
  const { isDark } = useTheme();
  const [fetchedData, setFetchedData] = useState<any | null>(data || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'improve' | 'history'>('details');

  useEffect(() => {
    if (mode === 'company') return;
    if (fetchedData || !menteeId || !resumeId) return;

    const fetchReport = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/mentees/${menteeId}/cv/report/${resumeId}`);
        const json = await response.json();
        
        if (!response.ok) {
          throw new Error(json?.error || 'Failed to load analysis');
        }

        setFetchedData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [menteeId, resumeId, fetchedData, mode]);

  const result = fetchedData?.analysis || fetchedData || data;
  const categories = result?.categories || {};

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDark ? '#0b1020' : '#f5f3ff' }]}>
        <ActivityIndicator size="large" color={isDark ? '#5eead4' : '#7c3aed'} />
        <Text style={[styles.loadingText, { color: isDark ? '#fff' : '#2e1065' }]}>
          Loading CV analysis…
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: isDark ? '#0b1020' : '#f5f3ff' }]}>
        <Text style={styles.errorText}>⚠️ {error}</Text>
      </View>
    );
  }

  if (!result) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: isDark ? '#0b1020' : '#f5f3ff' }]}>
        <Text style={[styles.emptyText, { color: isDark ? '#fff' : '#2e1065' }]}>
          No analysis data available.
        </Text>
      </View>
    );
  }

  const ScoreBox = ({ label, value }: { label: string; value: number }) => (
    <View style={[
      styles.scoreBox,
      {
        backgroundColor: isDark ? 'rgba(15,23,42,0.8)' : '#fff',
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e9d5ff',
      }
    ]}>
      <Text style={[styles.scoreLabel, { color: isDark ? '#fff' : '#7c3aed' }]}>
        {label}
      </Text>
      <Text style={[styles.scoreValue, { color: isDark ? '#fff' : '#2e1065' }]}>
        {value}/100
      </Text>
    </View>
  );

  const CategoryCard = ({ title, data }: { title: string; data: any }) => (
    <View style={[
      styles.categoryCard,
      {
        backgroundColor: isDark ? 'rgba(15,23,42,0.8)' : '#fff',
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e9d5ff',
      }
    ]}>
      <Text style={[styles.categoryTitle, { color: isDark ? '#fff' : '#2e1065' }]}>
        {title} ({data?.score || 0}/10)
      </Text>
      <View style={styles.insightsList}>
        {(data?.insights || []).map((insight: string, idx: number) => (
          <Text key={idx} style={[styles.insightText, { color: isDark ? '#fff' : '#2e1065' }]}>
            • {insight}
          </Text>
        ))}
      </View>
    </View>
  );

  const ImprovementSection = ({ improvements }: { improvements: string[] }) => (
    <View style={[
      styles.improvementSection,
      {
        backgroundColor: isDark ? 'rgba(15,23,42,0.8)' : '#fff',
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e9d5ff',
      }
    ]}>
      <Text style={[styles.improvementTitle, { color: isDark ? '#fff' : '#2e1065' }]}>
        AI Recommendations
      </Text>
      <View style={styles.improvementsList}>
        {improvements.map((improvement: string, idx: number) => (
          <Text key={idx} style={[styles.improvementText, { color: isDark ? '#fff' : '#2e1065' }]}>
            • {improvement}
          </Text>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? '#0b1020' : '#f5f3ff' }]}>
      {/* Header */}
      <View style={[
        styles.header,
        {
          backgroundColor: isDark ? 'rgba(15,23,42,0.9)' : '#fff',
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e9d5ff',
        }
      ]}>
        <View>
          <Text style={[
            styles.headerTitle,
            { color: isDark ? '#a855f7' : '#7c3aed' }
          ]}>
            CV Review & Optimization
          </Text>
          <Text style={[styles.headerSubtitle, { color: isDark ? '#fff' : '#7c3aed' }]}>
            AI-powered resume evaluation
          </Text>
        </View>

        {mode === 'mentee' && (
          <TouchableOpacity
            style={[
              styles.downloadButton,
              {
                backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(124,58,237,0.1)',
                borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(124,58,237,0.2)',
              }
            ]}
          >
            <Ionicons name="download" size={16} color={isDark ? '#fff' : '#7c3aed'} />
            <Text style={[styles.downloadButtonText, { color: isDark ? '#fff' : '#7c3aed' }]}>
              Download Report
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Scores */}
      <View style={styles.scoresGrid}>
        <ScoreBox label="Overall" value={result.score || 0} />
        <ScoreBox label="ATS" value={result.atsScore || 0} />
        <ScoreBox 
          label="Keyword Match" 
          value={(result.keywordCoverage?.matched?.length || 0) * 10} 
        />
        <ScoreBox 
          label="Impact" 
          value={(result.strengths?.length || 1) * 10} 
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {['details', 'improve', 'history'].map((tab) =>
          mode === 'company' && tab !== 'details' ? null : (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab as any)}
              style={styles.tab}
            >
              <Text style={[
                styles.tabText,
                {
                  color: activeTab === tab
                    ? isDark ? '#a855f7' : '#7c3aed'
                    : isDark ? '#fff' : '#7c3aed',
                  borderBottomColor: activeTab === tab
                    ? isDark ? '#a855f7' : '#7c3aed'
                    : 'transparent',
                  borderBottomWidth: activeTab === tab ? 2 : 0,
                }
              ]}>
                {tab === 'details'
                  ? 'Detailed Feedback'
                  : tab === 'improve'
                  ? 'Improvements'
                  : 'History'}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'details' && (
          <View style={styles.detailsGrid}>
            <CategoryCard title="Formatting" data={categories.formatting} />
            <CategoryCard title="Content" data={categories.content} />
            <CategoryCard title="Keywords" data={categories.keywords} />
            <CategoryCard title="Experience" data={categories.experience} />
          </View>
        )}

        {mode === 'mentee' && activeTab === 'improve' && (
          <ImprovementSection improvements={result.improvements || []} />
        )}

        {mode === 'mentee' && activeTab === 'history' && (
          <View style={styles.historyPlaceholder}>
            <Text style={[styles.historyText, { color: isDark ? '#fff' : '#2e1065' }]}>
              History component would be displayed here
            </Text>
          </View>
        )}
      </View>

      {/* Back Button */}
      <View style={styles.backContainer}>
        <TouchableOpacity
          onPress={onBack}
          style={[
            styles.backButton,
            {
              backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(124,58,237,0.1)',
              borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(124,58,237,0.2)',
            }
          ]}
        >
          <Ionicons name="arrow-back" size={16} color={isDark ? '#fff' : '#7c3aed'} />
          <Text style={[styles.backButtonText, { color: isDark ? '#fff' : '#7c3aed' }]}>
            ← Back to Main
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
  },
  header: {
    margin: 32,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  downloadButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  scoresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    marginBottom: 32,
  },
  scoreBox: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 32,
    marginBottom: 24,
  },
  tab: {
    marginRight: 24,
    paddingBottom: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  detailsGrid: {
    gap: 16,
  },
  categoryCard: {
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  insightsList: {
    gap: 8,
  },
  insightText: {
    fontSize: 14,
    lineHeight: 20,
  },
  improvementSection: {
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
  },
  improvementTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  improvementsList: {
    gap: 8,
  },
  improvementText: {
    fontSize: 14,
    lineHeight: 20,
  },
  historyPlaceholder: {
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  historyText: {
    fontSize: 16,
  },
  backContainer: {
    paddingHorizontal: 32,
    paddingBottom: 32,
    alignItems: 'flex-end',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

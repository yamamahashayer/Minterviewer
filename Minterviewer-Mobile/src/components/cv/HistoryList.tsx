import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { CONFIG } from '../../constants/config';

interface Props {
  menteeId: string;
}

interface HistoryItem {
  _id: string;
  resume?: {
    _id: string;
  };
  score: number;
  atsScore: number;
  createdAt: string;
}

export default function HistoryList({ menteeId }: Props) {
  const { isDark } = useTheme();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!menteeId || hasFetched.current) return;
    hasFetched.current = true;

    const fetchHistory = async () => {
      try {
        const token = await fetch(`${CONFIG.API_BASE_URL}/api/auth/session`).then(r => r.json()).then(data => data.token);
        
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/mentees/${menteeId}/cv/history`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const json = await response.json();
        if (json?.history) setHistory(json.history);
      } catch (err) {
        console.error('Failed to fetch CV history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [menteeId]);

  const renderItem = ({ item, index }: { item: HistoryItem; index: number }) => {
    const hasAnalysis = item.score > 0;
    const date = new Date(item.createdAt);
    
    return (
      <TouchableOpacity
        style={[
          styles.historyItem,
          {
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#faf5ff',
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e9d5ff',
          }
        ]}
      >
        {/* Header */}
        <View style={styles.itemHeader}>
          <View style={styles.itemTitleRow}>
            <Ionicons
              name="document-text"
              size={18}
              color={isDark ? '#5eead4' : '#7c3aed'}
            />
            <Text style={[styles.itemTitle, { color: isDark ? '#fff' : '#2e1065' }]}>
              Resume: {item.resume?._id || 'N/A'}
            </Text>
          </View>
          <Text style={[styles.itemDate, { color: isDark ? '#64748b' : '#888' }]}>
            {date.toLocaleDateString()} {date.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>

        {/* Scores */}
        <View style={styles.scoresContainer}>
          <Text style={[styles.scoreText, { color: isDark ? '#fff' : '#2e1065' }]}>
            <Text style={styles.scoreLabel}>Score:</Text> {item.score ?? 0}/100
          </Text>
          <Text style={[styles.scoreText, { color: isDark ? '#fff' : '#2e1065' }]}>
            <Text style={styles.scoreLabel}>ATS:</Text> {item.atsScore ?? 0}/100
          </Text>
        </View>

        {/* Status */}
        <View style={styles.statusContainer}>
          {hasAnalysis ? (
            <Ionicons
              name="checkmark-circle"
              size={16}
              color="#22c55e"
            />
          ) : (
            <Ionicons
              name="time"
              size={16}
              color="#fbbf24"
            />
          )}
          <Text style={[
            styles.statusText,
            {
              color: hasAnalysis
                ? isDark ? '#86efac' : '#16a34a'
                : isDark ? '#fde047' : '#ca8a04'
            }
          ]}>
            {hasAnalysis ? 'Analyzed' : 'Pending'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={isDark ? '#5eead4' : '#7c3aed'} />
        <Text style={[styles.loadingText, { color: isDark ? '#94a3b8' : '#777' }]}>
          Loading your history...
        </Text>
      </View>
    );
  }

  if (history.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: isDark ? '#94a3b8' : '#777' }]}>
          You haven't uploaded any CVs yet.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[
        styles.sectionTitle,
        { color: isDark ? '#5eead4' : '#7c3aed' }
      ]}>
        Your CV Analysis History
      </Text>
      
      <FlatList
        data={history}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 64,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  listContainer: {
    gap: 16,
    maxHeight: 450,
  },
  historyItem: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  itemDate: {
    fontSize: 12,
    opacity: 0.7,
  },
  scoresContainer: {
    marginBottom: 8,
    gap: 4,
  },
  scoreText: {
    fontSize: 12,
  },
  scoreLabel: {
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
  },
});

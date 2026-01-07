import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

interface JobStatusChartProps {
  jobs: any[];
  isDark: boolean;
}

export default function JobStatusChart({ jobs, isDark }: JobStatusChartProps) {
  const active = jobs.filter((j) => j.status === "active").length;
  const closed = jobs.filter((j) => j.status === "closed").length;
  
  const total = active + closed || 1;
  const activePercentage = Math.round((active / total) * 100);
  const closedPercentage = Math.round((closed / total) * 100);

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <View style={[styles.donutChart, { borderColor: isDark ? '#1e293b' : '#e5e7eb' }]}>
          <View style={styles.innerCircle}>
            <Text style={[styles.percentageText, { color: isDark ? '#ffffff' : '#111827' }]}>
              {total}
            </Text>
            <Text style={[styles.totalText, { color: isDark ? '#94a3b8' : '#6b7280' }]}>
              Total Jobs
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#22c55e' }]} />
          <Text style={[styles.legendText, { color: isDark ? '#ffffff' : '#111827' }]}>
            Active ({activePercentage}%)
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#ef4444' }]} />
          <Text style={[styles.legendText, { color: isDark ? '#ffffff' : '#111827' }]}>
            Closed ({closedPercentage}%)
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 16,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutChart: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  totalText: {
    fontSize: 12,
    marginTop: 2,
  },
  legend: {
    gap: 8,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

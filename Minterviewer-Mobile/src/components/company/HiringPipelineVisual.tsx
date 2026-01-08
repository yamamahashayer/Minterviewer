import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface HiringPipelineVisualProps {
  jobs: any[];
  isDark: boolean;
}

export default function HiringPipelineVisual({ jobs, isDark }: HiringPipelineVisualProps) {
  const applicants = jobs.flatMap((j) => j.applicants || []);
  const totalApplications = applicants.length;
  const cvAnalyzed = applicants.filter((a) => a.analysisId).length;
  const interviews = applicants.filter((a) => a.interviewId).length;

  const max = Math.max(totalApplications, cvAnalyzed, interviews, 1);

  const Item = ({ icon, label, value }: { icon: string; label: string; value: number }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <Text style={[styles.icon, { color: '#9333ea' }]}>{icon}</Text>
        <Text style={[styles.label, { color: isDark ? '#ffffff' : '#111827' }]}>{label}</Text>
        <Text style={[styles.value, { color: isDark ? '#ffffff' : '#111827' }]}>{value}</Text>
      </View>
      <View style={[styles.barBg, { backgroundColor: isDark ? '#1e293b' : '#e5e7eb' }]}>
        <View 
          style={[
            styles.barFill, 
            { 
              width: `${(value / max) * 100}%`,
              backgroundColor: '#9333ea'
            }
          ]} 
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Item icon="📄" label="Total Applications" value={totalApplications} />
      <Item icon="📊" label="CV Analyzed" value={cvAnalyzed} />
      <Item icon="🎥" label="Interviews" value={interviews} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  itemContainer: {
    gap: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
  },
  label: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
  },
  barBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
});

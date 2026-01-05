import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import type { CvType } from '../types';

interface Props {
  cvType: CvType;
  setCvType: (t: CvType) => void;
}

export default function TypeStep({ cvType, setCvType }: Props) {
  const { isDark } = useTheme();

  const Card = ({
    keyType,
    title,
    desc,
    points,
  }: {
    keyType: CvType;
    title: string;
    desc: string;
    points: string[];
  }) => {
    const active = cvType === keyType;
    return (
      <TouchableOpacity
        onPress={() => setCvType(keyType)}
        style={[
          styles.card,
          {
            backgroundColor: active
              ? isDark ? 'rgba(94,234,212,0.1)' : 'rgba(124,58,237,0.1)'
              : isDark ? 'rgba(255,255,255,0.05)' : '#fff',
            borderColor: active
              ? isDark ? '#5eead4' : '#7c3aed'
              : isDark ? 'rgba(94,234,212,0.2)' : '#ddd6fe',
          }
        ]}
      >
        <Text style={[
          styles.cardTitle,
          { color: isDark ? '#fff' : '#2e1065' }
        ]}>
          {title}
        </Text>
        <Text style={[
          styles.cardDesc,
          { color: isDark ? '#99a1af' : '#6b21a8' }
        ]}>
          {desc}
        </Text>

        {/* Points */}
        <View style={styles.pointsList}>
          {points.map((p, i) => (
            <View key={i} style={styles.pointItem}>
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={isDark ? '#4ade80' : '#22c55e'}
              />
              <Text style={[
                styles.pointText,
                { color: isDark ? '#e5e7eb' : '#3b0764' }
              ]}>
                {p}
              </Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.cardFooter}>
          <Ionicons
            name="star"
            size={14}
            color={isDark ? '#5eead4' : '#7c3aed'}
          />
          <Text style={[
            styles.footerText,
            { color: isDark ? '#5eead4' : '#7c3aed' }
          ]}>
            {active ? "Selected" : "Click to select"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#fff',
        borderColor: isDark ? 'rgba(94,234,212,0.2)' : '#ddd6fe',
      }
    ]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[
          styles.iconContainer,
          {
            backgroundColor: isDark ? 'rgba(94,234,212,0.2)' : 'rgba(124,58,237,0.1)',
            borderColor: isDark ? 'rgba(94,234,212,0.3)' : 'rgba(124,58,237,0.3)',
          }
        ]}>
          <Ionicons
            name="flag"
            size={24}
            color={isDark ? '#5eead4' : '#7c3aed'}
          />
        </View>
        <View>
          <Text style={[
            styles.headerTitle,
            { color: isDark ? '#fff' : '#2e1065' }
          ]}>
            Choose CV Type
          </Text>
          <Text style={[
            styles.headerSubtitle,
            { color: isDark ? '#99a1af' : '#6b21a8' }
          ]}>
            Pick the mode that fits your goal
          </Text>
        </View>
      </View>

      {/* Cards */}
      <View style={styles.cardsContainer}>
        <Card
          keyType="general"
          title="General"
          desc="Standard CV for broad sharing"
          points={[
            "Classic, recruiter-friendly layout",
            "Balanced sections (experience, education, skills)",
            "Best for quick sharing and job portals",
          ]}
        />
        <Card
          keyType="role"
          title="Role-Based"
          desc="Customize for a specific role"
          points={[
            "Highlights role-relevant achievements",
            "Emphasizes required tech/soft skills",
            "Optimized summary & bullets for the role",
          ]}
        />
        <Card
          keyType="job"
          title="Job-Based"
          desc="Match a pasted JD"
          points={[
            "Paste job description and extract keywords",
            "Alignment score & missing skills hints",
            "Tailored bullets to match JD phrasing",
          ]}
        />
      </View>

      {/* Helper text */}
      {cvType === "general" && (
        <Text style={[
          styles.helperText,
          { color: isDark ? '#99a1af' : '#6b21a8' }
        ]}>
          No extra info needed. You can proceed to the next step.
        </Text>
      )}
      {cvType === "role" && (
        <Text style={[
          styles.helperText,
          { color: isDark ? '#99a1af' : '#6b21a8' }
        ]}>
          Select or type your target role in the next step to tailor content.
        </Text>
      )}
      {cvType === "job" && (
        <Text style={[
          styles.helperText,
          { color: isDark ? '#99a1af' : '#6b21a8' }
        ]}>
          Paste or upload the job description next to generate a targeted CV.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 32,
    borderRadius: 12,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 14,
    marginBottom: 16,
  },
  pointsList: {
    gap: 8,
    marginBottom: 16,
  },
  pointItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  pointText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '500',
  },
  helperText: {
    fontSize: 14,
    marginTop: 24,
  },
});

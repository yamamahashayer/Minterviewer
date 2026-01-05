import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import type { Skills, CVData, CvType } from '../types';

interface Props {
  skills: Skills;
  update: (category: keyof Skills, value: string) => void;
  menteeId?: string;
  cvType: CvType;
  cvData: CVData;
  targetRole?: string;
  jobDescription?: string;
}

export default function SkillsStep({ 
  skills, 
  update, 
  menteeId,
  cvType,
  cvData,
  targetRole,
  jobDescription 
}: Props) {
  const { isDark } = useTheme();

  const inputStyle = [
    styles.input,
    {
      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff',
      borderColor: isDark ? 'rgba(94,234,212,0.3)' : '#ddd6fe',
      color: isDark ? '#fff' : '#2e1065',
    }
  ];

  const labelStyle = [
    styles.label,
    { color: isDark ? '#d1d5dc' : '#2e1065' }
  ];

  const suggestions = {
    technical: [
      'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Node.js',
      'Python', 'Java', 'C++', 'Go', 'Rust', 'SQL', 'MongoDB',
      'Docker', 'Kubernetes', 'AWS', 'Azure', 'Git', 'CI/CD'
    ],
    soft: [
      'Communication', 'Teamwork', 'Problem-solving', 'Leadership',
      'Time management', 'Adaptability', 'Critical thinking',
      'Creativity', 'Collaboration', 'Project management'
    ],
    languages: [
      'English', 'Spanish', 'French', 'German', 'Mandarin', 'Japanese',
      'Arabic', 'Portuguese', 'Russian', 'Italian', 'Hindi'
    ]
  };

  const SkillCategory = ({ 
    category, 
    title, 
    icon, 
    placeholder 
  }: { 
    category: keyof Skills; 
    title: string; 
    icon: string; 
    placeholder: string; 
  }) => (
    <View style={[
      styles.skillCategory,
      {
        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff',
        borderColor: isDark ? 'rgba(94,234,212,0.2)' : '#ddd6fe',
      }
    ]}>
      <View style={styles.categoryHeader}>
        <View style={[
          styles.categoryIcon,
          {
            backgroundColor: isDark ? 'rgba(94,234,212,0.2)' : 'rgba(124,58,237,0.1)',
            borderColor: isDark ? 'rgba(94,234,212,0.3)' : 'rgba(124,58,237,0.3)',
          }
        ]}>
          <Ionicons
            name={icon as any}
            size={20}
            color={isDark ? '#5eead4' : '#7c3aed'}
          />
        </View>
        <Text style={[
          styles.categoryTitle,
          { color: isDark ? '#fff' : '#2e1065' }
        ]}>
          {title}
        </Text>
      </View>

      <TextInput
        style={[inputStyle, styles.textarea]}
        value={skills[category]}
        onChangeText={(text) => update(category, text)}
        placeholder={placeholder}
        placeholderTextColor={isDark ? '#6a7282' : '#7c3aed'}
        multiline
        textAlignVertical="top"
      />

      {/* Suggestions */}
      <View style={styles.suggestionsContainer}>
        <Text style={[
          styles.suggestionsTitle,
          { color: isDark ? '#99a1af' : '#6b21a8' }
        ]}>
          Suggestions:
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.suggestionsList}>
            {suggestions[category].map((skill, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  const currentSkills = skills[category];
                  const newSkills = currentSkills 
                    ? `${currentSkills}, ${skill}`
                    : skill;
                  update(category, newSkills);
                }}
                style={[
                  styles.suggestionChip,
                  {
                    backgroundColor: isDark ? 'rgba(94,234,212,0.1)' : 'rgba(124,58,237,0.1)',
                    borderColor: isDark ? 'rgba(94,234,212,0.3)' : '#ddd6fe',
                  }
                ]}
              >
                <Text style={[
                  styles.suggestionText,
                  { color: isDark ? '#5eead4' : '#7c3aed' }
                ]}>
                  + {skill}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );

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
            name="code"
            size={24}
            color={isDark ? '#5eead4' : '#7c3aed'}
          />
        </View>
        <View style={styles.headerContent}>
          <Text style={[
            styles.headerTitle,
            { color: isDark ? '#fff' : '#2e1065' }
          ]}>
            Skills & Technologies
          </Text>
          <Text style={[
            styles.headerSubtitle,
            { color: isDark ? '#99a1af' : '#6b21a8' }
          ]}>
            Showcase your technical and soft skills
          </Text>
        </View>
      </View>

      {/* Targeting Info */}
      {(cvType === 'role' && targetRole) && (
        <View style={[
          styles.targetingInfo,
          {
            backgroundColor: isDark ? 'rgba(94,234,212,0.1)' : 'rgba(124,58,237,0.1)',
            borderColor: isDark ? 'rgba(94,234,212,0.3)' : '#ddd6fe',
          }
        ]}>
          <Ionicons
            name="information-circle"
            size={16}
            color={isDark ? '#5eead4' : '#7c3aed'}
          />
          <Text style={[
            styles.targetingText,
            { color: isDark ? '#5eead4' : '#7c3aed' }
          ]}>
            Tailoring skills for: {targetRole}
          </Text>
        </View>
      )}

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <SkillCategory
          category="technical"
          title="Technical Skills"
          icon="code"
          placeholder="React, Node.js, Python, AWS, Docker..."
        />

        <SkillCategory
          category="soft"
          title="Soft Skills"
          icon="people"
          placeholder="Communication, Leadership, Problem-solving..."
        />

        <SkillCategory
          category="languages"
          title="Languages"
          icon="language"
          placeholder="English (Native), Spanish (Fluent)..."
        />
      </ScrollView>

      {/* Tips */}
      <View style={[
        styles.tipsContainer,
        {
          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff',
          borderColor: isDark ? 'rgba(94,234,212,0.2)' : '#ddd6fe',
        }
      ]}>
        <Text style={[
          styles.tipsTitle,
          { color: isDark ? '#5eead4' : '#7c3aed' }
        ]}>
          💡 Tips
        </Text>
        <Text style={[
          styles.tipsText,
          { color: isDark ? '#99a1af' : '#6b21a8' }
        ]}>
          • Be specific with technologies (e.g., "React 18" instead of just "React")
        </Text>
        <Text style={[
          styles.tipsText,
          { color: isDark ? '#99a1af' : '#6b21a8' }
        ]}>
          • Include proficiency levels (e.g., "Spanish: Conversational")
        </Text>
        <Text style={[
          styles.tipsText,
          { color: isDark ? '#99a1af' : '#6b21a8' }
        ]}>
          • Focus on skills relevant to your target role
        </Text>
      </View>
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
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  targetingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 24,
  },
  targetingText: {
    fontSize: 14,
    fontWeight: '500',
  },
  scrollContent: {
    maxHeight: 600,
  },
  skillCategory: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  textarea: {
    textAlignVertical: 'top',
    height: 80,
  },
  suggestionsContainer: {
    marginTop: 16,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  suggestionsList: {
    flexDirection: 'row',
    gap: 8,
  },
  suggestionChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  suggestionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  tipsContainer: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 16,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  tipsText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import type { CVData, CvType } from '../types';

interface Props {
  value: string;
  onChange: (v: string) => void;
  menteeId?: string;
  activeKey: string;
  cvType: CvType;
  cvData: CVData;
  targetRole?: string;
  jobDescription?: string;
}

export default function SummaryStep({ 
  value, 
  onChange, 
  menteeId,
  activeKey,
  cvType,
  cvData,
  targetRole,
  jobDescription 
}: Props) {
  const { isDark } = useTheme();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSummary = async () => {
    if (!menteeId) {
      Alert.alert('Error', 'User session not found');
      return;
    }

    setIsGenerating(true);
    try {
      // Mock AI generation - in real implementation this would call the API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockSummary = cvType === 'role' && targetRole
        ? `Experienced ${targetRole} with ${cvData.experience.length} years of professional experience. Skilled in ${cvData.skills.technical.split(',').slice(0, 3).join(', ')} and passionate about creating innovative solutions. Strong background in ${cvData.experience[0]?.company || 'technology'} with a track record of delivering high-quality projects.`
        : `Professional with diverse experience across multiple industries. Skilled in various technologies and committed to continuous learning and growth. Strong problem-solving abilities and excellent communication skills.`;

      onChange(mockSummary);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate summary');
    } finally {
      setIsGenerating(false);
    }
  };

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

  const templates = [
    {
      title: 'Professional Summary',
      template: `Results-driven professional with [X] years of experience in [industry/field]. Proven track record of [key achievement]. Skilled in [top 2-3 skills] with strong [soft skill]. Seeking to leverage expertise in [target role/industry] to drive [desired outcome].`
    },
    {
      title: 'Career Objective',
      template: `Motivated [profession] with expertise in [key areas]. Eager to apply [specific skills] in a [type of role] where I can contribute to [company goals] and grow professionally. Passionate about [industry interest] and committed to [personal value].`
    },
    {
      title: 'Qualifications Profile',
      template: `[Adjective] professional with [X]+ years in [field]. Expertise includes [skill 1], [skill 2], and [skill 3]. Known for [key strength] and [another strength]. [Degree/Certification] holder with experience in [notable achievement].`
    }
  ];

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
            name="document-text"
            size={24}
            color={isDark ? '#5eead4' : '#7c3aed'}
          />
        </View>
        <View style={styles.headerContent}>
          <Text style={[
            styles.headerTitle,
            { color: isDark ? '#fff' : '#2e1065' }
          ]}>
            Professional Summary
          </Text>
          <Text style={[
            styles.headerSubtitle,
            { color: isDark ? '#99a1af' : '#6b21a8' }
          ]}>
            Write a compelling summary about yourself
          </Text>
        </View>
      </View>

      {/* AI Generation */}
      <View style={[
        styles.aiSection,
        {
          backgroundColor: isDark ? 'rgba(94,234,212,0.1)' : 'rgba(124,58,237,0.1)',
          borderColor: isDark ? 'rgba(94,234,212,0.3)' : '#ddd6fe',
        }
      ]}>
        <TouchableOpacity
          onPress={generateSummary}
          disabled={isGenerating}
          style={[
            styles.aiButton,
            {
              backgroundColor: isDark ? '#5eead4' : '#7c3aed',
              opacity: isGenerating ? 0.6 : 1,
            }
          ]}
        >
          {isGenerating ? (
            <>
              <Ionicons
                name="refresh"
                size={16}
                color={isDark ? '#0a0f1e' : '#fff'}
              />
              <Text style={[
                styles.aiButtonText,
                { color: isDark ? '#0a0f1e' : '#fff' }
              ]}>
                Generating...
              </Text>
            </>
          ) : (
            <>
              <Ionicons
                name="bulb"
                size={16}
                color={isDark ? '#0a0f1e' : '#fff'}
              />
              <Text style={[
                styles.aiButtonText,
                { color: isDark ? '#0a0f1e' : '#fff' }
              ]}>
                Generate with AI
              </Text>
            </>
          )}
        </TouchableOpacity>
        
        <Text style={[
          styles.aiDescription,
          { color: isDark ? '#5eead4' : '#7c3aed' }
        ]}>
          AI will create a summary based on your experience and target role
        </Text>
      </View>

      {/* Summary Input */}
      <View style={styles.inputSection}>
        <Text style={labelStyle}>Professional Summary *</Text>
        <TextInput
          style={[inputStyle, styles.textarea]}
          value={value}
          onChangeText={onChange}
          placeholder="Write 2-4 sentences that highlight your key qualifications, experience, and career goals..."
          placeholderTextColor={isDark ? '#6a7282' : '#7c3aed'}
          multiline
          textAlignVertical="top"
        />
        
        <View style={styles.characterCount}>
          <Text style={[
            styles.characterText,
            { color: isDark ? '#99a1af' : '#6b21a8' }
          ]}>
            {value.length} characters (recommended: 150-300)
          </Text>
        </View>
      </View>

      {/* Templates */}
      <View style={styles.templatesSection}>
        <Text style={[
          styles.templatesTitle,
          { color: isDark ? '#fff' : '#2e1065' }
        ]}>
          Templates
        </Text>
        
        <ScrollView style={styles.templatesList} showsVerticalScrollIndicator={false}>
          {templates.map((template, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => onChange(template.template)}
              style={[
                styles.templateCard,
                {
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff',
                  borderColor: isDark ? 'rgba(94,234,212,0.2)' : '#ddd6fe',
                }
              ]}
            >
              <Text style={[
                styles.templateTitle,
                { color: isDark ? '#5eead4' : '#7c3aed' }
              ]}>
                {template.title}
              </Text>
              <Text style={[
                styles.templateText,
                { color: isDark ? '#99a1af' : '#6b21a8' }
              ]}>
                {template.template}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

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
          • Keep it concise (2-4 sentences, 150-300 characters)
        </Text>
        <Text style={[
          styles.tipsText,
          { color: isDark ? '#99a1af' : '#6b21a8' }
        ]}>
          • Highlight your most relevant experience and skills
        </Text>
        <Text style={[
          styles.tipsText,
          { color: isDark ? '#99a1af' : '#6b21a8' }
        ]}>
          • Include your career goals and what makes you unique
        </Text>
        <Text style={[
          styles.tipsText,
          { color: isDark ? '#99a1af' : '#6b21a8' }
        ]}>
          • Use action verbs and quantify achievements when possible
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
  aiSection: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 24,
    alignItems: 'center',
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    marginBottom: 8,
  },
  aiButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  aiDescription: {
    fontSize: 12,
    textAlign: 'center',
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
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
    height: 120,
  },
  characterCount: {
    marginTop: 8,
  },
  characterText: {
    fontSize: 12,
  },
  templatesSection: {
    marginBottom: 24,
  },
  templatesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  templatesList: {
    maxHeight: 200,
  },
  templateCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  templateTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  templateText: {
    fontSize: 12,
    lineHeight: 18,
  },
  tipsContainer: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
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

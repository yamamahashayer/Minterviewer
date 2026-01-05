import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import type { CVData, CvType } from '../types';

interface Props {
  cvType: CvType;
  data: CVData;
  menteeId?: string;
  onSave?: () => Promise<string | null>;
  onExportPDF?: () => Promise<void>;
  onExportDOCX?: () => Promise<void>;
  saveLoading?: boolean;
  exportLoading?: 'pdf' | 'docx' | null;
}

export default function PreviewStep({ 
  cvType, 
  data, 
  menteeId, 
  onSave, 
  onExportPDF, 
  onExportDOCX, 
  saveLoading = false, 
  exportLoading 
}: Props) {
  const { isDark } = useTheme();

  const handleDownload = () => {
    Alert.alert('Download', 'PDF generation would be implemented here');
  };

  const handleSubmit = () => {
    Alert.alert('Submit', 'CV submission would be implemented here');
  };

  const containerStyle = [
    styles.container,
    {
      backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#fff',
      borderColor: isDark ? 'rgba(94,234,212,0.2)' : '#ddd6fe',
    }
  ];

  const previewStyle = [
    styles.preview,
    {
      backgroundColor: '#fff',
      borderColor: isDark ? 'rgba(94,234,212,0.3)' : '#ddd6fe',
    }
  ];

  return (
    <View style={containerStyle}>
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
            name="eye"
            size={24}
            color={isDark ? '#5eead4' : '#7c3aed'}
          />
        </View>
        <View style={styles.headerContent}>
          <Text style={[
            styles.headerTitle,
            { color: isDark ? '#fff' : '#2e1065' }
          ]}>
            Preview Your CV
          </Text>
          <Text style={[
            styles.headerSubtitle,
            { color: isDark ? '#99a1af' : '#6b21a8' }
          ]}>
            Review your CV before downloading
          </Text>
        </View>
      </View>

      {/* CV Preview */}
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={previewStyle}>
          {/* Header Section */}
          <View style={styles.cvHeader}>
            <Text style={styles.cvName}>{data.personal.fullName || 'Your Name'}</Text>
            <Text style={styles.cvContact}>
              {data.personal.email && `${data.personal.email} • `}
              {data.personal.phone && `${data.personal.phone} • `}
              {data.personal.location}
            </Text>
            {(data.personal.linkedin || data.personal.github) && (
              <Text style={styles.cvLinks}>
                {data.personal.linkedin && `LinkedIn: ${data.personal.linkedin}`}
                {data.personal.linkedin && data.personal.github && ' • '}
                {data.personal.github && `GitHub: ${data.personal.github}`}
              </Text>
            )}
          </View>

          {/* Summary */}
          {data.personal.summary && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Professional Summary</Text>
              <Text style={styles.sectionContent}>{data.personal.summary}</Text>
            </View>
          )}

          {/* Experience */}
          {data.experience.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Work Experience</Text>
              {data.experience.map((exp, index) => (
                <View key={exp.id} style={styles.experienceItem}>
                  <View style={styles.experienceHeader}>
                    <Text style={styles.experienceTitle}>{exp.title}</Text>
                    <Text style={styles.experienceCompany}>
                      {exp.company} • {exp.location}
                    </Text>
                    <Text style={styles.experienceDate}>
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </Text>
                  </View>
                  <Text style={styles.experienceDescription}>{exp.description}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Education</Text>
              {data.education.map((edu, index) => (
                <View key={edu.id} style={styles.educationItem}>
                  <Text style={styles.educationDegree}>{edu.degree}</Text>
                  <Text style={styles.educationInstitution}>
                    {edu.institution} • {edu.location}
                  </Text>
                  <Text style={styles.educationDate}>{edu.graduationDate}</Text>
                  {edu.gpa && <Text style={styles.educationGPA}>GPA: {edu.gpa}</Text>}
                </View>
              ))}
            </View>
          )}

          {/* Skills */}
          {(data.skills.technical || data.skills.soft || data.skills.languages) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Skills</Text>
              
              {data.skills.technical && (
                <View style={styles.skillCategory}>
                  <Text style={styles.skillCategoryTitle}>Technical</Text>
                  <Text style={styles.skillContent}>{data.skills.technical}</Text>
                </View>
              )}
              
              {data.skills.soft && (
                <View style={styles.skillCategory}>
                  <Text style={styles.skillCategoryTitle}>Soft Skills</Text>
                  <Text style={styles.skillContent}>{data.skills.soft}</Text>
                </View>
              )}
              
              {data.skills.languages && (
                <View style={styles.skillCategory}>
                  <Text style={styles.skillCategoryTitle}>Languages</Text>
                  <Text style={styles.skillContent}>{data.skills.languages}</Text>
                </View>
              )}
            </View>
          )}

          {/* Projects */}
          {data.projects.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Projects</Text>
              {data.projects.map((project, index) => (
                <View key={project.id} style={styles.projectItem}>
                  <Text style={styles.projectName}>{project.name}</Text>
                  <Text style={styles.projectDescription}>{project.description}</Text>
                  <View style={styles.projectLinks}>
                    {project.github && (
                      <Text style={styles.projectLink}>GitHub: {project.github}</Text>
                    )}
                    {project.link && (
                      <Text style={styles.projectLink}>Live: {project.link}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          onPress={onSave}
          disabled={saveLoading}
          style={[
            styles.downloadButton,
            {
              backgroundColor: isDark ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.1)',
              borderColor: isDark ? 'rgba(16,185,129,0.3)' : '#10b981',
              opacity: saveLoading ? 0.6 : 1,
            }
          ]}
        >
          <Ionicons
            name={saveLoading ? "refresh" : "save"}
            size={20}
            color={isDark ? '#10b981' : '#10b981'}
          />
          <Text style={[
            styles.downloadButtonText,
            { color: isDark ? '#10b981' : '#10b981' }
          ]}>
            {saveLoading ? "Saving..." : "Save CV"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onExportPDF}
          disabled={exportLoading === 'pdf'}
          style={[
            styles.downloadButton,
            {
              backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#fff',
              borderColor: isDark ? 'rgba(94,234,212,0.3)' : '#ddd6fe',
              opacity: exportLoading === 'pdf' ? 0.6 : 1,
            }
          ]}
        >
          <Ionicons
            name={exportLoading === 'pdf' ? "refresh" : "document-text"}
            size={20}
            color={isDark ? '#5eead4' : '#7c3aed'}
          />
          <Text style={[
            styles.downloadButtonText,
            { color: isDark ? '#5eead4' : '#7c3aed' }
          ]}>
            {exportLoading === 'pdf' ? "Exporting..." : "PDF"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onExportDOCX}
          disabled={exportLoading === 'docx'}
          style={[
            styles.downloadButton,
            {
              backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#fff',
              borderColor: isDark ? 'rgba(94,234,212,0.3)' : '#ddd6fe',
              opacity: exportLoading === 'docx' ? 0.6 : 1,
            }
          ]}
        >
          <Ionicons
            name={exportLoading === 'docx' ? "refresh" : "document"}
            size={20}
            color={isDark ? '#5eead4' : '#7c3aed'}
          />
          <Text style={[
            styles.downloadButtonText,
            { color: isDark ? '#5eead4' : '#7c3aed' }
          ]}>
            {exportLoading === 'docx' ? "Exporting..." : "DOCX"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSubmit}
          style={[
            styles.submitButton,
            { backgroundColor: isDark ? '#5eead4' : '#7c3aed' }
          ]}
        >
          <Ionicons
            name="checkmark-circle"
            size={20}
            color={isDark ? '#0a0f1e' : '#fff'}
          />
          <Text style={[
            styles.submitButtonText,
            { color: isDark ? '#0a0f1e' : '#fff' }
          ]}>
            Complete CV
          </Text>
        </TouchableOpacity>
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
          💡 Preview Tips
        </Text>
        <Text style={[
          styles.tipsText,
          { color: isDark ? '#99a1af' : '#6b21a8' }
        ]}>
          • Review all sections for accuracy and completeness
        </Text>
        <Text style={[
          styles.tipsText,
          { color: isDark ? '#99a1af' : '#6b21a8' }
        ]}>
          • Ensure consistent formatting and professional language
        </Text>
        <Text style={[
          styles.tipsText,
          { color: isDark ? '#99a1af' : '#6b21a8' }
        ]}>
          • Download PDF to share with recruiters and save for records
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
  scrollContent: {
    maxHeight: 500,
  },
  preview: {
    padding: 40,
    borderRadius: 8,
    borderWidth: 1,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  cvHeader: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  cvName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  cvContact: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  cvLinks: {
    fontSize: 12,
    color: '#6b7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  sectionContent: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  experienceItem: {
    marginBottom: 16,
  },
  experienceHeader: {
    marginBottom: 4,
  },
  experienceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  experienceCompany: {
    fontSize: 14,
    color: '#6b7280',
  },
  experienceDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  experienceDescription: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginTop: 8,
  },
  educationItem: {
    marginBottom: 16,
  },
  educationDegree: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  educationInstitution: {
    fontSize: 14,
    color: '#6b7280',
  },
  educationDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  educationGPA: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  skillCategory: {
    marginBottom: 12,
  },
  skillCategoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  skillContent: {
    fontSize: 14,
    color: '#4b5563',
  },
  projectItem: {
    marginBottom: 16,
  },
  projectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  projectDescription: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 8,
  },
  projectLinks: {
    gap: 4,
  },
  projectLink: {
    fontSize: 12,
    color: '#6b7280',
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  downloadButton: {
    flex: 1,
    minWidth: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  downloadButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '500',
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

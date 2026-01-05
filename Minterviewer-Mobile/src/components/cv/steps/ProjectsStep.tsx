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
import type { Project } from '../types';

interface Props {
  projects: Project[];
  setProjects: (updater: Project[] | ((prev: Project[]) => Project[])) => void;
}

export default function ProjectsStep({ projects, setProjects }: Props) {
  const { isDark } = useTheme();

  const updateProject = (id: number, field: keyof Project, value: string) => {
    setProjects(prev => prev.map(project => 
      project.id === id ? { ...project, [field]: value } : project
    ));
  };

  const addProject = () => {
    const newId = Math.max(0, ...projects.map(p => p.id)) + 1;
    setProjects(prev => [...prev, {
      id: newId,
      name: '',
      description: '',
      github: '',
      link: '',
    }]);
  };

  const removeProject = (id: number) => {
    setProjects(prev => prev.filter(project => project.id !== id));
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
            name="folder"
            size={24}
            color={isDark ? '#5eead4' : '#7c3aed'}
          />
        </View>
        <View style={styles.headerContent}>
          <Text style={[
            styles.headerTitle,
            { color: isDark ? '#fff' : '#2e1065' }
          ]}>
            Projects
          </Text>
          <Text style={[
            styles.headerSubtitle,
            { color: isDark ? '#99a1af' : '#6b21a8' }
          ]}>
            Showcase your best projects
          </Text>
        </View>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {projects.map((project, index) => (
          <View key={project.id} style={[
            styles.projectCard,
            {
              backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff',
              borderColor: isDark ? 'rgba(94,234,212,0.2)' : '#ddd6fe',
            }
          ]}>
            <View style={styles.cardHeader}>
              <Text style={[
                styles.cardTitle,
                { color: isDark ? '#fff' : '#2e1065' }
              ]}>
                Project {index + 1}
              </Text>
              {projects.length > 1 && (
                <TouchableOpacity
                  onPress={() => removeProject(project.id)}
                  style={styles.removeButton}
                >
                  <Ionicons
                    name="remove-circle"
                    size={20}
                    color="#ef4444"
                  />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.formGrid}>
              <View style={styles.fullWidthField}>
                <Text style={labelStyle}>Project Name *</Text>
                <TextInput
                  style={inputStyle}
                  value={project.name}
                  onChangeText={(text) => updateProject(project.id, 'name', text)}
                  placeholder="E-commerce Platform"
                  placeholderTextColor={isDark ? '#6a7282' : '#7c3aed'}
                />
              </View>

              <View style={styles.fullWidthField}>
                <Text style={labelStyle}>Description *</Text>
                <TextInput
                  style={[inputStyle, styles.textarea]}
                  value={project.description}
                  onChangeText={(text) => updateProject(project.id, 'description', text)}
                  placeholder="Built a full-stack e-commerce platform with React and Node.js..."
                  placeholderTextColor={isDark ? '#6a7282' : '#7c3aed'}
                  multiline
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.formRow}>
                <View style={styles.field}>
                  <Text style={labelStyle}>GitHub URL</Text>
                  <TextInput
                    style={inputStyle}
                    value={project.github || ''}
                    onChangeText={(text) => updateProject(project.id, 'github', text)}
                    placeholder="https://github.com/username/project"
                    placeholderTextColor={isDark ? '#6a7282' : '#7c3aed'}
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.field}>
                  <Text style={labelStyle}>Live URL</Text>
                  <TextInput
                    style={inputStyle}
                    value={project.link || ''}
                    onChangeText={(text) => updateProject(project.id, 'link', text)}
                    placeholder="https://project-demo.com"
                    placeholderTextColor={isDark ? '#6a7282' : '#7c3aed'}
                    autoCapitalize="none"
                  />
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add Project Button */}
      <TouchableOpacity
        onPress={addProject}
        style={[
          styles.addButton,
          {
            backgroundColor: isDark ? 'rgba(94,234,212,0.1)' : 'rgba(124,58,237,0.1)',
            borderColor: isDark ? 'rgba(94,234,212,0.3)' : '#ddd6fe',
          }
        ]}
      >
        <Ionicons
          name="add-circle"
          size={20}
          color={isDark ? '#5eead4' : '#7c3aed'}
        />
        <Text style={[
          styles.addButtonText,
          { color: isDark ? '#5eead4' : '#7c3aed' }
        ]}>
          Add Project
        </Text>
      </TouchableOpacity>

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
          • Focus on projects that demonstrate relevant skills
        </Text>
        <Text style={[
          styles.tipsText,
          { color: isDark ? '#99a1af' : '#6b21a8' }
        ]}>
          • Include quantifiable results (e.g., "Increased performance by 40%")
        </Text>
        <Text style={[
          styles.tipsText,
          { color: isDark ? '#99a1af' : '#6b21a8' }
        ]}>
          • Provide live demos when possible
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
  projectCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  removeButton: {
    padding: 4,
  },
  formGrid: {
    gap: 16,
  },
  formRow: {
    flexDirection: 'row',
    gap: 16,
  },
  field: {
    flex: 1,
  },
  fullWidthField: {
    width: '100%',
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
    height: 100,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    marginTop: 16,
  },
  addButtonText: {
    fontSize: 16,
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

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
import type { Experience } from '../types';

interface Props {
  items: Experience[];
  setItems: (updater: Experience[] | ((prev: Experience[]) => Experience[])) => void;
}

export default function ExperienceStep({ items, setItems }: Props) {
  const { isDark } = useTheme();

  const updateItem = (id: number, field: keyof Experience, value: string | boolean) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const addItem = () => {
    const newId = Math.max(0, ...items.map(i => i.id)) + 1;
    setItems(prev => [...prev, {
      id: newId,
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    }]);
  };

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
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
            name="briefcase"
            size={24}
            color={isDark ? '#5eead4' : '#7c3aed'}
          />
        </View>
        <View style={styles.headerContent}>
          <Text style={[
            styles.headerTitle,
            { color: isDark ? '#fff' : '#2e1065' }
          ]}>
            Work Experience
          </Text>
          <Text style={[
            styles.headerSubtitle,
            { color: isDark ? '#99a1af' : '#6b21a8' }
          ]}>
            Add your professional experience
          </Text>
        </View>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {items.map((item, index) => (
          <View key={item.id} style={[
            styles.experienceCard,
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
                Experience {index + 1}
              </Text>
              {items.length > 1 && (
                <TouchableOpacity
                  onPress={() => removeItem(item.id)}
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
              <View style={styles.formRow}>
                <View style={styles.field}>
                  <Text style={labelStyle}>Job Title *</Text>
                  <TextInput
                    style={inputStyle}
                    value={item.title}
                    onChangeText={(text) => updateItem(item.id, 'title', text)}
                    placeholder="Senior Frontend Developer"
                    placeholderTextColor={isDark ? '#6a7282' : '#7c3aed'}
                  />
                </View>

                <View style={styles.field}>
                  <Text style={labelStyle}>Company *</Text>
                  <TextInput
                    style={inputStyle}
                    value={item.company}
                    onChangeText={(text) => updateItem(item.id, 'company', text)}
                    placeholder="Tech Company Inc."
                    placeholderTextColor={isDark ? '#6a7282' : '#7c3aed'}
                  />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={styles.field}>
                  <Text style={labelStyle}>Location *</Text>
                  <TextInput
                    style={inputStyle}
                    value={item.location}
                    onChangeText={(text) => updateItem(item.id, 'location', text)}
                    placeholder="San Francisco, CA"
                    placeholderTextColor={isDark ? '#6a7282' : '#7c3aed'}
                  />
                </View>

                <View style={styles.field}>
                  <Text style={labelStyle}>Start Date *</Text>
                  <TextInput
                    style={inputStyle}
                    value={item.startDate}
                    onChangeText={(text) => updateItem(item.id, 'startDate', text)}
                    placeholder="Jan 2020"
                    placeholderTextColor={isDark ? '#6a7282' : '#7c3aed'}
                  />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={styles.field}>
                  <Text style={labelStyle}>End Date</Text>
                  <TextInput
                    style={[
                      inputStyle,
                      { opacity: item.current ? 0.5 : 1 }
                    ]}
                    value={item.endDate}
                    onChangeText={(text) => updateItem(item.id, 'endDate', text)}
                    placeholder="Dec 2022"
                    placeholderTextColor={isDark ? '#6a7282' : '#7c3aed'}
                    editable={!item.current}
                  />
                </View>

                <View style={styles.field}>
                  <Text style={labelStyle}>Currently Working</Text>
                  <TouchableOpacity
                    style={[
                      styles.checkbox,
                      {
                        backgroundColor: item.current
                          ? isDark ? '#5eead4' : '#7c3aed'
                          : isDark ? 'rgba(255,255,255,0.05)' : '#fff',
                        borderColor: isDark ? 'rgba(94,234,212,0.3)' : '#ddd6fe',
                      }
                    ]}
                    onPress={() => updateItem(item.id, 'current', !item.current)}
                  >
                    {item.current && (
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color={isDark ? '#0a0f1e' : '#fff'}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.fullWidthField}>
                <Text style={labelStyle}>Description *</Text>
                <TextInput
                  style={[
                    inputStyle,
                    styles.textarea,
                    { minHeight: 100 }
                  ]}
                  value={item.description}
                  onChangeText={(text) => updateItem(item.id, 'description', text)}
                  placeholder="Describe your responsibilities and achievements..."
                  placeholderTextColor={isDark ? '#6a7282' : '#7c3aed'}
                  multiline
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add Experience Button */}
      <TouchableOpacity
        onPress={addItem}
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
          Add Experience
        </Text>
      </TouchableOpacity>
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
  experienceCard: {
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
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
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
});

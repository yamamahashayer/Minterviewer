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
import type { Education } from '../types';

interface Props {
  items: Education[];
  setItems: (updater: Education[] | ((prev: Education[]) => Education[])) => void;
}

export default function EducationStep({ items, setItems }: Props) {
  const { isDark } = useTheme();

  const updateItem = (id: number, field: keyof Education, value: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const addItem = () => {
    const newId = Math.max(0, ...items.map(i => i.id)) + 1;
    setItems(prev => [...prev, {
      id: newId,
      degree: '',
      institution: '',
      location: '',
      graduationDate: '',
      gpa: '',
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
            name="school"
            size={24}
            color={isDark ? '#5eead4' : '#7c3aed'}
          />
        </View>
        <View style={styles.headerContent}>
          <Text style={[
            styles.headerTitle,
            { color: isDark ? '#fff' : '#2e1065' }
          ]}>
            Education
          </Text>
          <Text style={[
            styles.headerSubtitle,
            { color: isDark ? '#99a1af' : '#6b21a8' }
          ]}>
            Add your educational background
          </Text>
        </View>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {items.map((item, index) => (
          <View key={item.id} style={[
            styles.educationCard,
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
                Education {index + 1}
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
                  <Text style={labelStyle}>Degree *</Text>
                  <TextInput
                    style={inputStyle}
                    value={item.degree}
                    onChangeText={(text) => updateItem(item.id, 'degree', text)}
                    placeholder="Bachelor of Science in Computer Science"
                    placeholderTextColor={isDark ? '#6a7282' : '#7c3aed'}
                  />
                </View>

                <View style={styles.field}>
                  <Text style={labelStyle}>Institution *</Text>
                  <TextInput
                    style={inputStyle}
                    value={item.institution}
                    onChangeText={(text) => updateItem(item.id, 'institution', text)}
                    placeholder="Stanford University"
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
                    placeholder="Stanford, CA"
                    placeholderTextColor={isDark ? '#6a7282' : '#7c3aed'}
                  />
                </View>

                <View style={styles.field}>
                  <Text style={labelStyle}>Graduation Date *</Text>
                  <TextInput
                    style={inputStyle}
                    value={item.graduationDate}
                    onChangeText={(text) => updateItem(item.id, 'graduationDate', text)}
                    placeholder="June 2020"
                    placeholderTextColor={isDark ? '#6a7282' : '#7c3aed'}
                  />
                </View>
              </View>

              <View style={styles.fullWidthField}>
                <Text style={labelStyle}>GPA (Optional)</Text>
                <TextInput
                  style={inputStyle}
                  value={item.gpa || ''}
                  onChangeText={(text) => updateItem(item.id, 'gpa', text)}
                  placeholder="3.8/4.0"
                  placeholderTextColor={isDark ? '#6a7282' : '#7c3aed'}
                />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add Education Button */}
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
          Add Education
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
    maxHeight: 400,
  },
  educationCard: {
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

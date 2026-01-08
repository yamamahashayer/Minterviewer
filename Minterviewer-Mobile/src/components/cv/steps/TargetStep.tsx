import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import type { CvType } from '../types';
import { ROLE_OPTIONS } from '../types';

type JDMode = "paste" | "upload" | "url";

interface Props {
  cvType: CvType;
  setCvType: (t: CvType) => void;
  targetRole: string;
  setTargetRole: (v: string) => void;
  jobDescription: string;
  setJobDescription: (v: string) => void;
}

export default function TargetStep({
  cvType,
  setCvType,
  targetRole,
  setTargetRole,
  jobDescription,
  setJobDescription,
}: Props) {
  const { isDark } = useTheme();
  const [jdMode, setJdMode] = useState<JDMode>("paste");
  const [rolePickerOpen, setRolePickerOpen] = useState(false);
  const [roleQuery, setRoleQuery] = useState("");
  const [showCustomRole, setShowCustomRole] = useState(false);

  const filteredRoles = ROLE_OPTIONS.filter(r =>
    r.toLowerCase().includes(roleQuery.toLowerCase())
  );

  const handleRoleSelect = (role: string) => {
    if (role === "Other") {
      setTargetRole("");
      setShowCustomRole(true);
    } else {
      setTargetRole(role);
      setShowCustomRole(false);
    }
    setRolePickerOpen(false);
  };

  const wrap = [
    styles.container,
    {
      backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#fff',
      borderColor: isDark ? 'rgba(94,234,212,0.2)' : '#ddd6fe',
    }
  ];

  return (
    <ScrollView style={wrap}>
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
            Targeting Details {cvType === "role" ? "(Role-Based)" : "(Job-Based)"}
          </Text>
        </View>
      </View>

      {/* Toggle Role/Job */}
      <View style={styles.toggleContainer}>
        <View style={[
          styles.toggleWrapper,
          { borderColor: isDark ? 'rgba(94,234,212,0.25)' : '#e9d5ff' }
        ]}>
          {(["role", "job"] as CvType[]).map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setCvType(t)}
              style={[
                styles.toggleButton,
                {
                  backgroundColor: cvType === t
                    ? isDark ? 'rgba(94,234,212,0.2)' : 'rgba(124,58,237,0.1)'
                    : 'transparent',
                }
              ]}
            >
              <Text style={[
                styles.toggleText,
                {
                  color: cvType === t
                    ? isDark ? '#5eead4' : '#7c3aed'
                    : isDark ? '#aab3c2' : '#6b21a8'
                }
              ]}>
                {t === "role" ? "Role-Based" : "Job-Based"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ROLE-BASED */}
      {cvType === "role" && (
        <View style={styles.content}>
          <Text style={[
            styles.label,
            { color: isDark ? '#d1d5dc' : '#2e1065' }
          ]}>
            Target Role *
          </Text>

          <TouchableOpacity
            onPress={() => setRolePickerOpen(!rolePickerOpen)}
            style={[
              styles.roleSelector,
              {
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff',
                borderColor: isDark ? 'rgba(94,234,212,0.3)' : '#ddd6fe',
              }
            ]}
          >
            <Text style={[
              styles.roleSelectorText,
              { color: isDark ? '#fff' : '#2e1065' }
            ]}>
              {targetRole || (showCustomRole ? "Enter a custom role…" : "Select or type a role…")}
            </Text>
            <Ionicons
              name="chevron-down"
              size={20}
              color={isDark ? '#fff' : '#2e1065'}
            />
          </TouchableOpacity>

          {/* Role suggestions */}
          <View style={styles.roleSuggestions}>
            {ROLE_OPTIONS.map((role) => (
              <TouchableOpacity
                key={role}
                onPress={() => handleRoleSelect(role)}
                style={[
                  styles.roleChip,
                  {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff',
                    borderColor: isDark ? 'rgba(94,234,212,0.25)' : '#e9d5ff',
                  }
                ]}
              >
                <Text style={[
                  styles.roleChipText,
                  { color: isDark ? '#cdeffd' : '#6b21a8' }
                ]}>
                  + {role}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {showCustomRole && (
            <View style={styles.customRoleContainer}>
              <Text style={[
                styles.customRoleLabel,
                { color: isDark ? '#cbd5e1' : '#3b0764' }
              ]}>
                Enter Custom Role *
              </Text>
              <TextInput
                placeholder="e.g., Robotics Engineer / Research Assistant"
                value={targetRole}
                onChangeText={setTargetRole}
                style={[
                  styles.customRoleInput,
                  {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff',
                    borderColor: isDark ? 'rgba(94,234,212,0.3)' : '#ddd6fe',
                    color: isDark ? '#fff' : '#2e1065',
                  }
                ]}
              />
            </View>
          )}

          {!targetRole.trim() && (
            <Text style={styles.errorText}>
              This field is required for Role-Based.
            </Text>
          )}
        </View>
      )}

      {/* JOB-BASED */}
      {cvType === "job" && (
        <View style={styles.content}>
          <Text style={[
            styles.label,
            { color: isDark ? '#d1d5dc' : '#2e1065' }
          ]}>
            Job Description *
          </Text>

          <View style={[
            styles.jdModeToggle,
            { borderColor: isDark ? 'rgba(94,234,212,0.25)' : '#e9d5ff' }
          ]}>
            {(["paste", "upload", "url"] as JDMode[]).map((m) => (
              <TouchableOpacity
                key={m}
                onPress={() => setJdMode(m)}
                style={[
                  styles.jdModeButton,
                  {
                    backgroundColor: jdMode === m
                      ? isDark ? 'rgba(94,234,212,0.2)' : 'rgba(124,58,237,0.1)'
                      : 'transparent',
                  }
                ]}
              >
                <Text style={[
                  styles.jdModeText,
                  {
                    color: jdMode === m
                      ? isDark ? '#5eead4' : '#7c3aed'
                      : isDark ? '#aab3c2' : '#6b21a8'
                  }
                ]}>
                  {m === "paste" ? "Paste" : m === "upload" ? "Upload" : "URL"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {jdMode === "paste" && (
            <View>
              <TextInput
                multiline
                placeholder="Paste the full job description here…"
                value={jobDescription}
                onChangeText={setJobDescription}
                style={[
                  styles.jdTextarea,
                  {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff',
                    borderColor: isDark ? 'rgba(94,234,212,0.3)' : '#ddd6fe',
                    color: isDark ? '#fff' : '#2e1065',
                    minHeight: 160,
                  }
                ]}
              />
              <View style={styles.jdFooter}>
                <Text style={[
                  styles.charCount,
                  { color: isDark ? '#99a1af' : '#6b21a8' }
                ]}>
                  {jobDescription.length} chars
                </Text>
                <TouchableOpacity
                  onPress={() => setJobDescription(jobDescription.trim())}
                  style={[
                    styles.cleanButton,
                    {
                      borderColor: isDark ? 'rgba(94,234,212,0.3)' : '#ddd6fe',
                    }
                  ]}
                >
                  <Text style={[
                    styles.cleanButtonText,
                    { color: isDark ? '#5eead4' : '#7c3aed' }
                  ]}>
                    Clean text
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {jdMode === "upload" && (
            <View style={[
              styles.uploadContainer,
              { borderColor: isDark ? 'rgba(94,234,212,0.25)' : '#e9d5ff' }
            ]}>
              <TouchableOpacity
                style={[
                  styles.uploadButton,
                  {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff',
                    borderColor: isDark ? 'rgba(94,234,212,0.3)' : '#ddd6fe',
                  }
                ]}
                onPress={() => Alert.alert('Upload', 'File upload would be implemented here')}
              >
                <Ionicons
                  name="cloud-upload"
                  size={24}
                  color={isDark ? '#5eead4' : '#7c3aed'}
                />
                <Text style={[
                  styles.uploadButtonText,
                  { color: isDark ? '#fff' : '#2e1065' }
                ]}>
                  Choose File
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {jdMode === "url" && (
            <View style={styles.urlContainer}>
              <TextInput
                placeholder="https://company.com/careers/job-123"
                value=""
                onChangeText={() => {}}
                style={[
                  styles.urlInput,
                  {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff',
                    borderColor: isDark ? 'rgba(94,234,212,0.3)' : '#ddd6fe',
                    color: isDark ? '#fff' : '#2e1065',
                  }
                ]}
              />
              <TouchableOpacity
                style={[
                  styles.fetchButton,
                  { backgroundColor: isDark ? '#5eead4' : '#7c3aed' }
                ]}
                onPress={() => Alert.alert('Fetch', 'URL fetching would be implemented here')}
              >
                <Text style={[
                  styles.fetchButtonText,
                  { color: isDark ? '#0a0f1e' : '#fff' }
                ]}>
                  Fetch
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {!jobDescription.trim() && (
            <Text style={styles.errorText}>
              Job description is required for Job-Based.
            </Text>
          )}
        </View>
      )}

      {/* Role Picker Modal */}
      <Modal
        visible={rolePickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setRolePickerOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalContent,
            {
              backgroundColor: isDark ? '#0b1220' : '#fff',
              borderColor: isDark ? 'rgba(94,234,212,0.25)' : '#e9d5ff',
            }
          ]}>
            <TextInput
              autoFocus
              placeholder="Search roles…"
              value={roleQuery}
              onChangeText={setRoleQuery}
              style={[
                styles.searchInput,
                {
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff',
                  borderColor: isDark ? 'rgba(94,234,212,0.25)' : '#ddd6fe',
                  color: isDark ? '#fff' : '#2e1065',
                }
              ]}
            />
            
            <ScrollView style={styles.rolesList}>
              {filteredRoles.slice(0, 40).map((role) => (
                <TouchableOpacity
                  key={role}
                  onPress={() => handleRoleSelect(role)}
                  style={[
                    styles.roleItem,
                    {
                      backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(124,58,237,0.05)',
                    }
                  ]}
                >
                  <Text style={[
                    styles.roleItemText,
                    { color: isDark ? '#d1d5dc' : '#2e1065' }
                  ]}>
                    {role}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TextInput
                placeholder="Or type a custom role…"
                value={targetRole}
                onChangeText={(text) => {
                  setTargetRole(text);
                  if (text) setShowCustomRole(true);
                }}
                style={[
                  styles.customRoleInput,
                  {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff',
                    borderColor: isDark ? 'rgba(94,234,212,0.3)' : '#ddd6fe',
                    color: isDark ? '#fff' : '#2e1065',
                  }
                ]}
              />
              <TouchableOpacity
                onPress={() => setRolePickerOpen(false)}
                style={[
                  styles.okButton,
                  { backgroundColor: isDark ? '#5eead4' : '#7c3aed' }
                ]}
              >
                <Text style={[
                  styles.okButtonText,
                  { color: isDark ? '#0a0f1e' : '#fff' }
                ]}>
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
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
  toggleContainer: {
    marginBottom: 16,
  },
  toggleWrapper: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  toggleText: {
    fontSize: 14,
  },
  content: {
    gap: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  roleSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  roleSelectorText: {
    fontSize: 16,
  },
  roleSuggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  roleChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  roleChipText: {
    fontSize: 12,
  },
  customRoleContainer: {
    marginTop: 16,
  },
  customRoleLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  customRoleInput: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
  },
  jdModeToggle: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  jdModeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  jdModeText: {
    fontSize: 14,
  },
  jdTextarea: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  jdFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  charCount: {
    fontSize: 12,
  },
  cleanButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  cleanButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  uploadContainer: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  uploadButton: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  urlContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  urlInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  fetchButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  fetchButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    maxHeight: '80%',
    width: '100%',
  },
  searchInput: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    marginBottom: 12,
  },
  rolesList: {
    maxHeight: 224,
  },
  roleItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 4,
  },
  roleItemText: {
    fontSize: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  okButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  okButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

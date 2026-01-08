import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme';
import { companyService } from '../../services/companyService';
import CompanyLayout from '../../layouts/CompanyLayout';

interface CompanyData {
  _id: string;
  name: string;
  industry: string;
  description: string;
  website: string;
  location: string;
  size: string;
  isVerified: boolean;
  hiringStatus: string;
}

export default function CompanyProfileScreen({ navigation }: any) {
  const { isDark } = useTheme();
  const { user, isAuthenticated } = useAuth();

  const [company, setCompany] = useState<CompanyData | null>(null);
  const [editedCompany, setEditedCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalApplications, setTotalApplications] = useState(0);

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    try {
      if (!isAuthenticated || !user?.companyId) {
        setLoading(false);
        return;
      }

      // Use the same working analytics endpoint
      const response = await companyService.getAnalytics(user.companyId);
      const analyticsData = response.analytics || response;

      if (analyticsData && analyticsData.overview) {
        const companyData: CompanyData = {
          _id: user.companyId,
          name: analyticsData.overview.name || '',
          industry: analyticsData.overview.industry || '',
          description: analyticsData.overview.description || 'Leading technology company focused on innovation',
          website: analyticsData.overview.website || 'https://example.com',
          location: analyticsData.overview.location || 'San Francisco, CA',
          size: analyticsData.overview.size || '51-200',
          isVerified: analyticsData.overview.isVerified || false,
          hiringStatus: analyticsData.overview.hiringStatus || '',
        };
        
        setCompany(companyData);
        setEditedCompany(companyData);

        // Owner check - if user can access this endpoint, they are the owner
        setIsOwner(true);

        // Fetch jobs stats
        const jobsRes = await companyService.getJobs(user.companyId);
        if (jobsRes.jobs) {
          setTotalJobs(jobsRes.jobs.length);
          const applicationsCount = jobsRes.jobs.reduce(
            (sum: number, job: any) => sum + (job.applicants?.length || 0),
            0
          );
          setTotalApplications(applicationsCount);
        }
      }
    } catch (error) {
      console.error('Error fetching company data:', error);
      Alert.alert('Error', 'Failed to load company profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editedCompany || !user?.companyId) return;

    try {
      setSaving(true);
      
      const companyData = await companyService.updateProfile(user.companyId, editedCompany);
      setCompany(companyData.company as CompanyData);
      setEditedCompany(companyData.company as CompanyData);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedCompany(company);
    setIsEditing(false);
  };

  const onFieldChange = (key: keyof CompanyData, value: string) => {
    if (editedCompany) {
      setEditedCompany({
        ...editedCompany,
        [key]: value,
      });
    }
  };

  if (loading) {
    return (
      <CompanyLayout>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text.primaryDark }]}>Loading profile...</Text>
        </View>
      </CompanyLayout>
    );
  }

  if (!company) {
    return (
      <CompanyLayout>
        <View style={styles.centerContainer}>
          <Text style={[styles.errorText, { color: colors.danger }]}>Failed to load company profile</Text>
        </View>
      </CompanyLayout>
    );
  }

  return (
    <CompanyLayout>
      <ScrollView style={[styles.container, { backgroundColor: isDark ? '#0f172a' : '#f5f3ff' }]} showsVerticalScrollIndicator={false}>
        {/* ================= HEADER ================= */}
        <View style={[styles.header, { backgroundColor: isDark ? '#0a1022' : '#ffffff', borderColor: isDark ? '#1e293b' : '#e5e7eb' }]}>
          {/* Background grid pattern */}
          <View style={styles.gridPattern} />
          
          <View style={styles.headerContent}>
            <View style={styles.leftColumn}>
              <Text style={[styles.headerTitle, { color: isDark ? '#ffffff' : '#111827' }]}>
                Company Profile for{' '}
                <Text style={[styles.highlightText, { color: '#9333ea' }]}>{company.name}</Text>
              </Text>
              
              <Text style={[styles.headerSubtitle, { color: isDark ? '#cbd5e1' : '#6b7280' }]}>
                Manage your company information and verification status.
              </Text>
              
              <View style={[styles.verificationBadge, { backgroundColor: isDark ? 'rgba(147, 51, 234, 0.15)' : 'rgba(147, 51, 234, 0.05)' }]}>
                <Text style={[styles.verificationText, { color: colors.primary }]}>
                  {company.isVerified ? '✅ Verified Company' : '⏳ Verification Pending'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ================= STATS ================= */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: isDark ? '#020617' : '#ffffff', borderColor: isDark ? '#374151' : '#e5e7eb' }]}>
            <Text style={styles.statIcon}>💼</Text>
            <Text style={[styles.statLabel, { color: isDark ? '#94a3b8' : '#6b7280' }]}>Total Jobs</Text>
            <Text style={[styles.statValue, { color: isDark ? '#ffffff' : '#111827' }]}>{totalJobs}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: isDark ? '#020617' : '#ffffff', borderColor: isDark ? '#374151' : '#e5e7eb' }]}>
            <Text style={styles.statIcon}>👥</Text>
            <Text style={[styles.statLabel, { color: isDark ? '#94a3b8' : '#6b7280' }]}>Applications</Text>
            <Text style={[styles.statValue, { color: isDark ? '#ffffff' : '#111827' }]}>{totalApplications}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: isDark ? '#020617' : '#ffffff', borderColor: isDark ? '#374151' : '#e5e7eb' }]}>
            <Text style={styles.statIcon}>{company.isVerified ? '✅' : '⏳'}</Text>
            <Text style={[styles.statLabel, { color: isDark ? '#94a3b8' : '#6b7280' }]}>Status</Text>
            <Text style={[styles.statValue, { color: company.isVerified ? '#10b981' : '#f59e0b' }]}>
              {company.isVerified ? 'Verified' : 'Pending'}
            </Text>
          </View>
        </View>

        {/* ================= COMPANY INFORMATION ================= */}
        <View style={[styles.infoSection, { backgroundColor: isDark ? '#020617' : '#ffffff', borderColor: isDark ? '#1e293b' : '#e5e7eb' }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#111827' }]}>Company Information</Text>
            {isOwner && (
              !isEditing ? (
                <TouchableOpacity
                  style={[styles.editButton, { backgroundColor: colors.primary }]}
                  onPress={() => setIsEditing(true)}
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton, { borderColor: isDark ? '#374151' : '#d1d5db' }]}
                    onPress={handleCancel}
                    disabled={saving}
                  >
                    <Text style={[styles.cancelButtonText, { color: isDark ? '#e2e8f0' : '#374151' }]}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.saveButton, { backgroundColor: colors.primary }]}
                    onPress={handleSave}
                    disabled={saving}
                  >
                    {saving ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.saveButtonText}>Save</Text>
                    )}
                  </TouchableOpacity>
                </View>
              
            
           ))}
          </View>
        
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: isDark ? '#c4b5fd' : '#374151' }]}>Company Name</Text>
            {isEditing && isOwner ? (
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: isDark ? '#0f172a' : '#f9fafb',
                    borderColor: isDark ? '#8b5cf6' : '#e5e7eb',
                    color: isDark ? '#ffffff' : '#111827'
                  }
                ]}
                value={editedCompany?.name || ''}
                onChangeText={(text) => onFieldChange('name', text)}
                placeholder="Company name"
                placeholderTextColor={isDark ? '#a78bfa' : '#9ca3af'}
              />
            ) : (
              <Text style={[styles.fieldValue, { color: isDark ? '#e9d5ff' : '#111827', backgroundColor: isDark ? '#1e1b4b' : '#f9fafb', borderColor: isDark ? '#7c3aed' : '#e5e7eb' }]}>{company.name}</Text>
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: isDark ? '#c4b5fd' : '#374151' }]}>Industry</Text>
            {isEditing && isOwner ? (
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: isDark ? '#0f172a' : '#f9fafb',
                    borderColor: isDark ? '#8b5cf6' : '#e5e7eb',
                    color: isDark ? '#ffffff' : '#111827'
                  }
                ]}
                value={editedCompany?.industry || ''}
                onChangeText={(text) => onFieldChange('industry', text)}
                placeholder="Industry"
                placeholderTextColor={isDark ? '#a78bfa' : '#9ca3af'}
              />
            ) : (
              <Text style={[styles.fieldValue, { color: isDark ? '#e9d5ff' : '#111827', backgroundColor: isDark ? '#1e1b4b' : '#f9fafb', borderColor: isDark ? '#7c3aed' : '#e5e7eb' }]}>{company.industry}</Text>
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: isDark ? '#c4b5fd' : '#374151' }]}>Description</Text>
            {isEditing && isOwner ? (
              <TextInput
                style={[
                  styles.textInput,
                  styles.textArea,
                  {
                    backgroundColor: isDark ? '#0f172a' : '#f9fafb',
                    borderColor: isDark ? '#8b5cf6' : '#e5e7eb',
                    color: isDark ? '#ffffff' : '#111827'
                  }
                ]}
                value={editedCompany?.description || ''}
                onChangeText={(text) => onFieldChange('description', text)}
                placeholder="Company description"
                multiline
                numberOfLines={4}
                placeholderTextColor={isDark ? '#a78bfa' : '#9ca3af'}
              />
            ) : (
              <Text style={[styles.fieldValue, { color: isDark ? '#e9d5ff' : '#111827', backgroundColor: isDark ? '#1e1b4b' : '#f9fafb', borderColor: isDark ? '#7c3aed' : '#e5e7eb' }]}>{company.description}</Text>
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: isDark ? '#c4b5fd' : '#374151' }]}>Website</Text>
            {isEditing && isOwner ? (
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: isDark ? '#0f172a' : '#f9fafb',
                    borderColor: isDark ? '#8b5cf6' : '#e5e7eb',
                    color: isDark ? '#ffffff' : '#111827'
                  }
                ]}
                value={editedCompany?.website || ''}
                onChangeText={(text) => onFieldChange('website', text)}
                placeholder="Website URL"
                placeholderTextColor={isDark ? '#a78bfa' : '#9ca3af'}
              />
            ) : (
              <Text style={[styles.fieldValue, { color: isDark ? '#e9d5ff' : '#111827', backgroundColor: isDark ? '#1e1b4b' : '#f9fafb', borderColor: isDark ? '#7c3aed' : '#e5e7eb' }]}>{company.website}</Text>
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: isDark ? '#c4b5fd' : '#374151' }]}>Location</Text>
            {isEditing && isOwner ? (
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: isDark ? '#0f172a' : '#f9fafb',
                    borderColor: isDark ? '#8b5cf6' : '#e5e7eb',
                    color: isDark ? '#ffffff' : '#111827'
                  }
                ]}
                value={editedCompany?.location || ''}
                onChangeText={(text) => onFieldChange('location', text)}
                placeholder="Location"
                placeholderTextColor={isDark ? '#a78bfa' : '#9ca3af'}
              />
            ) : (
              <Text style={[styles.fieldValue, { color: isDark ? '#e9d5ff' : '#111827', backgroundColor: isDark ? '#1e1b4b' : '#f9fafb', borderColor: isDark ? '#7c3aed' : '#e5e7eb' }]}>{company.location}</Text>
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: isDark ? '#c4b5fd' : '#374151' }]}>Company Size</Text>
            {isEditing && isOwner ? (
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: isDark ? '#0f172a' : '#f9fafb',
                    borderColor: isDark ? '#8b5cf6' : '#e5e7eb',
                    color: isDark ? '#ffffff' : '#111827'
                  }
                ]}
                value={editedCompany?.size || ''}
                onChangeText={(text) => onFieldChange('size', text)}
                placeholder="Company size"
                placeholderTextColor={isDark ? '#a78bfa' : '#9ca3af'}
              />
            ) : (
              <Text style={[styles.fieldValue, { color: isDark ? '#e9d5ff' : '#111827', backgroundColor: isDark ? '#1e1b4b' : '#f9fafb', borderColor: isDark ? '#7c3aed' : '#e5e7eb' }]}>{company.size}</Text>
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: isDark ? '#c4b5fd' : '#374151' }]}>Hiring Status</Text>
            {isEditing && isOwner ? (
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: isDark ? '#0f172a' : '#f9fafb',
                    borderColor: isDark ? '#8b5cf6' : '#e5e7eb',
                    color: isDark ? '#ffffff' : '#111827'
                  }
                ]}
                value={editedCompany?.hiringStatus || ''}
                onChangeText={(text) => onFieldChange('hiringStatus', text)}
                placeholder="Hiring status"
                placeholderTextColor={isDark ? '#a78bfa' : '#9ca3af'}
              />
            ) : (
              <Text style={[styles.fieldValue, { color: isDark ? '#e9d5ff' : '#111827', backgroundColor: isDark ? '#1e1b4b' : '#f9fafb', borderColor: isDark ? '#7c3aed' : '#e5e7eb' }]}>{company.hiringStatus}</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </CompanyLayout>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  header: {
    margin: 20,
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  gridPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.04,
    backgroundColor: 'transparent',
  },
  headerContent: {
    gap: 20,
  },
  leftColumn: {
    gap: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  highlightText: {
    color: '#9333ea',
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  verificationBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(147, 51, 234, 0.2)',
  },
  verificationText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  statCard: {
    borderRadius: 20,
    padding: 20,
    width: width * 0.8,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.8,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  infoSection: {
    margin: 20,
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  editButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 11,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 70,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  cancelButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  saveButton: {
    minWidth: 70,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  fieldGroup: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  fieldValue: {
    fontSize: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    color: '#111827',
  },
  textInput: {
    fontSize: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    color: '#111827',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});
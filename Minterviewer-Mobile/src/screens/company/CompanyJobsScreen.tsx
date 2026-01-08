import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import CompanyLayout from '../../layouts/CompanyLayout';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme';
import { companyService, Job } from '../../services/companyService';

export default function CompanyJobsScreen() {
  const { theme, isDark } = useTheme();
  const { user, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    type: 'Full-time',
    location: '',
    salary: '',
    requirements: '',
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user?.companyId) {
      setLoading(false);
      return;
    }

    loadJobs();
  }, [isAuthenticated, user]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      if (!user?.companyId) return;
      const jobsData = await companyService.getJobs(user.companyId);
      setJobs(jobsData.jobs || []);
      setError(null);
    } catch (e: any) {
      console.error('CompanyJobsScreen: Error loading jobs:', e);
      setError(`Failed to load jobs: ${e.message || String(e)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async () => {
    if (!newJob.title || !newJob.description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setCreating(true);
      if (!user?.companyId) return;
      const result = await companyService.createJob(user.companyId, {
        title: newJob.title,
        description: newJob.description,
        type: newJob.type,
        location: newJob.location,
        salary: newJob.salary,
        requirements: newJob.requirements.split('\n').filter(r => r.trim()),
      });
      
      if (result.ok) {
        Alert.alert('Success', 'Job created successfully');
        setShowCreateModal(false);
        setNewJob({
          title: '',
          description: '',
          type: 'Full-time',
          location: '',
          salary: '',
          requirements: '',
        });
        loadJobs();
      }
    } catch (e: any) {
      console.error('CompanyJobsScreen: Error creating job:', e);
      Alert.alert('Error', 'Failed to create job');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    Alert.alert(
      'Delete Job',
      'Are you sure you want to delete this job?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              if (!user?.companyId) return;
              await companyService.deleteJob(user.companyId, jobId);
              Alert.alert('Success', 'Job deleted successfully');
              loadJobs();
            } catch (e: any) {
              console.error('CompanyJobsScreen: Error deleting job:', e);
              Alert.alert('Error', 'Failed to delete job');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'closed':
        return '#ef4444';
      case 'draft':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  if (loading) {
    return (
      <CompanyLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}>Loading jobs...</Text>
        </View>
      </CompanyLayout>
    );
  }

  return (
    <CompanyLayout>
      <View style={[styles.container, { backgroundColor: isDark ? colors.background.dark : colors.background.light }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: isDark ? colors.background.headerDark : colors.background.headerLight, borderBottomColor: isDark ? colors.border.dark : colors.border.light }]}>
          <Text style={[styles.headerTitle, { color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}>Job Management</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => setShowCreateModal(true)}
          >
            <Text style={styles.createButtonText}>+ Create Job</Text>
          </TouchableOpacity>
        </View>

        {/* Jobs List */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {jobs.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}>No jobs posted yet</Text>
            <Text style={[styles.emptyDescription, { color: isDark ? colors.text.secondaryDark : colors.text.secondaryLight }]}>
              Create your first job posting to start attracting candidates
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => setShowCreateModal(true)}
            >
              <Text style={styles.emptyButtonText}>Create Your First Job</Text>
            </TouchableOpacity>
          </View>
        ) : (
          jobs.map((job) => (
            <View key={job._id} style={[styles.jobCard, { backgroundColor: isDark ? colors.background.cardDark : colors.background.light, borderColor: isDark ? colors.border.dark : colors.border.light }]}>
              <View style={styles.jobHeader}>
                <Text style={[styles.jobTitle, { color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}>{job.title}</Text>
              </View>

              <View style={styles.jobStatus}>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(job.status) },
                  ]}
                >
                  <Text style={styles.statusText}>{job.status}</Text>
                </View>
              </View>

              <View style={styles.jobDetails}>
                <Text style={[styles.jobDetail, { color: isDark ? colors.text.secondaryDark : colors.text.secondaryLight }]}>📍 {job.location}</Text>
                <Text style={[styles.jobDetail, { color: isDark ? colors.text.secondaryDark : colors.text.secondaryLight }]}>💼 {job.type}</Text>
                <Text style={[styles.jobDetail, { color: isDark ? colors.text.secondaryDark : colors.text.secondaryLight }]}>💰 {job.salary}</Text>
              </View>

              <Text style={[styles.jobDescription, { color: isDark ? colors.text.secondaryDark : colors.text.secondaryLight }]} numberOfLines={3}>
                {job.description}
              </Text>

              <View style={styles.jobFooter}>
                <Text style={[styles.applicantsCount, { color: colors.primary }]}>
                  👥 0 applicants
                </Text>
                <View style={styles.jobActions}>
                  <TouchableOpacity
                    style={styles.viewButton}
                  >
                    <Text style={styles.viewButtonText}>View</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteJob(job._id)}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

        {/* Create Job Modal */}
        <Modal
          visible={showCreateModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={[styles.modalContainer, { backgroundColor: isDark ? colors.background.dark : colors.background.light }]}>
            <View style={[styles.modalHeader, { borderBottomColor: isDark ? colors.border.dark : colors.border.light }]}>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <Text style={[styles.cancelText, { color: isDark ? colors.text.secondaryDark : colors.text.secondaryLight }]}>Cancel</Text>
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}>Create New Job</Text>
              <TouchableOpacity onPress={handleCreateJob} disabled={creating}>
                {creating ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <Text style={[styles.createText, { color: colors.primary }]}>Create</Text>
                )}
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}>Job Title *</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: isDark ? colors.background.cardDark : colors.background.light, borderColor: isDark ? colors.border.dark : colors.border.light, color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}
                  value={newJob.title}
                  onChangeText={(text) => setNewJob({ ...newJob, title: text })}
                  placeholder="e.g. Senior React Developer"
                  placeholderTextColor={isDark ? colors.text.secondaryDark : colors.text.secondaryLight}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}>Job Type</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: isDark ? colors.background.cardDark : colors.background.light, borderColor: isDark ? colors.border.dark : colors.border.light, color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}
                  value={newJob.type}
                  onChangeText={(text) => setNewJob({ ...newJob, type: text })}
                  placeholder="e.g. Full-time, Part-time, Contract"
                  placeholderTextColor={isDark ? colors.text.secondaryDark : colors.text.secondaryLight}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}>Location</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: isDark ? colors.background.cardDark : colors.background.light, borderColor: isDark ? colors.border.dark : colors.border.light, color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}
                  value={newJob.location}
                  onChangeText={(text) => setNewJob({ ...newJob, location: text })}
                  placeholder="e.g. Remote, New York, NY"
                  placeholderTextColor={isDark ? colors.text.secondaryDark : colors.text.secondaryLight}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}>Salary</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: isDark ? colors.background.cardDark : colors.background.light, borderColor: isDark ? colors.border.dark : colors.border.light, color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}
                  value={newJob.salary}
                  onChangeText={(text) => setNewJob({ ...newJob, salary: text })}
                  placeholder="e.g. $80,000 - $120,000"
                  placeholderTextColor={isDark ? colors.text.secondaryDark : colors.text.secondaryLight}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}>Description *</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea, { backgroundColor: isDark ? colors.background.cardDark : colors.background.light, borderColor: isDark ? colors.border.dark : colors.border.light, color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}
                  value={newJob.description}
                  onChangeText={(text) => setNewJob({ ...newJob, description: text })}
                  placeholder="Describe the role, responsibilities, and what you're looking for..."
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                  placeholderTextColor={isDark ? colors.text.secondaryDark : colors.text.secondaryLight}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}>Requirements</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea, { backgroundColor: isDark ? colors.background.cardDark : colors.background.light, borderColor: isDark ? colors.border.dark : colors.border.light, color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}
                  value={newJob.requirements}
                  onChangeText={(text) => setNewJob({ ...newJob, requirements: text })}
                  placeholder="Enter each requirement on a new line"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  placeholderTextColor={isDark ? colors.text.secondaryDark : colors.text.secondaryLight}
                />
              </View>
            </ScrollView>
          </View>
        </Modal>
      </View>
    </CompanyLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#9333ea',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  emptyButton: {
    backgroundColor: '#9333ea',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  jobCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  jobDepartment: {
    fontSize: 14,
  },
  jobStatus: {
    marginLeft: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  jobDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 12,
  },
  jobDetail: {
    fontSize: 14,
  },
  jobDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  applicantsCount: {
    fontSize: 14,
    fontWeight: '600',
  },
  jobActions: {
    flexDirection: 'row',
    gap: 8,
  },
  viewButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#9333ea',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  viewButtonText: {
    color: '#9333ea',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  cancelText: {
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  createText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import CompanyLayout from '../../layouts/CompanyLayout';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme';
import { companyService, Job } from '../../services/companyService';

// Define the actual API response structure
interface Mentee {
  full_name: string;
  email: string;
}

interface ApplicantData {
  _id: string;
  analysisId: string | null;
  atsScore: number | null;
  createdAt: string;
  cvScore: number | null;
  interviewId: string | null;
  interviewScore: number | null;
  mentee: Mentee;
  status: 'pending' | 'reviewing' | 'interviewed' | 'accepted' | 'rejected';
  skills?: string[];
  experience?: string;
  education?: string;
}

export default function CompanyCandidatesScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [openJobId, setOpenJobId] = useState<string | null>(null);
  const [applicants, setApplicants] = useState<ApplicantData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      if (!user?.companyId) return;

      console.log('CompanyCandidatesScreen: Fetching jobs for companyId:', user.companyId);
      const jobsData = await companyService.getJobs(user.companyId);
      console.log('CompanyCandidatesScreen: Jobs data:', jobsData);
      setJobs(jobsData.jobs || []);
    } catch (error: any) {
      console.error('CompanyCandidatesScreen: Error fetching jobs:', error);
      Alert.alert('Error', `Failed to load jobs: ${error.message || String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenJob = async (job: Job) => {
    if (openJobId === job._id) {
      setOpenJobId(null);
      setApplicants([]);
      return;
    }

    setOpenJobId(job._id);
    setApplicants([]);
    setLoadingApplicants(true);

    try {
      if (!user?.companyId) return;

      console.log('CompanyCandidatesScreen: Fetching applicants for job:', job._id);
      const applicantsData = await companyService.getJobApplicants(user.companyId, job._id);
      console.log('CompanyCandidatesScreen: Applicants data:', applicantsData);
      setApplicants((applicantsData.applicants as unknown) as ApplicantData[] || []);
    } catch (error: any) {
      console.error('CompanyCandidatesScreen: Error fetching applicants:', error);
      Alert.alert('Error', `Failed to load applicants: ${error.message || String(error)}`);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleViewProfile = (applicant: ApplicantData) => {
    navigation.navigate('ApplicantProfile', { applicantId: applicant._id });
  };

  const handleScheduleInterview = (applicant: ApplicantData, job: Job) => {
    navigation.navigate('ScheduleInterview', {
      applicantId: applicant._id,
      jobId: job._id,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#f59e0b';
      case 'reviewing':
        return '#3b82f6';
      case 'interviewed':
        return '#8b5cf6';
      case 'accepted':
        return '#10b981';
      case 'rejected':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  if (loading) {
    return (
      <CompanyLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}>Loading candidates...</Text>
        </View>
      </CompanyLayout>
    );
  }

  return (
    <CompanyLayout>
      <View style={[styles.container, { backgroundColor: isDark ? colors.background.dark : colors.background.light }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: isDark ? colors.background.headerDark : colors.background.headerLight, borderBottomColor: isDark ? colors.border.dark : colors.border.light }]}>
          <Text style={[styles.headerTitle, { color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}>Candidates</Text>
          <Text style={[styles.headerSubtitle, { color: isDark ? colors.text.secondaryDark : colors.text.secondaryLight }]}>
            Review applicants grouped by job position
          </Text>
        </View>

      {/* Jobs and Applicants */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {jobs.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}>No candidates yet</Text>
            <Text style={[styles.emptyDescription, { color: isDark ? colors.text.secondaryDark : colors.text.secondaryLight }]}>
              Post jobs to start receiving applications from candidates
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('Jobs')}
            >
              <Text style={styles.emptyButtonText}>Post a Job</Text>
            </TouchableOpacity>
          </View>
        ) : (
          jobs.map((job) => {
            const isOpen = openJobId === job._id;

            return (
              <View key={job._id} style={[styles.jobCard, { backgroundColor: isDark ? colors.background.cardDark : colors.background.light, borderColor: isDark ? colors.border.dark : colors.border.light }]}>
                <TouchableOpacity
                  style={[styles.jobHeader, { backgroundColor: isDark ? colors.background.cardDark : colors.background.light }]}
                  onPress={() => handleOpenJob(job)}
                >
                  <View style={styles.jobInfo}>
                    <Text style={[styles.jobTitle, { color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}>{job.title}</Text>
                    <Text style={[styles.applicantCount, { color: isDark ? colors.text.secondaryDark : colors.text.secondaryLight }]}>
                      View applicants
                    </Text>
                  </View>
                  <Text style={[styles.expandIcon, { color: colors.primary }]}>
                    {isOpen ? '▼' : '▶'}
                  </Text>
                </TouchableOpacity>

                {isOpen && (
                  <View style={styles.applicantsSection}>
                    {loadingApplicants ? (
                      <View style={styles.loadingApplicants}>
                        <ActivityIndicator size="small" color={colors.primary} />
                        <Text style={[styles.loadingText, { color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}>Loading applicants...</Text>
                      </View>
                    ) : applicants.length === 0 ? (
                      <View style={styles.noApplicants}>
                        <Text style={[styles.noApplicantsText, { color: isDark ? colors.text.secondaryDark : colors.text.secondaryLight }]}>
                          No applicants for this position yet
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.tableContainer}>
                        {/* Table Header */}
                        <View style={[styles.tableHeader, { backgroundColor: isDark ? colors.background.cardDark : colors.background.light, borderBottomColor: isDark ? colors.border.dark : colors.border.light }]}>
                          <Text style={[styles.tableHeaderText, { color: isDark ? colors.text.secondaryDark : colors.text.secondaryLight }]}>#</Text>
                          <Text style={[styles.tableHeaderText, { color: isDark ? colors.text.secondaryDark : colors.text.secondaryLight }]}>Candidate</Text>
                          <Text style={[styles.tableHeaderText, { color: isDark ? colors.text.secondaryDark : colors.text.secondaryLight }]}>CV</Text>
                          <Text style={[styles.tableHeaderText, { color: isDark ? colors.text.secondaryDark : colors.text.secondaryLight }]}>ATS</Text>
                          <Text style={[styles.tableHeaderText, { color: isDark ? colors.text.secondaryDark : colors.text.secondaryLight }]}>Status</Text>
                          <Text style={[styles.tableHeaderText, { color: isDark ? colors.text.secondaryDark : colors.text.secondaryLight }]}>Actions</Text>
                        </View>

                        {/* Table Rows */}
                        {applicants.map((applicant, index) => (
                          <View key={applicant._id} style={[styles.tableRow, { borderBottomColor: isDark ? colors.border.dark : colors.border.light }]}>
                            <View style={styles.tableCell}>
                              <Text style={[styles.tableCellText, { color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}>{index + 1}</Text>
                            </View>
                            
                            <View style={styles.tableCell}>
                              <Text style={[styles.candidateName, { color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}>
                                {applicant.mentee?.full_name || 'Unknown'}
                              </Text>
                              <Text style={[styles.candidateEmail, { color: isDark ? colors.text.secondaryDark : colors.text.secondaryLight }]}>
                                {applicant.mentee?.email || 'No email'}
                              </Text>
                            </View>
                            
                            <View style={styles.tableCell}>
                              <Text style={[styles.scoreText, { color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}>
                                {applicant.cvScore ?? '—'}
                              </Text>
                            </View>
                            
                            <View style={styles.tableCell}>
                              <Text style={[styles.scoreText, { color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}>
                                {applicant.atsScore != null ? `${applicant.atsScore}%` : '—'}
                              </Text>
                            </View>
                            
                            <View style={styles.tableCell}>
                              <View
                                style={[
                                  styles.statusBadge,
                                  { backgroundColor: getStatusColor(applicant.status) },
                                ]}
                              >
                                <Text style={styles.statusText}>{applicant.status}</Text>
                              </View>
                            </View>
                            
                            <View style={styles.tableCell}>
                              <View style={styles.actionButtons}>
                                <TouchableOpacity
                                  style={styles.actionButton}
                                  onPress={() => handleViewProfile(applicant)}
                                >
                                  <Text style={styles.actionButtonText}>View</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={[styles.actionButton, styles.interviewButton]}
                                  onPress={() => handleScheduleInterview(applicant, job)}
                                >
                                  <Text style={styles.interviewButtonText}>Interview</Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
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
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
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
    marginBottom: 12,
    overflow: 'hidden',
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  applicantCount: {
    fontSize: 14,
  },
  expandIcon: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  applicantsSection: {
    borderTopWidth: 1,
  },
  loadingApplicants: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 8,
  },
  noApplicants: {
    padding: 20,
    alignItems: 'center',
  },
  noApplicantsText: {
    fontSize: 16,
    textAlign: 'center',
  },
  applicantCard: {
    padding: 16,
    borderBottomWidth: 1,
  },
  applicantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  applicantInfo: {
    flex: 1,
  },
  applicantName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  applicantEmail: {
    fontSize: 14,
    marginBottom: 2,
  },
  appliedDate: {
    fontSize: 12,
  },
  statusContainer: {
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
  applicantDetails: {
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    marginBottom: 2,
  },
  skillsSection: {
    marginBottom: 12,
  },
  skillsLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
  },
  skillBadge: {
    backgroundColor: 'rgba(147, 51, 234, 0.1)',
    borderWidth: 1,
    borderColor: '#9333ea',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  skillText: {
    fontSize: 12,
    color: '#9333ea',
    fontWeight: '500',
  },
  moreSkillsText: {
    fontSize: 12,
  },
  applicantActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#9333ea',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
  },
  actionButtonText: {
    color: '#9333ea',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  interviewButton: {
    backgroundColor: '#9333ea',
    borderColor: '#9333ea',
  },
  interviewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Table Styles
  tableContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    flex: 1,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  tableCell: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  tableCellText: {
    fontSize: 14,
    textAlign: 'center',
  },
  candidateName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  candidateEmail: {
    fontSize: 12,
    textAlign: 'center',
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'column',
    gap: 4,
  },
});

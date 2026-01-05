import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MenteeLayout from '../../layouts/MenteeLayout';
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme';
import api from '../../services/api';

interface Job {
  _id: string;
  title: string;
  location?: string;
  type: string;
  level: string;
  status: string;
  description?: string;
  skills?: string[];
  salary?: string;
  postedAt?: string;
  companyId?: {
    _id: string;
    name: string;
    logo?: string;
    industry?: string;
  };
}

interface FilterState {
  search: string;
  company: string;
  type: string;
  level: string;
}

export default function ExploreJobsScreen() {
  const { isDark } = useTheme();

  // State
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isJobModalOpen, setJobModalOpen] = useState(false);

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    company: 'all',
    type: 'all',
    level: 'all',
  });

  // Fetch jobs
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/company/jobs');
        if (response.data.ok) setJobs(response.data.jobs || []);
      } catch (err) {
        console.error('Fetch jobs error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Get unique companies for filter
  const companies = useMemo(() => {
    return Array.from(
      new Set(jobs.map((j) => j.companyId?.name).filter(Boolean))
    );
  }, [jobs]);

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        !filters.search ||
        job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.companyId?.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.skills?.some((s: string) =>
          s.toLowerCase().includes(filters.search.toLowerCase())
        );

      const matchesCompany =
        filters.company === 'all' || job.companyId?.name === filters.company;

      const matchesType = filters.type === 'all' || job.type === filters.type;
      const matchesLevel = filters.level === 'all' || job.level === filters.level;

      return matchesSearch && matchesCompany && matchesType && matchesLevel;
    });
  }, [jobs, filters]);

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
    setJobModalOpen(true);
  };

  const renderJobCard = ({ item: job }: { item: Job }) => {
    const isClosed = job.status === 'closed';

    return (
      <TouchableOpacity
        style={[
          styles.jobCard,
          {
            backgroundColor: isDark ? 'rgba(11,18,32,0.8)' : 'white',
            borderColor: isDark ? 'rgba(94,234,212,0.25)' : '#ddd6fe',
            opacity: isClosed ? 0.6 : 1,
          },
        ]}
        onPress={() => handleJobSelect(job)}
        disabled={isClosed}
      >
        {/* Company Header */}
        <View style={styles.companyHeader}>
          <View style={[
            styles.companyLogo,
            {
              backgroundColor: isDark ? '#0f172a' : '#f3e8ff',
              borderColor: isDark ? 'rgba(94,234,212,0.25)' : '#ddd6fe',
            }
          ]}>
            {job.companyId?.logo ? (
              <Text style={styles.logoText}>{job.companyId.name?.charAt(0)}</Text>
            ) : (
              <Ionicons name="business-outline" size={24} color={isDark ? '#5eead4' : '#9333ea'} />
            )}
          </View>
          <View style={styles.companyInfo}>
            <Text style={[
              styles.companyName,
              { color: isDark ? 'white' : '#2e1065' }
            ]}>
              {job.companyId?.name || 'Company'}
            </Text>
            {job.companyId?.industry && (
              <Text style={[
                styles.industry,
                { color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }
              ]}>
                {job.companyId.industry}
              </Text>
            )}
          </View>
        </View>

        {/* Job Title */}
        <View style={styles.jobTitleSection}>
          <Text style={[
            styles.jobTitle,
            { color: isDark ? 'white' : '#2e1065' }
          ]}>
            {job.title}
          </Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={16} color={isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)'} />
            <Text style={[
              styles.location,
              { color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.75)' }
            ]}>
              {job.location || 'Location not specified'}
            </Text>
          </View>
        </View>

        {/* Meta Info */}
        <View style={styles.metaInfo}>
          {job.type && (
            <View style={[
              styles.metaTag,
              {
                backgroundColor: isDark ? 'rgba(94,234,212,0.1)' : 'rgba(147,51,234,0.1)',
                borderColor: isDark ? 'rgba(94,234,212,0.3)' : 'rgba(147,51,234,0.3)',
              }
            ]}>
              <Ionicons name="briefcase-outline" size={12} color={isDark ? '#5eead4' : '#9333ea'} />
              <Text style={[
                styles.metaText,
                { color: isDark ? '#5eead4' : '#9333ea' }
              ]}>
                {job.type}
              </Text>
            </View>
          )}
          {job.level && (
            <View style={[
              styles.metaTag,
              {
                backgroundColor: isDark ? 'rgba(94,234,212,0.1)' : 'rgba(147,51,234,0.1)',
                borderColor: isDark ? 'rgba(94,234,212,0.3)' : 'rgba(147,51,234,0.3)',
              }
            ]}>
              <Ionicons name="school-outline" size={12} color={isDark ? '#5eead4' : '#9333ea'} />
              <Text style={[
                styles.metaText,
                { color: isDark ? '#5eead4' : '#9333ea' }
              ]}>
                {job.level}
              </Text>
            </View>
          )}
          {isClosed && (
            <View style={[
              styles.metaTag,
              styles.closedTag,
              { backgroundColor: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)' }
            ]}>
              <Ionicons name="close-circle-outline" size={12} color="#ef4444" />
              <Text style={[styles.metaText, { color: '#ef4444' }]}>Closed</Text>
            </View>
          )}
        </View>

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <View style={styles.skillsSection}>
            <Text style={[
              styles.skillsLabel,
              { color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }
            ]}>
              Skills:
            </Text>
            <View style={styles.skillsList}>
              {job.skills.slice(0, 3).map((skill, index) => (
                <Text key={index} style={[
                  styles.skillTag,
                  { color: isDark ? '#5eead4' : '#9333ea' }
                ]}>
                  {skill}
                </Text>
              ))}
              {job.skills.length > 3 && (
                <Text style={[
                  styles.skillTag,
                  { color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }
                ]}>
                  +{job.skills.length - 3}
                </Text>
              )}
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <MenteeLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}>
            Loading jobs...
          </Text>
        </View>
      </MenteeLayout>
    );
  }

  return (
    <MenteeLayout>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={[
            styles.title,
            { color: isDark ? 'white' : '#2e1065' }
          ]}>
            Explore Jobs
          </Text>
          <Text style={[
            styles.subtitle,
            { color: isDark ? 'rgba(255,255,255,0.8)' : '#4c1d95' }
          ]}>
            Explore intelligent job opportunities designed around your{' '}
            <Text style={[
              styles.highlight,
              { color: isDark ? '#5eead4' : '#9333ea' }
            ]}>
              skills, interests, and future career goals.
            </Text>
          </Text>
          <View style={[
            styles.divider,
            { backgroundColor: isDark ? '#5eead4' : '#9333ea' }
          ]} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={[
            styles.searchBar,
            {
              backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'white',
              borderColor: isDark ? 'rgba(94,234,212,0.3)' : '#ddd6fe',
            }
          ]}>
            <Ionicons name="search-outline" size={20} color={isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'} />
            <TextInput
              style={[
                styles.searchInput,
                { color: isDark ? 'white' : 'black' }
              ]}
              placeholder="Search jobs, companies, skills…"
              placeholderTextColor={isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'}
              value={filters.search}
              onChangeText={(text) => updateFilter('search', text)}
            />
          </View>
        </View>

        {/* Filter Pills */}
        <View style={styles.filtersSection}>
          <TouchableOpacity
            style={[
              styles.filterPill,
              {
                backgroundColor: filters.company !== 'all' ? colors.primary : (isDark ? 'rgba(255,255,255,0.1)' : 'white'),
                borderColor: isDark ? 'rgba(94,234,212,0.3)' : '#ddd6fe',
              }
            ]}
            onPress={() => updateFilter('company', filters.company === 'all' ? companies[0] || 'all' : 'all')}
          >
            <Text style={[
              styles.filterPillText,
              { color: filters.company !== 'all' ? 'white' : (isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)') }
            ]}>
              Company: {filters.company === 'all' ? 'All' : filters.company}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterPill,
              {
                backgroundColor: filters.type !== 'all' ? colors.primary : (isDark ? 'rgba(255,255,255,0.1)' : 'white'),
                borderColor: isDark ? 'rgba(94,234,212,0.3)' : '#ddd6fe',
              }
            ]}
            onPress={() => updateFilter('type', filters.type === 'all' ? 'Full-time' : 'all')}
          >
            <Text style={[
              styles.filterPillText,
              { color: filters.type !== 'all' ? 'white' : (isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)') }
            ]}>
              Type: {filters.type === 'all' ? 'All' : filters.type}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterPill,
              {
                backgroundColor: filters.level !== 'all' ? colors.primary : (isDark ? 'rgba(255,255,255,0.1)' : 'white'),
                borderColor: isDark ? 'rgba(94,234,212,0.3)' : '#ddd6fe',
              }
            ]}
            onPress={() => updateFilter('level', filters.level === 'all' ? 'Entry' : 'all')}
          >
            <Text style={[
              styles.filterPillText,
              { color: filters.level !== 'all' ? 'white' : (isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)') }
            ]}>
              Level: {filters.level === 'all' ? 'All' : filters.level}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Jobs List */}
        <View style={styles.jobsSection}>
          {filteredJobs.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'} />
              <Text style={[
                styles.emptyText,
                { color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }
              ]}>
                No jobs match your filters.
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredJobs}
              renderItem={renderJobCard}
              keyExtractor={(item) => item._id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        {/* Job Details Modal */}
        <Modal
          visible={isJobModalOpen}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setJobModalOpen(false)}
        >
          <View style={[
            styles.modalContainer,
            { backgroundColor: isDark ? '#0a0f1e' : '#f8fafc' }
          ]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setJobModalOpen(false)}>
                <Ionicons name="close" size={24} color={isDark ? 'white' : 'black'} />
              </TouchableOpacity>
              <Text style={[
                styles.modalTitle,
                { color: isDark ? 'white' : 'black' }
              ]}>
                Job Details
              </Text>
              <View style={{ width: 24 }} />
            </View>

            {selectedJob && (
              <ScrollView style={styles.modalContent}>
                <Text style={[
                  styles.modalJobTitle,
                  { color: isDark ? 'white' : 'black' }
                ]}>
                  {selectedJob.title}
                </Text>
                <Text style={[
                  styles.modalCompany,
                  { color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)' }
                ]}>
                  {selectedJob.companyId?.name}
                </Text>
                
                {selectedJob.description && (
                  <View style={styles.modalSection}>
                    <Text style={[
                      styles.modalSectionTitle,
                      { color: isDark ? 'white' : 'black' }
                    ]}>
                      Description
                    </Text>
                    <Text style={[
                      styles.modalSectionText,
                      { color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)' }
                    ]}>
                      {selectedJob.description}
                    </Text>
                  </View>
                )}

                <View style={styles.modalSection}>
                  <Text style={[
                    styles.modalSectionTitle,
                    { color: isDark ? 'white' : 'black' }
                  ]}>
                    Job Details
                  </Text>
                  <View style={styles.detailRow}>
                    <Text style={[
                      styles.detailLabel,
                      { color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }
                    ]}>
                      Type:
                    </Text>
                    <Text style={[
                      styles.detailValue,
                      { color: isDark ? 'white' : 'black' }
                    ]}>
                      {selectedJob.type}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={[
                      styles.detailLabel,
                      { color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }
                    ]}>
                      Level:
                    </Text>
                    <Text style={[
                      styles.detailValue,
                      { color: isDark ? 'white' : 'black' }
                    ]}>
                      {selectedJob.level}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={[
                      styles.detailLabel,
                      { color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }
                    ]}>
                      Location:
                    </Text>
                    <Text style={[
                      styles.detailValue,
                      { color: isDark ? 'white' : 'black' }
                    ]}>
                      {selectedJob.location || 'Not specified'}
                    </Text>
                  </View>
                </View>

                {selectedJob.skills && selectedJob.skills.length > 0 && (
                  <View style={styles.modalSection}>
                    <Text style={[
                      styles.modalSectionTitle,
                      { color: isDark ? 'white' : 'black' }
                    ]}>
                      Required Skills
                    </Text>
                    <View style={styles.modalSkillsList}>
                      {selectedJob.skills.map((skill, index) => (
                        <Text key={index} style={[
                          styles.modalSkillTag,
                          { color: isDark ? '#5eead4' : '#9333ea' }
                        ]}>
                          {skill}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}

                <TouchableOpacity
                  style={[
                    styles.applyButton,
                    { backgroundColor: selectedJob.status === 'closed' ? '#ef4444' : colors.primary }
                  ]}
                  disabled={selectedJob.status === 'closed'}
                >
                  <Text style={styles.applyButtonText}>
                    {selectedJob.status === 'closed' ? 'Position Closed' : 'Apply Now'}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </Modal>
      </ScrollView>
    </MenteeLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  headerSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 24,
    marginBottom: 20,
  },
  highlight: {
    fontWeight: 'bold',
  },
  divider: {
    height: 6,
    width: 112,
    borderRadius: 3,
    alignSelf: 'flex-start',
  },
  searchSection: {
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  filtersSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 14,
    fontWeight: '500',
  },
  jobsSection: {
    flex: 1,
  },
  jobCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  companyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  companyLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5eead4',
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  industry: {
    fontSize: 14,
  },
  jobTitleSection: {
    marginBottom: 16,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    marginLeft: 4,
    fontSize: 14,
  },
  metaInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  metaTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  closedTag: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderColor: 'rgba(239,68,68,0.3)',
  },
  metaText: {
    fontSize: 12,
  },
  skillsSection: {
    marginTop: 8,
  },
  skillsLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalJobTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalCompany: {
    fontSize: 16,
    marginBottom: 24,
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  modalSectionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalSkillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modalSkillTag: {
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(94,234,212,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(94,234,212,0.3)',
  },
  applyButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

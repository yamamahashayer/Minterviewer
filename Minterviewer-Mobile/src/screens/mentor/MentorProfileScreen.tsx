import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  TouchableOpacity, 
  TextInput, 
  Alert, 
  Switch,
  Image,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import MentorLayout from '../../layouts/MentorLayout';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme';
import { mentorService } from '../../services/mentorService';

const { width } = Dimensions.get('window');

const MentorProfileScreen = () => {
  const { isDark } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const mentorId = user?.mentorId;
  
  const [profile, setProfile] = useState<any>(null);
  const [form, setForm] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'expertise' | 'sessions' | 'reviews'>('about');

  useEffect(() => {
    if (!isAuthenticated) {
      console.log('MentorProfileScreen: User not authenticated');
      return;
    }
    if (!mentorId) {
      console.log('MentorProfileScreen: No mentorId found for user:', user);
      setError('No mentor profile found. Please login as a mentor.');
      setLoading(false);
      return;
    }
    console.log('MentorProfileScreen: Loading profile for mentorId:', mentorId);
    loadProfile();
  }, [isAuthenticated, mentorId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await mentorService.getProfile(mentorId!);
      setProfile(response.profile);
      setForm(response.profile);
      setStats(response.stats);
      setError(null);
    } catch (err: any) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (key: string, value: any) => {
    setForm((prev: any) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    if (!isEditing || !mentorId) return;

    try {
      setSaving(true);
      await mentorService.updateProfile(mentorId, form);
      setProfile(form);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (err: any) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(profile);
    setIsEditing(false);
  };

  // Tag Display Component
  const TagDisplay = ({ items, title }: { items: any[]; title: string }) => (
    <View style={styles.infoField}>
      <Text style={[styles.fieldLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#4b5563' }]}>
        {title}
      </Text>
      <View style={styles.tagsContainer}>
        {Array.isArray(items) && items.map((item: any, index: number) => (
          <View key={index} style={[
            styles.tag,
            {
              backgroundColor: isDark ? 'rgba(59,130,246,0.2)' : 'rgba(99,102,241,0.25)',
              borderColor: isDark ? '#3b82f6' : '#6366f1',
              borderWidth: 1.5,
              shadowColor: isDark ? '#3b82f6' : '#6366f1',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 2,
            }
          ]}>
            <Text style={[styles.tagText, { color: isDark ? '#3b82f6' : '#6366f1' }]}>
              {typeof item === 'string' ? item : item.title || item.name || 'Item'}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  // Stat Item Component
  const StatItem = ({ icon, title, value }: { icon: string; title: string; value: string | number }) => (
    <View style={styles.statItem}>
      <View style={styles.statIcon}>
        <Ionicons 
          name={icon as any} 
          size={16} 
          color={isDark ? '#8b5cf6' : '#6366f1'} 
        />
      </View>
      <View>
        <Text style={[styles.statTitle, { color: isDark ? 'rgba(255,255,255,0.6)' : '#4b5563' }]}>
          {title}
        </Text>
        <Text style={[styles.statValue, { color: isDark ? 'white' : '#111827' }]}>
          {value}
        </Text>
      </View>
    </View>
  );

  const InfoField = ({ 
    label, 
    value, 
    editable = false, 
    onChangeText, 
    multiline = false,
    keyboardType = 'default',
    icon
  }: {
    label: string;
    value: string | number | undefined;
    editable?: boolean;
    onChangeText?: (text: string) => void;
    multiline?: boolean;
    keyboardType?: 'default' | 'url' | 'numeric';
    icon?: string;
  }) => (
    <View style={styles.infoField}>
      <View style={styles.fieldHeader}>
        {icon && (
          <Ionicons 
            name={icon as any} 
            size={16} 
            color={isDark ? '#8b5cf6' : '#6366f1'} 
            style={styles.fieldIcon}
          />
        )}
        <Text style={[styles.fieldLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#4b5563' }]}>
          {label}
        </Text>
      </View>
      {editable && onChangeText ? (
        <TextInput
          style={[
            styles.fieldInput,
            { 
              backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              color: isDark ? 'white' : '#111827',
              borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
              borderWidth: 1.5,
              shadowColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 2,
              height: multiline ? 80 : 44,
            }
          ]}
          value={value?.toString() || ''}
          onChangeText={onChangeText}
          multiline={multiline}
          keyboardType={keyboardType === 'url' ? 'url' : keyboardType === 'numeric' ? 'numeric' : 'default'}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
      ) : (
        <Text style={[styles.fieldValue, { color: isDark ? 'white' : '#111827' }]}>
          {value || 'Not specified'}
        </Text>
      )}
    </View>
  );

  // Tab Button Component
  const TabButton = ({ tab, title }: { tab: typeof activeTab; title: string }) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        { 
          backgroundColor: activeTab === tab 
            ? colors.primary 
            : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
          borderColor: activeTab === tab 
            ? colors.primary 
            : isDark ? 'rgba(255,255,255,0.2)' : 'rgba(99,102,241,0.2)',
          borderWidth: 1.5,
          shadowColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(99,102,241,0.1)',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 2,
        }
      ]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[
        styles.tabButtonText,
        { 
          color: activeTab === tab 
            ? 'white' 
            : isDark ? 'rgba(255,255,255,0.7)' : '#4b5563'
        }
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <MentorLayout>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280' }]}>
            Loading profile...
          </Text>
        </View>
      </MentorLayout>
    );
  }

  if (error) {
    return (
      <MentorLayout>
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadProfile}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </MentorLayout>
    );
  }

  return (
    <MentorLayout>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Polished Header */}
        <View style={[
          styles.header,
          {
            backgroundColor: isDark 
              ? 'rgba(30,41,59,0.95)' 
              : 'rgba(255,255,255,0.98)',
            borderColor: isDark ? 'rgba(59,130,246,0.4)' : 'rgba(99,102,241,0.3)',
            borderWidth: 1.5,
            shadowColor: isDark ? 'rgba(59,130,246,0.3)' : 'rgba(99,102,241,0.2)',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 16,
            elevation: 8,
          }
        ]}>
          {/* Background gradient effect */}
          <View style={[
            styles.backgroundBlob,
            { 
              backgroundColor: isDark ? 'rgba(59,130,246,0.2)' : 'rgba(99,102,241,0.15)',
              shadowColor: isDark ? 'rgba(59,130,246,0.4)' : 'rgba(99,102,241,0.3)',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
            }
          ]} />

          {/* Edit Actions */}
          <View style={styles.headerActions}>
            {!isEditing ? (
              <TouchableOpacity
                style={[
                  styles.editButton,
                  {
                    backgroundColor: colors.primary,
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 4,
                  }
                ]}
                onPress={() => setIsEditing(true)}
              >
                <Ionicons name="pencil" size={16} color="white" />
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.editActions}>
                <TouchableOpacity
                  style={[
                    styles.actionButton, 
                    styles.saveButton,
                    {
                      backgroundColor: '#10b981',
                      shadowColor: '#10b981',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 4,
                    }
                  ]}
                  onPress={handleSave}
                  disabled={saving}
                >
                  <Ionicons name="checkmark" size={16} color="white" />
                  <Text style={styles.actionButtonText}>{saving ? 'Saving...' : 'Save'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.actionButton, 
                    styles.cancelButton,
                    {
                      backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
                      borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
                      borderWidth: 1.5,
                    }
                  ]}
                  onPress={handleCancel}
                >
                  <Ionicons name="close" size={16} color={isDark ? 'white' : '#374151'} />
                  <Text style={[styles.actionButtonText, { color: isDark ? 'white' : '#374151' }]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Profile Info */}
          <View style={styles.profileInfo}>
            {/* Avatar */}
            <View style={styles.avatarContainer}>
              <View style={[
                styles.avatar,
                { 
                  borderColor: isDark ? '#3b82f6' : '#6366f1',
                  borderWidth: 4,
                  shadowColor: isDark ? '#3b82f6' : '#6366f1',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                  elevation: 6,
                }
              ]}>
                {profile?.profile_photo ? (
                  <Image source={{ uri: profile.profile_photo }} style={styles.avatarImage} />
                ) : (
                  <Text style={[styles.avatarFallback, { color: isDark ? 'white' : '#6b7280' }]}>
                    {profile?.full_name?.charAt(0)?.toUpperCase() || 'M'}
                  </Text>
                )}
              </View>
              {/* Award Badge */}
              <View style={[
                styles.awardBadge,
                {
                  backgroundColor: '#f59e0b',
                  shadowColor: '#f59e0b',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.4,
                  shadowRadius: 6,
                  elevation: 4,
                }
              ]}>
                <Ionicons name="trophy" size={14} color="white" />
              </View>
            </View>

            {/* Name and Details */}
            <View style={styles.profileDetails}>
              <View style={styles.nameRow}>
                {isEditing ? (
                  <TextInput
                    style={[
                      styles.nameInput,
                      {
                        backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.05)',
                        color: isDark ? 'white' : '#111827',
                        borderColor: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.2)',
                        borderWidth: 1.5,
                        shadowColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.15,
                        shadowRadius: 6,
                        elevation: 2,
                      }
                    ]}
                    value={form?.full_name || ''}
                    onChangeText={(text) => handleFieldChange('full_name', text)}
                  />
                ) : (
                  <Text style={[styles.profileName, { color: isDark ? 'white' : '#111827' }]}>
                    {profile?.full_name || 'Mentor'}
                  </Text>
                )}
                
                {/* Rating Badge */}
                <View style={[
                  styles.ratingBadge,
                  {
                    backgroundColor: isDark ? 'rgba(250,204,21,0.2)' : 'rgba(250,204,21,0.25)',
                    borderColor: isDark ? '#fbbf24' : '#f59e0b',
                    borderWidth: 1.5,
                    shadowColor: '#f59e0b',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 6,
                    elevation: 3,
                  }
                ]}>
                  <Ionicons name="trophy" size={14} color={isDark ? '#fbbf24' : '#f59e0b'} />
                  <Text style={[styles.ratingText, { color: isDark ? '#fbbf24' : '#f59e0b' }]}>
                    {stats?.rating?.toFixed(1) || '0.0'}
                  </Text>
                </View>
              </View>

              {/* Skills Preview */}
              <Text style={[styles.skillsPreview, { color: isDark ? 'rgba(255,255,255,0.8)' : '#4b5563' }]}>
                {(() => {
                  const expertise = Array.isArray(profile?.area_of_expertise) ? profile.area_of_expertise : [];
                  const focus = Array.isArray(profile?.focusAreas) ? profile.focusAreas : [];
                  const selected = [];
                  if (expertise.length > 0) selected.push(expertise[0]);
                  if (focus.length > 0) selected.push(focus[0]);
                  if (focus.length > 1) selected.push(focus[1]);
                  const remaining = expertise.length + focus.length - selected.length;
                  return selected.join(', ') + (remaining > 0 ? ` • +${remaining} more` : '');
                })()}
              </Text>

              {/* Experience and Location Badges */}
              <View style={styles.badgesRow}>
                <View style={[
                  styles.badge,
                  {
                    backgroundColor: isDark ? 'rgba(59,130,246,0.2)' : 'rgba(99,102,241,0.25)',
                    borderColor: isDark ? '#3b82f6' : '#6366f1',
                    borderWidth: 1.5,
                    shadowColor: isDark ? '#3b82f6' : '#6366f1',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 2,
                  }
                ]}>
                  <Text style={[styles.badgeText, { color: isDark ? '#3b82f6' : '#6366f1' }]}>
                    {profile?.yearsOfExperience || 0} yrs exp
                  </Text>
                </View>
                
                {profile?.Country && (
                  <View style={[
                    styles.badge,
                    {
                      backgroundColor: isDark ? 'rgba(59,130,246,0.2)' : 'rgba(99,102,241,0.25)',
                      borderColor: isDark ? '#3b82f6' : '#6366f1',
                      borderWidth: 1.5,
                      shadowColor: isDark ? '#3b82f6' : '#6366f1',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.25,
                      shadowRadius: 4,
                      elevation: 2,
                    }
                  ]}>
                    <Ionicons name="location" size={12} color={isDark ? '#3b82f6' : '#6366f1'} />
                    <Text style={[styles.badgeText, { color: isDark ? '#3b82f6' : '#6366f1' }]}>
                      {profile.Country}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Quick Stats */}
          <View style={styles.quickStats}>
            <StatItem icon="calendar" title="Sessions" value={stats?.sessions || 0} />
            <StatItem icon="people" title="Mentees" value={stats?.mentees || 0} />
            <StatItem icon="cash" title="Earned" value={`$${stats?.earned || 0}`} />
            <StatItem icon="time" title="Response" value={stats?.responseTime || '<2 hrs'} />
          </View>
        </View>

        {/* Polished Tabs */}
        <View style={styles.tabContainer}>
          <TabButton tab="about" title="About" />
          <TabButton tab="expertise" title="Expertise" />
          <TabButton tab="sessions" title="Sessions" />
          <TabButton tab="reviews" title="Reviews" />
        </View>

        {/* About Tab */}
        {activeTab === 'about' && (
          <View style={styles.tabContent}>
            {/* Bio Card */}
            <View style={[
              styles.card,
              {
                backgroundColor: isDark ? 'rgba(30,41,59,0.95)' : 'rgba(255,255,255,0.98)',
                borderColor: isDark ? 'rgba(94,234,212,0.3)' : 'rgba(147,51,234,0.2)',
                borderWidth: 1.5,
                shadowColor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(147,51,234,0.15)',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 12,
                elevation: 6,
              }
            ]}>
              <Text style={[styles.sectionTitle, { color: isDark ? 'white' : '#111827' }]}>Bio</Text>
              <InfoField
                label=""
                value={form?.short_bio || ''}
                editable={isEditing}
                onChangeText={(text) => handleFieldChange('short_bio', text)}
                multiline
              />
            </View>

            {/* Contact Information Card */}
            <View style={[
              styles.card,
              {
                backgroundColor: isDark ? 'rgba(30,41,59,0.95)' : 'rgba(255,255,255,0.98)',
                borderColor: isDark ? 'rgba(94,234,212,0.3)' : 'rgba(147,51,234,0.2)',
                borderWidth: 1.5,
                shadowColor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(147,51,234,0.15)',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 12,
                elevation: 6,
              }
            ]}>
              <Text style={[styles.sectionTitle, { color: isDark ? 'white' : '#111827' }]}>Contact Information</Text>
              <InfoField
                label="Email"
                value={form?.email || ''}
                icon="mail"
                editable={false}
              />
              <InfoField
                label="Phone"
                value={form?.phoneNumber || ''}
                icon="call"
                editable={isEditing}
                onChangeText={(text) => handleFieldChange('phoneNumber', text)}
                keyboardType="numeric"
              />
              <InfoField
                label="Location"
                value={form?.Country || ''}
                icon="location"
                editable={isEditing}
                onChangeText={(text) => handleFieldChange('Country', text)}
              />
            </View>

            {/* Social Links Card */}
            <View style={[
              styles.card,
              {
                backgroundColor: isDark ? 'rgba(30,41,59,0.95)' : 'rgba(255,255,255,0.98)',
                borderColor: isDark ? 'rgba(94,234,212,0.3)' : 'rgba(147,51,234,0.2)',
                borderWidth: 1.5,
                shadowColor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(147,51,234,0.15)',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 12,
                elevation: 6,
              }
            ]}>
              <Text style={[styles.sectionTitle, { color: isDark ? 'white' : '#111827' }]}>Social Links</Text>
              <InfoField
                label="LinkedIn"
                value={form?.linkedin_url || ''}
                icon="logo-linkedin"
                editable={isEditing}
                onChangeText={(text) => handleFieldChange('linkedin_url', text)}
                keyboardType="url"
              />
              <InfoField
                label="GitHub"
                value={form?.github || ''}
                icon="logo-github"
                editable={isEditing}
                onChangeText={(text) => handleFieldChange('github', text)}
                keyboardType="url"
              />
            </View>
          </View>
        )}

        {/* Expertise Tab */}
        {activeTab === 'expertise' && (
          <View style={styles.tabContent}>
            {/* Professional Details Card */}
            <View style={[
              styles.card,
              {
                backgroundColor: isDark ? 'rgba(30,41,59,0.95)' : 'rgba(255,255,255,0.98)',
                borderColor: isDark ? 'rgba(59,130,246,0.3)' : 'rgba(99,102,241,0.2)',
                borderWidth: 1.5,
                shadowColor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(99,102,241,0.15)',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 12,
                elevation: 6,
              }
            ]}>
              <Text style={[styles.sectionTitle, { color: isDark ? 'white' : '#111827' }]}>Professional Details</Text>
              
              <TagDisplay 
                items={Array.isArray(form?.area_of_expertise) ? form.area_of_expertise : []} 
                title="Areas of Expertise" 
              />
              
              <TagDisplay 
                items={Array.isArray(form?.focusAreas) ? form.focusAreas : []} 
                title="Focus Areas" 
              />
              
              <InfoField
                label="Hourly Rate ($)"
                value={form?.hourlyRate || ''}
                icon="cash"
                editable={isEditing}
                onChangeText={(text) => handleFieldChange('hourlyRate', text)}
                keyboardType="numeric"
              />
              
              <InfoField
                label="Years of Experience"
                value={form?.yearsOfExperience || ''}
                icon="briefcase"
                editable={isEditing}
                onChangeText={(text) => handleFieldChange('yearsOfExperience', text)}
                keyboardType="numeric"
              />
              
              <TagDisplay 
                items={Array.isArray(form?.languages) ? form.languages : []} 
                title="Languages" 
              />
              
              <TagDisplay 
                items={Array.isArray(form?.sessionTypes) ? form.sessionTypes : []} 
                title="Session Types" 
              />
              
              <TagDisplay 
                items={Array.isArray(form?.certifications) ? form.certifications : []} 
                title="Certifications" 
              />
              
              <TagDisplay 
                items={Array.isArray(form?.achievements) ? form.achievements : []} 
                title="Achievements" 
              />
            </View>
          </View>
        )}

        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <View style={styles.tabContent}>
            {/* Session Statistics Card */}
            <View style={[
              styles.card,
              {
                backgroundColor: isDark ? 'rgba(30,41,59,0.95)' : 'rgba(255,255,255,0.98)',
                borderColor: isDark ? 'rgba(59,130,246,0.3)' : 'rgba(99,102,241,0.2)',
                borderWidth: 1.5,
                shadowColor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(99,102,241,0.15)',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 12,
                elevation: 6,
              }
            ]}>
              <Text style={[styles.sectionTitle, { color: isDark ? 'white' : '#111827' }]}>Session Statistics</Text>
              
              <InfoField
                label="Total Sessions"
                value={stats?.sessions || '0'}
                icon="calendar"
                editable={false}
              />
              
              <InfoField
                label="Active Mentees"
                value={stats?.mentees || '0'}
                icon="people"
                editable={false}
              />
              
              <InfoField
                label="Total Earnings"
                value={`$${stats?.earned || '0'}`}
                icon="cash"
                editable={false}
              />
              
              <InfoField
                label="Response Time"
                value={stats?.responseTime || 'N/A'}
                icon="time"
                editable={false}
              />
            </View>
          </View>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <View style={styles.tabContent}>
            {/* Reviews Summary Card */}
            <View style={[
              styles.card,
              {
                backgroundColor: isDark ? 'rgba(30,41,59,0.95)' : 'rgba(255,255,255,0.98)',
                borderColor: isDark ? 'rgba(59,130,246,0.3)' : 'rgba(99,102,241,0.2)',
                borderWidth: 1.5,
                shadowColor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(99,102,241,0.15)',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 12,
                elevation: 6,
              }
            ]}>
              <Text style={[styles.sectionTitle, { color: isDark ? 'white' : '#111827' }]}>Reviews Summary</Text>
              
              <InfoField
                label="Average Rating"
                value={stats?.rating ? `${stats.rating.toFixed(1)} ⭐` : 'No ratings'}
                icon="trophy"
                editable={false}
              />
              
              <InfoField
                label="Total Reviews"
                value={stats?.reviewsCount || '0'}
                icon="chatbubble"
                editable={false}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </MentorLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },

  // Polished Header Styles
  header: {
    margin: 16,
    borderRadius: 16,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundBlob: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.6,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  editButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  saveButton: {
    backgroundColor: '#10b981',
  },
  cancelButton: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  actionButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },

  // Profile Info Styles
  profileInfo: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  awardBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f59e0b',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  profileDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  nameInput: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  ratingText: {
    fontWeight: '600',
    fontSize: 14,
  },
  skillsPreview: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Quick Stats Styles
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: width > 400 ? 'auto' : '50%',
    marginBottom: 16,
  },
  statIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statTitle: {
    fontSize: 12,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },

  // Tab Styles
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  tabButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },

  // Tab Content
  tabContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 16,
  },

  // Card Styles
  card: {
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  // Section Styles
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },

  // Info Field Styles
  infoField: {
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldIcon: {
    marginRight: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  fieldInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  fieldValue: {
    fontSize: 16,
    lineHeight: 24,
  },

  // Tag Styles
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default MentorProfileScreen;

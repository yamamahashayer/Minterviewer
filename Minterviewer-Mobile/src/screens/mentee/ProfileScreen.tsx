import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

import MenteeLayout from "../../layouts/MenteeLayout";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { colors } from "../../theme";
import { menteeService } from "../../services/menteeService";

/* ================= TYPES ================= */

type ApiUser = {
  github?: string;
  linkedin_url?: string;
  full_name?: string;
  email?: string;
  short_bio?: string;
  phoneNumber?: string;
  Country?: string;
  area_of_expertise?: string[];
};

type ApiMentee = {
  overall_score?: number;
  total_interviews?: number;
  joined_date?: string;
  active?: boolean;
  phone?: string;
  location?: string;
  education?: string;
  company?: string;
  skills?: { name: string; level: number }[];
};

interface Profile {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  joinedDate: string;
  company: string;
  education: string;
  active: boolean;
  skills: { name: string; level: number }[];
  area_of_expertise: string[];
  linkedin: string;
  github: string;
}

const EDITABLE_KEYS = [
  "name",
  "bio",
  "phone",
  "location",
  "linkedin",
  "github",
  "area_of_expertise",
] as const;

/* ================= SCREEN ================= */

export default function ProfileScreen() {
  const { isDark } = useTheme();
  const { user, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const menteeId = user?.menteeId;

  // Debug logging
  console.log('ProfileScreen Debug:', { user, isAuthenticated, menteeId });

  const [profile, setProfile] = useState<Profile>({
    name: "—",
    title: "Mentee",
    bio: "Passionate learner on Minterviewer.",
    email: "—",
    phone: "—",
    location: "—",
    joinedDate: "—",
    company: "—",
    education: "—",
    active: true,
    skills: [],
    area_of_expertise: [],
    linkedin: "",
    github: "",
  });

  const [editedProfile, setEditedProfile] = useState<Profile>(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  /* ================= HELPERS ================= */

  function diff(next: Record<string, any>, prev: Record<string, any>) {
    const changed: Record<string, any> = {};
    for (const key of EDITABLE_KEYS) {
      if (next[key] !== prev[key]) changed[key] = next[key];
    }
    return changed;
  }

  function formatActivityDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    }
  }

  
  /* ================= LOAD PROFILE ================= */

  useEffect(() => {
    if (!isAuthenticated) {
      console.log('ProfileScreen: Not authenticated');
      setLoading(false);
      return;
    }

    if (!menteeId) {
      console.log('ProfileScreen: No menteeId found, user:', user);
      setError('No mentee ID found. Please log out and log back in.');
      setLoading(false);
      return;
    }

    (async () => {
      try {
        console.log('ProfileScreen: Loading profile for menteeId:', menteeId);
        setLoading(true);

        const { user, mentee } = await menteeService.getProfile(menteeId);
        console.log('ProfileScreen: Profile data received:', { user, mentee });

        const joined = mentee?.joined_date
          ? new Date(mentee.joined_date).toLocaleString("en-US", {
              month: "long",
              year: "numeric",
            })
          : "—";

        const mapped: Profile = {
          name: user?.full_name ?? "—",
          title: "Mentee",
          bio: user?.short_bio ?? "Passionate learner on Minterviewer.",
          email: user?.email ?? "—",
          phone: user?.phoneNumber ?? mentee?.phone ?? "—",
          location: user?.Country ?? mentee?.location ?? "—",
          joinedDate: joined,
          company: mentee?.company ?? "—",
          education: mentee?.education ?? "—",
          skills: mentee?.skills ?? [],
          active: mentee?.active ?? true,
          area_of_expertise: user?.area_of_expertise ?? [],
          linkedin: user?.linkedin_url ?? "",
          github: user?.github ?? "",
        };

        setProfile(mapped);
        setEditedProfile(mapped);
        setError(null);
      } catch (e: any) {
        console.error('ProfileScreen: Error loading profile:', e);
        setError(`Failed to load profile: ${e.message || String(e)}`);
      } finally {
        setLoading(false);
      }
    })();
  }, [isAuthenticated, menteeId, user]);

  /* ================= LOAD ACTIVITIES ================= */

  useEffect(() => {
    if (!isAuthenticated || !menteeId) return;

    (async () => {
      try {
        setActivitiesLoading(true);
        const j = await menteeService.getActivities(menteeId);
        setActivities(j?.items || []);
      } finally {
        setActivitiesLoading(false);
      }
    })();
  }, [isAuthenticated, menteeId]);

  /* ================= ACTIONS ================= */

  const handleSave = async () => {
    if (!menteeId) return;

    const changed = diff(editedProfile, profile);
    if (!Object.keys(changed).length) {
      setIsEditing(false);
      return;
    }

    try {
      const updated = await menteeService.updateProfile(menteeId, changed);

      const mapped: Profile = {
        name: updated.user?.full_name ?? "—",
        title: "Mentee",
        bio: updated.user?.short_bio ?? "Passionate learner on Minterviewer.",
        email: updated.user?.email ?? "—",
        phone: updated.user?.phoneNumber ?? updated.mentee?.phone ?? "—",
        location: updated.user?.Country ?? updated.mentee?.location ?? "—",
        joinedDate: updated.mentee?.joined_date
          ? new Date(updated.mentee.joined_date).toLocaleString("en-US", {
              month: "long",
              year: "numeric",
            })
          : "—",
        company: updated.mentee?.company ?? "—",
        education: updated.mentee?.education ?? "—",
        skills: updated.mentee?.skills ?? [],
        active: updated.mentee?.active ?? true,
        area_of_expertise: updated.user?.area_of_expertise ?? [],
        linkedin: updated.user?.linkedin_url ?? "",
        github: updated.user?.github ?? "",
      };

      setProfile(mapped);
      setEditedProfile(mapped);
      setIsEditing(false);
    } catch (err) {
      Alert.alert("Error", "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  /* ================= STATES ================= */

  if (loading) {
    return (
      <MenteeLayout>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, themedText(isDark)]}>Loading...</Text>
        </View>
      </MenteeLayout>
    );
  }

  if (error) {
    return (
      <MenteeLayout>
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: colors.danger }]}>
            Failed to load profile: {error}
          </Text>
        </View>
      </MenteeLayout>
    );
  }

  /* ================= UI ================= */

  return (
    <MenteeLayout>
      <ScrollView 
        style={[styles.container, { backgroundColor: isDark ? '#0f172a' : '#f5f3ff' }]} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* HEADER SECTION */}
        <View style={[styles.headerCard, themedCard(isDark)]}>
          <View style={styles.headerContent}>
            <View style={styles.profileHeader}>
              <View style={styles.profileInfo}>
                {isEditing ? (
                  <TextInput
                    style={[styles.profileName, themedText(isDark), { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', borderRadius: 8, paddingHorizontal: 12 }]}
                    value={editedProfile.name}
                    onChangeText={(v) =>
                      setEditedProfile({ ...editedProfile, name: v })
                    }
                    placeholder="Your name"
                    placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                  />
                ) : (
                  <Text style={[styles.profileName, themedText(isDark)]}>
                    {profile.name}
                  </Text>
                )}
                <Text style={[styles.profileRole, themedText(isDark)]}>
                  {profile.title}
                </Text>
                <Text style={[styles.profileEmail, themedText(isDark)]}>
                  {profile.email}
                </Text>
              </View>
              
              <TouchableOpacity
                style={[styles.editButton, { backgroundColor: isEditing ? "#10b981" : colors.primary }]}
                onPress={isEditing ? handleSave : () => setIsEditing(true)}
              >
                <Ionicons 
                  name={isEditing ? "checkmark" : "create-outline"} 
                  size={20} 
                  color="#fff" 
                />
              </TouchableOpacity>
            </View>

            <View style={styles.bioSection}>
              <Text style={[styles.sectionLabel, themedText(isDark)]}>Bio</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.bioText, themedText(isDark), { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', borderRadius: 8, paddingHorizontal: 12, textAlignVertical: 'top' }]}
                  multiline
                  value={editedProfile.bio}
                  onChangeText={(v) =>
                    setEditedProfile({ ...editedProfile, bio: v })
                  }
                  placeholder="Tell us about yourself..."
                  placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                />
              ) : (
                <Text style={[styles.bioText, themedText(isDark)]}>
                  {profile.bio}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* INFO GRID */}
        <View style={styles.infoGrid}>
          <View style={[styles.infoCard, themedCard(isDark)]}>
            <Ionicons name="call-outline" size={20} color={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, themedText(isDark)]}>Phone</Text>
              <Text style={[styles.infoValue, themedText(isDark)]}>
                {profile.phone}
              </Text>
            </View>
          </View>

          <View style={[styles.infoCard, themedCard(isDark)]}>
            <Ionicons name="location-outline" size={20} color={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, themedText(isDark)]}>Location</Text>
              <Text style={[styles.infoValue, themedText(isDark)]}>
                {profile.location}
              </Text>
            </View>
          </View>

          <View style={[styles.infoCard, themedCard(isDark)]}>
            <Ionicons name="business-outline" size={20} color={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, themedText(isDark)]}>Company</Text>
              <Text style={[styles.infoValue, themedText(isDark)]}>
                {profile.company}
              </Text>
            </View>
          </View>

          <View style={[styles.infoCard, themedCard(isDark)]}>
            <Ionicons name="school-outline" size={20} color={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, themedText(isDark)]}>Education</Text>
              <Text style={[styles.infoValue, themedText(isDark)]}>
                {profile.education}
              </Text>
            </View>
          </View>

          <View style={[styles.infoCard, themedCard(isDark)]}>
            <Ionicons name="calendar-outline" size={20} color={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, themedText(isDark)]}>Joined</Text>
              <Text style={[styles.infoValue, themedText(isDark)]}>
                {profile.joinedDate}
              </Text>
            </View>
          </View>

          <View style={[styles.infoCard, themedCard(isDark)]}>
            <Ionicons name="checkmark-circle-outline" size={20} color={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, themedText(isDark)]}>Status</Text>
              <Text style={[styles.infoValue, themedText(isDark)]}>
                {profile.active ? "Active" : "Inactive"}
              </Text>
            </View>
          </View>
        </View>

        {/* SKILLS SECTION */}
        <View style={[styles.sectionCard, themedCard(isDark)]}>
          <Text style={[styles.sectionTitle, themedText(isDark)]}>Skills</Text>
          {profile.skills.length ? (
            <View style={styles.skillsContainer}>
              {profile.skills.map((skill, i) => (
                <View key={i} style={styles.skillItem}>
                  <View style={styles.skillHeader}>
                    <Text style={[styles.skillName, themedText(isDark)]}>
                      {skill.name}
                    </Text>
                    <Text style={[styles.skillLevel, themedText(isDark)]}>
                      {skill.level}%
                    </Text>
                  </View>
                  <View style={[styles.skillBar, { backgroundColor: isDark ? '#374151' : '#e5e7eb' }]}>
                    <View
                      style={[
                        styles.skillBarFill,
                        { width: `${skill.level}%`, backgroundColor: colors.primary },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="code-outline" size={40} color={isDark ? '#6b7280' : '#9ca3af'} />
              <Text style={[styles.emptyText, themedText(isDark)]}>
                No skills added yet
              </Text>
            </View>
          )}
        </View>

        {/* EXPERTISE SECTION */}
        {profile.area_of_expertise.length > 0 && (
          <View style={[styles.sectionCard, themedCard(isDark)]}>
            <Text style={[styles.sectionTitle, themedText(isDark)]}>Areas of Expertise</Text>
            <View style={styles.expertiseContainer}>
              {profile.area_of_expertise.map((area, i) => (
                <View key={i} style={[styles.expertiseTag, { backgroundColor: `${colors.primary}20`, borderColor: isDark ? `${colors.primary}40` : `${colors.primary}30` }]}>
                  <Text style={[styles.expertiseText, { color: colors.primary }]}>
                    {area}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* SOCIAL LINKS */}
        {(profile.linkedin || profile.github) && (
          <View style={[styles.sectionCard, themedCard(isDark)]}>
            <Text style={[styles.sectionTitle, themedText(isDark)]}>Social Links</Text>
            <View style={styles.socialContainer}>
              {profile.linkedin && (
                <TouchableOpacity style={styles.socialLink}>
                  <Ionicons name="logo-linkedin" size={24} color="#0077b5" />
                  <Text style={[styles.socialText, themedText(isDark)]}>
                    LinkedIn
                  </Text>
                </TouchableOpacity>
              )}
              {profile.github && (
                <TouchableOpacity style={styles.socialLink}>
                  <Ionicons name="logo-github" size={24} color="#333" />
                  <Text style={[styles.socialText, themedText(isDark)]}>
                    GitHub
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* ACTIVITY SECTION */}
        <View style={[styles.sectionCard, themedCard(isDark)]}>
          <Text style={[styles.sectionTitle, themedText(isDark)]}>
            Recent Activity
          </Text>

          {activitiesLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={[styles.loadingText, themedText(isDark)]}>
                Loading activity...
              </Text>
            </View>
          ) : activities.length ? (
            <View style={styles.timelineContainer}>
              {/* Timeline Line */}
              <View style={[styles.timelineLine, { backgroundColor: isDark ? '#374151' : '#e5e7eb' }]} />
              
              {/* Activity Items */}
              {activities.map((activity, i) => (
                <View key={i} style={styles.timelineItem}>
                  {/* Timeline Dot */}
                  <View style={[styles.timelineDot, { backgroundColor: isDark ? '#1f2937' : '#fff', borderColor: isDark ? '#374151' : '#e5e7eb' }]}>
                    <View style={[styles.timelineDotInner, { backgroundColor: colors.primary }]} />
                  </View>
                  
                  {/* Activity Card */}
                  <View style={[styles.activityCard, themedCard(isDark)]}>
                    {/* Activity Header */}
                    <View style={styles.activityHeader}>
                      <View style={styles.activityIcon}>
                        <Ionicons
                          name="flash-outline"
                          size={20}
                          color={colors.primary}
                        />
                      </View>
                      <View style={styles.activityMeta}>
                        <Text style={[styles.activityTitle, themedText(isDark)]}>
                          {activity.title || "New Activity"}
                        </Text>
                        {activity.createdAt && (
                          <Text style={[styles.activityTime, themedText(isDark)]}>
                            {formatActivityDate(activity.createdAt)}
                          </Text>
                        )}
                      </View>
                    </View>
                    
                    {/* Activity Description */}
                    <Text style={[styles.activityDescription, themedText(isDark)]}>
                      {activity.description || "You have a new update"}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="time-outline" size={40} color={isDark ? '#6b7280' : '#9ca3af'} />
              <Text style={[styles.emptyText, themedText(isDark)]}>
                No recent activity
              </Text>
            </View>
          )}
        </View>

      </ScrollView>
    </MenteeLayout>
  );
}

/* ================= STYLES ================= */

const themedCard = (isDark: boolean) => ({
  backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#fff",
  borderColor: isDark ? "rgba(94,234,212,0.2)" : "#ddd6fe",
});

const themedText = (isDark: boolean) => ({
  color: isDark ? colors.text.primaryDark : colors.text.primaryLight,
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  
  // Header Card
  headerCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: { flex: 1 },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  profileInfo: { flex: 1 },
  profileName: { 
    fontSize: 28, 
    fontWeight: "bold", 
    marginBottom: 4,
    lineHeight: 32,
  },
  profileRole: { 
    fontSize: 16, 
    fontWeight: "500",
    marginBottom: 4,
    opacity: 0.8,
  },
  profileEmail: { 
    fontSize: 14, 
    opacity: 0.7,
    marginBottom: 8,
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  bioSection: { marginTop: 16 },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    opacity: 0.7,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  bioText: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "left",
  },

  // Info Grid
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  infoCard: {
    width: "48%",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  infoContent: { marginLeft: 12, flex: 1 },
  infoLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 2,
    opacity: 0.6,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
  },

  // Section Cards
  sectionCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    lineHeight: 24,
  },

  // Skills
  skillsContainer: { gap: 16 },
  skillItem: { gap: 8 },
  skillHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skillName: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  skillLevel: {
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.8,
  },
  skillBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  skillBarFill: { 
    height: "100%",
    borderRadius: 4,
  },

  // Expertise Tags
  expertiseContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  expertiseTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  expertiseText: {
    fontSize: 13,
    fontWeight: "500",
  },

  // Social Links
  socialContainer: {
    flexDirection: "row",
    gap: 16,
  },
  socialLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  socialText: {
    fontSize: 14,
    fontWeight: "500",
  },

  // Activity - Timeline Styles
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
  },
  loadingText: {
    fontSize: 14,
    marginTop: 12,
    opacity: 0.7,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  timelineContainer: {
    position: "relative",
    paddingLeft: 24,
  },
  timelineLine: {
    position: "absolute",
    left: 12,
    top: 0,
    bottom: 0,
    width: 2,
  },
  timelineItem: {
    position: "relative",
    marginBottom: 20,
  },
  timelineDot: {
    position: "absolute",
    left: -12,
    top: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  timelineDotInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  activityCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  activityHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityMeta: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    lineHeight: 20,
  },
  activityTime: {
    fontSize: 12,
    lineHeight: 16,
    opacity: 0.6,
  },
  activityDescription: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },

  // Legacy activity styles (kept for backward compatibility)
  activityContainer: { gap: 12 },
  activityItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 8,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#6366f1",
    marginTop: 6,
  },
  activityText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },

  // Empty States
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: "center",
  },

  // Legacy styles for backward compatibility
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  name: { fontSize: 22, fontWeight: "bold" },
  subtitle: { opacity: 0.7 },
  bio: { marginTop: 8, lineHeight: 20 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  bar: {
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 3,
    overflow: "hidden",
  },
  barFill: { height: "100%" },
  empty: { fontStyle: "italic", opacity: 0.7 },
});

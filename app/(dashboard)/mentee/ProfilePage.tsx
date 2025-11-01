"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Mail, Phone, MapPin, Calendar, Briefcase, GraduationCap,
  Edit2, Save, X, Trophy, Target, TrendingUp, Award,
  CheckCircle2, Clock
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";

type Theme = "dark" | "light";

type ApiUser = {
  _id: string;
  full_name?: string;
  email?: string;
  role?: string;
  created_at?: string;
};

type ApiMentee = {
  _id: string;
  user: string;
  overall_score: number;
  total_interviews: number;
  points_earned: number;
  joined_date?: string; // ISO
  active: boolean;
};

const EDITABLE_KEYS = ["name", "bio", "email", "phone", "location"] as const;
type EditableKey = typeof EDITABLE_KEYS[number];
function diff(next: Record<string, any>, prev: Record<string, any>) {
  const changed: Record<string, any> = {};
  for (const k of EDITABLE_KEYS) {
    if (next[k] !== prev[k]) changed[k] = next[k];
  }
  return changed;
}

export default function ProfilePage({ theme = "dark" }: { theme?: Theme }) {
  const isDark = theme === "dark";
  const router = useRouter();
  const params = useParams() as { userId?: string };

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // بيانات العرض/التحرير
  const [profile, setProfile] = useState({
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
  });
  const [editedProfile, setEditedProfile] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);

  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState([
    { label: "Total Interviews", value: "0", change: "", icon: CheckCircle2 },
    { label: "Average Score", value: "—", change: "", icon: TrendingUp },
    { label: "Time Invested", value: "—", change: "", icon: Clock },
    { label: "Achievements", value: "—", change: "", icon: Trophy },
  ]);

  const skills = [
    { name: "React", level: 95 },
    { name: "Python", level: 90 },
    { name: "TypeScript", level: 88 },
    { name: "Node.js", level: 85 },
    { name: "AI/ML", level: 80 },
    { name: "System Design", level: 82 },
  ];
  const achievements = [
    { id: 1, title: "Interview Master", description: "Completed 50+ AI interviews", icon: Trophy, color: "text-amber-400" },
    { id: 2, title: "Top Performer", description: "Ranked in top 10% this month", icon: Award, color: "text-teal-400" },
    { id: 3, title: "Streak Champion", description: "15-day practice streak", icon: Target, color: "text-emerald-400" },
    { id: 4, title: "Quick Learner", description: "Improved score by 40%", icon: TrendingUp, color: "text-violet-400" },
  ];
  const recentActivities = [
    { id: 1, title: "System Design Interview", time: "2 hours ago", score: "9.2/10", status: "completed" },
    { id: 2, title: "Behavioral Interview Practice", time: "Yesterday", score: "8.8/10", status: "completed" },
    { id: 3, title: "Coding Challenge", time: "2 days ago", score: "9.5/10", status: "completed" },
    { id: 4, title: "Mock Technical Interview", time: "3 days ago", score: "8.5/10", status: "completed" },
  ];

  useEffect(() => {
    const fromUrl = params?.userId;
    if (fromUrl) { setUserId(fromUrl); return; }

    try {
      const raw = typeof window !== "undefined" ? sessionStorage.getItem("user") : null;
      if (!raw) { router.replace("/login"); return; }
      const u = JSON.parse(raw);
      const id = u?.id || u?._id;
      if (!id) { router.replace("/login"); return; }
      setUserId(id);
    } catch {
      router.replace("/login");
    }
  }, [params?.userId]);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        setLoading(true);
        const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null;

        const r = await fetch(`/api/mentees/${userId}/profile`, {
          cache: "no-store",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!r.ok) throw new Error(await r.text());

        const { user, mentee }: { user: ApiUser; mentee: ApiMentee | null } = await r.json();

        const joined =
          mentee?.joined_date
            ? new Date(mentee.joined_date).toLocaleString("en-US", { month: "long", year: "numeric" })
            : "—";

        const mapped = {
          name: user?.full_name ?? "—",
          title: "Mentee",
          bio: "Passionate learner on Minterviewer.",
          email: user?.email ?? "—",
          phone: "—",
          location: "—",
          joinedDate: joined,
          company: "—",
          education: "—",
          active: mentee?.active ?? true,
        };

        setProfile(mapped);
        setEditedProfile(mapped);

        const avg = mentee?.overall_score ?? 0;
        setStats([
          { label: "Total Interviews", value: String(mentee?.total_interviews ?? 0), change: "", icon: CheckCircle2 },
          { label: "Average Score", value: avg ? `${avg.toFixed(1)}/10` : "—", change: "", icon: TrendingUp },
          { label: "Time Invested", value: "—", change: "", icon: Clock },
          { label: "Achievements", value: "—", change: "", icon: Trophy },
        ]);

        setErr(null);
      } catch (e: any) {
        setErr(e?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  useEffect(() => {
    setHasChanges(Object.keys(diff(editedProfile, profile)).length > 0);
  }, [editedProfile, profile]);

  const handleSave = async () => {
    if (!userId) return;

    const changed = diff(editedProfile, profile);
    if (Object.keys(changed).length === 0) {
      setIsEditing(false);
      return;
    }

    try {
      setSaving(true);
      const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null;

      const res = await fetch(`/api/mentees/${userId}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ profile: changed }),
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Failed to save");
      }

      const updated = { ...profile, ...changed };
      setProfile(updated);
      setEditedProfile(updated);
      setIsEditing(false);
    } catch (e) {
      alert("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  if (loading) return <div className={`min-h-screen p-8 ${isDark ? "text-white" : ""}`}>Loading…</div>;
  if (err) return <div className="min-h-screen p-8 text-red-500">Failed: {err}</div>;

  return (
    <div className={`min-h-screen p-8 ${isDark ? "bg-gradient-to-b from-[#0a0f1e] to-[#000000]" : "bg-[#f5f3ff]"}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className={isDark ? "text-white" : "text-[#2e1065]"} style={{ marginBottom: "0.5rem", fontWeight: 700 }}>
          Welcome to Minterviewer, {(profile.name.split(" ")[0] || "Mentee")} 👋
        </h1>
        <div
          className={`h-1 w-[200px] rounded-full mt-4 ${
            isDark
              ? "bg-gradient-to-r from-[#5eead4] to-transparent shadow-[0_0_10px_rgba(94,234,212,0.5)]"
              : "bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-transparent shadow-[0_0_15px_rgba(124,58,237,0.4)]"
          }`}
        />
      </div>

      {/* Profile Header Card */}
      <div
        className={`${
          isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]" : "bg-white shadow-lg"
        } border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-2xl p-8 mb-6 backdrop-blur-sm`}
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-6">
            <div
              className={`w-24 h-24 rounded-full bg-gradient-to-br ${
                isDark ? "from-teal-300 to-emerald-400" : "from-purple-400 to-pink-500"
              } flex items-center justify-center text-white shadow-lg`}
            >
              <span className="text-4xl">{(profile.name || "M")[0]}</span>
            </div>
            <div>
              {isEditing ? (
                <>
                  <Input
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                    className={`mb-2 ${
                      isDark
                        ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white"
                        : "bg-white border-[#ddd6fe] text-[#2e1065]"
                    }`}
                  />
                  <Input
                    value={profile.title}
                    readOnly
                    className={`mb-3 ${
                      isDark
                        ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white"
                        : "bg-white border-[#ddd6fe] text-[#2e1065]"
                    }`}
                  />
                </>
              ) : (
                <>
                  <h2 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-1 font-bold`}>{profile.name}</h2>
                  <p className={`${isDark ? "text-teal-300" : "text-purple-600"} mb-3 font-medium`}>{profile.title}</p>
                </>
              )}
              <div className="flex gap-2">
                <Badge
                  className={
                    isDark
                      ? "bg-[rgba(94,234,212,0.2)] text-teal-300 border-[rgba(94,234,212,0.3)]"
                      : "bg-purple-100 text-purple-700 border-purple-300 font-semibold"
                  }
                >
                  {profile.active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className={
                  isDark
                    ? "bg-[rgba(94,234,212,0.2)] hover:bg-[rgba(94,234,212,0.3)] text-teal-300 border border-[rgba(94,234,212,0.3)]"
                    : "bg-white hover:bg-purple-50 text-purple-700 border-2 border-[#ddd6fe] hover:border-[#a855f7] font-medium shadow-sm"
                }
              >
                <Edit2 size={16} className="mr-2" />
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleSave}
                  disabled={!hasChanges || saving}
                  className={
                    isDark
                      ? "bg-teal-500 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white"
                      : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold shadow-md"
                  }
                >
                  <Save size={16} className="mr-2" />
                  {saving ? "Saving..." : "Save"}
                </Button>
                <Button
                  onClick={handleCancel}
                  disabled={saving}
                  className={
                    isDark
                      ? "bg-[rgba(220,38,38,0.2)] hover:bg-[rgba(220,38,38,0.3)] disabled:opacity-50 text-red-400 border border-[rgba(220,38,38,0.3)]"
                      : "bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-700 border-2 border-red-300 font-medium"
                  }
                >
                  <X size={16} className="mr-2" />
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Bio */}
        {isEditing ? (
          <Textarea
            value={editedProfile.bio}
            onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
            className={`min-h-[80px] ${
              isDark
                ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white"
                : "bg-white border-[#ddd6fe] text-[#2e1065]"
            }`}
          />
        ) : (
          <p className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} mb-6 leading-relaxed`}>{profile.bio}</p>
        )}

        {/* Contact Info */}
        <div
          className={`grid grid-cols-2 gap-4 pt-6 border-t ${
            isDark ? "border-[rgba(94,234,212,0.1)]" : "border-[#ddd6fe]"
          }`}
        >
          {/* Email */}
          <div className="flex items-center gap-3">
            <Mail size={18} className={isDark ? "text-teal-300" : "text-purple-600"} />
            {isEditing ? (
              <Input
                value={editedProfile.email}
                onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                className={`flex-1 ${
                  isDark
                    ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white"
                    : "bg-white border-[#ddd6fe] text-[#2e1065]"
                }`}
              />
            ) : (
              <span className={isDark ? "text-[#99a1af]" : "text-[#6b21a8]"}>{profile.email}</span>
            )}
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3">
            <Phone size={18} className={isDark ? "text-teal-300" : "text-purple-600"} />
            {isEditing ? (
              <Input
                value={editedProfile.phone}
                onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                className={`flex-1 ${
                  isDark
                    ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white"
                    : "bg-white border-[#ddd6fe] text-[#2e1065]"
                }`}
              />
            ) : (
              <span className={isDark ? "text-[#99a1af]" : "text-[#6b21a8]"}>{profile.phone}</span>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center gap-3">
            <MapPin size={18} className={isDark ? "text-teal-300" : "text-purple-600"} />
            {isEditing ? (
              <Input
                value={editedProfile.location}
                onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                className={`flex-1 ${
                  isDark
                    ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white"
                    : "bg-white border-[#ddd6fe] text-[#2e1065]"
                }`}
              />
            ) : (
              <span className={isDark ? "text-[#99a1af]" : "text-[#6b21a8]"}>{profile.location}</span>
            )}
          </div>

          {/* Joined */}
          <div className="flex items-center gap-3">
            <Calendar size={18} className={isDark ? "text-teal-300" : "text-purple-600"} />
            <span className={isDark ? "text-[#99a1af]" : "text-[#6b21a8]"}>Joined {profile.joinedDate}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon as any;
          return (
            <div
              key={index}
              className={`${
                isDark
                  ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]"
                  : "bg-white shadow-lg"
              } border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm ${
                isDark ? "hover:border-[rgba(94,234,212,0.4)]" : "hover:border-[#a855f7] hover:shadow-xl"
              } transition-all`}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className={isDark ? "text-teal-300" : "text-purple-600"} size={24} />
              </div>
              <div className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-1 font-bold text-xl`}>{stat.value}</div>
              <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-xs mb-2`}>{stat.label}</p>
              {stat.change && (
                <p className={`${isDark ? "text-emerald-400" : "text-green-600"} text-xs font-semibold`}>{stat.change}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Skills & Experience */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skills */}
          <div
            className={`${
              isDark
                ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]"
                : "bg-white shadow-lg"
            } border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm`}
          >
            <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-6 flex items-center gap-2 font-semibold`}>
              <Target className={isDark ? "text-teal-300" : "text-purple-600"} size={20} />
              Skills & Expertise
            </h3>
            <div className="space-y-4">
              {skills.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} font-medium`}>{skill.name}</span>
                    <span className={`${isDark ? "text-teal-300" : "text-purple-600"} font-bold`}>{skill.level}%</span>
                  </div>
                  <div
                    className={`h-2 ${isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-purple-100"} rounded-full overflow-hidden`}
                  >
                    <div
                      className={`h-full bg-gradient-to-r ${
                        isDark ? "from-teal-300 to-emerald-400" : "from-purple-600 to-pink-600"
                      } rounded-full transition-all duration-500`}
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Experience & Education */}
          <div
            className={`${
              isDark
                ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]"
                : "bg-white shadow-lg"
            } border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm`}
          >
            <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-6 flex items-center gap-2 font-semibold`}>
              <Briefcase className={isDark ? "text-teal-300" : "text-purple-600"} size={20} />
              Professional Background
            </h3>
            <div className="space-y-4">
              <div
                className={`flex items-start gap-4 pb-4 border-b ${
                  isDark ? "border-[rgba(94,234,212,0.1)]" : "border-[#ddd6fe]"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${
                    isDark ? "from-teal-300 to-emerald-400" : "from-purple-400 to-pink-500"
                  } flex items-center justify-center text-white shrink-0`}
                >
                  <Briefcase size={20} />
                </div>
                <div className="flex-1">
                  {isEditing ? (
                    <Input
                      value={editedProfile.company}
                      onChange={(e) => setEditedProfile({ ...editedProfile, company: e.target.value })}
                      className={`mb-2 ${
                        isDark
                          ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white"
                          : "bg-white border-[#ddd6fe] text-[#2e1065]"
                      }`}
                    />
                  ) : (
                    <>
                      <h4 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-1 font-semibold`}>{profile.title}</h4>
                      <p className={`${isDark ? "text-teal-300" : "text-purple-600"} mb-2 font-medium`}>{profile.company}</p>
                      <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-xs`}>2022 - Present</p>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${
                    isDark ? "from-violet-400 to-purple-500" : "from-pink-400 to-rose-500"
                  } flex items-center justify-center text-white shrink-0`}
                >
                  <GraduationCap size={20} />
                </div>
                <div className="flex-1">
                  {isEditing ? (
                    <Input
                      value={editedProfile.education}
                      onChange={(e) => setEditedProfile({ ...editedProfile, education: e.target.value })}
                      className={`${
                        isDark
                          ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white"
                          : "bg-white border-[#ddd6fe] text-[#2e1065]"
                      }`}
                    />
                  ) : (
                    <>
                      <h4 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-1 font-semibold`}>
                        {profile.education}
                      </h4>
                      <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-xs`}>2018 - 2022</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div
            className={`${
              isDark
                ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]"
                : "bg-white shadow-lg"
            } border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm`}
          >
            <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-6 flex items-center gap-2 font-semibold`}>
              <Clock className={isDark ? "text-teal-300" : "text-purple-600"} size={20} />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className={`flex items-center justify-between p-4 ${
                    isDark ? "bg-[rgba(255,255,255,0.03)]" : "bg-purple-50"
                  } rounded-lg border ${isDark ? "border-[rgba(94,234,212,0.1)]" : "border-[#ddd6fe]"} ${
                    isDark ? "hover:border-[rgba(94,234,212,0.3)]" : "hover:border-[#a855f7] hover:shadow-md"
                  } transition-all`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${isDark ? "bg-emerald-400" : "bg-purple-600"}`} />
                    <div>
                      <h4 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-1 font-semibold`}>{activity.title}</h4>
                      <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-xs`}>{activity.time}</p>
                    </div>
                  </div>
                  <div className={`${isDark ? "text-teal-300" : "text-purple-600"} font-bold`}>{activity.score}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Achievements + Quick Actions */}
        <div className="space-y-6">
          {/* Achievements */}
          <div
            className={`${
              isDark
                ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]"
                : "bg-white shadow-lg"
            } border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm`}
          >
            <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-6 flex items-center gap-2 font-semibold`}>
              <Trophy className={isDark ? "text-teal-300" : "text-purple-600"} size={20} />
              Achievements
            </h3>
            <div className="space-y-4">
              {achievements.map((achievement) => {
                const Icon = achievement.icon as any;
                return (
                  <div
                    key={achievement.id}
                    className={`p-4 ${
                      isDark ? "bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-transparent" : "bg-purple-50"
                    } rounded-lg border ${isDark ? "border-[rgba(94,234,212,0.1)]" : "border-[#ddd6fe]"} ${
                      isDark ? "hover:border-[rgba(94,234,212,0.3)]" : "hover:border-[#a855f7] hover:shadow-md"
                    } transition-all`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={isDark ? achievement.color : "text-purple-600"} size={24} />
                      <div>
                        <h4 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-1 font-semibold`}>
                          {achievement.title}
                        </h4>
                        <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-xs`}>
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div
            className={`${
              isDark
                ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]"
                : "bg-white shadow-lg"
            } border ${isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"} rounded-xl p-6 backdrop-blur-sm`}
          >
            <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-6 font-semibold`}>Quick Actions</h3>
            <div className="space-y-3">
              <Button
                className={`w-full ${
                  isDark
                    ? "bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-md"
                }`}
              >
                Start New Interview
              </Button>
              <Button
                className={`w-full ${
                  isDark
                    ? "bg-[rgba(94,234,212,0.2)] hover:bg-[rgba(94,234,212,0.3)] text-teal-300 border border-[rgba(94,234,212,0.3)]"
                    : "bg-white hover:bg-purple-50 text-purple-700 border-2 border-[#ddd6fe] hover:border-[#a855f7] font-medium shadow-sm"
                }`}
              >
                View Progress Report
              </Button>
              <Button
                className={`w-full ${
                  isDark
                    ? "bg-[rgba(94,234,212,0.2)] hover:bg-[rgba(94,234,212,0.3)] text-teal-300 border border-[rgba(94,234,212,0.3)]"
                    : "bg-white hover:bg-purple-50 text-purple-700 border-2 border-[#ddd6fe] hover:border-[#a855f7] font-medium shadow-sm"
                }`}
              >
                Schedule Practice
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

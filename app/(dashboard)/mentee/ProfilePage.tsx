"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { CheckCircle2, TrendingUp, Clock, Trophy } from "lucide-react";

import Header from "@/app/components/MenteePages/Profile/Header";
import StatsSection from "@/app/components/MenteePages/Profile/StatsSection";
import SkillsSection from "@/app/components/MenteePages/Profile/SkillsSection";
import ActivitySection from "@/app/components/MenteePages/Profile/ActivitySection";

import MenteeBackgroundSection from "@/app/components/Background/MenteeBackgroundSection";


type Theme = "dark" | "light";

type ApiUser = {
  full_name?: string;
  email?: string;
  short_bio?: string;
  phoneNumber?: string;
  Country?: string;
};

type ApiMentee = {
  overall_score: number;
  total_interviews: number;
  points_earned: number;
  joined_date?: string;
  active: boolean;
  phone?: string;
  location?: string;
  education?: string;
  company?: string;
  skills?: { name: string; level: number }[];
  time_invested_minutes?: number;
};

export default function ProfilePage({ theme = "dark" }: { theme?: Theme }) {
  const isDark = theme === "dark";
  const router = useRouter();
  const params = useParams() as { userId?: string };

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [userId, setUserId] = useState<string | null>(null);
  const [menteeId, setMenteeId] = useState<string | null>(null);

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
    skills: [] as { name: string; level: number }[],
  });

  const [editedProfile, setEditedProfile] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [stats, setStats] = useState([
    { label: "Total Interviews", value: "0", icon: CheckCircle2 },
    { label: "Average Score", value: "—", icon: TrendingUp },
    { label: "Time Invested", value: "—", icon: Clock },
    { label: "Achievements", value: "0", icon: Trophy },
  ]);

  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
const EDITABLE_KEYS = ["name", "bio", "phone", "location", "profile_photo"] as const;

function diff(next: Record<string, any>, prev: Record<string, any>) {
  const changed: Record<string, any> = {};
  for (const key of EDITABLE_KEYS) {
    if (next[key] !== prev[key]) changed[key] = next[key];
  }
  return changed;
}

  // ---------------------------
  // 1) Resolve userId from session or URL
  // ---------------------------
  useEffect(() => {
    const fromUrl = params?.userId;
    if (fromUrl) {
      setUserId(fromUrl);
      return;
    }

    try {
      const raw = sessionStorage.getItem("user");
      if (!raw) return router.replace("/login");

      const u = JSON.parse(raw);
      const id = u?.id || u?._id;

      if (!id) {
        router.replace("/login");
        return;
      }
      setUserId(id);
    } catch {
      router.replace("/login");
    }
  }, []);

  // ---------------------------
  // 2) Get menteeId from session user object
  // ---------------------------
  useEffect(() => {
    if (menteeId) return;
    try {
      const raw = sessionStorage.getItem("user");
      if (!raw) return;

      const u = JSON.parse(raw);
      const mid = u?.menteeId || u?.mentee?._id;
      if (mid) setMenteeId(mid);
    } catch {}
  }, []);

  // ---------------------------
  // 3) Load profile from API
  // ---------------------------
  useEffect(() => {
    if (!menteeId) return;

    (async () => {
      try {
        setLoading(true);

        const token = sessionStorage.getItem("token");

        const r = await fetch(`/api/mentees/${menteeId}/profile`, {
          cache: "no-store",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        if (!r.ok) throw new Error(await r.text());

        const { user, mentee }: { user: ApiUser; mentee: ApiMentee } = await r.json();

        const joined = mentee?.joined_date
          ? new Date(mentee.joined_date).toLocaleString("en-US", {
              month: "long",
              year: "numeric",
            })
          : "—";

        const mapped = {
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
        };

        setProfile(mapped);
        setEditedProfile(mapped);

        // Stats
        const total = mentee?.total_interviews ?? 0;
        const avg = mentee?.overall_score ?? 0;
        const time = mentee?.time_invested_minutes;

        setStats([
          { label: "Total Interviews", value: String(total), icon: CheckCircle2 },
          {
            label: "Average Score",
            value: avg > 0 ? `${avg.toFixed(1)}/10` : "—",
            icon: TrendingUp,
          },
          {
            label: "Time Invested",
            value:
              typeof time === "number"
                ? `${Math.floor(time / 60)}h ${time % 60}m`
                : "—",
            icon: Clock,
          },
          { label: "Achievements", value: "4", icon: Trophy },
        ]);

        setErr(null);
      } catch (e: any) {
        setErr(String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [menteeId]);

  // Watch changes
  useEffect(() => {
    setHasChanges(Object.keys(diff(editedProfile, profile)).length > 0);
  }, [editedProfile, profile]);

  // ---------------------------
  // 4) Load Recent Activity
  // ---------------------------
  useEffect(() => {
    if (!menteeId) return;

    (async () => {
      try {
        setActivitiesLoading(true);

        const r = await fetch(`/api/mentees/${menteeId}/activities?limit=8`);
        const j = await r.json();

        setActivities(j?.items || []);
      } finally {
        setActivitiesLoading(false);
      }
    })();
  }, [menteeId]);

  // ---------------------------
  // SAVE Handler
  // ---------------------------
  const handleSave = async () => {
    if (!menteeId) return;

    const changed = diff(editedProfile, profile);
    if (Object.keys(changed).length === 0) {
      setIsEditing(false);
      return;
    }

    try {
      setSaving(true);

      const token = sessionStorage.getItem("token");

      const r = await fetch(`/api/mentees/${menteeId}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ profile: changed }),
      });

      if (!r.ok) throw new Error(await r.text());

      const updated = { ...profile, ...changed };
      setProfile(updated);
      setEditedProfile(updated);
      setIsEditing(false);
    } catch {
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  // ---------------------------
  // UI Rendering
  // ---------------------------
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading...
      </div>
    );

  if (err)
    return <div className="text-red-500 p-8">Failed to load profile: {err}</div>;

  return (
  <div
    className={`min-h-screen ${isDark ? "bg-[#0a0f1e]" : "bg-[#f5f3ff]"}`}
  >
    <div className="w-full flex justify-center">
      <div className="w-full max-w-6xl px-4 py-8">

        {/* Header */}
        <Header
        profile={profile}
        editedProfile={editedProfile}
        setEditedProfile={setEditedProfile}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        isDark
        onSave={handleSave}
        onCancel={handleCancel}
      />


        {/* Stats */}
        <StatsSection stats={stats} isDark={isDark} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          
          {/* Left Side */}
          <div className="lg:col-span-2 space-y-6">
            <SkillsSection profile={profile} isDark={isDark} />

            <MenteeBackgroundSection
              menteeId={menteeId}
              theme={isDark ? "dark" : "light"}
            />

            <ActivitySection
              activities={activities}
              loading={activitiesLoading}
              isDark={isDark}
            />
          </div>

          

        </div>

      </div>
    </div>
  </div>
);

}

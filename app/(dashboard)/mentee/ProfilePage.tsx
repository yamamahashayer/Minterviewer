"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { CheckCircle2, TrendingUp, Clock } from "lucide-react";

import Header from "@/app/components/MenteePages/Profile/Header";
import StatsSection from "@/app/components/MenteePages/Profile/StatsSection";
import SkillsSection from "@/app/components/MenteePages/Profile/SkillsSection";
import ActivitySection from "@/app/components/MenteePages/Profile/ActivitySection";
import MenteeBackgroundSection from "@/app/components/Background/MenteeBackgroundSection";
import ProfileContactCard from "@/app/components/MenteePages/Profile/ProfileContactCard";

type Theme = "dark" | "light";

type ApiUser = {
  github: string;
  linkedin_url: string;
  full_name?: string;
  email?: string;
  short_bio?: string;
  phoneNumber?: string;
  Country?: string;
  area_of_expertise?: string[]; 
};


type ApiMentee = {
  overall_score: number;
  total_interviews: number;
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
  area_of_expertise: [] as string[], // ✅ جديد
  linkedin: "",     // ✅
  github: "",       // ✅
});


  const [editedProfile, setEditedProfile] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);

  const [stats, setStats] = useState<
    { label: string; value: string; icon: any }[]
  >([]);

  const [activities, setActivities] = useState<any[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

    const EDITABLE_KEYS = [
      "name",
      "bio",
      "phone",
      "location",
      "linkedin",
      "github",
      "area_of_expertise", // 👈 مهم
      "profile_photo",
    ] as const;



  function diff(next: Record<string, any>, prev: Record<string, any>) {
    const changed: Record<string, any> = {};
    for (const key of EDITABLE_KEYS) {
      if (next[key] !== prev[key]) changed[key] = next[key];
    }
    return changed;
  }

  /* ================= USER ID ================= */
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
      if (!id) return router.replace("/login");

      setUserId(id);
    } catch {
      router.replace("/login");
    }
  }, []);

  /* ================= MENTEE ID ================= */
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

  /* ================= LOAD PROFILE ================= */
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

        const { user, mentee }: { user: ApiUser; mentee: ApiMentee } =
          await r.json();

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
        area_of_expertise: user?.area_of_expertise ?? [], // ✅ الجديد
        linkedin: user?.linkedin_url ?? "",   // ✅
        github: user?.github ?? "",            // ✅
      };


        setProfile(mapped);
        setEditedProfile(mapped);

        setErr(null);
      } catch (e: any) {
        setErr(String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [menteeId]);

  /* ================= ACTIVITY ================= */
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

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!menteeId) return;
    const changed = diff(editedProfile, profile);
    if (!Object.keys(changed).length) return setIsEditing(false);

    try {
      const token = sessionStorage.getItem("token");
      const r = await fetch(`/api/mentees/${menteeId}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ profile: changed }),
      });

      if (!r.ok) throw new Error();
      const updated = { ...profile, ...changed };
      setProfile(updated);
      setEditedProfile(updated);
      setIsEditing(false);
    } catch {
      alert("Save failed");
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  /* ================= UI ================= */
  if (loading)
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? "text-white" : "text-gray-800"
        }`}
      >
        Loading…
      </div>
    );

  if (err)
    return (
      <div className={`p-8 ${isDark ? "text-red-400" : "text-red-600"}`}>
        Failed to load profile: {err}
      </div>
    );

return (
  <div className={`min-h-screen ${isDark ? "bg-[#0a0f1e]" : "bg-[#f5f3ff]"}`}>
    <div className="flex justify-center">
      <div className="w-full max-w-6xl px-4 py-8">

        {/* ================= HEADER ================= */}
        <Header
          profile={profile}
          editedProfile={editedProfile}
          setEditedProfile={setEditedProfile}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          isDark={isDark}
          onSave={handleSave}
          onCancel={handleCancel}
        />

      
        {/* ================= MAIN GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

          {/* ===== LEFT (Main Content) ===== */}
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

          {/* ===== RIGHT (Contact & Links) ===== */}
          <div className="space-y-6">
          <ProfileContactCard
            profile={profile}
            editedProfile={editedProfile}
            setEditedProfile={setEditedProfile}
            isEditing={isEditing}
            isDark={isDark}
          />
          </div>

        </div>
      </div>
    </div>
  </div>
);

}

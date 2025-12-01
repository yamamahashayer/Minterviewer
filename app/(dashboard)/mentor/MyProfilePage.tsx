"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import ProfileHeader from "@/app/components/MentorPages/Profile/ProfileHeader";
import EditDialog from "@/app/components/MentorPages/Profile/EditDialog";

import {
  AboutSection,
  ExpertiseSection,
  SessionsSection,
  ReviewsSection,
  AchievementsSection,
} from "@/app/components/MentorPages/Profile";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/app/components/ui/tabs";
import { Dialog } from "@/app/components/ui/dialog";

export default function MyProfilePage() {
  const [loading, setLoading] = useState(true);
  const [mentorId, setMentorId] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  const isDark = false;

  /* ---------------- Load mentorId ---------------- */
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("user");
      if (!raw) return;

      const u = JSON.parse(raw);

      const mid =
        u?.mentorId ||
        u?.mentor?._id ||
        u?.mentor ||
        null;

      if (mid) setMentorId(mid);
    } catch (e) {
      console.error(e);
    }
  }, []);

  /* ---------------- Fetch Profile from API ---------------- */
  useEffect(() => {
    if (!mentorId) return;

    (async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/mentors/${mentorId}/profile`, {
          cache: "no-store",
        });

        const data = await res.json();
        if (!data.ok) throw new Error("Invalid API response");

        const { profile: p, stats: s } = data;

        setProfile(p);
        setStats(s);

      } catch (e) {
        console.error("Profile fetch error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [mentorId]);

  /* ---------------- Save Updated Data ---------------- */
  const handleSave = async (updated) => {
    if (!mentorId) return;

    try {
      const res = await fetch(`/api/mentors/${mentorId}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: updated }),
      });

      if (!res.ok) throw new Error("Save failed");

      // merge updated values safely
      setProfile((prev) => ({
        ...prev,
        ...updated,
        social: {
          ...(prev?.social || {}),
          ...(updated?.social || {}),
        },
      }));

      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="p-20 text-lg text-[var(--foreground-muted)]">
        Loading profile...
      </div>
    );
  }

  /* ---------------- PAGE ---------------- */
  return (
    <div className="p-8 max-w-7xl mx-auto">

      <ProfileHeader
        profile={profile}
        stats={stats}
        isDark={isDark}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <EditDialog
          profile={profile}
          onSave={handleSave}
          close={() => setIsEditing(false)}
        />
      </Dialog>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Tabs defaultValue="about" className="w-full mt-6">
          <TabsList>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="expertise">Expertise</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <AboutSection profile={profile} />
          </TabsContent>

          <TabsContent value="expertise">
            <ExpertiseSection profile={profile} />
          </TabsContent>

          <TabsContent value="sessions">
            <SessionsSection profile={profile} />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewsSection stats={stats} />
          </TabsContent>

          <TabsContent value="achievements">
            <AchievementsSection profile={profile} />
          </TabsContent>
        </Tabs>
      </motion.div>

    </div>
  );
}

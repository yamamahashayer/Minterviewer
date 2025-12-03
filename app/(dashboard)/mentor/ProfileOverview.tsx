"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import ProfileHeader from "@/app/components/MentorPages/Profile/ProfileHeader";

export default function ProfileOverview() {
  const [loading, setLoading] = useState(true);
  const [mentorId, setMentorId] = useState<string | null>(null);

  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [isDark, setIsDark] = useState(false);

  /* ---------------- Load mentorId ---------------- */
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("user");
      if (!raw) return;

      const u = JSON.parse(raw);
      const mid = u?.mentorId || u?.mentor?._id || u?.mentor || null;

      if (mid) setMentorId(mid);
    } catch (e) {
      console.error(e);
    }
  }, []);

  /* ---------------- Fetch Profile ---------------- */
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

        setProfile(data.profile);
        setStats(data.stats);
      } catch (e) {
        console.error("Profile fetch error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [mentorId]);

  /* ---------------- Detect Dark Mode ---------------- */
  useEffect(() => {
    const check = () => {
      const dark = document.documentElement.classList.contains("dark");
      setIsDark(dark);
    };

    check();

    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  /* ---------------- LOADING ---------------- */
  if (loading || !profile || !stats) {
    return (
      <div className="p-20 text-lg text-[var(--foreground-muted)]">
        Loading overview...
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
     <ProfileHeader
      profile={profile}
      stats={stats}
      isEditing={false}
      setIsEditing={() => {}}
      onFieldChange={() => {}}
      onSave={() => {}}
      onCancel={() => {}}
      isDark={isDark}
      hideEdit={true}   // ←🔥 أهم خطوة
    />

    </motion.div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import ProfileHeader from "@/app/components/MentorPages/Profile/ProfileHeader";
import AboutSection from "@/app/components/MentorPages/Profile/AboutSection";
import ExpertiseSection from "@/app/components/MentorPages/Profile/ExpertiseSection";
import SessionsSection from "@/app/components/MentorPages/Profile/SessionsSection";
import ReviewsSection from "@/app/components/MentorPages/Profile/ReviewsSection";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/app/components/ui/tabs";

export default function MyProfilePage() {
  const [loading, setLoading] = useState(true);
  const [mentorId, setMentorId] = useState<string | null>(null);

  const [profile, setProfile] = useState<any>(null); // ← البيانات الأصلية
  const [form, setForm] = useState<any>(null);       // ← النسخة التي نعدلها على الشاشة
  const [stats, setStats] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
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
        setForm(JSON.parse(JSON.stringify(data.profile))); // ← نسخة مستقلة
        setStats(data.stats);
      } catch (e) {
        console.error("Profile fetch error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [mentorId]);

  /* ---------------- UPDATE FIELDS ---------------- */
  const handleFieldChange = (key: string, value: any) => {
    setForm((prev: any) => ({
      ...prev,
      [key]: value,   // ← نعدل فقط على form
    }));

    console.log("UPDATED FIELD:", key, value);
  };
  useEffect(() => {
  const dark = document.documentElement.classList.contains("dark");
  setIsDark(dark);
}, []);

  /* ---------------- SAVE ---------------- */
  const handleSave = async () => {
    if (!mentorId) return;

    try {
      const res = await fetch(`/api/mentors/${mentorId}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: form }),
      });

      if (!res.ok) throw new Error("Save failed");

      setProfile(form); // ← نثبت التغييرات الحقيقية
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- CANCEL ---------------- */
  const handleCancel = () => {
    setForm(JSON.parse(JSON.stringify(profile))); // ← ارجاع القيم الأصلية
    setIsEditing(false);
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="p-20 text-lg text-[var(--foreground-muted)]">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">

      {/* HEADER */}
      <ProfileHeader
          profile={form}
          stats={stats}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onFieldChange={handleFieldChange}
          onSave={handleSave}
          onCancel={handleCancel}
          isDark={isDark}
        />


      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Tabs defaultValue="about" className="w-full mt-6">

          <TabsList>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="expertise">Expertise</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <AboutSection
              profile={form}
              isEditing={isEditing}
              onFieldChange={handleFieldChange}
              onSave={handleSave}
              onCancel={handleCancel}
              isDark={isDark}     // ←🔥🔥 ضروري جداً
            />
          </TabsContent>


          <TabsContent value="expertise">
          <ExpertiseSection
            profile={form}
            mentorId={mentorId}
            isEditing={isEditing}
            isDark={isDark}            // ←🔥 مهم جدًا
            onFieldChange={handleFieldChange}
          />


          </TabsContent>


          <TabsContent value="sessions">
            <SessionsSection profile={form} />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewsSection stats={stats} />
          </TabsContent>

          
        </Tabs>
      </motion.div>

    </div>
  );
}

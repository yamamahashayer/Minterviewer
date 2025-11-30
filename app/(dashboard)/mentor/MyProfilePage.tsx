"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Components
import {
  ProfileHeader,
  AboutSection,
  ExpertiseSection,
  SessionsSection,
  ReviewsSection,
  AchievementsSection,
  EditDialog
} from "@/app/components/MentorPages/Profile";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs";
import { Dialog, DialogTrigger } from "@/app/components/ui/dialog";
import { Edit } from "lucide-react";

// ==================================================================
// FETCH PROFILE FROM BACKEND
// ==================================================================

export default function MyProfilePage() {
  const [loading, setLoading] = useState(true);
  const [mentorId, setMentorId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // MAIN PROFILE STATE
  const [mentorInfo, setMentorInfo] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);

  const [bio, setBio] = useState("");

  // ------------------------------------------------------------
  // 1) GET mentorId FROM SESSION
  // ------------------------------------------------------------
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("user");
      if (!raw) {
        console.error("❌ no session user");
        return;
      }

      const u = JSON.parse(raw);

      const mid =
        u?.mentorId || u?.mentor?._id;

      if (!mid) {
        console.error("❌ mentorId missing in sessionStorage");
        return;
      }

      setMentorId(mid);

    } catch (err) {
      console.error("❌ failed reading session", err);
    }
  }, []);

  // ------------------------------------------------------------
  // 2) FETCH PROFILE USING mentorId
  // ------------------------------------------------------------
  useEffect(() => {
    if (!mentorId) return;

    (async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/mentors/${mentorId}/profile`, { cache: "no-store" });

        if (!res.ok) {
          throw new Error("Failed to load mentor profile");
        }

        const data = await res.json();

        // Structure:
        // data = { mentor: {...}, user: {...}, stats: {...} }

        const { mentor, user, stats } = data;

        const infoMapped = {
          name: user?.full_name ?? "Mentor",
          title: mentor?.title ?? "Mentor",
          level: mentor?.level ?? "",
          company: mentor?.company ?? "",
          location: mentor?.location ?? "",
          email: user?.email ?? "",
          phone: user?.phoneNumber ?? mentor?.phone ?? "",
          joinedDate: mentor?.joinedDate ?? "",
          avatar: mentor?.avatar ?? "",
        };

        setMentorInfo(infoMapped);
        setBio(mentor?.bio ?? "");
        setStats(stats || {});

        setError(null);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [mentorId]);

  // ==================================================================
  // RENDER
  // ==================================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-500">
        Loading profile…
      </div>
    );
  }

  if (error || !mentorInfo) {
    return (
      <div className="min-h-screen p-10 text-red-500 text-lg">
        Failed to load profile: {error}
      </div>
    );
  }

  // Dummy data until backend is ready (same structure you had)
  const expertise = mentorInfo?.expertise || [
    { name: "System Design", level: 95 },
    { name: "Algorithms", level: 90 },
    { name: "Leadership", level: 85 },
  ];

  const sessionTypes = mentorInfo?.sessionTypes || [
    { type: "Technical Interview", price: 120, duration: "60 min", sessions: 30 },
    { type: "System Design", price: 150, duration: "90 min", sessions: 18 },
  ];

  const reviews = mentorInfo?.reviews || [
    {
      name: "John Doe",
      rating: 5,
      comment: "Amazing mentor!",
      date: "2 days ago",
      avatar: "",
    },
  ];

  const achievements = mentorInfo?.achievements || [
    { title: "Top Mentor", desc: "Rated 5 stars", color: "yellow" },
    { title: "100+ Sessions", desc: "Completed over 100 sessions", color: "cyan" },
  ];

  const languages = mentorInfo?.languages || ["English", "Arabic"];
  const industries = mentorInfo?.industries || ["Technology", "AI"];

  // ==================================================================
  // PAGE UI
  // ==================================================================

  return (
    <div className="p-8 max-w-7xl mx-auto">

      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-[var(--foreground)]">My Profile</h1>

          <Dialog>
            <DialogTrigger className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2">
              <Edit className="w-4 h-4" /> Edit Profile
            </DialogTrigger>

            <EditDialog mentorInfo={mentorInfo} bio={bio} setBio={setBio} />
          </Dialog>
        </div>
      </motion.div>

      {/* PROFILE HEADER */}
      <ProfileHeader mentorInfo={mentorInfo} stats={stats} bio={bio} />

      {/* TABS */}
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
            <AboutSection mentorInfo={mentorInfo} languages={languages} industries={industries} />
          </TabsContent>

          <TabsContent value="expertise">
            <ExpertiseSection expertise={expertise} />
          </TabsContent>

          <TabsContent value="sessions">
            <SessionsSection sessionTypes={sessionTypes} />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewsSection reviews={reviews} stats={stats} />
          </TabsContent>

          <TabsContent value="achievements">
            <AchievementsSection achievements={achievements} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}

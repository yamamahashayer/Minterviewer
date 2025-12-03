"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent } from "@/app/components/ui/tabs";

import TabsHeader from "@/app/components/MentorPages/MentorSetting/TabsHeader";
import ProfileTab from "@/app/components/MentorPages/MentorSetting/ProfileTab";
import NotificationsTab from "@/app/components/MentorPages/MentorSetting/NotificationsTab";
import SecurityTab from "@/app/components/MentorPages/MentorSetting/SecurityTab";
import PreferencesTab from "@/app/components/MentorPages/MentorSetting/PreferencesTab";
import SettingsHeader from "./SettingsHeader";

export default function SettingsPage({ theme }: { theme?: "dark" | "light" }) {
  /* =======================================================
        LOAD USER + MENTOR DATA FROM SESSION API
    ======================================================= */
  const [user, setUser] = useState<any>(null);
  const [mentor, setMentor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    (async () => {
      try {
        const res = await fetch("/api/auth/session", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          cache: "no-store",
        });

        const data = await res.json();

        if (data?.user) setUser(data.user);
        if (data?.mentor) setMentor(data.mentor);

      } catch (err) {
        console.error("❌ Failed to load session:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ================= LOADING UI ================= */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Loading settings...
      </div>
    );
  }

  /* ================= THEME HANDLING ================= */
  const currentTheme =
    theme ??
    (typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark")
      ? "dark"
      : "light");

  const isDark = currentTheme === "dark";

  /* ================= MAIN UI ================= */
  return (
    <div
      className="min-h-screen w-full"
      style={{
        background:
          currentTheme === "light"
            ? "#ffffff"
            : "linear-gradient(180deg, #0A0F1E 0%, #0F172A 100%)",
      }}
    >
      <div className="p-8 max-w-5xl mx-auto">
        <SettingsHeader theme={currentTheme} />

        <Tabs defaultValue="profile" className="w-full mt-6">
          <TabsHeader theme={currentTheme} />

          <TabsContent value="profile">
            <ProfileTab theme={currentTheme} user={user} mentor={mentor} />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationsTab theme={currentTheme} user={user} mentor={mentor} />
          </TabsContent>

          <TabsContent value="security">
            <SecurityTab theme={currentTheme} user={user} mentor={mentor} />
          </TabsContent>

          <TabsContent value="preferences">
            <PreferencesTab theme={currentTheme} user={user} mentor={mentor} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

"use client";

import { Tabs, TabsContent } from "@/app/components/ui/tabs";

import SettingsHeader from "@/app/components/MenteePages/MenteeSetting/SettingsHeader";
import SettingsTabsNav from "@/app/components/MenteePages/MenteeSetting/SettingsTabsNav";
import AccountSettings from "@/app/components/MenteePages/MenteeSetting/AccountSettings";
import NotificationSettings from "@/app/components/MenteePages/MenteeSetting/NotificationSettings";
import SecuritySettings from "@/app/components/MenteePages/MenteeSetting/SecuritySettings";
import DataPrivacySettings from "@/app/components/MenteePages/MenteeSetting/DataPrivacySettings";
import { useEffect, useState } from "react";

export default function SettingsPage({
  theme = "dark",
}: {
  theme?: "dark" | "light";
}) {
  const isDark = theme === "dark";

  const [menteeId, setMenteeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* ========================= Load Session ========================= */
  useEffect(() => {
    const token = sessionStorage.getItem("token");

    (async () => {
      try {
        const res = await fetch("/api/auth/session", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          cache: "no-store",
        });
        const data = await res.json();

        const mid = data?.menteeId || data?.user?.menteeId || null;
        if (mid) {
          setMenteeId(mid);
          sessionStorage.setItem("menteeId", mid);
        }
      } catch (err) {
        console.error("❌ Failed to fetch session:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ========================= Loading ========================= */
  if (loading)
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${
          isDark
            ? "bg-[#0a0f1e] text-white"
            : "bg-[#f5f3ff] text-[#2e1065]"
        }`}
      >
        <div className="flex flex-col items-center">
          <div
            className={`w-12 h-12 border-4 border-t-transparent rounded-full animate-spin ${
              isDark ? "border-teal-400" : "border-purple-500"
            }`}
          />
          <p className="mt-4 text-lg font-medium tracking-wide">
            Loading your profile...
          </p>
        </div>
      </div>
    );

  /* ========================= MAIN ========================= */
  return (
    <div
      className="min-h-screen p-8 w-full flex justify-center"
      style={{
        background:
          theme === "light"
            ? "#f9fafb" // نفس Light Theme المستخدم في Mentor Settings
            : "linear-gradient(180deg, #0A0F1E 0%, #0F172A 100%)",
      }}
    >
      <div className="w-full max-w-5xl">
        {/* Header */}
        <SettingsHeader isDark={isDark} />

        {/* Tabs & Content */}
        <Tabs defaultValue="account" className="w-full mt-6">
          <SettingsTabsNav isDark={isDark} />

          <TabsContent value="account">
            <AccountSettings isDark={isDark} />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSettings isDark={isDark} />
          </TabsContent>

          <TabsContent value="security">
            <SecuritySettings isDark={isDark} />
          </TabsContent>

          <TabsContent value="data">
            <DataPrivacySettings isDark={isDark} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

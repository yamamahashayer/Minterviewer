"use client";

import { Tabs, TabsContent } from "@/app/components/ui/tabs";
import TabsHeader from "@/app/components/MentorPages/MentorSetting/TabsHeader";
import ProfileTab from "@/app/components/MentorPages/MentorSetting/ProfileTab";
import NotificationsTab from "@/app/components/MentorPages/MentorSetting/NotificationsTab";
import SecurityTab from "@/app/components/MentorPages/MentorSetting/SecurityTab";
import PreferencesTab from "@/app/components/MentorPages/MentorSetting/PreferencesTab";
import SettingsHeader from "./SettingsHeader";

export default function SettingsPage({ theme }: { theme?: "dark" | "light" }) {
  const currentTheme =
    theme ??
    (typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark")
      ? "dark"
      : "light");

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
      {/* ========================= */}
      {/* INNER CONTENT (NOT FULL) */}
      {/* ========================= */}
      <div className="p-8 max-w-5xl mx-auto">
         <SettingsHeader theme={currentTheme} />
         

        <Tabs defaultValue="profile" className="w-full">
          <TabsHeader theme={currentTheme} />

          <TabsContent value="profile">
            <ProfileTab theme={currentTheme} />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationsTab theme={currentTheme} />
          </TabsContent>

          <TabsContent value="security">
            <SecurityTab theme={currentTheme} />
          </TabsContent>

          <TabsContent value="preferences">
            <PreferencesTab theme={currentTheme} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

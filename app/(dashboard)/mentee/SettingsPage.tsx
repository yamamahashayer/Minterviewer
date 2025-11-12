"use client";
import { Tabs, TabsContent } from "@/app/components/ui/tabs";

// 🧩 الكومبوننتات المفصولة
import SettingsHeader from "@/app/components/MenteePages/MenteeSetting/SettingsHeader";
import SettingsTabsNav from "@/app/components/MenteePages/MenteeSetting/SettingsTabsNav";
import AccountSettings from "@/app/components/MenteePages/MenteeSetting/AccountSettings";
import NotificationSettings from "@/app/components/MenteePages/MenteeSetting/NotificationSettings";
import SecuritySettings from "@/app/components/MenteePages/MenteeSetting/SecuritySettings";
import DataPrivacySettings from "@/app/components/MenteePages/MenteeSetting/DataPrivacySettings";

export default function SettingsPage({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen p-8 ${
        isDark
          ? "bg-gradient-to-b from-[#0a0f1e] to-[#000000]"
          : "bg-[#f5f3ff]"
      }`}
    >
      {/* Header */}
      <SettingsHeader isDark={isDark} />

      {/* Tabs Section */}
      <div className="max-w-4xl">
        <Tabs defaultValue="account" className="w-full">
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

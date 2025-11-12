"use client";
import SettingsPage from "@/app/(dashboard)/mentee/SettingsPage";
import { Button } from "@/app/components/ui/button";
import { Settings } from "lucide-react";
import router from "next/router";


export default function NotificationPreferences({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const isDark = theme === "dark";
  return (
    <div
      className={`mt-8 p-6 rounded-xl border ${
        isDark
          ? "border-white/10 bg-white/5"
          : "border-[#ddd6fe] bg-white shadow-sm"
      }`}
    >
      <h3
        className={`text-lg font-semibold mb-2 flex items-center gap-2 ${
          isDark ? "text-white" : "text-[#3b0764]"
        }`}
      >
        <Settings size={18} className={isDark ? "text-teal-400" : "text-purple-600"} />
        Notification Preferences
      </h3>
      <p className={isDark ? "text-gray-400 text-sm mb-4" : "text-purple-700 text-sm mb-4"}>
        Manage how you receive notifications and customize your preferences.
      </p>
            <Button
        onClick={() => window.location.href = "/mentee?tab=Settings"}
        className={
          isDark
            ? "bg-teal-500/20 border border-teal-400/40 hover:bg-teal-500/30 text-teal-200"
            : "bg-purple-100 border border-purple-300 hover:bg-purple-200 text-purple-700 font-semibold"
        }
      >
        <Settings size={14} className="mr-2" /> Open Settings
      </Button>
    </div>
  );
}

"use client";

import { User, Bell, Lock, Palette } from "lucide-react";
import { TabsList, TabsTrigger } from "@/app/components/ui/tabs";

export default function TabsHeader({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const isDark = theme === "dark";

  // ACTIVE STYLE
  const activeLight =
    "data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:font-semibold";

  const activeDark =
    "data-[state=active]:bg-[rgba(94,234,212,0.2)] data-[state=active]:text-teal-300";

  // CONTAINER STYLE
  const containerLight =
    "bg-white border-2 border-[#ddd6fe] shadow-sm rounded-xl px-2 py-1";

  const containerDark =
    "bg-[rgba(255,255,255,0.05)] border border-[rgba(94,234,212,0.2)] rounded-xl";

  const active = isDark ? activeDark : activeLight;
  const container = isDark ? containerDark : containerLight;

  return (
    <TabsList className={`${container} mb-6 flex flex-wrap gap-1`}>
      <TabsTrigger value="profile" className={`px-4 py-2 rounded-lg ${active}`}>
        <User className="w-4 h-4 mr-2" /> Profile
      </TabsTrigger>

      <TabsTrigger value="notifications" className={`px-4 py-2 rounded-lg ${active}`}>
        <Bell className="w-4 h-4 mr-2" /> Notifications
      </TabsTrigger>

      <TabsTrigger value="security" className={`px-4 py-2 rounded-lg ${active}`}>
        <Lock className="w-4 h-4 mr-2" /> Security
      </TabsTrigger>

      <TabsTrigger value="preferences" className={`px-4 py-2 rounded-lg ${active}`}>
        <Palette className="w-4 h-4 mr-2" /> Preferences
      </TabsTrigger>
    </TabsList>
  );
}

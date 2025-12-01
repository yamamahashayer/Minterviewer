"use client";

import { TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { User, Bell, Palette, Lock, Database } from "lucide-react";

export default function SettingsTabsNav({ isDark }: { isDark: boolean }) {
  const commonStyle = isDark
    ? "data-[state=active]:bg-[rgba(94,234,212,0.2)] data-[state=active]:text-teal-300"
    : "data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:font-semibold";

  const containerStyle = isDark
    ? "bg-[rgba(255,255,255,0.05)] border border-[rgba(94,234,212,0.2)]"
    : "bg-white border-2 border-[#ddd6fe] shadow-sm";

  return (
    <TabsList className={`${containerStyle} mb-6 flex flex-wrap`}>
      <TabsTrigger value="account" className={commonStyle}>
        <User size={16} className="mr-2" /> Account
      </TabsTrigger>

      <TabsTrigger value="notifications" className={commonStyle}>
        <Bell size={16} className="mr-2" /> Notifications
      </TabsTrigger>



      <TabsTrigger value="security" className={commonStyle}>
        <Lock size={16} className="mr-2" /> Security
      </TabsTrigger>

      <TabsTrigger value="data" className={commonStyle}>
        <Database size={16} className="mr-2" /> Data & Privacy
      </TabsTrigger>
    </TabsList>
  );
}

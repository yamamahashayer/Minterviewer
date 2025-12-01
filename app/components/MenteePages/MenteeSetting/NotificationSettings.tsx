"use client";
import { Switch } from "@/app/components/ui/switch";
import { Button } from "@/app/components/ui/button";
import { Separator } from "@/app/components/ui/separator";
import { Save } from "lucide-react";
import { useState } from "react";

export default function NotificationSettings({ isDark }: { isDark: boolean }) {
  const [notifications, setNotifications] = useState({
    email: true,
    practice: true,
    achievements: true,
    weekly: true,
    messages: true,
  });

  return (
    <div
      className={`${
        isDark
          ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]"
          : "bg-white shadow-lg"
      } border ${
        isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"
      } rounded-xl p-6 backdrop-blur-sm`}
    >
      <h3 className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-6 font-semibold`}>
        Notification Preferences
      </h3>

      <div className="space-y-6">
        {[
          ["Email Notifications", "Receive email updates about your activity", "email"],
          ["Practice Reminders", "Get reminded about scheduled practice sessions", "practice"],
          ["Achievement Alerts", "Be notified when you unlock new achievements", "achievements"],
          ["Weekly Progress Report", "Receive weekly summary of your progress", "weekly"],
          ["Message Notifications", "Get notified about new messages from mentors", "messages"],
        ].map(([title, desc, key]) => (
          <div key={key}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className={`${isDark ? "text-white" : "text-[#2e1065]"} font-medium`}>{title}</h4>
                <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-sm`}>{desc}</p>
              </div>
              <Switch
                checked={(notifications as any)[key]}
                onCheckedChange={(checked) => setNotifications({ ...notifications, [key]: checked })}
              />
            </div>
            <Separator className={`mt-4 ${isDark ? "bg-[rgba(94,234,212,0.1)]" : "bg-[#ddd6fe]"}`} />
          </div>
        ))}

        <div className="flex justify-end pt-4">
          <Button
            className={`${
              isDark
                ? "bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-[#0a0f1e]"
                : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            }`}
          >
            <Save size={16} className="mr-2" />
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
}

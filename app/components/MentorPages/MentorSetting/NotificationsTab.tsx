"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Bell, Calendar, Award } from "lucide-react";
import { Switch } from "@/app/components/ui/switch";
import { Separator } from "@/app/components/ui/separator";

import SettingCard from "./SettingCard";

export default function NotificationsTab({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [sessionReminders, setSessionReminders] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <SettingCard>
        <h3 className="text-[var(--foreground)] mb-6">
          Notification Preferences
        </h3>

        <div className="space-y-6">
          {/* EMAIL */}
          <div
            className="flex items-center justify-between p-4 rounded-lg"
            style={{
              background: "var(--background-muted)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-purple-400" />
              <div>
                <h4 className="text-[var(--foreground)]">Email Notifications</h4>
                <p className="text-[var(--foreground-muted)] text-sm">
                  Receive email updates about your mentees
                </p>
              </div>
            </div>

            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          {/* PUSH */}
          <div
            className="flex items-center justify-between p-4 rounded-lg"
            style={{
              background: "var(--background-muted)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-pink-400" />
              <div>
                <h4 className="text-[var(--foreground)]">Push Notifications</h4>
                <p className="text-[var(--foreground-muted)] text-sm">
                  Get notified about new messages and updates
                </p>
              </div>
            </div>

            <Switch
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>

          {/* SESSION REMINDERS */}
          <div
            className="flex items-center justify-between p-4 rounded-lg"
            style={{
              background: "var(--background-muted)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-indigo-400" />
              <div>
                <h4 className="text-[var(--foreground)]">Session Reminders</h4>
                <p className="text-[var(--foreground-muted)] text-sm">
                  Receive reminders 1 hour before sessions
                </p>
              </div>
            </div>

            <Switch
              checked={sessionReminders}
              onCheckedChange={setSessionReminders}
            />
          </div>

          {/* WEEKLY REPORTS */}
          <div
            className="flex items-center justify-between p-4 rounded-lg"
            style={{
              background: "var(--background-muted)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-yellow-400" />
              <div>
                <h4 className="text-[var(--foreground)]">Weekly Reports</h4>
                <p className="text-[var(--foreground-muted)] text-sm">
                  Get weekly summary of mentee progress
                </p>
              </div>
            </div>

            <Switch
              checked={weeklyReports}
              onCheckedChange={setWeeklyReports}
            />
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex justify-end">
          <button
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-[0_0_20px_rgba(168,85,247,0.4)] text-white px-4 py-2 rounded-md"
          >
            Save Preferences
          </button>
        </div>
      </SettingCard>
    </motion.div>
  );
}

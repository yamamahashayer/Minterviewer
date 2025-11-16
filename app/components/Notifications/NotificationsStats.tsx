"use client";
import { Bell, Mail, Award, MessageSquare } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";

export default function NotificationsStats({
  notifications,
  theme = "dark",
}: {
  notifications: any[];
  theme?: "dark" | "light";
}) {
  const isDark = theme === "dark";

  const unread = notifications.filter((n) => !n.read).length;
  const achievements = notifications.filter(
    (n) => n.type === "achievement"
  ).length;
  const messages = notifications.filter((n) => n.type === "message").length;

  const statBox = (
    icon: any,
    title: string,
    value: number,
    color: string,
    label: string
  ) => (
    <div
      className={`rounded-xl p-6 ${
        isDark
          ? "bg-white/5 border border-white/10"
          : "bg-white border border-[#ddd6fe] shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        {icon}
        <Badge
          className={
            isDark
              ? `bg-${color}-500/20 text-${color}-300 border-none`
              : `bg-${color}-100 text-${color}-700 border border-${color}-300`
          }
        >
          {label}
        </Badge>
      </div>
      <div
        className={`text-lg font-semibold ${
          isDark ? "text-white" : "text-[#3b0764]"
        }`}
      >
        {value}
      </div>
      <p className={isDark ? "text-gray-400" : "text-purple-700 text-sm"}>
        {title}
      </p>
    </div>
  );

  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
      {statBox(
        <Bell className={isDark ? "text-teal-400" : "text-purple-600"} />,
        "Total",
        notifications.length,
        isDark ? "teal" : "purple",
        "All"
      )}
      {statBox(
        <Mail className={isDark ? "text-blue-400" : "text-blue-600"} />,
        "Unread",
        unread,
        isDark ? "blue" : "blue",
        "Unread"
      )}
      {statBox(
        <Award className={isDark ? "text-amber-400" : "text-amber-600"} />,
        "Achievements",
        achievements,
        isDark ? "amber" : "amber",
        "Achievements"
      )}
      {statBox(
        <MessageSquare
          className={isDark ? "text-violet-400" : "text-purple-600"}
        />,
        "Messages",
        messages,
        isDark ? "violet" : "purple",
        "Messages"
      )}
    </div>
  );
}

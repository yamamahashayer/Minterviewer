"use client";
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Badge } from "@/app/components/ui/badge";

export default function NotificationsTabs({
  activeTab,
  setActiveTab,
  notifications,
  theme = "dark",
}: {
  activeTab: string;
  setActiveTab: (value: string) => void;
  notifications: any[];
  theme?: "dark" | "light";
}) {
  const isDark = theme === "dark";
  const types = [
    { id: "all", label: "All", count: notifications.length },
    { id: "unread", label: "Unread", count: notifications.filter((n) => !n.read).length },
    { id: "achievement", label: "Achievements", count: notifications.filter((n) => n.type === "achievement").length },
    { id: "message", label: "Messages", count: notifications.filter((n) => n.type === "message").length },
  ];

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
      <TabsList
        className={`flex flex-wrap border ${
          isDark
            ? "border-white/10 bg-white/5"
            : "border-[#ddd6fe] bg-white shadow-sm"
        }`}
      >
        {types.map((type) => (
          <TabsTrigger
            key={type.id}
            value={type.id}
            className={`px-4 py-2 rounded-lg text-sm ${
              isDark
                ? "data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-300 text-gray-300"
                : "data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 text-[#4c1d95]"
            }`}
          >
            {type.label}
            {type.count > 0 && (
              <Badge
                className={`ml-2 text-xs ${
                  isDark
                    ? "bg-teal-500/30 text-teal-100 border-none"
                    : "bg-purple-200 text-purple-700 border border-purple-300"
                }`}
              >
                {type.count}
              </Badge>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

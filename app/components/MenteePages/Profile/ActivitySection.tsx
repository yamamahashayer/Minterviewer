"use client";

import { Clock } from "lucide-react";

export default function ActivitySection({
  activities,
  activitiesLoading,
  isDark,
}: any) {
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
      <h3
        className={`${
          isDark ? "text-white" : "text-[#2e1065]"
        } mb-6 flex items-center gap-2 font-semibold`}
      >
        <Clock className={isDark ? "text-teal-300" : "text-purple-600"} size={20} />
        Recent Activity
      </h3>

      {activitiesLoading ? (
        <div className={`${isDark ? "text-[#9bb0b5]" : "text-[#6b21a8]"} text-sm`}>
          Loading…
        </div>
      ) : activities.length === 0 ? (
        <div className={`${isDark ? "text-[#9bb0b5]" : "text-[#6b21a8]"} text-sm opacity-80`}>
          No recent activity yet.
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity: any) => (
            <div
              key={activity._id}
              className={`flex items-center justify-between p-4 ${
                isDark ? "bg-[rgba(255,255,255,0.03)]" : "bg-purple-50"
              } rounded-lg border ${
                isDark
                  ? "border-[rgba(94,234,212,0.1)]"
                  : "border-[#ddd6fe]"
              } ${
                isDark
                  ? "hover:border-[rgba(94,234,212,0.3)]"
                  : "hover:border-[#a855f7] hover:shadow-md"
              } transition-all`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isDark ? "bg-emerald-400" : "bg-purple-600"
                  }`}
                />
                <div>
                  <h4
                    className={`${
                      isDark ? "text-white" : "text-[#2e1065]"
                    } mb-1 font-semibold`}
                  >
                    {activity.title}
                  </h4>
                  <p
                    className={`${
                      isDark ? "text-[#99a1af]" : "text-[#6b21a8]"
                    } text-xs`}
                  >
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>

              {activity.score !== null &&
                activity.score !== undefined && (
                  <div
                    className={`${
                      isDark ? "text-teal-300" : "text-purple-600"
                    } font-bold`}
                  >
                    {typeof activity.score === "number"
                      ? `${activity.score}/10`
                      : activity.score}
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

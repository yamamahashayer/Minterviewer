"use client";

import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Theme = "dark" | "light";

export default function JobsTimelineChart({
  jobs,
  theme,
}: {
  jobs: any[];
  theme: Theme;
}) {
  const isDark = theme === "dark";

  const data = useMemo(() => {
    const months: Record<string, number> = {};
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString("default", { month: "short" });
      months[key] = 0;
    }

    jobs.forEach((job) => {
      const d = new Date(job.createdAt);
      const key = d.toLocaleString("default", { month: "short" });
      if (key in months) months[key]++;
    });

    return Object.entries(months).map(([month, count]) => ({
      month,
      jobs: count,
    }));
  }, [jobs]);

  return (
    <div
      className={`rounded-2xl p-6 border ${
        isDark
          ? "bg-white/5 border-white/10 text-white"
          : "bg-white border-gray-200 text-black"
      }`}
    >
      <h3 className="text-lg font-semibold mb-4">
        Job Posts Over Time
      </h3>

      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="month" stroke={isDark ? "#94a3b8" : "#475569"} />
            <YAxis allowDecimals={false} stroke={isDark ? "#94a3b8" : "#475569"} />
            <Tooltip
              contentStyle={{
                background: isDark ? "#020617" : "#fff",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            />
            <Line
              type="monotone"
              dataKey="jobs"
              stroke="#a855f7"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

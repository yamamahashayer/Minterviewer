"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Theme = "dark" | "light";

export default function JobStatusChart({
  jobs,
  theme,
}: {
  jobs: any[];
  theme: Theme;
}) {
  const isDark = theme === "dark";

  const active = jobs.filter((j) => j.status === "active").length;
  const closed = jobs.filter((j) => j.status === "closed").length;

  const data = [
    { name: "Active Jobs", value: active },
    { name: "Closed Jobs", value: closed },
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  return (
    <div
      className={`
        w-full h-[380px]
        rounded-xl border p-6
        ${
          isDark
            ? "bg-[#0F172A]/50 border-gray-700 text-white"
            : "bg-white border-gray-200"
        }
      `}
    >
      <h3 className="text-lg font-semibold mb-4">
        Job Status Distribution
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={80}
            outerRadius={120}
            paddingAngle={3}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>

          <Tooltip />
          <Legend verticalAlign="bottom" height={60} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ApplicantsDonut({ jobs, theme  }) {
  const isDark = theme === "dark";

  // ⬅️ Top 7 jobs
  const sorted = [...jobs].sort(
    (a, b) => (b.applicants?.length || 0) - (a.applicants?.length || 0)
  );
  const top7 = sorted.slice(0, 7);

  // ⬅️ Convert to pie chart data
  const data = top7.map((job, i) => ({
    name: job.title,
    value: job.applicants?.length || 0,
  }));

  // ⬅️ Colors for donut
  const COLORS = [
    "#c084fc", // purple
    "#f472b6", // pink
    "#60a5fa", // blue
    "#34d399", // green
    "#fb923c", // orange
    "#facc15", // yellow
    "#38bdf8", // teal
  ];

  return (
    <div
      className={`
        w-full h-[380px] rounded-xl border p-6 mt-8
        ${isDark ? "bg-[#0F172A]/50 border-gray-700 text-white" : "bg-white border-gray-200"}
      `}
    >
      <h3 className="text-lg font-semibold mb-4">Applicants Distribution</h3>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={80}
            outerRadius={120}
            stroke="none"
            paddingAngle={3}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              background: isDark ? "#1e293b" : "white",
              borderRadius: 10,
              border: "none",
              boxShadow: isDark
                ? "0 4px 20px rgba(0,0,0,0.4)"
                : "0 4px 20px rgba(0,0,0,0.1)",
            }}
            labelStyle={{ fontWeight: "bold" }}
          />

          <Legend
            verticalAlign="bottom"
            height={60}
            formatter={(value) => (
              <span className={isDark ? "text-gray-300" : "text-gray-700"}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

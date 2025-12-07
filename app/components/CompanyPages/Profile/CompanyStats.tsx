"use client";

import { CheckCircle2, Briefcase, Users, Clock } from "lucide-react";

type Stat = {
  label: string;
  value: string | number;
};

export default function CompanyStats({
  stats = [],
  isDark,
}: {
  stats: Stat[];
  isDark: boolean;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
      {stats.map((item, i) => {
        const Icon =
          item.label === "Total Jobs"
            ? Briefcase
            : item.label === "Applications"
            ? Users
            : item.label === "Status"
            ? CheckCircle2
            : Clock;

        return (
          <div
            key={i}
            className={`p-4 rounded-xl border flex items-center gap-4 ${
              isDark
                ? "bg-white/5 border-white/10 text-white"
                : "bg-white border-purple-200 text-purple-900"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isDark ? "bg-white/10" : "bg-purple-100"
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>

            <div>
              <p className="text-sm opacity-70">{item.label}</p>
              <p className="text-lg font-semibold">{item.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

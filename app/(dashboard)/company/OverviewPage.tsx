"use client";

import { useEffect, useState } from "react";
import { Briefcase, Users, BadgeCheck, Activity } from "lucide-react";
import JobStatusChart from "@/app/components/CompanyPages/Jobs/JobStatusChart";
import HiringPipelineVisual from "@/app/components/CompanyPages/Jobs/HiringPipeline";

type Theme = "dark" | "light";

export default function OverviewPage({ theme }: { theme: Theme }) {
  const isDark = theme === "dark";
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const raw = sessionStorage.getItem("user");
      if (!raw) return;
      const user = JSON.parse(raw);

      const res = await fetch("/api/company/overview", {
        headers: { "x-company-id": user.companyId },
      });
      const json = await res.json();
      if (json.ok) setData(json.overview);
    })();
  }, []);

  if (!data) return null;

  return (
    <div
      className={`min-h-screen p-10 space-y-10 ${
        isDark ? "bg-[#020617] text-white" : "bg-[#f8fafc] text-black"
      }`}
    >
      {/* HEADER */}
      <div
        className={`rounded-3xl p-10 border ${
          isDark
            ? "bg-gradient-to-br from-[#0f172a] to-[#020617] border-[#1e293b]"
            : "bg-gradient-to-br from-purple-100 via-pink-50 to-purple-50 border-purple-200"
        }`}
      >
        <h1 className="text-4xl font-extrabold">
          Welcome, {data.name}
        </h1>
        <p className="mt-2 opacity-70 max-w-2xl">
          Here’s a high-level overview of your hiring activity and company status.
        </p>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <HiringPipelineVisual jobs={data.jobs} theme={theme} />
        <JobStatusChart jobs={data.jobs} theme={theme} />
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Stat icon={<Briefcase />} label="Jobs Posted" value={data.totalJobs} isDark={isDark} />
        <Stat icon={<Users />} label="Total Candidates" value={data.totalCandidates} isDark={isDark} />
        <Stat icon={<Activity />} label="Hiring Status" value={data.hiringStatus} isDark={isDark} />
        <Stat icon={<BadgeCheck />} label="Verification" value={data.isVerified ? "Verified" : "Pending"} isDark={isDark} />
      </div>
    </div>
  );
}

/* STAT */
function Stat({ icon, label, value, isDark }: any) {
  return (
    <div
      className={`rounded-2xl p-6 border flex flex-col gap-3 ${
        isDark
          ? "bg-[#020617] border-[#1e293b]"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="text-purple-500">{icon}</div>
      <p className="text-sm opacity-60">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  Briefcase,
  Users,
  BadgeCheck,
  Activity,
  Brain,
  Mic,
} from "lucide-react";
import { useRouter } from "next/navigation";


import JobStatusChart from "@/app/components/CompanyPages/Jobs/JobStatusChart";
import HiringPipelineVisual from "@/app/components/CompanyPages/Jobs/HiringPipeline";

type Theme = "dark" | "light";

export default function OverviewPage({ theme }: { theme: Theme }) {
  const isDark = theme === "dark";
  const [data, setData] = useState<any>(null);
  const router = useRouter();


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
      className={`min-h-screen p-10 space-y-12 ${
        isDark ? "bg-[#020617] text-white" : "bg-[#f8fafc] text-black"
      }`}
    >
     
     {/* ================= HEADER ================= */}
<div
  className={`relative rounded-3xl p-12 border overflow-hidden ${
    isDark
      ? "bg-gradient-to-br from-[#0a1022] via-[#020617] to-[#0a1022] border-[#1e293b]"
      : "bg-white border-gray-200"
  }`}
>
  {/* subtle background grid */}
  <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_1px_1px,#a855f7_1px,transparent_0)] bg-[size:24px_24px]" />

  <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
    {/* ================= LEFT ================= */}
    <div className="space-y-6">
      <h1
        className={`text-5xl font-extrabold leading-tight ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        Hiring control center for{" "}
        <span className="text-purple-600">{data.name}</span>
      </h1>

      <p
        className={`max-w-xl text-lg ${
          isDark ? "text-slate-300" : "text-gray-600"
        }`}
      >
        Manage jobs, candidates, CVs, and interviews from one intelligent
        dashboard powered by AI insights.
      </p>

    {/* CTA */}
      <div className="flex flex-wrap gap-4 pt-2">
        <button
          onClick={() => router.push("/company?tab=jobs")}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            isDark
              ? "bg-purple-600 text-white hover:bg-purple-500"
              : "bg-purple-600 text-white hover:bg-purple-700"
          }`}
        >
          + Post a new job
        </button>


          <button
          onClick={() => router.push("/company?tab=candidates")}
          className={`px-6 py-3 rounded-xl font-medium border transition-all ${
            isDark
              ? "border-white/10 text-slate-200 hover:bg-white/5"
              : "border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
        >
          View candidates
        </button>

      </div>

    </div>

    {/* ================= RIGHT ================= */}
    <div className="grid grid-cols-2 gap-6">
      {[
        {
          title: "Job Management",
          desc: "Create & control job openings",
          icon: Briefcase,
          delay: "0s",
        },
        {
          title: "Candidate Tracking",
          desc: "Follow applicants across stages",
          icon: Users,
          delay: "0.6s",
        },
        
      ].map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            style={{ animationDelay: item.delay }}
            className={`
              relative rounded-2xl p-6 overflow-hidden
              animate-float-soft
              transition-all duration-300
              hover:-translate-y-2 hover:border-purple-500/40
              ${
                isDark
                  ? "bg-[#020617] border border-white/10"
                  : "bg-white border border-gray-200"
              }
            `}
          >
            {/* rotating glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full
              bg-gradient-to-br from-purple-600/30 to-transparent
              blur-2xl animate-spin-very-slow opacity-40"
            />

            {/* icon */}
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4
                ${
                  isDark
                    ? "bg-purple-500/10 text-purple-400"
                    : "bg-purple-100 text-purple-600"
                }
              `}
            >
              <Icon size={22} />
            </div>

            <h4
              className={`text-lg font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {item.title}
            </h4>

            <p
              className={`text-sm mt-1 ${
                isDark ? "text-slate-400" : "text-gray-600"
              }`}
            >
              {item.desc}
            </p>
          </div>
        );
      })}
    </div>
  </div>
</div>


      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Stat
          icon={<Briefcase />}
          label="Jobs Posted"
          value={data.totalJobs}
          isDark={isDark}
        />
        <Stat
          icon={<Users />}
          label="Total Candidates"
          value={data.totalCandidates}
          isDark={isDark}
        />
        <Stat
          icon={<Activity />}
          label="Hiring Status"
          value={data.hiringStatus}
          isDark={isDark}
        />
        <Stat
          icon={<BadgeCheck />}
          label="Verification"
          value={data.isVerified ? "Verified" : "Pending"}
          isDark={isDark}
        />
      </div>
      

      {/* ================= ANALYTICS ================= */}
      <div
        className={`rounded-3xl p-8 border ${
          isDark
            ? "bg-[#020617] border-[#1e293b]"
            : "bg-white border-gray-200"
        }`}
      >
        <h2 className="text-2xl font-semibold mb-6">
          Hiring Analytics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <HiringPipelineVisual jobs={data.jobs} theme={theme} />
          <JobStatusChart jobs={data.jobs} theme={theme} />
        </div>
      </div>
    </div>
  );
}

/* ================= STAT CARD ================= */
function Stat({
  icon,
  label,
  value,
  isDark,
}: {
  icon: React.ReactNode;
  label: string;
  value: any;
  isDark: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-6 border flex flex-col gap-3 transition-all ${
        isDark
          ? "bg-[#020617] border-[#1e293b] hover:border-purple-500/40"
          : "bg-white border-gray-200 hover:shadow-md"
      }`}
    >
      <div className="text-purple-500 opacity-80">{icon}</div>
      <p className="text-sm opacity-60">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

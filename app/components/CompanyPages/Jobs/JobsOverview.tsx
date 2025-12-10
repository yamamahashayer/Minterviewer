"use client";

import React from "react";
import {
  Briefcase,
  CheckCircle,
  Users,
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
  BarChart3,
} from "lucide-react";

type Theme = "dark" | "light";

export default function JobsOverview({
  jobs,
  theme,
}: {
  jobs: any[];
  theme: Theme;
}) {
  const isDark = theme === "dark";

  // ===========================
  // Stats
  // ===========================
  const activeJobs = jobs.filter((j) => j.status !== "closed");
  const closedJobs = jobs.filter((j) => j.status === "closed");
  const totalApplicants = jobs.reduce(
    (sum, job) => sum + (job.applicants?.length || 0),
    0
  );

  const mostPopular = [...jobs].sort(
    (a, b) => (b.applicants?.length || 0) - (a.applicants?.length || 0)
  )[0];

  const leastPopular = [...jobs].sort(
    (a, b) => (a.applicants?.length || 0) - (b.applicants?.length || 0)
  )[0];

  // ===========================
  // Style Classes
  // ===========================
  const card = `
    p-6 rounded-2xl border shadow-sm transition-all
    hover:shadow-md hover:-translate-y-1 duration-200
    ${isDark ? "bg-[#0F172A]/50 border-gray-700 text-white" : "bg-white border-gray-200"}
  `;

  const number = `
    text-4xl font-extrabold
    ${isDark ? "text-purple-300" : "text-purple-600"}
  `;

  const label = "text-sm font-semibold opacity-70";

  const iconBox = `
    w-10 h-10 flex items-center justify-center rounded-lg 
    bg-purple-100 text-purple-700
  `;

  return (
    <div className="space-y-8">

      {/* ====================== TOP STAT CARDS ====================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Active Jobs */}
        <div className={card}>
          <div className="flex items-center gap-3">
            <div className={iconBox}>
              <Briefcase size={20} />
            </div>
            <p className="font-semibold text-lg">Active Jobs</p>
          </div>
          <p className={`${number} mt-2`}>{activeJobs.length}</p>
        </div>

        {/* Closed Jobs */}
        <div className={card}>
          <div className="flex items-center gap-3">
            <div className={iconBox}>
              <CheckCircle size={20} />
            </div>
            <p className="font-semibold text-lg">Closed Jobs</p>
          </div>
          <p className={`${number} mt-2`}>{closedJobs.length}</p>
        </div>

        {/* Total Applicants */}
        <div className={card}>
          <div className="flex items-center gap-3">
            <div className={iconBox}>
              <Users size={20} />
            </div>
            <p className="font-semibold text-lg">Total Applicants</p>
          </div>
          <p className={`${number} mt-2`}>{totalApplicants}</p>
        </div>

      </div>

      {/* ====================== MIDDLE ROW ====================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Most Popular */}
        <div className={card}>
          <div className="flex items-center gap-3 mb-3">
            <div className={iconBox}>
              <ThumbsUp size={20} />
            </div>
            <h3 className="text-lg font-semibold">Most Popular Job</h3>
          </div>

          {mostPopular ? (
            <>
              <p className="text-lg font-bold">{mostPopular.title}</p>
              <p className={label}>
                Applicants: {mostPopular.applicants?.length || 0}
              </p>
            </>
          ) : (
            <p className={label}>No jobs posted yet.</p>
          )}
        </div>

        {/* Least Popular */}
        <div className={card}>
          <div className="flex items-center gap-3 mb-3">
            <div className={iconBox}>
              <ThumbsDown size={20} />
            </div>
            <h3 className="text-lg font-semibold">Least Popular Job</h3>
          </div>

          {leastPopular ? (
            <>
              <p className="text-lg font-bold">{leastPopular.title}</p>
              <p className={label}>
                Applicants: {leastPopular.applicants?.length || 0}
              </p>
            </>
          ) : (
            <p className={label}>No jobs posted yet.</p>
          )}
        </div>
      </div>

      
    </div>
  );
}

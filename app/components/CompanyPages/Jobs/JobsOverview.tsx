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
  CircleDot,
} from "lucide-react";
import DashboardJobsTable from "./DashboardJobsTable";
import ApplicantsBarChart from "./ApplicantsBarChart";

type Theme = "dark" | "light";

export default function JobsOverview({
  jobs,
  theme,
  onGoToJobs,
  onSelectJob,
}: {
  jobs: any[];
  theme: Theme;
  onGoToJobs: () => void;
  onSelectJob: (job: any) => void;
}) {
  const isDark = theme === "dark";

  /* ================= STATS ================= */
  const activeJobs = jobs.filter((j) => j.status !== "closed");
  const closedJobs = jobs.filter((j) => j.status === "closed");

  const totalApplicants = jobs.reduce(
    (sum, job) => sum + (job.applicants?.length || 0),
    0
  );

  const jobsThisMonth = jobs.filter((j) => {
    const created = new Date(j.createdAt);
    const now = new Date();

    return (
      created.getMonth() === now.getMonth() &&
      created.getFullYear() === now.getFullYear()
    );
  });

  const jobsThisMonthCount = jobsThisMonth.length;

  const noApplicants = jobs.filter(
    (j) => (j.applicants?.length || 0) === 0
  );

  const trendingJob = [...jobs]
    .filter((j) => {
      const days =
        (Date.now() - new Date(j.createdAt).getTime()) /
        (1000 * 60 * 60 * 24);
      return days <= 7;
    })
    .sort(
      (a, b) =>
        (b.applicants?.length || 0) -
        (a.applicants?.length || 0)
    )[0];

  const mostPopular = [...jobs].sort(
    (a, b) =>
      (b.applicants?.length || 0) -
      (a.applicants?.length || 0)
  )[0];

  const leastPopular = [...jobs].sort(
    (a, b) =>
      (a.applicants?.length || 0) -
      (b.applicants?.length || 0)
  )[0];

  /* ================= UI CLASSES ================= */
  const card = `
    p-6 rounded-2xl border shadow-sm transition
    ${
      isDark
        ? "bg-[#0F172A]/50 border-gray-700 text-white"
        : "bg-white border-gray-200"
    }
  `;

  const number = `text-4xl font-extrabold ${
    isDark ? "text-purple-300" : "text-purple-600"
  }`;

  const label = "text-sm opacity-70";

  const iconBox = `
    w-10 h-10 flex items-center justify-center rounded-lg 
    bg-purple-100 text-purple-700
  `;

  return (
    <div className="space-y-10">
      {/* ================= TOP STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Jobs */}
        <div className={card}>
          <div className="flex gap-3 items-center">
            <div className={iconBox}>
              <Briefcase size={20} />
            </div>
            <p className="font-semibold">Active Jobs</p>
          </div>
          <p className={number}>{activeJobs.length}</p>
        </div>

        {/* Closed Jobs */}
        <div className={card}>
          <div className="flex gap-3 items-center">
            <div className={iconBox}>
              <CheckCircle size={20} />
            </div>
            <p className="font-semibold">Closed Jobs</p>
          </div>
          <p className={number}>{closedJobs.length}</p>
        </div>

        {/* Total Applicants */}
        <div className={card}>
          <div className="flex gap-3 items-center">
            <div className={iconBox}>
              <Users size={20} />
            </div>
            <p className="font-semibold">Total Applicants</p>
          </div>
          <p className={number}>{totalApplicants}</p>
        </div>

        {/* Jobs This Month */}
        <div className={card}>
          <div className="flex gap-3 items-center">
            <div className={iconBox}>
              <BarChart3 size={20} />
            </div>
            <p className="font-semibold">Jobs This Month</p>
          </div>
          <p className={number}>{jobsThisMonthCount}</p>
          <p className={label}>
            Published in{" "}
            {new Date().toLocaleString("default", {
              month: "long",
            })}
          </p>
        </div>

        {/* Jobs with 0 Applicants */}
        <div className={card}>
          <div className="flex gap-3 items-center">
            <div className={iconBox}>
              <CircleDot size={20} />
            </div>
            <p className="font-semibold">Jobs with 0 Applicants</p>
          </div>
          <p className={number}>{noApplicants.length}</p>
        </div>

        {/* Trending Job */}
        <div className={card}>
          <div className="flex gap-3 items-center">
            <div className={iconBox}>
              <TrendingUp size={20} />
            </div>
            <p className="font-semibold">Trending Job</p>
          </div>
          {trendingJob ? (
            <>
              <p className="font-bold">{trendingJob.title}</p>
              <p className={label}>
                Applicants: {trendingJob.applicants?.length || 0}
              </p>
            </>
          ) : (
            <p className={label}>No trending jobs</p>
          )}
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <DashboardJobsTable
        jobs={jobs}
        theme={theme}
        onGoToJobs={onGoToJobs}
        onSelectJob={onSelectJob}
      />

      {/* ================= CHART ================= */}
      <ApplicantsBarChart jobs={jobs} theme={theme} />

      {/* ================= MOST / LEAST ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Most Popular */}
        <div className={card}>
          <div className="flex gap-3 items-center">
            <div className={iconBox}>
              <ThumbsUp size={20} />
            </div>
            <p className="font-semibold">Most Popular Job</p>
          </div>
          {mostPopular && (
            <>
              <p className="font-bold">{mostPopular.title}</p>
              <p className={label}>
                Applicants: {mostPopular.applicants?.length || 0}
              </p>
            </>
          )}
        </div>

        {/* Least Popular */}
        <div className={card}>
          <div className="flex gap-3 items-center">
            <div className={iconBox}>
              <ThumbsDown size={20} />
            </div>
            <p className="font-semibold">Least Popular Job</p>
          </div>
          {leastPopular && (
            <>
              <p className="font-bold">{leastPopular.title}</p>
              <p className={label}>
                Applicants: {leastPopular.applicants?.length || 0}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

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
}: {
  jobs: any[];
  theme: Theme;
  onGoToJobs: () => void;
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



  const avgApplicants = jobs.length
  ? Math.round(totalApplicants / jobs.length)
  : 0;

const noApplicants = jobs.filter(
  (j) => (j.applicants?.length || 0) === 0
);

const trendingJob = [...jobs]
  .filter((j) => {
    const daysAgo =
      // eslint-disable-next-line react-hooks/purity
      (Date.now() - new Date(j.createdAt).getTime()) /
      (1000 * 60 * 60 * 24);
    return daysAgo <= 7; // last 7 days
  })
  .sort(
    (a, b) => (b.applicants?.length || 0) - (a.applicants?.length || 0)
  )[0];


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

      
       {/* Avg Applicants */}
      <div className={card}>
        <div className="flex items-center gap-3">
          <div className={iconBox}>
            <BarChart3 size={20} />
          </div>
          <p className="font-semibold text-lg">Avg Applicants / Job</p>
        </div>
        <p className={`${number} mt-2`}>{avgApplicants}</p>
      </div>

        {/* Jobs With No Applicants */}
        <div className={card}>
          <div className="flex items-center gap-3">
            <div className={iconBox}>
              <CircleDot size={20} />
            </div>
            <p className="font-semibold text-lg">Jobs with 0 Applicants</p>
          </div>
          <p className={`${number} mt-2`}>{noApplicants.length}</p>
        </div>

        {/* Trending Job */}
        <div className={card}>
          <div className="flex items-center gap-3 mb-3">
            <div className={iconBox}>
              <TrendingUp size={20} />
            </div>
            <h3 className="text-lg font-semibold">Trending Job</h3>
          </div>

          {trendingJob ? (
            <>
              <p className="text-lg font-bold">{trendingJob.title}</p>
              <p className={label}>
                Applicants: {trendingJob.applicants?.length || 0}
              </p>
            </>
          ) : (
            <p className={label}>No trending jobs this week.</p>
          )}
        </div>
    </div>

     <DashboardJobsTable 
          jobs={jobs}
          theme={theme}
          onGoToJobs={onGoToJobs}
        />
    <ApplicantsBarChart jobs={jobs}  theme={theme} />


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

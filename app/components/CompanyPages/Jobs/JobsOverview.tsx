"use client";

import React from "react";

type Theme = "dark" | "light";

export default function JobsOverview({
  jobs,
  theme,
}: {
  jobs: any[];
  theme: Theme;
}) {
  const isDark = theme === "dark";

  // ==============================
  // Derive Stats
  // ==============================

  const activeJobs = jobs.filter((j) => j.status !== "closed");
  const closedJobs = jobs.filter((j) => j.status === "closed");

  const totalApplicants = jobs.reduce((sum, job) => sum + (job.applicants?.length || 0), 0);

  const mostPopular = [...jobs].sort(
    (a, b) => (b.applicants?.length || 0) - (a.applicants?.length || 0)
  )[0];

  const leastPopular = [...jobs].sort(
    (a, b) => (a.applicants?.length || 0) - (b.applicants?.length || 0)
  )[0];

  // Card Styles
  const cardClass = `
    p-6 rounded-xl border shadow-sm 
    ${isDark ? "bg-[#0f0f0f] border-gray-700" : "bg-white border-gray-200"}
  `;

  const numberClass = `
    text-4xl font-bold
    ${isDark ? "text-purple-400" : "text-purple-600"}
  `;

  return (
    <div className="space-y-6">

      {/* ========= ROW 1: STAT CARDS ========= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Active Jobs */}
        <div className={cardClass}>
          <p className="font-semibold mb-2">Active Jobs</p>
          <p className={numberClass}>{activeJobs.length}</p>
        </div>

        {/* Closed Jobs */}
        <div className={cardClass}>
          <p className="font-semibold mb-2">Closed Jobs</p>
          <p className={numberClass}>{closedJobs.length}</p>
        </div>

        {/* Total Applicants */}
        <div className={cardClass}>
          <p className="font-semibold mb-2">Total Applicants</p>
          <p className={numberClass}>{totalApplicants}</p>
        </div>

      </div>

      {/* ========= ROW 2: POPULARITY ========= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Most Popular Job */}
        <div className={cardClass}>
          <h3 className="text-lg font-semibold mb-3">
            Most Popular Job
          </h3>

          {mostPopular ? (
            <div>
              <p className="font-bold text-lg">{mostPopular.title}</p>
              <p className="text-sm opacity-70">
                Applicants: {mostPopular.applicants?.length || 0}
              </p>
            </div>
          ) : (
            <p>No jobs posted yet.</p>
          )}
        </div>

        {/* Least Popular Job */}
        <div className={cardClass}>
          <h3 className="text-lg font-semibold mb-3">
            Least Popular Job
          </h3>

          {leastPopular ? (
            <div>
              <p className="font-bold text-lg">{leastPopular.title}</p>
              <p className="text-sm opacity-70">
                Applicants: {leastPopular.applicants?.length || 0}
              </p>
            </div>
          ) : (
            <p>No jobs posted yet.</p>
          )}
        </div>
      </div>

      {/* ========= ROW 3 — PIPELINE PREVIEW ========= */}
      <div className={cardClass}>
        <h3 className="text-lg font-semibold mb-4">Application Pipeline Overview</h3>

        <p className="text-sm opacity-80 mb-3">
          Snapshot of your hiring flow across all job posts.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <div>
            <p className="font-semibold">Submitted</p>
            <p className={numberClass}>
              {totalApplicants}
            </p>
          </div>

          <div>
            <p className="font-semibold">Screening</p>
            <p className={numberClass}>
              {Math.floor(totalApplicants * 0.6)}
            </p>
          </div>

          <div>
            <p className="font-semibold">Interviewing</p>
            <p className={numberClass}>
              {Math.floor(totalApplicants * 0.3)}
            </p>
          </div>

          <div>
            <p className="font-semibold">Finalists</p>
            <p className={numberClass}>
              {Math.floor(totalApplicants * 0.1)}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

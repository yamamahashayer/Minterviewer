"use client";

import React, { useMemo, useState } from "react";
import JobList from "./JobList";
import JobCard from "./JobCard";
import CreateJobInlineForm from "./CreateJobInlineForm";
import JobsOverview from "./JobsOverview";
import ApplicantsList from "./ApplicantsList";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/app/components/ui/tabs";

type Theme = "dark" | "light";

export default function JobsPageComponent({
  theme,
  jobs,
  refreshJobs,
}: {
  theme: Theme;
  jobs: any[];
  refreshJobs: () => void;
}) {
  const isDark = theme === "dark";
  const [mainTab, setMainTab] = useState("overview");

  /* ================= FILTERS ================= */
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [level, setLevel] = useState("all");
  const [applicantsFilter, setApplicantsFilter] = useState("all");

  /* ================= FOCUSED JOB ================= */
  const [focusedJob, setFocusedJob] = useState<any | null>(null);

  /* ================= APPLICANTS ================= */
  const [showApplicants, setShowApplicants] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [applicants, setApplicants] = useState<any[]>([]);

  /* ================= FILTERED JOBS ================= */
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const count = job.applicants?.length ?? 0;

      const matchesSearch =
        !search ||
        job.title?.toLowerCase().includes(search.toLowerCase()) ||
        job.location?.toLowerCase().includes(search.toLowerCase()) ||
        job.skills?.some((s: string) =>
          s.toLowerCase().includes(search.toLowerCase())
        );

      const matchesStatus = status === "all" || job.status === status;
      const matchesType = type === "all" || job.type === type;
      const matchesLevel = level === "all" || job.level === level;

      const matchesApplicants =
        applicantsFilter === "all" ||
        (applicantsFilter === "none" && count === 0) ||
        (applicantsFilter === "low" && count <= 10) ||
        (applicantsFilter === "medium" && count > 10 && count <= 50) ||
        (applicantsFilter === "high" && count > 50 && count <= 100) ||
        (applicantsFilter === "very-high" && count > 100);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType &&
        matchesLevel &&
        matchesApplicants
      );
    });
  }, [jobs, search, status, type, level, applicantsFilter]);

  /* ================= TABLE → CARD ================= */
  const handleSelectJobFromTable = (job: any) => {
    setFocusedJob(job);
    setShowApplicants(false);
    setMainTab("jobs");
  };

  /* ================= VIEW APPLICANTS ================= */
  const handleViewApplicants = async (job: any) => {
    setSelectedJob(job);
    setShowApplicants(true);

    const raw = sessionStorage.getItem("user");
    if (!raw) return;
    const user = JSON.parse(raw);

    const res = await fetch(
      `/api/company/${user.companyId}/jobs/${job._id}/applicants`
    );
    const data = await res.json();
    setApplicants(data.ok ? data.applicants : []);
  };

  return (
             <div
          className={`
            min-h-screen p-6 space-y-8
            ${isDark
              ? "bg-[#020617] text-white"
              : "bg-[#f8fafc] text-black"}
          `}
        >

      {/* ================= HEADER ================= */}
      <div
        className={`
          relative overflow-hidden rounded-2xl p-8 border
          ${
            isDark
              ? "bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#0b1220] border-[#1e293b]"
              : "bg-gradient-to-br from-purple-100 via-pink-50 to-purple-50 border-purple-200"
          }
        `}
      >
        <h1
          className={`text-4xl font-extrabold tracking-tight
            ${isDark ? "text-purple-300" : "text-[#4c1d95]"}`}
        >
          Job Posts
        </h1>
        <p
          className={`mt-2 max-w-xl
            ${isDark ? "text-slate-400" : "text-purple-700"}`}
        >
          Manage your jobs, track applicants, and control your hiring process.
        </p>
      </div>

      <Tabs value={mainTab} onValueChange={setMainTab}>
        {/* ================= TABS ================= */}
        <TabsList
          className={`
            rounded-xl p-1 w-fit
            ${isDark ? "bg-[#020617] border border-[#1e293b]" : "bg-white border"}
          `}
        >
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="create">Create Job</TabsTrigger>
        </TabsList>

        {/* ================= OVERVIEW ================= */}
        <TabsContent value="overview">
          <JobsOverview
            jobs={jobs}
            theme={theme}
            onGoToJobs={() => setMainTab("jobs")}
            onSelectJob={handleSelectJobFromTable}
          />
        </TabsContent>

        {/* ================= JOBS ================= */}
        <TabsContent value="jobs">
          {/* ===== FILTERS ===== */}
          <div
            className={`
              rounded-xl p-4 border flex flex-wrap gap-4 mb-6
              ${isDark ? "bg-[#020617] border-[#1e293b]" : "bg-white border-gray-200"}
            `}
          >
            <input
              placeholder="Search jobs…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`
                px-4 py-2 rounded-lg text-sm outline-none w-64
                ${isDark
                  ? "bg-[#020617] border border-[#1e293b] text-white"
                  : "bg-white border border-gray-300"}
              `}
            />

            {[status, type, level, applicantsFilter].map((_, i) => null)}

            <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 rounded-lg border">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>

            <select value={type} onChange={(e) => setType(e.target.value)} className="px-3 py-2 rounded-lg border">
              <option value="all">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
            </select>

            <select value={level} onChange={(e) => setLevel(e.target.value)} className="px-3 py-2 rounded-lg border">
              <option value="all">All Levels</option>
              <option value="Entry">Entry</option>
              <option value="Junior">Junior</option>
              <option value="Mid">Mid</option>
              <option value="Senior">Senior</option>
            </select>

            <select
              value={applicantsFilter}
              onChange={(e) => setApplicantsFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border"
            >
              <option value="all">Any Applicants</option>
              <option value="none">No Applicants</option>
              <option value="low">Low (1–10)</option>
              <option value="medium">Medium (11–50)</option>
              <option value="high">High (51–100)</option>
              <option value="very-high">Very High (100+)</option>
            </select>
          </div>

          {/* ===== SINGLE JOB ===== */}
          {focusedJob && !showApplicants && (
            <>
              <button
                onClick={() => setFocusedJob(null)}
                className={`
                  flex items-center gap-2 text-sm font-semibold mb-4
                  ${isDark ? "text-purple-300" : "text-purple-700"}
                `}
              >
                ← Back to all jobs
              </button>

              <JobCard
                job={focusedJob}
                theme={theme}
                onEdit={() => {}}
                onClose={() => {}}
                onDelete={() => {}}
                onViewApplicants={handleViewApplicants}
              />
            </>
          )}

          {/* ===== ALL JOBS ===== */}
          {!focusedJob && !showApplicants && (
            <JobList
              jobs={filteredJobs}
              theme={theme}
              onEdit={() => {}}
              onClose={() => {}}
              onDelete={() => {}}
              onViewApplicants={handleViewApplicants}
            />
          )}

          {/* ===== APPLICANTS ===== */}
          {showApplicants && selectedJob && (
            <ApplicantsList
              applicants={applicants}
              job={selectedJob}
              theme={theme}
              onBack={() => {
                setShowApplicants(false);
                setSelectedJob(null);
              }}
            />
          )}
        </TabsContent>

        {/* ================= CREATE ================= */}
        <TabsContent value="create">
          <CreateJobInlineForm
            theme={theme}
            onCancel={() => setMainTab("overview")}
            onSaved={() => {
              refreshJobs();
              setMainTab("jobs");
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

"use client";

import React, { useMemo, useState } from "react";
import JobList from "./JobList";
import JobCard from "./JobCard";
import CreateJobInlineForm from "./CreateJobInlineForm";
import JobsOverview from "./JobsOverview";
import ApplicantsList from "./ApplicantsList";
import PublicMenteeProfile from "@/app/components/PublicProfiles/PublicMenteeProfile";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/app/components/ui/tabs";

import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  Users,
  Brain,
  Mic,
  Award,
} from "lucide-react";
import JobsTimelineChart from "./JobsTimelineChart";

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

  /* ================= JOB STATES ================= */
  const [focusedJob, setFocusedJob] = useState<any | null>(null);
  const [showApplicants, setShowApplicants] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [applicants, setApplicants] = useState<any[]>([]);

  /* ================= PROFILE VIEW ================= */
  const [viewingMenteeId, setViewingMenteeId] = useState<string | null>(null);

  const isJobsListView = !focusedJob && !showApplicants;

  /* ================= FILTERED JOBS ================= */
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const count = job.applicants?.length ?? 0;

      const matchesSearch =
        !search ||
        job.title?.toLowerCase().includes(search.toLowerCase()) ||
        job.location?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        status === "all" || job.status === status;

      const matchesType =
        type === "all" || job.type === type;

      const matchesLevel =
        level === "all" || job.level === level;

      const matchesApplicants =
        applicantsFilter === "all" ||
        (applicantsFilter === "none" && count === 0) ||
        (applicantsFilter === "low" && count <= 10) ||
        (applicantsFilter === "medium" &&
          count > 10 &&
          count <= 50) ||
        (applicantsFilter === "high" && count > 50);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType &&
        matchesLevel &&
        matchesApplicants
      );
    });
  }, [jobs, search, status, type, level, applicantsFilter]);

  /* ================= HELPERS ================= */
  const getCompanyId = () => {
    const raw = sessionStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw).companyId;
  };

  const handleEditJob = (job: any) => {
    setFocusedJob(job);
    setMainTab("create");
  };

  const handleCloseJob = async (jobId: string) => {
    const companyId = getCompanyId();
    if (!companyId) return;

    await fetch(`/api/company/${companyId}/jobs/${jobId}`, {
      method: "PATCH",
    });

    refreshJobs();
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    const companyId = getCompanyId();
    if (!companyId) return;

    await fetch(`/api/company/${companyId}/jobs/${jobId}`, {
      method: "DELETE",
    });

    refreshJobs();
  };

  const handleViewApplicants = async (job: any) => {
    setSelectedJob(job);
    setShowApplicants(true);

    const companyId = getCompanyId();
    if (!companyId) return;

    const res = await fetch(
      `/api/company/${companyId}/jobs/${job._id}/applicants`
    );
    const data = await res.json();
    setApplicants(data.ok ? data.applicants : []);
  };

  /* ================= PROFILE MODE ================= */
  if (viewingMenteeId) {
    return (
      <div
        className={`min-h-screen p-8 ${
          isDark ? "bg-[#020617] text-white" : "bg-white text-black"
        }`}
      >
        <button
          onClick={() => setViewingMenteeId(null)}
          className="mb-6 underline opacity-70 hover:opacity-100"
        >
          ← Back to applicants
        </button>

        <PublicMenteeProfile menteeId={viewingMenteeId} />
      </div>
    );
  }

  /* ================= PAGE ================= */
  return (
    <div
      className={`min-h-screen p-6 space-y-8 ${
        isDark ? "bg-[#020617] text-white" : "bg-[#f8fafc] text-black"
      }`}
    >
{/* ================= HEADER ================= */}
<div
  className={`relative rounded-2xl px-8 py-10 border mb-10 overflow-hidden
    ${isDark
      ? "bg-[#020617] border-[#1e293b]"
      : "bg-white border-gray-200"
    }
  `}
>
  {/* very subtle accent */}
  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-transparent" />

  <div className="relative space-y-4 animate-fade-in">
    <h1
      className={`text-4xl font-extrabold tracking-tight
        ${isDark ? "text-white" : "text-gray-900"}
      `}
    >
      Hire with{" "}
      <span className="text-purple-500">confidence</span>
    </h1>

    <p
      className={`max-w-2xl text-base
        ${isDark ? "text-slate-400" : "text-gray-600"}
      `}
    >
      Analyze CVs, run interviews, and focus on the
      <span className="text-purple-500 font-medium"> top candidates </span>
      — without the noise.
    </p>
  </div>
</div>



      {/* ================= CHART ================= */}
      <JobsTimelineChart jobs={jobs} theme={theme} />


      {/* NAV TABS */}
      <Tabs value={mainTab} onValueChange={setMainTab}>
        <TabsList
          className={`
            flex gap-1 p-1 rounded-2xl w-fit
            ${isDark
              ? "bg-white/5 border border-white/10"
              : "bg-gray-100 border border-gray-200"}
          `}
        >
          <TabsTrigger
            value="overview"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition
              data-[state=active]:bg-purple-600
              data-[state=active]:text-white
              data-[state=inactive]:opacity-70
              hover:opacity-100"
          >
            <LayoutDashboard size={16} />
            Overview
          </TabsTrigger>

          <TabsTrigger
            value="jobs"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition
              data-[state=active]:bg-purple-600
              data-[state=active]:text-white
              data-[state=inactive]:opacity-70
              hover:opacity-100"
          >
            <Briefcase size={16} />
            Jobs
          </TabsTrigger>

          <TabsTrigger
            value="create"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition
              data-[state=active]:bg-purple-600
              data-[state=active]:text-white
              data-[state=inactive]:opacity-70
              hover:opacity-100"
          >
            <PlusCircle size={16} />
            Create Job
          </TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview">
          <JobsOverview
            jobs={jobs}
            theme={theme}
            onGoToJobs={() => setMainTab("jobs")}
            onSelectJob={(job) => {
              setFocusedJob(job);
              setMainTab("jobs");
            }}
          />
        </TabsContent>

        {/* JOBS */}
        <TabsContent value="jobs">
          {/* 🔍 FILTER BAR (رجعت كاملة 👇) */}
          {isJobsListView && (
            <div
              className={`mb-6 flex flex-wrap gap-3 items-center rounded-xl p-4 border
                ${isDark
                  ? "bg-white/5 border-white/10"
                  : "bg-white border-gray-200"}
              `}
            >
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search title or location"
                className={`px-3 py-2 rounded-lg text-sm outline-none
                  ${isDark
                    ? "bg-[#020617] border border-white/10 text-white"
                    : "bg-white border border-gray-300 text-black"}
                `}
              />

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={`px-3 py-2 rounded-lg text-sm outline-none
                  ${isDark
                    ? "bg-[#020617] border border-white/10 text-white"
                    : "bg-white border border-gray-300 text-black"}
                `}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
              </select>

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={`px-3 py-2 rounded-lg text-sm outline-none
                  ${isDark
                    ? "bg-[#020617] border border-white/10 text-white"
                    : "bg-white border border-gray-300 text-black"}
                `}
              >
                <option value="all">All Types</option>
                <option value="Remote">Remote</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
              </select>

              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className={`px-3 py-2 rounded-lg text-sm outline-none
                  ${isDark
                    ? "bg-[#020617] border border-white/10 text-white"
                    : "bg-white border border-gray-300 text-black"}
                `}
              >
                <option value="all">All Levels</option>
                <option value="Junior">Junior</option>
                <option value="Mid">Mid</option>
                <option value="Senior">Senior</option>
              </select>
            </div>
          )}

          {/* SINGLE JOB */}
          {focusedJob && !showApplicants && (
            <>
              <button
                onClick={() => setFocusedJob(null)}
                className="mb-4 underline"
              >
                ← Back to all jobs
              </button>

              <JobCard
                job={focusedJob}
                theme={theme}
                onEdit={() => handleEditJob(focusedJob)}
                onClose={() => handleCloseJob(focusedJob._id)}
                onDelete={() => handleDeleteJob(focusedJob._id)}
                onViewApplicants={handleViewApplicants}
              />
            </>
          )}

          {/* ALL JOBS */}
          {isJobsListView && (
            <JobList
              jobs={filteredJobs}
              theme={theme}
              onEdit={handleEditJob}
              onClose={handleCloseJob}
              onDelete={handleDeleteJob}
              onViewApplicants={handleViewApplicants}
            />
          )}

          {/* APPLICANTS */}
          {showApplicants && selectedJob && (
            <ApplicantsList
              applicants={applicants}
              job={selectedJob}
              theme={theme}
              onViewProfile={(menteeId) =>
                setViewingMenteeId(menteeId)             
              }
               onBack={() => {
                  setShowApplicants(false);
                  setSelectedJob(null);
                }}
            />
          )}
        </TabsContent>

        {/* CREATE */}
        <TabsContent value="create">
          <CreateJobInlineForm
            theme={theme}
            job={focusedJob}
            onCancel={() => {
              setFocusedJob(null);
              setMainTab("overview");
            }}
            onSaved={() => {
              refreshJobs();
              setFocusedJob(null);
              setMainTab("jobs");
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

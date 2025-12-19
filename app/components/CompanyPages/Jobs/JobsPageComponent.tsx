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

  /* ================= FILTERED JOBS ================= */
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const count = job.applicants?.length ?? 0;

      const matchesSearch =
        !search ||
        job.title?.toLowerCase().includes(search.toLowerCase()) ||
        job.location?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = status === "all" || job.status === status;
      const matchesType = type === "all" || job.type === type;
      const matchesLevel = level === "all" || job.level === level;

      const matchesApplicants =
        applicantsFilter === "all" ||
        (applicantsFilter === "none" && count === 0) ||
        (applicantsFilter === "low" && count <= 10) ||
        (applicantsFilter === "medium" && count > 10 && count <= 50) ||
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

  /* ======================================================
     🔥 FULL SCREEN PROFILE MODE (يخفي كل شيء)
     ====================================================== */
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

  /* ======================================================
     🟢 NORMAL JOBS PAGE
     ====================================================== */
  return (
    <div
      className={`min-h-screen p-6 space-y-8 ${
        isDark ? "bg-[#020617] text-white" : "bg-[#f8fafc] text-black"
      }`}
    >
      {/* ================= HEADER ================= */}
      <div className="rounded-2xl p-8 border">
        <h1 className="text-4xl font-extrabold">Job Posts</h1>
        <p className="opacity-60 mt-2">
          Manage your jobs and review applicants.
        </p>
      </div>

      <Tabs value={mainTab} onValueChange={setMainTab}>
        <TabsList className="rounded-xl p-1 w-fit border">
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
            onSelectJob={(job) => {
              setFocusedJob(job);
              setMainTab("jobs");
            }}
          />
        </TabsContent>

        {/* ================= JOBS ================= */}
        <TabsContent value="jobs">
          {/* ===== SINGLE JOB ===== */}
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
              onViewProfile={(menteeId) =>
                setViewingMenteeId(menteeId)
              }
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

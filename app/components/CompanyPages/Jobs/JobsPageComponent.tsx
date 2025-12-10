"use client";

import React, { useState } from "react";
import JobList from "./JobList";
import CreateJobInlineForm from "./CreateJobInlineForm";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/app/components/ui/tabs";

import JobsOverview from "./JobsOverview";
import ApplicantsList from "./ApplicantsList";

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
  const [showSuccess, setShowSuccess] = useState(false);
  const [editJob, setEditJob] = useState<any | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const isDark = theme === "dark";
  const [mainTab, setMainTab] = useState("overview");

  // ⭐ NEW STATES للمتقدمين
  const [showApplicants, setShowApplicants] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [applicants, setApplicants] = useState<any[]>([]);

  const onGoToJobs = () => {
    setMainTab("jobs");
  };

  /* ==================================
        VIEW APPLICANTS
  =================================== */
  const handleViewApplicants = async (jobId: string) => {
    setSelectedJobId(jobId);
    setShowApplicants(true);

    const res = await fetch(`/api/company/jobs/${jobId}/applicants`);
    const data = await res.json();

    if (data.ok) {
      setApplicants(data.applicants);
    }
  };

  /* ==================================
        HANDLERS
  =================================== */

  const handleEdit = (job: any) => {
    setEditJob({ ...job }); // deep copy
  };

  const handleClose = async (jobId: string) => {
    const raw = sessionStorage.getItem("user");
    const user = JSON.parse(raw!);
    const companyId = user.companyId;

    await fetch(`/api/company/${companyId}/jobs/${jobId}`, {
      method: "PATCH",
    });

    refreshJobs();
  };

  const handleDelete = async (jobId: string) => {
    const confirmed = confirm("Are you sure you want to delete this job?");
    if (!confirmed) return;

    const raw = sessionStorage.getItem("user");
    const user = JSON.parse(raw!);
    const companyId = user.companyId;

    await fetch(`/api/company/${companyId}/jobs/${jobId}`, {
      method: "DELETE",
    });

    refreshJobs();
  };

  /* ==================================
        UPDATE HANDLER (PUT)
  =================================== */

  const saveEdit = async () => {
    if (!editJob) return;
    setSavingEdit(true);

    const raw = sessionStorage.getItem("user");
    const user = JSON.parse(raw!);
    const companyId = user.companyId;

    await fetch(`/api/company/${companyId}/jobs/${editJob._id}`, {
      method: "PUT",
      body: JSON.stringify(editJob),
    });

    setSavingEdit(false);
    setEditJob(null);
    refreshJobs();
  };

  return (
    <div className={`p-6 space-y-6 ${isDark ? "text-white" : "text-black"}`}>

      {/* HEADER */}
      <div
        className="
          w-full rounded-xl p-6 mb-6 
          bg-gradient-to-r from-purple-100/50 to-pink-100/40 
          border border-purple-200/40
        "
      >
        <h1 className="text-3xl font-bold text-[#4c1d95]">Job Posts</h1>
        <p className="text-[#6b21a8] mt-1">
          Manage all your openings, view applicants, and create new positions.
        </p>
      </div>

      {/* MAIN TABS */}
      <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">

        <TabsList
          className={`
            flex gap-1 w-fit rounded-lg p-2
            ${isDark ? "bg-gray-800" : "bg-gray-200"}
          `}
        >
          <TabsTrigger value="overview" className="px-5 py-3">Overview</TabsTrigger>
          <TabsTrigger value="jobs" className="px-5 py-3">Jobs</TabsTrigger>
          <TabsTrigger value="create" className="px-5 py-3">Create Job</TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview">
          <JobsOverview
            jobs={jobs}
            theme={theme}
            onGoToJobs={() => setMainTab("jobs")}
          />
        </TabsContent>

        {/* JOB LIST OR APPLICANTS – نفس التاب */}
        <TabsContent value="jobs">

          {/* 👉 لو مش ضاغطة View Applicants */}
          {!showApplicants && (
            <JobList
              jobs={jobs}
              theme={theme}
              onEdit={setEditJob}
              onClose={handleClose}
              onDelete={handleDelete}
              onViewApplicants={handleViewApplicants}   // ⭐ مهم جداً
            />
          )}

          {/* 👉 لو ضاغطة View Applicants */}
          {showApplicants && (
            <ApplicantsList
              applicants={applicants}
              theme={theme}
              onBack={() => setShowApplicants(false)}
            />
          )}

        </TabsContent>

        {/* CREATE JOB */}
        <TabsContent value="create">
          <CreateJobInlineForm
            theme={theme}
            onCancel={() => setMainTab("overview")}
            onSaved={() => {
              refreshJobs();
              setShowSuccess(true);
              setTimeout(() => setShowSuccess(false), 2000);
              setMainTab("jobs");
            }}
          />
        </TabsContent>

      </Tabs>
    </div>
  );
}

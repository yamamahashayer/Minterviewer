"use client";

import React, { useState, useEffect } from "react";
import JobList from "./JobList";
import CreateJobInlineForm from "./CreateJobInlineForm";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/app/components/ui/tabs";
import JobsOverview from "./JobsOverview";

type Theme = "dark" | "light";

export default function JobsPage({ theme }: { theme: Theme }) {
  const [jobs, setJobs] = useState<any[]>([]);
  const isDark = theme === "dark";

  /* =============================
        FETCH JOBS
  ============================== */
  const fetchJobs = async () => {
    try {
      const raw = sessionStorage.getItem("user");
      if (!raw) return;

      const user = JSON.parse(raw);
      const companyId = user?.companyId;
      if (!companyId) return;

      const res = await fetch(`/api/company/${companyId}/jobs`);
      const data = await res.json();

      if (data.ok) setJobs(data.jobs);
    } catch (err) {
      console.error("Fetch Jobs Error:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  /* COUNTS */
  const activeCount = jobs.filter((j) => j.status !== "closed").length;
  const closedCount = jobs.filter((j) => j.status === "closed").length;

  return (
    <div className={`p-6 space-y-6 ${isDark ? "text-white" : "text-black"}`}>

      {/* HEADER */}
      <div
        className="
        w-full rounded-xl p-6 mb-6 
        bg-gradient-to-r from-purple-100/50 to-pink-100/40 
        border border-purple-200/40"
      >
        <h1 className="text-3xl font-bold text-[#4c1d95]">Job Posts</h1>
        <p className="text-[#6b21a8] mt-1">
          Manage all your openings, view applicants, and create new positions.
        </p>
      </div>

      {/* =============================
              MAIN TABS
      ============================== */}
      <Tabs defaultValue="overview" className="w-full">

        {/* ⭐ BIG TABS */}
        <TabsList
          className={`
            flex gap-1 w-fit rounded-lg p-2
            ${isDark ? "bg-gray-800" : "bg-gray-200"}
          `}
        >
          <TabsTrigger
            value="overview"
            className="
              px-5 py-3 text-base font-semibold rounded-md
              data-[state=active]:bg-white data-[state=active]:shadow
            "
          >
            Overview
          </TabsTrigger>

          <TabsTrigger
            value="jobs"
            className="
              px-5 py-3 text-base font-semibold rounded-md
              data-[state=active]:bg-white data-[state=active]:shadow
            "
          >
            Jobs
          </TabsTrigger>

          <TabsTrigger
            value="create"
            className="
              px-5 py-3 text-base font-semibold rounded-md
              data-[state=active]:bg-white data-[state=active]:shadow
            "
          >
            Create Job
          </TabsTrigger>
        </TabsList>

        {/* ⭐ OVERVIEW TAB */}
        <TabsContent value="overview">
        <JobsOverview jobs={jobs} theme={theme} />
      </TabsContent>


        {/* ⭐ JOBS LIST */}
        <TabsContent value="jobs">
          <JobList jobs={jobs} theme={theme} />
        </TabsContent>

        {/* ⭐ CREATE JOB */}
        <TabsContent value="create">
          <CreateJobInlineForm
            theme={theme}
            onCancel={() => {}}
            onSaved={() => fetchJobs()}
          />
        </TabsContent>

      </Tabs>
    </div>
  );
}

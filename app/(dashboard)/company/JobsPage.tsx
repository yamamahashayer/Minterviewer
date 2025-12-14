"use client";

import JobsPageComponent from "@/app/components/CompanyPages/Jobs/JobsPageComponent";
import React, { useState, useEffect } from "react";

type Theme = "dark" | "light";

export default function JobsPage({ theme }: { theme: Theme }) {
  const [jobs, setJobs] = useState([]);

  const isDark = theme === "dark";

  const fetchJobs = async () => {
    try {
      const raw = sessionStorage.getItem("user");
      if (!raw) return;

      const user = JSON.parse(raw);
      const companyId = user.companyId;

      const res = await fetch(`/api/company/${companyId}/jobs`);
      const data = await res.json();

      if (data.ok) setJobs(data.jobs);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
  <div
    className={`
      min-h-screen p-6
      ${isDark
        ? "bg-[#020617] text-white"
        : "bg-[#f8fafc] text-black"}
    `}
  >
    <JobsPageComponent
      theme={theme}
      jobs={jobs}
      refreshJobs={fetchJobs}
    />
  </div>
);

}

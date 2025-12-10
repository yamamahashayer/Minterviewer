"use client";

import React, { useState, useEffect } from "react";
import JobCreateButton from "@/app/components/CompanyPages/Jobs/JobCreateButton";
import JobList from "@/app/components/CompanyPages/Jobs/JobList";
import JobCreateDialog from "@/app/components/CompanyPages/Jobs/JobCreateDialog";

type Theme = "dark" | "light";

export default function JobsPage({ theme }: { theme: Theme }) {
  const [open, setOpen] = useState(false);
  const [jobs, setJobs] = useState([]);

  const isDark = theme === "dark";

  const fetchJobs = async () => {
    try {
      // 🔥 جلب companyId من sessionStorage
      const raw = sessionStorage.getItem("user");
      if (!raw) return;

      const user = JSON.parse(raw);
      const companyId = user?.companyId;

      if (!companyId) {
        console.error("No companyId found in sessionStorage");
        return;
      }

      // 🔥 استدعاء endpoint الجديد
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
    <div className={`p-6 ${isDark ? "text-white" : "text-black"}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Job Posts</h1>
        <JobCreateButton onOpen={() => setOpen(true)} />
      </div>

      {/* Job List */}
      <JobList jobs={jobs} theme={theme} />

      {/* Dialog */}
      {open && (
        <JobCreateDialog
          onClose={() => {
            setOpen(false);
            fetchJobs(); // إعادة تحميل القائمة بعد إنشاء وظيفة
          }}
        />
      )}
    </div>
  );
}

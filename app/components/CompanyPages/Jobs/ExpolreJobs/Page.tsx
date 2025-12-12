"use client";

import JobCard from "@/app/components/CompanyPages/Jobs/ExpolreJobs/JobCard";
import JobDetailsDrawer from "@/app/components/CompanyPages/Jobs/ExpolreJobs/JobDetailsDrawer";
import React, { useEffect, useState } from "react";

export default function ExploreJobsPage({ theme = "dark" }) {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const isDark = theme === "dark";

  // Fetch active jobs
  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/company/jobs");
      const data = await res.json();
      if (data.ok) setJobs(data.jobs);
    } catch (err) {
      console.log("Error fetching jobs:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div
      className={`p-6 min-h-screen ${
        isDark ? "text-white bg-[#0a0f1e]" : "text-black bg-gray-50"
      }`}
    >
      <h1 className="text-3xl font-bold mb-6">Explore Jobs</h1>

      {jobs.length === 0 && (
        <p className="opacity-60">No jobs available yet.</p>
      )}

      {/* JOBS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map((job: any) => (
          <JobCard
            key={job._id}
            job={job}
            isDark={isDark}
            onSelect={() => {
              setSelectedJob(job);
              setDrawerOpen(true);
            }}
          />
        ))}
      </div>

      {/* DRAWER */}
      <JobDetailsDrawer
        job={selectedJob}
        isDark={isDark}
        open={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}

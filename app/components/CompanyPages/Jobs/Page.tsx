"use client";

import React, { useState, useEffect } from "react";
import JobCreateButton from "./JobCreateButton";
import JobList from "./JobList";

export default function JobsPage() {
  const [open, setOpen] = useState(false);
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/company/jobs");
      const data = await res.json();
      if (data.ok) setJobs(data.jobs);
    } catch (err) {
      console.error("Fetch Jobs Error:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Job Posts</h1>
        <JobCreateButton onOpen={() => setOpen(true)} />
      </div>

      <JobList jobs={jobs} />

      {open && (
        <JobCreateDialog
          onClose={() => {
            setOpen(false);
            fetchJobs(); // reload list after create
          }}
        />
      )}
    </div>
  );
}

"use client";

import React from "react";
import JobCard from "./JobCard";

export default function JobList({
  jobs,
  theme,
  onEdit,
  onClose,
  onDelete,
  onViewApplicants,
}: {
  jobs: any[];
  theme: "dark" | "light";
  onEdit: (job: any) => void;
  onClose: (id: string) => void;
  onDelete: (id: string) => void;
  onViewApplicants: (job: any) => void;
}) {
  if (jobs.length === 0) {
    return (
      <p className="text-gray-500 text-sm">
        No jobs found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {jobs.map((job) => (
        <JobCard
          key={job._id}
          job={job}
          theme={theme}
          onEdit={() => onEdit(job)}
          onClose={() => onClose(job._id)}
          onDelete={() => onDelete(job._id)}
          onViewApplicants={() => onViewApplicants(job)}
        />
      ))}
    </div>
  );
}

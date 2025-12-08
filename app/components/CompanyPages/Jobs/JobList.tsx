"use client";

import JobCard from "./JobCard";

export default function JobList({ jobs, theme }: { jobs: any[]; theme: "dark" | "light" }) {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {jobs.map((job) => (
        <JobCard key={job._id} job={job} theme={theme} />
      ))}
    </div>
  );
}

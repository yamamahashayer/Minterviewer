"use client";

import JobCard from "@/app/components/CompanyPages/Jobs/ExpolreJobs/JobCard";
import JobDetailsDrawer from "@/app/components/CompanyPages/Jobs/ExpolreJobs/JobDetailsDrawer";
import React, { useEffect, useMemo, useState } from "react";

export default function ExploreJobsPage({ theme = "dark" }) {
  const isDark = theme === "dark";

  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  // 🔍 Filters
  const [search, setSearch] = useState("");
  const [company, setCompany] = useState("all");
  const [type, setType] = useState("all");
  const [level, setLevel] = useState("all");

  /* ================= FETCH JOBS ================= */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/company/jobs");
        const data = await res.json();
        if (data.ok) setJobs(data.jobs);
      } catch (err) {
        console.error("Fetch jobs error:", err);
      }
    })();
  }, []);

  /* ================= OPTIONS ================= */
  const companies = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.companyId?.name).filter(Boolean))),
    [jobs]
  );

  /* ================= FILTERED JOBS ================= */
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        !search ||
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.companyId?.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        job.skills?.some((s: string) =>
          s.toLowerCase().includes(search.toLowerCase())
        );

      const matchesCompany =
        company === "all" || job.companyId?.name === company;

      const matchesType = type === "all" || job.type === type;
      const matchesLevel = level === "all" || job.level === level;

      return (
        matchesSearch &&
        matchesCompany &&
        matchesType &&
        matchesLevel
      );
    });
  }, [jobs, search, company, type, level]);

  return (
    <div
      className={`p-6 min-h-screen ${
        isDark ? "bg-[#0a0f1e] text-white" : "bg-gray-50 text-black"
      }`}
    >
      <h1 className="text-3xl font-bold mb-6">Explore Jobs</h1>

      {/* 🔍 FILTER BAR */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          placeholder="Search jobs, companies, skills…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg border w-full md:w-64 bg-transparent"
        />

        <select
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="px-3 py-2 rounded-lg border bg-transparent"
        >
          <option value="all">All Companies</option>
          {companies.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="px-3 py-2 rounded-lg border bg-transparent"
        >
          <option value="all">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Internship">Internship</option>
        </select>

        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="px-3 py-2 rounded-lg border bg-transparent"
        >
          <option value="all">All Levels</option>
          <option value="Entry">Entry</option>
          <option value="Junior">Junior</option>
          <option value="Mid">Mid</option>
          <option value="Senior">Senior</option>
        </select>
      </div>

      {/* 🧱 JOBS GRID */}
      {filteredJobs.length === 0 ? (
        <p className="opacity-60">No jobs match your filters.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              isDark={isDark}
              onSelect={(j) => {
                setSelectedJob(j);
                setDrawerOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* 📄 DETAILS DRAWER */}
      <JobDetailsDrawer
        job={selectedJob}
        isDark={isDark}
        open={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}

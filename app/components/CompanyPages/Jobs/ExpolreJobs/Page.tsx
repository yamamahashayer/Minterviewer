"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Briefcase, FileText } from "lucide-react";

import JobCard from "@/app/components/CompanyPages/Jobs/ExpolreJobs/JobCard";
import JobDetailsDrawer from "@/app/components/CompanyPages/Jobs/ExpolreJobs/JobDetailsDrawer";
import ApplicationTracker from "@/app/components/CompanyPages/Jobs/ExpolreJobs/ApplicationTracker";

import CompanyHeader from "@/app/components/CompanyPages/Profile/CompanyHeader";
import CompanyInfoSection from "@/app/components/CompanyPages/Profile/CompanyInfoSection";

export default function ExploreJobsPage({ theme = "dark" }) {
  const isDark = theme === "dark";

  /* ================= STATE ================= */
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isJobDrawerOpen, setJobDrawerOpen] = useState(false);

  const [viewMode, setViewMode] = useState<"jobs" | "company" | "applications">("jobs");
  const [selectedCompany, setSelectedCompany] = useState<any>(null);

  /* ================= FILTERS ================= */
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
    () =>
      Array.from(
        new Set(jobs.map((j) => j.companyId?.name).filter(Boolean))
      ),
    [jobs]
  );

  /* ================= FILTERED JOBS ================= */
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        !search ||
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.companyId?.name?.toLowerCase().includes(search.toLowerCase()) ||
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

  /* ================= COMPANY JOBS ================= */
  const companyJobs = useMemo(() => {
    if (!selectedCompany) return [];
    return jobs.filter(
      (job) => job.companyId?._id === selectedCompany._id
    );
  }, [jobs, selectedCompany]);

  return (
    <div
      className={`p-6 min-h-screen ${
        isDark ? "bg-[#0a0f1e] text-white" : "bg-gray-50 text-black"
      }`}
    >
      {/* ================= TAB NAVIGATION ================= */}
      <div className="mb-8">
        <div
          className={`inline-flex rounded-xl p-1 gap-1 ${
            isDark
              ? "bg-white/5 border border-white/10"
              : "bg-gray-100 border border-gray-200"
          }`}
        >
          <button
            onClick={() => setViewMode("jobs")}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              viewMode === "jobs"
                ? isDark
                  ? "bg-teal-500 text-black"
                  : "bg-purple-600 text-white"
                : isDark
                ? "text-gray-300 hover:text-white hover:bg-white/5"
                : "text-gray-600 hover:text-black hover:bg-gray-200"
            }`}
          >
            <Briefcase className="w-4 h-4 inline mr-2" />
            Explore Jobs
          </button>
          
          <button
            onClick={() => setViewMode("applications")}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              viewMode === "applications"
                ? isDark
                  ? "bg-teal-500 text-black"
                  : "bg-purple-600 text-white"
                : isDark
                ? "text-gray-300 hover:text-white hover:bg-white/5"
                : "text-gray-600 hover:text-black hover:bg-gray-200"
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            My Applications
          </button>
        </div>
      </div>

      {/* ================= EXPLORE JOBS VIEW ================= */}
      {viewMode === "jobs" && (
        <>
      {/* ===== HEADER ===== */}
        <div className="mb-12">
          <h1
            className={`
              text-4xl md:text-5xl font-extrabold tracking-tight
              ${
                isDark
                  ? "bg-gradient-to-r from-teal-300 via-cyan-400 to-emerald-300 bg-clip-text text-transparent"
                  : "bg-gradient-to-r from-purple-600 via-pink-500 to-fuchsia-500 bg-clip-text text-transparent"
              }
            `}
          >
            Explore Jobs
          </h1>

          <p
            className={`
              mt-4 max-w-3xl text-lg leading-relaxed font-medium
              ${
                isDark
                  ? "text-gray-300"
                  : "text-[#4c1d95]"
              }
            `}
          >
            Explore intelligent job opportunities designed around your{" "}
            <span
              className={`font-semibold ${
                isDark ? "text-teal-300" : "text-purple-600"
              }`}
            >
              skills,interests, and future career goals.
            </span>
      
          </p>

          <div
            className={`
              mt-5 h-1.5 w-28 rounded-full
              ${
                isDark
                  ? "bg-gradient-to-r from-teal-400 to-cyan-400"
                  : "bg-gradient-to-r from-purple-500 to-pink-500"
              }
            `}
          />
        </div>

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
                    setJobDrawerOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* ================= APPLICATIONS VIEW ================= */}
      {viewMode === "applications" && (
        <div className="space-y-6">
          <div className="mb-8">
            <h1
              className="
                text-4xl md:text-5xl font-extrabold tracking-tight
                text-white
              "
            >
              My Applications
            </h1>

            <p
              className="
                mt-4 max-w-3xl text-lg leading-relaxed font-medium
                text-gray-300
              "
            >
              Track the status of your job applications and monitor your progress through the hiring process.
            </p>

            <div
              className="
                mt-5 h-1.5 w-28 rounded-full
                bg-gradient-to-r from-teal-400 to-cyan-400
              "
            />
          </div>

          <ApplicationTracker isDark={isDark} />
        </div>
      )}

      {/* ================= COMPANY PROFILE VIEW ================= */}
      {viewMode === "company" && selectedCompany && (
        <div className="space-y-10">

          {/* 🔙 BACK */}
          <button
            onClick={() => {
              setViewMode("jobs");
              setSelectedCompany(null);
            }}
            className="underline opacity-70 hover:opacity-100"
          >
            ← Back to Jobs
          </button>

          {/* 🏢 COMPANY PROFILE */}
          <CompanyHeader
            company={selectedCompany}
            edited={selectedCompany}
            isEditing={false}
            setIsEditing={() => {}}
            onSave={() => {}}
            onCancel={() => {}}
            isDark={isDark}
            isOwner={false}
          />

          <CompanyInfoSection
            edited={selectedCompany}
            isEditing={false}
            setIsEditing={() => {}}
            onFieldChange={() => {}}
            onSave={() => {}}
            onCancel={() => {}}
            isDark={isDark}
            isOwner={false}
          />

          {/* 💼 COMPANY JOB POSTS */}
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Open Positions
            </h2>

            {companyJobs.length === 0 ? (
              <p className="opacity-60">
                This company has no active job posts.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {companyJobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    isDark={isDark}
                    onSelect={(j) => {
                      setSelectedJob(j);
                      setJobDrawerOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= JOB DETAILS DRAWER ================= */}
      <JobDetailsDrawer
        job={selectedJob}
        isDark={isDark}
        open={isJobDrawerOpen}
        onClose={() => setJobDrawerOpen(false)}
        onViewCompany={(company) => {
          setSelectedCompany(company);
          setViewMode("company");
        }}
      />
    </div>
  );
}

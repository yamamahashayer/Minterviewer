"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, BarChart3, Users, Briefcase } from "lucide-react";
import ApplicantsList from "@/app/components/CompanyPages/Jobs/ApplicantsList";
import ApplicationManager from "@/app/components/CompanyPages/Jobs/ApplicationManager";
import ApplicationAnalytics from "@/app/components/CompanyPages/Jobs/ApplicationAnalytics";
import JobInfoCard from "@/app/components/CompanyPages/Jobs/JobInfoCard";
import PublicMenteeProfile from "@/app/components/PublicProfiles/PublicMenteeProfile";
import TalentRecommendations from "@/app/components/CompanyPages/Jobs/TalentRecommendations";

type Theme = "dark" | "light";

export default function CandidatesPage({ theme }: { theme: Theme }) {
  const isDark = theme === "dark";

  const [jobs, setJobs] = useState<any[]>([]);
  const [openJobId, setOpenJobId] = useState<string | null>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"applicants" | "analytics">("applicants");
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set());

  // ⭐⭐ أهم state
  const [selectedMenteeId, setSelectedMenteeId] = useState<string | null>(null);

  /* ================= FETCH JOBS ================= */
  useEffect(() => {
    (async () => {
      try {
        const raw = sessionStorage.getItem("user");
        if (!raw) return;

        const user = JSON.parse(raw);
        const companyId = user.companyId;

        const res = await fetch(`/api/company/${companyId}/jobs`);
        const data = await res.json();

        if (data.ok) setJobs(data.jobs || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ================= OPEN JOB ================= */
  const handleOpenJob = async (job: any) => {
    if (openJobId === job._id) {
      setOpenJobId(null);
      setApplicants([]);
      return;
    }

    setOpenJobId(job._id);
    setApplicants([]);

    const raw = sessionStorage.getItem("user");
    if (!raw) return;
    const user = JSON.parse(raw);

    const res = await fetch(
      `/api/company/${user.companyId}/jobs/${job._id}/applicants`
    );

    const data = await res.json();
    setApplicants(data.ok ? data.applicants : []);
  };

  const refreshApplicants = () => {
    if (openJobId) {
      const job = jobs.find(j => j._id === openJobId);
      if (job) handleOpenJob(job);
    }
  };

  const getCompanyId = () => {
    const raw = sessionStorage.getItem("user");
    if (!raw) return null;
    const user = JSON.parse(raw);
    return user.companyId;
  };

  const toggleJobExpansion = (jobId: string) => {
    setExpandedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  /* ======================================================
     🔥 FULL PROFILE MODE
     ====================================================== */
  if (selectedMenteeId) {
    return (
      <div
        className={`min-h-screen p-8 ${
          isDark ? "bg-[#020617] text-white" : "bg-white text-black"
        }`}
      >
        <button
          onClick={() => setSelectedMenteeId(null)}
          className="mb-6 text-sm underline opacity-80 hover:opacity-100"
        >
          ← Back to talent
        </button>

        <PublicMenteeProfile menteeId={selectedMenteeId} />
      </div>
    );
  }

  /* ======================================================
     🟢 NORMAL CANDIDATES VIEW
     ====================================================== */
  return (
    <div
      className={`min-h-screen p-6 space-y-8 ${
        isDark ? "bg-[#020617] text-white" : "bg-[#f8fafc] text-black"
      }`}
    >
     {/* ================= TALENT PAGE HEADER ================= */}
      <div
        className={`relative rounded-2xl px-8 py-10 border mb-10 overflow-hidden
          ${isDark
            ? "bg-[#020617] border-[#1e293b]"
            : "bg-white border-gray-200"
          }
        `}
      >
        {/* subtle accent */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-transparent" />

        <div className="relative space-y-4 animate-fade-in">
          
          {/* PAGE NAME (light label, not a second header) */}
          <span
          className={`inline-flex items-center gap-2 text-3xl font-semibold uppercase tracking-wide
            ${isDark ? "text-purple-400/80" : "text-purple-600"}
          `}
        >
          Talent
          <span className="opacity-50">•</span>
          Applicants & AI Recommendations
        </span>


          {/* MAIN HERO TITLE */}
          <h1
            className={`text-4xl font-extrabold tracking-tight
              ${isDark ? "text-white" : "text-gray-900"}
            `}
          >
            Build your team with{" "}
            <span className="text-purple-500">confidence</span>
          </h1>

          {/* SUBTITLE */}
          <p
            className={`max-w-2xl text-base
              ${isDark ? "text-slate-400" : "text-gray-600"}
            `}
          >
            Discover{" "}
            <span className="text-purple-500 font-medium">
              AI-recommended talent
            </span>{" "}
            and review applicants based on performance, skills, and interview insights.
          </p>
        </div>
      </div>

      {/* TAB NAVIGATION */}
      <div className="mb-8">
        <div
          className={`inline-flex rounded-xl p-1 gap-1 ${
            isDark
              ? "bg-white/5 border border-white/10"
              : "bg-gray-100 border border-gray-200"
          }`}
        >
          <button
            onClick={() => setViewMode("applicants")}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              viewMode === "applicants"
                ? isDark
                  ? "bg-purple-500 text-white"
                  : "bg-purple-600 text-white"
                : isDark
                ? "text-gray-300 hover:text-white hover:bg-white/5"
                : "text-gray-600 hover:text-black hover:bg-gray-200"
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Applicants Management
          </button>
          
          <button
            onClick={() => setViewMode("analytics")}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              viewMode === "analytics"
                ? isDark
                  ? "bg-purple-500 text-white"
                  : "bg-purple-600 text-white"
                : isDark
                ? "text-gray-300 hover:text-white hover:bg-white/5"
                : "text-gray-600 hover:text-black hover:bg-gray-200"
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Analytics Dashboard
          </button>
        </div>
      </div>

      {/* PAGE CONTENT */}
      <div className="space-y-6">
        {/* ================= ANALYTICS VIEW ================= */}
        {viewMode === "analytics" && (
          <ApplicationAnalytics jobs={jobs} theme={theme} />
        )}

        {/* ================= APPLICANTS MANAGEMENT VIEW ================= */}
        {viewMode === "applicants" && (
          <>
            {/* ================= TALENT RECOMMENDATIONS ================= */}
            {/* {jobs.length > 0 && (
              <TalentRecommendations
                job={jobs[0]} // Show recommendations for the most recent/first job
                theme={theme}
                onViewProfile={(menteeId) => {
                  setSelectedMenteeId(menteeId);
                }}
                onInviteToApply={(menteeId) => {
                  console.log('Invite to apply:', menteeId);
                }}
              />
            )} */}

            {/* JOBS LIST */}
            {jobs.map((job) => {
              const isOpen = openJobId === job._id;
              const isExpanded = expandedJobs.has(job._id);

              return (
                <div key={job._id} className="space-y-4">
                  <JobInfoCard
                    job={job}
                    theme={theme}
                    onToggle={() => toggleJobExpansion(job._id)}
                    isExpanded={isExpanded}
                    showFullLink={true}
                  />

                  {/* Only show "Manage Applicants" button when job is expanded */}
                  {isExpanded && (
                    <div className="ml-6">
                      <div className="flex items-center gap-3 mb-4">
                        <button
                          onClick={() => handleOpenJob(job)}
                          className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                            isOpen
                              ? isDark
                                ? "bg-purple-500/20 border-purple-500 text-purple-300"
                                : "bg-purple-100 border-purple-300 text-purple-700"
                              : isDark
                              ? "border-white/20 hover:bg-white/10"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {isOpen ? "Hide Applicants" : "Manage Applicants"}
                        </button>
                        
                        {isOpen && (
                          <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                            {applicants.length} applicants
                          </span>
                        )}
                      </div>

                      {/* Only show ApplicationManager when "Manage Applicants" is clicked */}
                      {isOpen && (
                        <div className="border-t border-gray-200/20 pt-4">
                          <ApplicationManager
                            applicants={applicants}
                            job={job}
                            theme={theme}
                            onViewProfile={(id) => setSelectedMenteeId(id)}
                            onStatusUpdate={refreshApplicants}
                            companyId={getCompanyId() || ""}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

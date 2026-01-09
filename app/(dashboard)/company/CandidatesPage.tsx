"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import ApplicantsList from "@/app/components/CompanyPages/Jobs/ApplicantsList";
import PublicMenteeProfile from "@/app/components/PublicProfiles/PublicMenteeProfile";
import TalentRecommendations from "@/app/components/CompanyPages/Jobs/TalentRecommendations";

type Theme = "dark" | "light";

export default function CandidatesPage({ theme }: { theme: Theme }) {
  const isDark = theme === "dark";

  const [jobs, setJobs] = useState<any[]>([]);
  const [openJobId, setOpenJobId] = useState<string | null>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

      {/* PAGE CONTENT */}
      <div className="space-y-6">
      {/* ================= TALENT RECOMMENDATIONS ================= */}
              {jobs.length > 0 && (
                <TalentRecommendations
                  job={jobs[0]} // Show recommendations for the most recent/first job
                  theme={theme}
                  onViewProfile={(menteeId) => {
                    // TODO: Navigate to mentee profile
                    console.log('View mentee profile:', menteeId);
                  }}
                  onInviteToApply={(menteeId) => {
                    // TODO: Implement invite to apply functionality
                    console.log('Invite to apply:', menteeId);
                  }}
                />
              )}

      {/* JOBS LIST */}
      {jobs.map((job) => {
        const isOpen = openJobId === job._id;

        return (
          <div
            key={job._id}
            className={`rounded-xl border overflow-hidden ${
              isDark
                ? "bg-[#020617] border-[#1e293b]"
                : "bg-white border-gray-200"
            }`}
          >
            <button
              onClick={() => handleOpenJob(job)}
              className={`w-full flex items-center justify-between p-5 text-left ${
                isDark ? "hover:bg-[#1e293b]" : "hover:bg-gray-50"
              }`}
            >
              <div>
                <p className="font-semibold">{job.title}</p>
                <p className="text-sm opacity-60">
                  {job.applicants?.length || 0} applicant(s)
                </p>
              </div>

              {isOpen ? <ChevronDown /> : <ChevronRight />}
            </button>

            {isOpen && (
              <div className="p-6">
                <ApplicantsList
                  applicants={applicants}
                  job={job}
                  theme={theme}
                  onViewProfile={(id) => setSelectedMenteeId(id)}
                  onBack={() => {
                    setOpenJobId(null);
                    setApplicants([]);
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
      </div>
    </div>
  );
}

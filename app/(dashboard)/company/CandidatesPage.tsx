"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import ApplicantsList from "@/app/components/CompanyPages/Jobs/ApplicantsList";

type Theme = "dark" | "light";

export default function CandidatesPage({ theme }: { theme: Theme }) {
  const isDark = theme === "dark";

  const [jobs, setJobs] = useState<any[]>([]);
  const [openJobId, setOpenJobId] = useState<string | null>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  /* ================= OPEN JOB + FETCH APPLICANTS ================= */
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

  const totalApplicants = jobs.reduce(
    (sum, j) => sum + (j.applicants?.length || 0),
    0
  );

  return (
    <div
      className={`min-h-screen p-8 space-y-6 ${
        isDark ? "bg-[#020617] text-white" : "bg-[#f8fafc] text-black"
      }`}
    >
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-3xl font-bold">Candidates</h1>
        <p className="opacity-70 mt-1">
          Review applicants grouped by job position.
        </p>
      </div>

      {/* ================= EMPTY STATE ================= */}
      {!loading && totalApplicants === 0 && (
        <div
          className={`p-6 rounded-xl border ${
            isDark
              ? "bg-[#020617] border-[#1e293b]"
              : "bg-white border-gray-200"
          }`}
        >
          <h2 className="font-semibold">No candidates yet</h2>
          <p className="opacity-60 mt-1">
            Candidates will appear once they apply.
          </p>
        </div>
      )}

      {/* ================= JOBS LIST ================= */}
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
            {/* ===== JOB HEADER ===== */}
            <button
              onClick={() => handleOpenJob(job)}
              className={`w-full flex items-center justify-between p-5 text-left transition ${
                isDark
                  ? "hover:bg-[#1e293b]"
                  : "hover:bg-purple-50"
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

            {/* ===== APPLICANTS ===== */}
            {isOpen && (
              <div className="p-6">
                <ApplicantsList
                  applicants={applicants}
                  job={job}
                  theme={theme}
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
  );
}

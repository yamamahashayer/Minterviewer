"use client";

import React, { useMemo, useState } from "react";
import { Mail, Phone, FileText, User, Video, Award } from "lucide-react";

type Theme = "dark" | "light";

interface Props {
  applicants: any[];
  job: any;
  theme: Theme;
  onViewProfile: (menteeId: string) => void;
}

export default function ApplicantsList({
  applicants,
  job,
  theme,
  onViewProfile,
}: Props) {
  const isDark = theme === "dark";
  const [sortBy, setSortBy] = useState<"cv" | "ats" | "interview">(() => {
    return job.interviewType === "ai" ? "interview" : "cv";
  });

  /* ================= SORT ================= */
  const sortedApplicants = useMemo(() => {
    return [...applicants].sort((a, b) => {
      if (sortBy === "ats")
        return (b.atsScore || 0) - (a.atsScore || 0);
      if (sortBy === "interview")
        return (b.interviewScore || 0) - (a.interviewScore || 0);
      return (b.cvScore || 0) - (a.cvScore || 0);
    });
  }, [applicants, sortBy]);

  return (
    <div
      className={`p-8 rounded-2xl space-y-6 ${isDark ? "bg-[#1b2333] text-white" : "bg-white text-black"
        }`}
    >
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">
            Applicants ({sortedApplicants.length})
          </h2>
          <p className="text-sm opacity-60">
            CV & interview overview for fast comparison
          </p>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2 rounded-lg border bg-transparent text-sm"
        >
          <option value="cv">Sort by CV</option>
          <option value="ats">Sort by ATS</option>
          <option value="interview">Sort by Interview</option>
        </select>
      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead
            className={`text-xs uppercase ${isDark
              ? "bg-[#20283d] text-gray-300"
              : "bg-gray-100 text-gray-600"
              }`}
          >
            <tr>
              <Th>#</Th>
              <Th>Candidate</Th>
              <Th>Contact</Th>
              <Th>CV</Th>
              <Th>ATS</Th>
              <Th>Interview</Th>
              <Th>Interview Score</Th>
              <Th className="text-center">Actions</Th>
            </tr>
          </thead>

          <tbody>
            {sortedApplicants.map((a, i) => {
              const m = a.mentee;

              return (
                <tr
                  key={a._id}
                  className={`border-b ${isDark
                    ? "border-gray-700 hover:bg-[#1f263a]"
                    : "border-gray-200 hover:bg-gray-50"
                    }`}
                >
                  <Td>{i + 1}</Td>

                  <Td>
                    <div className="font-medium">
                      {m?.full_name || "Unknown"}
                    </div>
                    <div className="text-xs opacity-60">
                      {m?.Country || "—"}
                    </div>
                  </Td>

                  <Td className="text-xs space-y-1">
                    <div className="flex items-center gap-2">
                      <Mail size={13} />
                      {m?.email || "—"}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={13} />
                      {m?.phoneNumber || "—"}
                    </div>
                  </Td>

                  <Td className="font-medium">{a.cvScore ?? "—"}</Td>
                  <Td>{a.atsScore != null ? `${a.atsScore}%` : "—"}</Td>
                  <Td>
                    {a.status === "interview_completed" ? (
                      <span className="text-green-600 dark:text-green-400 font-medium">✓ Completed</span>
                    ) : a.status === "interview_pending" ? (
                      <span className="text-yellow-600 dark:text-yellow-400">Pending</span>
                    ) : a.interviewId ? (
                      <span className="text-blue-600 dark:text-blue-400">In Progress</span>
                    ) : (
                      <span className="opacity-50">Not started</span>
                    )}
                  </Td>
                  <Td>
                    {a.evaluation?.interviewScore ? (
                      <div className="flex items-center gap-2">
                        <Award size={14} className="text-yellow-500" />
                        <span className="font-bold">{a.evaluation.interviewScore}</span>
                      </div>
                    ) : (
                      "—"
                    )}
                  </Td>

                  {/* ================= ACTIONS ================= */}
                  <Td className="space-y-2 text-center">
                    {/* VIEW PROFILE */}
                    <button
                      onClick={() => onViewProfile(m?._id)}
                      className="flex items-center gap-2 mx-auto px-3 py-1 text-xs rounded-lg border hover:bg-white/10"
                    >
                      <User size={14} />
                      View Profile
                    </button>

                    {/* ✅ CV ANALYSIS – SAME AS BEFORE */}
                    {a.analysisId ? (
                      <button
                        onClick={() =>
                        (window.location.href =
                          `/company/cv-analysis/${a.analysisId}`)
                        }
                        className="flex items-center gap-2 mx-auto px-3 py-1 text-xs rounded-lg border hover:bg-white/10"
                      >
                        <FileText size={14} />
                        CV Analysis
                      </button>
                    ) : (
                      <span className="block text-xs opacity-40">—</span>
                    )}

                    {/* ✅ AI INTERVIEW REPORT */}
                    {a.interviewId && a.status === "interview_completed" ? (
                      <button
                        onClick={() =>
                        (window.location.href =
                          `/company/jobs/${job._id}/applicants/${a._id}/interview`)
                        }
                        className="flex items-center gap-2 mx-auto px-3 py-1 text-xs rounded-lg border hover:bg-white/10 bg-purple-500/10 border-purple-500/30"
                      >
                        <Video size={14} />
                        View Interview
                      </button>
                    ) : null}
                  </Td>
                </tr>
              );
            })}

            {sortedApplicants.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-10 opacity-60">
                  No applicants yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */

function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th className={`px-5 py-4 font-semibold ${className}`}>
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-5 py-4 align-top">{children}</td>;
}

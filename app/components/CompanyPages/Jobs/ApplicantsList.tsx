"use client";

import React, { useMemo, useState } from "react";
import { Mail, Phone, FileText, User, Video, Award, Brain } from "lucide-react";
import TalentRecommendations from "./TalentRecommendations";

type Theme = "dark" | "light";

interface Props {
  applicants: any[];
  job: any;
  theme: Theme;
  onViewProfile: (menteeId: string) => void;
  onBack: () => void; // 🔙 NEW
}

export default function ApplicantsList({
  applicants,
  job,
  theme,
  onViewProfile,
  onBack, // 🔙 NEW
}: Props) {
  const isDark = theme === "dark";
  const [sortBy, setSortBy] = useState<"performance" | "cv" | "interview">(() => {
    return "performance";
  });

  // Dynamic column visibility based on job configuration
  const showCV = job?.enableCVAnalysis === true;
  const showInterview = job?.interviewType && job.interviewType !== "none";

  /* ================= SCORE READING HELPERS ================= */
  const getInterviewScore = (applicant: any): number => {
    // The API now returns interviewScore from interview.overallScore
    if (applicant.interviewScore !== undefined && applicant.interviewScore !== null) {
      return applicant.interviewScore;
    }
    // Check for overallScore at the root level (as seen in MongoDB document)
    if (applicant.overallScore !== undefined && applicant.overallScore !== null) {
      return applicant.overallScore;
    }
    // Check for interview object with overallScore (if populated)
    if (applicant.interview?.overallScore !== undefined && applicant.interview?.overallScore !== null) {
      return applicant.interview.overallScore;
    }
    // Check for evaluation.interviewScore (new structure)
    if (applicant.evaluation?.interviewScore !== undefined && applicant.evaluation?.interviewScore !== null) {
      return applicant.evaluation.interviewScore;
    }
    return 0;
  };

  const getCVScore = (applicant: any): number => {
    // CV scores were read directly in the working version
    if (applicant.cvScore !== undefined && applicant.cvScore !== null) {
      return applicant.cvScore;
    }
    // Fallback to evaluation.cvScore for new structure
    if (applicant.evaluation?.cvScore !== undefined && applicant.evaluation?.cvScore !== null) {
      return applicant.evaluation.cvScore;
    }
    return 0;
  };

  const getATSScore = (applicant: any): number | null => {
    // ATS scores were read directly in the working version
    if (applicant.atsScore !== undefined && applicant.atsScore !== null) {
      return applicant.atsScore;
    }
    // Fallback to evaluation.atsScore for new structure
    if (applicant.evaluation?.atsScore !== undefined && applicant.evaluation?.atsScore !== null) {
      return applicant.evaluation.atsScore;
    }
    return null;
  };

  const hasInterviewScore = (applicant: any): boolean => {
    return applicant.evaluation?.interviewScore !== undefined && applicant.evaluation?.interviewScore !== null ||
           applicant.interviewScore !== undefined && applicant.interviewScore !== null;
  };

  /* ================= PERFORMANCE SCORE CALCULATION ================= */
  const applicantsWithScores = useMemo(() => {
    return applicants.map(applicant => {
      const cvScore = getCVScore(applicant);
      const interviewScore = getInterviewScore(applicant);
      const atsScore = getATSScore(applicant);
      
      // Use mentee's overall_score instead of calculated performance
      const performanceScore = applicant.mentee?.overall_score || 0;
      
      return {
        ...applicant,
        performanceScore: Math.round(performanceScore),
        cvScore,
        interviewScore,
        atsScore
      };
    });
  }, [applicants, showCV, showInterview]);

  /* ================= TOP CANDIDATES ================= */
  const topCandidates = useMemo(() => {
    return applicantsWithScores
      .sort((a, b) => b.performanceScore - a.performanceScore)
      .slice(0, 5)
      .map((candidate, index) => ({
        ...candidate,
        rank: index + 1
      }));
  }, [applicantsWithScores]);

  /* ================= SORTED APPLICANTS ================= */
  const sortedApplicants = useMemo(() => {
    return [...applicantsWithScores].sort((a, b) => {
      if (sortBy === "performance")
        return b.performanceScore - a.performanceScore;
      if (sortBy === "interview")
        return b.interviewScore - a.interviewScore;
      return b.cvScore - a.cvScore;
    });
  }, [applicantsWithScores, sortBy]);

  return (
    <div
      className={`p-6 rounded-2xl space-y-4 ${
        isDark ? "bg-[#1b2333] text-white" : "bg-white text-black"
      }`}
    >
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          {/* 🔙 BACK BUTTON */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm opacity-70 hover:opacity-100 transition"
          >
            ← Back to all jobs
          </button>

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
          <option value="performance">Sort by Performance</option>
          <option value="cv">Sort by CV</option>
          <option value="interview">Sort by Interview</option>
        </select>
      </div>

      {/* ================= JOB SUMMARY ================= */}
      {job && (
        <div
          className={`rounded-xl p-4 border ${
            isDark
              ? "bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0.01)] border-[rgba(94,234,212,0.2)]"
              : "bg-gray-50 border-[#ddd6fe]"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Job Title */}
            <div>
              <p className="text-xs font-semibold mb-1 opacity-70">Job Title</p>
              <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                {job.title || "—"}
              </p>
            </div>

            {/* Interview Type */}
            <div>
              <p className="text-xs font-semibold mb-1 opacity-70">Interview Type</p>
              <div>
                {job.interviewType === "ai" ? (
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-medium ${
                      isDark
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-indigo-100 text-indigo-700"
                    }`}
                  >
                    AI Interview
                  </span>
                ) : job.interviewType === "human" ? (
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-medium ${
                      isDark
                        ? "bg-white/10 text-gray-300"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    Human Interview
                  </span>
                ) : (
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-medium ${
                      isDark
                        ? "bg-gray-600/30 text-gray-400"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    None
                  </span>
                )}
              </div>
            </div>

            {/* CV Analysis */}
            <div>
              <p className="text-xs font-semibold mb-1 opacity-70">CV Analysis</p>
              <div>
                {job.enableCVAnalysis ? (
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-medium ${
                      isDark
                        ? "bg-teal-500/20 text-teal-300"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    Enabled
                  </span>
                ) : (
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-medium ${
                      isDark
                        ? "bg-gray-600/30 text-gray-400"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    Disabled
                  </span>
                )}
              </div>
            </div>

            {/* Required Skills */}
            <div>
              <p className="text-xs font-semibold mb-1 opacity-70">Required Skills</p>
              <div className="flex flex-wrap gap-1">
                {job.skills?.length > 0 ? (
                  job.skills.slice(0, 3).map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className={`px-2 py-1 text-xs rounded-full ${
                        isDark
                          ? "bg-gray-700 text-gray-100 border border-gray-600"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className={isDark ? "text-gray-400" : "text-gray-500"}>
                    —
                  </span>
                )}
                {job.skills?.length > 3 && (
                  <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    +{job.skills.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TOP CANDIDATES ================= */}
      {topCandidates.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Top Candidates</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {topCandidates.map((candidate) => {
              const mentee = candidate.mentee;
              return (
                <div
                  key={candidate._id}
                  className={`flex-shrink-0 w-64 rounded-xl p-4 border transition-all duration-200 hover:shadow-lg ${
                    isDark
                      ? "bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0.01)] border-[rgba(94,234,212,0.2)] hover:border-[rgba(94,234,212,0.4)]"
                      : "bg-white border-[#ddd6fe] hover:border-purple-300 shadow-md"
                  }`}
                >
                  {/* Rank and Name */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        candidate.rank === 1
                          ? isDark
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-yellow-100 text-yellow-700"
                          : candidate.rank === 2
                          ? isDark
                            ? "bg-gray-500/20 text-gray-300"
                            : "bg-gray-100 text-gray-700"
                          : candidate.rank === 3
                          ? isDark
                            ? "bg-orange-500/20 text-orange-300"
                            : "bg-orange-100 text-orange-700"
                          : isDark
                          ? "bg-gray-600/20 text-gray-400"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {candidate.rank}
                    </div>
                    <div>
                      <div className="font-semibold">
                        {mentee?.full_name || "Unknown"}
                      </div>
                      <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        {mentee?.Country || "—"}
                      </div>
                    </div>
                  </div>
                  
                  {/* Performance Score */}
                  <div className="mb-3">
                    <div className={`text-2xl font-bold ${
                      candidate.performanceScore >= 80
                        ? "text-green-600"
                        : candidate.performanceScore >= 60
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}>
                      {candidate.performanceScore}%
                    </div>
                    <div className="text-xs opacity-60">Performance</div>
                  </div>
                  
                  {/* Component Scores */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {showCV && (
                      <div className={`text-center p-2 rounded-lg ${
                        isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-gray-50"
                      }`}>
                        <div className="font-medium">{candidate.cvScore}</div>
                        <div className="text-xs opacity-60">CV</div>
                      </div>
                    )}
                    {showInterview && (
                      <div className={`text-center p-2 rounded-lg ${
                        isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-gray-50"
                      }`}>
                        <div className="font-medium">{candidate.interviewScore}</div>
                        <div className="text-xs opacity-60">Interview</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead
            className={`text-xs uppercase ${
              isDark
                ? "bg-[#20283d] text-gray-300"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            <tr>
              <Th>Candidate</Th>
              <Th>Contact</Th>
              <Th>Performance</Th>
              {showCV && <Th>CV Score</Th>}
              {showCV && <Th>ATS</Th>}
              {showInterview && <Th>Interview Status</Th>}
              {showInterview && <Th>Interview Score</Th>}
              <Th className="text-center">Actions</Th>
            </tr>
          </thead>

          <tbody>
            {sortedApplicants.map((a, i) => {
              const m = a.mentee;

              return (
                <tr
                  key={a._id}
                  className={`border-b ${
                    isDark
                      ? "border-gray-700 hover:bg-[#1f263a]"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
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

                  <Td>
                    <div className={`font-bold text-lg ${
                      a.performanceScore >= 80
                        ? "text-green-600"
                        : a.performanceScore >= 60
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}>
                      {a.performanceScore}%
                    </div>
                  </Td>

                  {showCV && (
                    <Td className="font-medium">{a.cvScore ?? "—"}</Td>
                  )}
                  {showCV && (
                    <Td>{a.atsScore != null ? `${a.atsScore}%` : "—"}</Td>
                  )}
                  {showInterview && (
                    <Td>
                      {a.status === "interview_completed" ? (
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          ✓ Completed
                        </span>
                      ) : a.status === "interview_pending" ? (
                        <span className="text-yellow-600 dark:text-yellow-400">
                          Pending
                        </span>
                      ) : a.interviewId ? (
                        <span className="text-blue-600 dark:text-blue-400">
                          In Progress
                        </span>
                      ) : (
                        <span className="opacity-50">Not started</span>
                      )}
                    </Td>
                  )}
                  {showInterview && (
                    <Td>
                      {hasInterviewScore(a) ? (
                        <div className="flex items-center gap-2">
                          <Award size={14} className="text-yellow-500" />
                          <span className="font-bold">
                            {getInterviewScore(a)}
                          </span>
                        </div>
                      ) : (
                        "—"
                      )}
                    </Td>
                  )}

                  <Td className="space-y-2 text-center">
                    <button
                      onClick={() => onViewProfile(m?._id)}
                      className="flex items-center gap-2 mx-auto px-3 py-1 text-xs rounded-lg border hover:bg-white/10"
                    >
                      <User size={14} />
                      View Profile
                    </button>

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

                    {a.interviewId &&
                    a.status === "interview_completed" ? (
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
                <td 
                  colSpan={
                    3 + // Candidate, Contact, Performance
                    (showCV ? 2 : 0) + // CV Score, ATS
                    (showInterview ? 2 : 0) + // Interview Status, Interview Score
                    1 // Actions
                  } 
                  className="text-center py-10 opacity-60"
                >
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
    <th className={`px-5 py-3 font-semibold text-left ${className}`}>
      {children}
    </th>
  );
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-5 py-3 align-top text-left ${className}`}>{children}</td>;
}

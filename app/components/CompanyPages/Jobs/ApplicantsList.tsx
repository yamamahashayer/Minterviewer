"use client";

import React, { useMemo, useState } from "react";
import { Mail, Phone, ChevronDown, ChevronUp } from "lucide-react";

type Theme = "dark" | "light";

interface Props {
  applicants: any[];
  job: any;
  theme: Theme;
  onBack: () => void;
}

export default function ApplicantsList({
  applicants,
  job,
  theme,
  onBack,
}: Props) {
  const isDark = theme === "dark";

  /* ================= STATE ================= */
  const [sortBy, setSortBy] = useState<"final" | "cv" | "interview">("final");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filters
  const [filterRecommendation, setFilterRecommendation] = useState("all");
  const [filterScore, setFilterScore] = useState("all");
  const [filterInterview, setFilterInterview] = useState("all");

  /* ================= FILTER + SORT ================= */
  const sortedApplicants = useMemo(() => {
    let list = [...applicants];

    // Recommendation
    if (filterRecommendation !== "all") {
      list = list.filter(
        (a) => a.recommendation === filterRecommendation
      );
    }

    // Final score
    if (filterScore !== "all") {
      list = list.filter((a) => {
        const s = a.finalScore ?? 0;
        if (filterScore === "high") return s >= 80;
        if (filterScore === "mid") return s >= 60 && s < 80;
        if (filterScore === "low") return s < 60;
      });
    }

    // Interview
    if (filterInterview !== "all") {
      list = list.filter((a) =>
        filterInterview === "yes"
          ? a.interviewScore != null
          : a.interviewScore == null
      );
    }

    // Sorting
    return list.sort((a, b) => {
      if (sortBy === "cv")
        return (b.cvScore || 0) - (a.cvScore || 0);
      if (sortBy === "interview")
        return (b.interviewScore || 0) - (a.interviewScore || 0);
      return (b.finalScore || 0) - (a.finalScore || 0);
    });
  }, [
    applicants,
    sortBy,
    filterRecommendation,
    filterScore,
    filterInterview,
  ]);

  return (
    <div
      className={`p-8 rounded-2xl space-y-8 ${
        isDark ? "bg-[#1b2333] text-white" : "bg-white text-black"
      }`}
    >
    

      {/* JOB OVERVIEW */}
      <JobOverview job={job} theme={theme} />

      {/* BACK */}
          <button
            onClick={onBack}
            className={`
              flex items-center gap-2 text-sm font-semibold
              px-4 py-2 rounded-lg w-fit
              transition-all
              ${isDark
                ? "text-purple-300 hover:bg-purple-900/40"
                : "text-purple-700 hover:bg-purple-100"}
            `}
          >
            <span className="text-lg">←</span>
            Back to all jobs
          </button>
          
      {/* HEADER + FILTERS */}
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-3xl font-bold">
            Applicants ({sortedApplicants.length})
          </h2>
          <p className="text-sm opacity-60 mt-1">
            Ranked automatically using CV & interview signals.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-lg border bg-transparent"
          >
            <option value="final">Sort by Final</option>
            <option value="cv">Sort by CV</option>
            <option value="interview">Sort by Interview</option>
          </select>

          <select
            value={filterRecommendation}
            onChange={(e) => setFilterRecommendation(e.target.value)}
            className="px-3 py-2 rounded-lg border bg-transparent"
          >
            <option value="all">All Recommendations</option>
            <option value="Strong Fit">Strong Fit</option>
            <option value="Potential">Potential</option>
            <option value="Reject">Reject</option>
          </select>

          <select
            value={filterScore}
            onChange={(e) => setFilterScore(e.target.value)}
            className="px-3 py-2 rounded-lg border bg-transparent"
          >
            <option value="all">All Scores</option>
            <option value="high">80–100</option>
            <option value="mid">60–79</option>
            <option value="low">Below 60</option>
          </select>

          <select
            value={filterInterview}
            onChange={(e) => setFilterInterview(e.target.value)}
            className="px-3 py-2 rounded-lg border bg-transparent"
          >
            <option value="all">All Interviews</option>
            <option value="yes">Interviewed</option>
            <option value="no">Not Interviewed</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
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
              <Th>#</Th>
              <Th>Candidate</Th>
              <Th>Contact</Th>
              <Th>CV</Th>
              <Th>Interview</Th>
              <Th>Final</Th>
              <Th>Recommendation</Th>
              <Th className="text-center">Details</Th>
            </tr>
          </thead>

          <tbody>
            {sortedApplicants.map((a, i) => {
              const m = a.mentee;
              const expanded = expandedId === a._id;

              return (
                <React.Fragment key={a._id}>
                  <tr
                    className={`border-b ${
                      isDark
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

                    <Td className="text-xs space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail size={13} />
                        {m?.email || "—"}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={13} />
                        {m?.phoneNumber || "—"}
                      </div>
                    </Td>

                    <Td><ScoreBadge value={a.cvScore} /></Td>
                    <Td><ScoreBadge value={a.interviewScore} /></Td>
                    <Td><ScoreBadge value={a.finalScore} /></Td>
                    <Td><RecommendationBadge value={a.recommendation} /></Td>

                    <Td className="text-center">
                      <button
                        onClick={() =>
                          setExpandedId(expanded ? null : a._id)
                        }
                      >
                        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </Td>
                  </tr>

                  {expanded && (
                    <tr>
                      <td colSpan={8}>
                        <div className="p-5 text-sm bg-black/5">
                          <p><b>AI Notes:</b> {a.aiNotes || "—"}</p>
                          <p className="mt-2">
                            <b>Interview Feedback:</b>{" "}
                            {a.interviewFeedback || "—"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}

            {sortedApplicants.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-12 opacity-60">
                  No applicants match filters
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

function ScoreBadge({ value }: { value?: number }) {
  if (value == null) return <span>—</span>;

  const color =
    value >= 80 ? "bg-green-500" :
    value >= 60 ? "bg-yellow-500" :
    "bg-red-500";

  return (
    <span className={`px-2 py-1 rounded-full text-xs text-white ${color}`}>
      {value}
    </span>
  );
}

function RecommendationBadge({ value }: { value?: string }) {
  if (!value) return <span>—</span>;

  const map: any = {
    "Strong Fit": "bg-green-600",
    Potential: "bg-yellow-500",
    Reject: "bg-red-600",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs text-white ${map[value]}`}>
      {value}
    </span>
  );
}

function JobOverview({ job, theme }: { job: any; theme: Theme }) {
  if (!job) return null;
  const isDark = theme === "dark";

  return (
    <div
      className={`p-6 rounded-xl border ${
        isDark
          ? "bg-[#20283d] border-gray-700"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      <h3 className="text-lg font-semibold mb-4">Job Overview</h3>

      <div className="grid md:grid-cols-2 gap-6 text-sm">
        <div>
          <p><b>Position:</b> {job.title}</p>
          <p><b>Location:</b> {job.location}</p>
          <p><b>Level:</b> {job.level}</p>
        </div>

        <div>
          <p><b>CV Analysis:</b> {job.enableCVAnalysis ? "Enabled" : "Disabled"}</p>
          <p><b>Interview:</b> {job.interviewType}</p>
        </div>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-6 py-4 font-semibold">{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-6 py-5">{children}</td>;
}

"use client";

import React, { useMemo, useState, useEffect } from "react";
import { User, MapPin, Star, Send, Brain } from "lucide-react";

type Theme = "dark" | "light";

interface Props {
  job: any;
  theme: Theme;
  onViewProfile: (menteeId: string) => void;
  onBack: () => void;
  onInviteToApply?: (menteeId: string) => void;
}

interface RecommendedMentee {
  menteeId: string;
  userId: string;
  skills: string[];
  matchScore: number;
  matchedSkills: string[];
  performanceScore: number;
  full_name?: string;
  Country?: string;
}

export default function SuggestedMenteesList({
  job,
  theme,
  onViewProfile,
  onBack,
  onInviteToApply,
}: Props) {
  const isDark = theme === "dark";
  const [sortBy, setSortBy] = useState<"match" | "performance">(() => {
    return "match";
  });
  const [suggestions, setSuggestions] = useState<RecommendedMentee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch suggestions from API when job is available
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!job?._id || !job?.companyId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/company/${job.companyId}/jobs/${job._id}/suggestions`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch suggestions');
        }

        const data = await response.json();

        if (data.ok && data.suggestions) {
          // Map API response to component format
          const mappedSuggestions = data.suggestions.map((suggestion: any) => ({
            ...suggestion,
            _id: suggestion.menteeId, // Add _id for compatibility with existing code
            full_name: suggestion.full_name || `User ${suggestion.menteeId.slice(-6)}`, // Use API name or fallback
          }));
          setSuggestions(mappedSuggestions);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.error('Error fetching suggestions:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [job?._id, job?.companyId]);

  // Calculate recommendations based on API suggestions
  const calculateRecommendations = useMemo(() => {
    if (!job?.skills || !Array.isArray(job.skills)) return [];

    return suggestions;
  }, [job?.skills, suggestions]);

  const sortedRecommendations = useMemo(() => {
    return [...calculateRecommendations].sort((a, b) => {
      if (sortBy === "match")
        return b.matchScore - a.matchScore;
      return b.performanceScore - a.performanceScore;
    });
  }, [calculateRecommendations, sortBy]);

  const topRecommendations = useMemo(() => {
    return sortedRecommendations.slice(0, 5).map((recommendation, index) => ({
      ...recommendation,
      rank: index + 1
    }));
  }, [sortedRecommendations]);

  // Show loading state
  if (loading) {
    return (
      <div
        className={`p-6 rounded-2xl space-y-4 ${
          isDark ? "bg-[#1b2333] text-white" : "bg-white text-black"
        }`}
      >
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-sm opacity-70 hover:opacity-100 transition"
            >
              ← Back to all jobs
            </button>
            <h2 className="text-3xl font-bold">Suggested Mentees</h2>
          </div>
        </div>
        
        <div className="text-center py-10 opacity-60">
          <Brain size={48} className="mx-auto mb-4 opacity-50 animate-pulse" />
          <p>Loading suggestions...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div
        className={`p-6 rounded-2xl space-y-4 ${
          isDark ? "bg-[#1b2333] text-white" : "bg-white text-black"
        }`}
      >
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-sm opacity-70 hover:opacity-100 transition"
            >
              ← Back to all jobs
            </button>
            <h2 className="text-3xl font-bold">Suggested Mentees</h2>
          </div>
        </div>
        
        <div className="text-center py-10 opacity-60">
          <Brain size={48} className="mx-auto mb-4 opacity-50" />
          <p>Error loading suggestions</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Show empty state
  if (!job?.skills || job.skills.length === 0) {
    return (
      <div
        className={`p-6 rounded-2xl space-y-4 ${
          isDark ? "bg-[#1b2333] text-white" : "bg-white text-black"
        }`}
      >
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-sm opacity-70 hover:opacity-100 transition"
            >
              ← Back to all jobs
            </button>
            <h2 className="text-3xl font-bold">Suggested Mentees</h2>
          </div>
        </div>
        
        <div className="text-center py-10 opacity-60">
          <Brain size={48} className="mx-auto mb-4 opacity-50" />
          <p>No skills specified for this job</p>
          <p className="text-sm">Add required skills to see AI-powered recommendations</p>
        </div>
      </div>
    );
  }

  // Show no suggestions state
  if (calculateRecommendations.length === 0) {
    return (
      <div
        className={`p-6 rounded-2xl space-y-4 ${
          isDark ? "bg-[#1b2333] text-white" : "bg-white text-black"
        }`}
      >
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-sm opacity-70 hover:opacity-100 transition"
            >
              ← Back to all jobs
            </button>
            <h2 className="text-3xl font-bold">Suggested Mentees</h2>
          </div>
        </div>
        
        <div className="text-center py-10 opacity-60">
          <Brain size={48} className="mx-auto mb-4 opacity-50" />
          <p>No suggestions yet</p>
          <p className="text-sm">No mentees found matching the required skills</p>
        </div>
      </div>
    );
  }

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
            Suggested Mentees ({sortedRecommendations.length})
          </h2>
          <p className="text-sm opacity-60">
            AI-powered recommendations based on skill matching
          </p>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2 rounded-lg border bg-transparent text-sm"
        >
          <option value="match">Sort by Match Score</option>
          <option value="performance">Sort by Performance</option>
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

      {/* ================= TOP RECOMMENDATIONS ================= */}
      {topRecommendations.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Top Recommendations</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {topRecommendations.map((recommendation) => (
              <div
                key={recommendation.menteeId}
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
                      recommendation.rank === 1
                        ? isDark
                          ? "bg-yellow-500/20 text-yellow-300"
                          : "bg-yellow-100 text-yellow-700"
                        : recommendation.rank === 2
                        ? isDark
                          ? "bg-gray-500/20 text-gray-300"
                          : "bg-gray-100 text-gray-700"
                        : recommendation.rank === 3
                        ? isDark
                          ? "bg-orange-500/20 text-orange-300"
                          : "bg-orange-100 text-orange-700"
                        : isDark
                        ? "bg-gray-600/20 text-gray-400"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {recommendation.rank}
                  </div>
                  <div>
                    <div className="font-semibold">
                      {recommendation.full_name}
                    </div>
                    <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      {recommendation.Country || "—"}
                    </div>
                  </div>
                </div>
                
                {/* Match Score */}
                <div className="mb-3">
                  <div className={`text-2xl font-bold ${
                    recommendation.matchScore >= 80
                      ? "text-green-600"
                      : recommendation.matchScore >= 60
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}>
                    {recommendation.matchScore}%
                  </div>
                  <div className="text-xs opacity-60">Skill Match</div>
                </div>
                
                {/* Component Scores */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className={`text-center p-2 rounded-lg ${
                    isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-gray-50"
                  }`}>
                    <div className="font-medium">{recommendation.performanceScore}%</div>
                    <div className="text-xs opacity-60">Performance</div>
                  </div>
                  <div className={`text-center p-2 rounded-lg ${
                    isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-gray-50"
                  }`}>
                    <div className="font-medium">{recommendation.matchedSkills.length}</div>
                    <div className="text-xs opacity-60">Matched Skills</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= RECOMMENDATIONS GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedRecommendations.map((mentee) => (
          <div
            key={mentee.menteeId}
            className={`rounded-xl p-4 border transition-all duration-200 hover:shadow-lg ${
              isDark
                ? "bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0.01)] border-[rgba(94,234,212,0.2)] hover:border-[rgba(94,234,212,0.4)]"
                : "bg-white border-[#ddd6fe] hover:border-purple-300 shadow-md"
            }`}
          >
            {/* Header with Match Score */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-base">{mentee.full_name}</h4>
                <div className="flex items-center gap-1 text-sm opacity-60 mt-1">
                  <MapPin size={12} />
                  {mentee.Country || "Location not specified"}
                </div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${
                  mentee.matchScore >= 80
                    ? "text-green-600"
                    : mentee.matchScore >= 60
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}>
                  {mentee.matchScore}%
                </div>
                <div className="text-xs opacity-60">Match</div>
              </div>
            </div>

            {/* Performance Score */}
            <div className="mb-3">
              <div className="flex items-center gap-2">
                <Star size={14} className="text-yellow-500" />
                <span className="text-sm font-medium">
                  Performance: {mentee.performanceScore}%
                </span>
              </div>
            </div>

            {/* Matched Skills */}
            <div className="mb-4">
              <div className="text-xs font-semibold mb-2 opacity-70">Matched Skills</div>
              <div className="flex flex-wrap gap-1">
                {mentee.matchedSkills.length > 0 ? (
                  mentee.matchedSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-1 text-xs rounded-full ${
                        isDark
                          ? "bg-green-500/20 text-green-300 border border-green-500/30"
                          : "bg-green-100 text-green-700 border border-green-300"
                      }`}
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    No direct skill matches
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={() => onViewProfile(mentee.menteeId)}
                className={`w-full flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg border transition ${
                  isDark
                    ? "border-gray-600 hover:bg-white/10 text-white"
                    : "border-gray-300 hover:bg-gray-50 text-gray-700"
                }`}
              >
                <User size={14} />
                View Profile
              </button>
              
              {onInviteToApply && (
                <button
                  onClick={() => onInviteToApply(mentee.menteeId)}
                  className={`w-full flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg border transition ${
                    isDark
                      ? "bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20 text-purple-300"
                      : "bg-purple-100 border-purple-300 hover:bg-purple-200 text-purple-700"
                  }`}
                >
                  <Send size={14} />
                  Invite to Apply
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className={`text-xs opacity-60 italic ${
        isDark ? "text-gray-400" : "text-gray-500"
      }`}>
        💡 Recommendations are based on AI performance and skill matching. These mentees have not applied to this job yet.
      </div>
    </div>
  );
}

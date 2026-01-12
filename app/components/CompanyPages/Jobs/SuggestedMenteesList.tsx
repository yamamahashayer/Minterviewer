"use client";

import React, { useMemo, useState, useEffect } from "react";
import { User, MapPin, Star, Send, Brain, Mail, Phone } from "lucide-react";

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
  email?: string | null;
  phoneNumber?: string | null;
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
  const [inviteLoading, setInviteLoading] = useState<Set<string>>(new Set());
  const [inviteErrors, setInviteErrors] = useState<Map<string, string>>(new Map());
  const [inviteSuccess, setInviteSuccess] = useState<Set<string>>(new Set());

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
          // Try to get error details from response
          let errorMessage = 'Failed to fetch suggestions';
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
            console.error('Server error:', errorData);
          } catch (parseError) {
            console.error('Response not JSON, status:', response.status, response.statusText);
            errorMessage = `Server error: ${response.status} ${response.statusText}`;
          }
          throw new Error(errorMessage);
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

  // Handle invite to apply
  const handleInviteToApply = async (menteeId: string) => {
    if (!job?._id || !job?.companyId) return;

    // Clear previous states for this mentee
    setInviteErrors(prev => {
      const newMap = new Map(prev);
      newMap.delete(menteeId);
      return newMap;
    });
    setInviteSuccess(prev => {
      const newSet = new Set(prev);
      newSet.delete(menteeId);
      return newSet;
    });

    // Set loading state
    setInviteLoading(prev => new Set(prev).add(menteeId));

    try {
      const response = await fetch(
        `/api/company/${job.companyId}/jobs/${job._id}/invite`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ menteeId }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send invite');
      }

      // Success
      setInviteSuccess(prev => new Set(prev).add(menteeId));
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setInviteSuccess(prev => {
          const newSet = new Set(prev);
          newSet.delete(menteeId);
          return newSet;
        });
      }, 3000);

    } catch (err) {
      console.error('Error sending invite:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setInviteErrors(prev => {
        const newMap = new Map(prev);
        newMap.set(menteeId, errorMessage);
        return newMap;
      });

      // Clear error message after 5 seconds
      setTimeout(() => {
        setInviteErrors(prev => {
          const newMap = new Map(prev);
          newMap.delete(menteeId);
          return newMap;
        });
      }, 5000);
    } finally {
      setInviteLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(menteeId);
        return newSet;
      });
    }
  };

  // Calculate recommendations based on API suggestions
  const calculateRecommendations = useMemo(() => {
    if (!job?.skills || !Array.isArray(job.skills)) return [];

    return suggestions.map(suggestion => ({
      ...suggestion,
      mentee: {
        _id: suggestion.menteeId,
        full_name: suggestion.full_name,
        Country: suggestion.Country,
        email: suggestion.email,
        phoneNumber: suggestion.phoneNumber,
      },
      cvScore: null, // AI suggestions don't have CV analysis yet
      interviewScore: null, // AI suggestions don't have interviews yet
      performanceScore: suggestion.performanceScore,
      matchScore: suggestion.matchScore,
      matchedSkills: suggestion.matchedSkills,
    }));
  }, [job?.skills, suggestions]);

  const sortedRecommendations = useMemo(() => {
    return [...calculateRecommendations].filter(mentee => mentee.matchScore >= 10).sort((a, b) => {
      if (sortBy === "match")
        return b.matchScore - a.matchScore;
      return b.performanceScore - a.performanceScore;
    });
  }, [calculateRecommendations, sortBy]);

  // Helper function to generate reason for suggestion
  const generateSuggestionReason = (recommendation: any) => {
    const { matchScore, matchedSkills, interviewReadiness, aiInsights } = recommendation;
    const reasons = [];
    
    // Skill matching reason
    if (matchedSkills.length > 0) {
      if (matchScore >= 70) {
        reasons.push(`Strong skill alignment with ${matchedSkills.length} key skills`);
      } else if (matchScore >= 50) {
        reasons.push(`Good skill match with ${matchedSkills.length} relevant skills`);
      } else {
        reasons.push(`Partial skill match with ${matchedSkills.length} skills`);
      }
    }
    
    // Interview data reasons
    if (interviewReadiness?.interviewCount > 0) {
      if (interviewReadiness.readinessScore >= 70) {
        reasons.push(`Proven interview readiness with ${interviewReadiness.interviewCount} completed interviews`);
      } else if (interviewReadiness.readinessScore >= 50) {
        reasons.push(`Demonstrated interview capability across ${interviewReadiness.interviewCount} interviews`);
      } else {
        reasons.push(`Has completed ${interviewReadiness.interviewCount} interviews`);
      }
      
      // Add average performance details
      if (interviewReadiness.avgOverallScore >= 80) {
        reasons.push(`Excellent interview performance (${interviewReadiness.avgOverallScore}% average)`);
      } else if (interviewReadiness.avgOverallScore >= 60) {
        reasons.push(`Good interview performance (${interviewReadiness.avgOverallScore}% average)`);
      }
      
      // Add relevance info if available
      if (interviewReadiness.relevanceInfo?.relevantInterviews > 0) {
        const { relevantInterviews, totalInterviews, avgRelevanceScore } = interviewReadiness.relevanceInfo;
        if (avgRelevanceScore >= 70) {
          reasons.push(`${relevantInterviews} highly relevant interviews (${avgRelevanceScore}% relevance)`);
        } else if (avgRelevanceScore >= 50) {
          reasons.push(`${relevantInterviews} relevant interviews (${avgRelevanceScore}% relevance)`);
        }
      }
    } else {
      reasons.push('No interview history yet');
    }
    
    // AI insights reason
    if (aiInsights?.reportCount > 0) {
      if (aiInsights.aiInsightScore >= 70) {
        reasons.push(`Strong AI assessment results from ${aiInsights.reportCount} reports`);
      } else if (aiInsights.aiInsightScore >= 50) {
        reasons.push(`Positive AI insights from ${aiInsights.reportCount} reports`);
      } else {
        reasons.push(`${aiInsights.reportCount} AI analysis reports available`);
      }
    }
    
    // If no specific reasons, provide a default
    if (reasons.length === 0) {
      reasons.push('Potential candidate based on profile analysis');
    }
    
    return reasons.join('. ') + '.';
  };

  // Helper components for table (matching ApplicantsList)
  function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
      <th className={`px-5 py-3 font-semibold text-left ${className}`}>
        {children}
      </th>
    );
  }

  function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return <td className={`px-5 py-3 align-top text-left ${className}`}>{children}</td>;
  }

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

      {/* ================= RECOMMENDATIONS TABLE ================= */}
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
              <Th>Mentee</Th>
              <Th>Contact</Th>
              <Th>Match Score</Th>
              <Th>Matched Skills</Th>
              <Th>Reason for Suggestion</Th>
              <Th className="text-center">Actions</Th>
            </tr>
          </thead>

          <tbody>
            {sortedRecommendations.map((recommendation) => {
              const m = recommendation.mentee;

              return (
                <tr
                  key={recommendation.menteeId}
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
                      {m?.email ? (
                        <span className="truncate">{m.email}</span>
                      ) : (
                        <span className="opacity-40">Email not available</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={13} />
                      {m?.phoneNumber ? (
                        <span>{m.phoneNumber}</span>
                      ) : (
                        <span className="opacity-40">Phone not available</span>
                      )}
                    </div>
                  </Td>

                  <Td>
                    <div className={`font-bold text-lg ${
                      recommendation.matchScore >= 80
                        ? "text-green-600"
                        : recommendation.matchScore >= 60
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}>
                      {recommendation.matchScore}%
                    </div>
                    <div className="text-xs opacity-60">Skill Match</div>
                  </Td>

                  <Td>
                    <div className="flex flex-wrap gap-1">
                      {recommendation.matchedSkills.length > 0 ? (
                        recommendation.matchedSkills.slice(0, 3).map((skill, idx) => (
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
                          No matches
                        </span>
                      )}
                      {recommendation.matchedSkills.length > 3 && (
                        <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                          +{recommendation.matchedSkills.length - 3} more
                        </span>
                      )}
                    </div>
                  </Td>

                  <Td>
                    <div className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      {generateSuggestionReason(recommendation)}
                    </div>
                  </Td>

                  <Td className="space-y-2 text-center">
                    <button
                      onClick={() => onViewProfile(m?._id)}
                      className="flex items-center gap-2 mx-auto px-3 py-1 text-xs rounded-lg border hover:bg-white/10"
                    >
                      <User size={14} />
                      View Profile
                    </button>

                    {onInviteToApply && (
                      <div className="space-y-2">
                        <button
                          onClick={() => handleInviteToApply(recommendation.menteeId)}
                          disabled={inviteLoading.has(recommendation.menteeId) || inviteSuccess.has(recommendation.menteeId)}
                          className={`flex items-center gap-2 mx-auto px-3 py-1 text-xs rounded-lg border transition ${
                            inviteLoading.has(recommendation.menteeId)
                              ? isDark
                                ? "bg-gray-600/20 border-gray-600/30 text-gray-400 cursor-not-allowed"
                                : "bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed"
                              : inviteSuccess.has(recommendation.menteeId)
                              ? isDark
                                ? "bg-green-500/20 border-green-500/30 text-green-300"
                                : "bg-green-100 border-green-300 text-green-700"
                              : isDark
                              ? "bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20 text-purple-300"
                              : "bg-purple-100 border-purple-300 hover:bg-purple-200 text-purple-700"
                          }`}
                        >
                          {inviteLoading.has(recommendation.menteeId) ? (
                            <>
                              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              Sending...
                            </>
                          ) : inviteSuccess.has(recommendation.menteeId) ? (
                            <>
                              <Send size={14} />
                              Invite Sent
                            </>
                          ) : (
                            <>
                              <Send size={14} />
                              Invite to Apply
                            </>
                          )}
                        </button>
                        
                        {inviteErrors.has(recommendation.menteeId) && (
                          <div className={`text-xs px-2 py-1 rounded text-center ${
                            isDark
                              ? "bg-red-500/20 text-red-300 border border-red-500/30"
                              : "bg-red-100 text-red-700 border border-red-300"
                          }`}>
                            {inviteErrors.get(recommendation.menteeId)}
                          </div>
                        )}
                      </div>
                    )}
                  </Td>
                </tr>
              );
            })}

            {sortedRecommendations.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-10 opacity-60">
                  No suggestions yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
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

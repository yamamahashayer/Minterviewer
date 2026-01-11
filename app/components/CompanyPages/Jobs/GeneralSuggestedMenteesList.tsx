"use client";

import React, { useMemo, useState, useEffect } from "react";
import { User, MapPin, Star, Send, Brain, Mail, Phone } from "lucide-react";

type Theme = "dark" | "light";

interface Props {
  company: any;
  theme: Theme;
  onViewProfile: (menteeId: string) => void;
}

interface RecommendedMentee {
  menteeId: string;
  userId: string;
  skills: string[];
  classified_skills?: {
    categories: {
      category: string;
      skills: string[];
    }[];
    source: string[];
    updated_at: Date;
  };
  matchScore: number;
  matchedSkills: string[];
  performanceScore: number;
  full_name?: string;
  Country?: string;
  email?: string | null;
  phoneNumber?: string | null;
}

export default function GeneralSuggestedMenteesList({
  company,
  theme,
  onViewProfile,
}: Props) {
  const isDark = theme === "dark";
  const [sortBy, setSortBy] = useState<"match" | "performance">(() => {
    return "match";
  });
  const [suggestions, setSuggestions] = useState<RecommendedMentee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch general suggestions from API
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!company?._id) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/company/${company._id}/suggestions`
        );

        if (!response.ok) {
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
            _id: suggestion.menteeId,
            full_name: suggestion.full_name || `User ${suggestion.menteeId.slice(-6)}`,
            classified_skills: suggestion.classified_skills,
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
  }, [company?._id]);

  // Calculate recommendations based on API suggestions
  const calculateRecommendations = useMemo(() => {
    return suggestions.map(suggestion => ({
      ...suggestion,
      mentee: {
        _id: suggestion.menteeId,
        full_name: suggestion.full_name,
        Country: suggestion.Country,
        email: suggestion.email,
        phoneNumber: suggestion.phoneNumber,
        classified_skills: suggestion.classified_skills,
      },
      cvScore: null,
      interviewScore: null,
      performanceScore: suggestion.performanceScore,
      matchScore: suggestion.matchScore,
      matchedSkills: suggestion.matchedSkills,
    }));
  }, [suggestions]);

  const sortedRecommendations = useMemo(() => {
    return [...calculateRecommendations].sort((a, b) => {
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
      
      if (interviewReadiness.avgOverallScore >= 80) {
        reasons.push(`Excellent interview performance (${interviewReadiness.avgOverallScore}% average)`);
      } else if (interviewReadiness.avgOverallScore >= 60) {
        reasons.push(`Good interview performance (${interviewReadiness.avgOverallScore}% average)`);
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
    
    if (reasons.length === 0) {
      reasons.push('Potential candidate based on profile analysis');
    }
    
    return reasons.join('. ') + '.';
  };

  // Helper components for table
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

  // Show loading state
  if (loading) {
    return (
      <div
        className={`p-6 rounded-2xl space-y-4 ${
          isDark ? "bg-[#1b2333] text-white" : "bg-white text-black"
        }`}
      >
        <div className="text-center py-10 opacity-60">
          <Brain size={48} className="mx-auto mb-4 opacity-50 animate-pulse" />
          <p>Loading general suggestions...</p>
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
        <div className="text-center py-10 opacity-60">
          <Brain size={48} className="mx-auto mb-4 opacity-50" />
          <p>Error loading suggestions</p>
          <p className="text-sm">{error}</p>
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
        <div className="text-center py-10 opacity-60">
          <Brain size={48} className="mx-auto mb-4 opacity-50" />
          <p>No general suggestions yet</p>
          <p className="text-sm">No mentees found matching general criteria</p>
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
          <h2 className="text-3xl font-bold">
            General Mentee Suggestions ({Math.min(sortedRecommendations.length, 6)})
          </h2>
          <p className="text-sm opacity-60">
            Top 6 special AI-powered recommendations based on overall profile and skills
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
              <Th className="w-48">Matched Skills</Th>
              <Th>Reason for Suggestion</Th>
              <Th className="text-center">Actions</Th>
            </tr>
          </thead>

          <tbody>
            {sortedRecommendations
              .filter(recommendation => recommendation.matchScore >= 30)
              .slice(0, 6)
              .map((recommendation) => {
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
                    <div className="text-xs opacity-60">Overall Match</div>
                  </Td>

                  <Td>
                    <div className="flex flex-wrap gap-1 max-w-48">
                      {m?.classified_skills?.categories && m.classified_skills.categories.length > 0 ? (
                        <>
                          {m.classified_skills.categories.flatMap((category: any, catIdx: number) => 
                            category.skills.slice(0, 2).map((skill: string, skillIdx: number) => (
                              <span
                                key={`${catIdx}-${skillIdx}`}
                                className={`px-1.5 py-0.5 text-xs rounded-full whitespace-nowrap ${
                                  isDark
                                    ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                    : "bg-green-100 text-green-700 border border-green-300"
                                }`}
                              >
                                {skill}
                              </span>
                            ))
                          ).slice(0, 3)}
                          {m.classified_skills.categories.reduce((total: number, cat: any) => total + cat.skills.length, 0) > 3 && (
                            <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                              +{m.classified_skills.categories.reduce((total: number, cat: any) => total + cat.skills.length, 0) - 3} more
                            </span>
                          )}
                        </>
                      ) : (
                        <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                          No skills
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
        💡 General suggestions are based on AI analysis of mentee profiles, skills, and interview performance. These recommendations are not tied to specific job requirements.
      </div>
    </div>
  );
}

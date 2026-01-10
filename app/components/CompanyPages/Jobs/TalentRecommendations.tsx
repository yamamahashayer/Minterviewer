"use client";

import React, { useMemo, useState } from "react";
import { User, MapPin, Star, Briefcase, Send, Brain } from "lucide-react";

type Theme = "dark" | "light";

interface Props {
  job: any;
  theme: Theme;
  onViewProfile: (menteeId: string) => void;
  onInviteToApply?: (menteeId: string) => void;
}

interface RecommendedMentee {
  _id: string;
  full_name: string;
  Country?: string;
  skills: string[];
  performanceScore: number;
  matchScore: number;
  matchedSkills: string[];
  cvAnalysis?: any;
  interviewAnalysis?: any;
}

export default function TalentRecommendations({
  job,
  theme,
  onViewProfile,
  onInviteToApply,
}: Props) {
  const isDark = theme === "dark";
  const [recommendations, setRecommendations] = useState<RecommendedMentee[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration - replace with actual API call
  const mockRecommendations: RecommendedMentee[] = [
    {
      _id: "1",
      full_name: "Sarah Johnson",
      Country: "United States",
      skills: ["React", "TypeScript", "Node.js", "AWS"],
      performanceScore: 92,
      matchScore: 88,
      matchedSkills: ["React", "TypeScript", "Node.js"],
      cvAnalysis: { skills: ["React", "TypeScript", "Node.js", "AWS"] },
      interviewAnalysis: { skills: ["React", "TypeScript", "Node.js"] }
    },
    {
      _id: "2",
      full_name: "Michael Chen",
      Country: "Canada",
      skills: ["React", "Python", "Docker", "PostgreSQL"],
      performanceScore: 85,
      matchScore: 75,
      matchedSkills: ["React", "Python"],
      cvAnalysis: { skills: ["React", "Python", "Docker", "PostgreSQL"] },
      interviewAnalysis: { skills: ["React", "Python"] }
    },
    {
      _id: "3",
      full_name: "Emily Rodriguez",
      Country: "Mexico",
      skills: ["JavaScript", "React", "MongoDB", "Express"],
      performanceScore: 78,
      matchScore: 82,
      matchedSkills: ["JavaScript", "React", "MongoDB"],
      cvAnalysis: { skills: ["JavaScript", "React", "MongoDB", "Express"] },
      interviewAnalysis: { skills: ["JavaScript", "React"] }
    }
  ];

  // Calculate recommendations based on job requirements
  const calculateRecommendations = useMemo(() => {
    if (!job?.skills || !Array.isArray(job.skills)) return [];

    const jobSkills = job.skills.map((skill: string) => skill.toLowerCase());
    
    return mockRecommendations.map(mentee => {
      // Calculate skill match score
      const menteeSkills = mentee.skills.map(skill => skill.toLowerCase());
      const matchedSkills = menteeSkills.filter(skill => 
        jobSkills.some(jobSkill => 
          jobSkill.includes(skill) || skill.includes(jobSkill)
        )
      );
      
      const skillMatchScore = jobSkills.length > 0 
        ? (matchedSkills.length / jobSkills.length) * 100
        : 0;
      
      // Weighted score: 60% skill match, 40% performance
      const weightedScore = (skillMatchScore * 0.6) + (mentee.performanceScore * 0.4);
      
      return {
        ...mentee,
        matchScore: Math.round(skillMatchScore),
        matchedSkills: matchedSkills.map(skill => 
          mentee.skills.find(s => s.toLowerCase() === skill) || skill
        )
      };
    }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);
  }, [job?.skills]);

  const finalRecommendations = calculateRecommendations;

  if (!job?.skills || job.skills.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recommended Candidates from Minterviewer</h3>
        <div className="flex items-center gap-2 text-xs opacity-60">
          <Brain size={14} />
          AI-powered recommendations
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {finalRecommendations.map((mentee) => (
          <div
            key={mentee._id}
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
                onClick={() => onViewProfile(mentee._id)}
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
                  onClick={() => onInviteToApply(mentee._id)}
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

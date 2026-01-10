"use client";

import React from "react";
import {
  Briefcase,
  MapPin,
  Users,
  Calendar,
  Clock,
  Building2,
  ChevronDown,
  ChevronRight,
  Star,
  TrendingUp,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Job = {
  _id: string;
  title: string;
  type: string;
  level: string;
  location: string;
  salaryRange?: string;
  description?: string;
  skills: string[];
  status: string;
  deadline?: string;
  enableCVAnalysis: boolean;
  interviewType: string;
  createdAt: string;
  applicants: Array<{
    _id: string;
    status: string;
    createdAt: string;
    mentee?: {
      full_name: string;
      email: string;
      phoneNumber: string;
      Country: string;
    };
  }>;
};

type Props = {
  job: Job;
  theme: "dark" | "light";
  onToggle?: () => void;
  isExpanded?: boolean;
  showFullLink?: boolean; // New prop to show full page link
};

export default function JobInfoCard({ job, theme, onToggle, isExpanded = false, showFullLink = false }: Props) {
  const isDark = theme === "dark";
  const router = useRouter();

  // Debug: log job data
  console.log("JobInfoCard - job data:", {
    jobId: job._id,
    applicantsCount: job.applicants?.length || 0,
    applicants: job.applicants?.slice(0, 2).map(a => ({
      id: a._id,
      status: a.status,
      hasMentee: !!a.mentee,
      menteeName: a.mentee?.full_name
    }))
  });

  // Calculate job statistics
  const totalApplicants = job.applicants.length;
  const pendingApplicants = job.applicants.filter(a => a.status === "pending").length;
  const interviewPending = job.applicants.filter(a => a.status === "interview_pending").length;
  const shortlisted = job.applicants.filter(a => a.status === "shortlisted").length;
  const rejected = job.applicants.filter(a => a.status === "rejected").length;

  const conversionRate = totalApplicants > 0 ? (shortlisted / totalApplicants) * 100 : 0;

  return (
    <div
      className={`rounded-xl border overflow-hidden transition-all duration-200 ${
        isDark
          ? "bg-[#1b2333] border-[#1e293b] hover:border-[#374151]"
          : "bg-white border-gray-200 hover:border-gray-300"
      }`}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-4 text-left transition-colors ${
          isDark ? "hover:bg-[#1e293b]" : "hover:bg-gray-50"
        }`}
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-lg">{job.title}</h3>
            <span
              className={`px-2 py-1 text-xs rounded-full font-medium ${
                job.status === "active"
                  ? isDark
                    ? "bg-green-500/20 text-green-300"
                    : "bg-green-100 text-green-700"
                  : isDark
                  ? "bg-red-500/20 text-red-300"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {job.status === "active" ? "Active" : "Closed"}
            </span>
          </div>
          
          {/* Only show essential info when collapsed */}
          {!isExpanded && (
            <div className="flex items-center gap-4 text-sm opacity-70">
              <span className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                {job.type || "Not specified"}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {job.location || "Not specified"}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {totalApplicants} applicant(s)
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Full page link */}
          {showFullLink && (
            <Link
              href={`/company/jobs/${job._id}`}
              className={`p-2 rounded-lg border text-xs font-medium transition-colors ${
                isDark
                  ? "border-white/20 hover:bg-white/10"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
              title="View full job details"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          )}
          
          {isExpanded ? <ChevronDown /> : <ChevronRight />}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-5 border-t border-gray-200/20 space-y-6">
          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className={`p-3 rounded-lg text-center ${
              isDark ? "bg-white/5" : "bg-gray-50"
            }`}>
              <div className="text-lg font-bold">{totalApplicants}</div>
              <div className="text-xs opacity-70">Total Applicants</div>
            </div>
            
            <div className={`p-3 rounded-lg text-center ${
              isDark ? "bg-yellow-500/10" : "bg-yellow-50"
            }`}>
              <div className="text-lg font-bold text-yellow-500">{pendingApplicants}</div>
              <div className="text-xs opacity-70">Pending</div>
            </div>
            
            <div className={`p-3 rounded-lg text-center ${
              isDark ? "bg-green-500/10" : "bg-green-50"
            }`}>
              <div className="text-lg font-bold text-green-500">{shortlisted}</div>
              <div className="text-xs opacity-70">Shortlisted</div>
            </div>
            
            <div className={`p-3 rounded-lg text-center ${
              isDark ? "bg-blue-500/10" : "bg-blue-50"
            }`}>
              <div className="text-lg font-bold text-blue-500">{conversionRate.toFixed(1)}%</div>
              <div className="text-xs opacity-70">Conversion Rate</div>
            </div>
          </div>

          {/* Job Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs font-semibold mb-1 opacity-70">Job Level</p>
              <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                {job.level || "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold mb-1 opacity-70">Salary</p>
              <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                {job.salaryRange || "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold mb-1 opacity-70">Deadline</p>
              <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                {job.deadline 
                  ? new Date(job.deadline).toLocaleDateString()
                  : "No deadline"
                }
              </p>
            </div>
          </div>

          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <div>
              <p className="text-sm font-semibold mb-2">Required Skills</p>
              <div className="flex flex-wrap gap-2">
                {job.skills.slice(0, 6).map((skill, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 text-xs rounded-full border ${
                      isDark
                        ? "bg-white/5 border-white/10 text-gray-300"
                        : "bg-gray-100 border-gray-300 text-gray-700"
                    }`}
                  >
                    {skill}
                  </span>
                ))}
                {job.skills.length > 6 && (
                  <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    +{job.skills.length - 6} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

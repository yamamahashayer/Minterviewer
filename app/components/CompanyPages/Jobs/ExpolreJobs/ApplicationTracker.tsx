"use client";

import React, { useEffect, useState } from "react";
import {
  Briefcase,
  Building2,
  MapPin,
  Clock,
  FileText,
  Video,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Brain,
  Award,
  TrendingUp,
} from "lucide-react";

type Application = {
  _id: string;
  jobId: string;
  jobTitle: string;
  jobType: string;
  jobLevel: string;
  jobLocation: string;
  jobStatus: string;
  salaryRange: string;
  deadline: string;
  skills: string[];
  company: {
    name: string;
    logo?: string;
    industry: string;
    location: string;
  };
  applicationStatus: "pending" | "interview_pending" | "interview_completed" | "shortlisted" | "rejected";
  cvScore: number | null;
  atsScore: number | null;
  interviewScore: number | null;
  interviewId: string | null;
  analysisId: string | null;
  interviewStartedAt: string | null;
  interviewCompletedAt: string | null;
  appliedAt: string;
  updatedAt: string;
  enableCVAnalysis: boolean;
  interviewType: "none" | "ai" | "human";
};

type Props = {
  isDark?: boolean;
};

export default function ApplicationTracker({ isDark = true }: Props) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      // Get mentee ID from sessionStorage
      const menteeId = sessionStorage.getItem("menteeId");
      const token = sessionStorage.getItem("token");

      let url = "/api/mentee/applications";
      if (menteeId && !token) {
        url += `?menteeId=${menteeId}`;
      }

      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(url, { headers });
      const data = await res.json();

      if (data.ok) {
        setApplications(data.applications);
        setStats(data.stats);
      } else {
        setError(data.message || "Failed to fetch applications");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Fetch applications error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return isDark ? "text-yellow-400" : "text-yellow-600";
      case "interview_pending":
        return isDark ? "text-blue-400" : "text-blue-600";
      case "interview_completed":
        return isDark ? "text-purple-400" : "text-purple-600";
      case "shortlisted":
        return isDark ? "text-green-400" : "text-green-600";
      case "rejected":
        return isDark ? "text-red-400" : "text-red-600";
      default:
        return isDark ? "text-gray-400" : "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "interview_pending":
        return <Video className="w-4 h-4" />;
      case "interview_completed":
        return <CheckCircle className="w-4 h-4" />;
      case "shortlisted":
        return <Award className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Application Pending";
      case "interview_pending":
        return "Interview Pending";
      case "interview_completed":
        return "Interview Completed";
      case "shortlisted":
        return "Shortlisted";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchApplications}
          className="mt-4 px-4 py-2 rounded-lg bg-teal-500 text-white hover:bg-teal-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ================= STATS CARDS ================= */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard
            isDark={isDark}
            title="Total"
            value={stats.total}
            icon={<Briefcase className="w-5 h-5" />}
            color="teal"
          />
          <StatCard
            isDark={isDark}
            title="Pending"
            value={stats.pending}
            icon={<Clock className="w-5 h-5" />}
            color="yellow"
          />
          <StatCard
            isDark={isDark}
            title="Interview"
            value={stats.interview_pending}
            icon={<Video className="w-5 h-5" />}
            color="blue"
          />
          <StatCard
            isDark={isDark}
            title="Completed"
            value={stats.interview_completed}
            icon={<CheckCircle className="w-5 h-5" />}
            color="purple"
          />
          <StatCard
            isDark={isDark}
            title="Shortlisted"
            value={stats.shortlisted}
            icon={<Award className="w-5 h-5" />}
            color="green"
          />
          <StatCard
            isDark={isDark}
            title="Rejected"
            value={stats.rejected}
            icon={<XCircle className="w-5 h-5" />}
            color="red"
          />
        </div>
      )}

      {/* ================= APPLICATIONS LIST ================= */}
      {applications.length === 0 ? (
        <div
          className={`text-center py-20 rounded-xl border ${
            isDark
              ? "bg-white/5 border-white/10"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No Applications Yet</h3>
          <p className="opacity-70">Start applying to jobs to track your progress here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <ApplicationCard
              key={app._id}
              application={app}
              isDark={isDark}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
              getStatusText={getStatusText}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({
  isDark,
  title,
  value,
  icon,
  color,
}: {
  isDark: boolean;
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  const colorClasses = {
    teal: isDark ? "bg-teal-500/20 text-teal-300 border-teal-500/30" : "bg-teal-50 text-teal-700 border-teal-200",
    yellow: isDark ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" : "bg-yellow-50 text-yellow-700 border-yellow-200",
    blue: isDark ? "bg-blue-500/20 text-blue-300 border-blue-500/30" : "bg-blue-50 text-blue-700 border-blue-200",
    purple: isDark ? "bg-purple-500/20 text-purple-300 border-purple-500/30" : "bg-purple-50 text-purple-700 border-purple-200",
    green: isDark ? "bg-green-500/20 text-green-300 border-green-500/30" : "bg-green-50 text-green-700 border-green-200",
    red: isDark ? "bg-red-500/20 text-red-300 border-red-500/30" : "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div
      className={`p-4 rounded-xl border ${colorClasses[color as keyof typeof colorClasses]}`}
    >
      <div className="flex items-center justify-between mb-2">
        {icon}
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <p className="text-sm opacity-80">{title}</p>
    </div>
  );
}

function ApplicationCard({
  application,
  isDark,
  getStatusColor,
  getStatusIcon,
  getStatusText,
}: {
  application: Application;
  isDark: boolean;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
  getStatusText: (status: string) => string;
}) {
  const performanceScore = React.useMemo(() => {
    let score = 0;
    let components = 0;

    if (application.enableCVAnalysis && application.cvScore !== null) {
      score += application.cvScore * 0.4;
      components += 0.4;
    }

    if (application.interviewType !== "none" && application.interviewScore !== null) {
      score += application.interviewScore * 0.6;
      components += 0.6;
    }

    if (components === 0) return null;
    if (components < 1) score = score / components;

    return Math.round(score);
  }, [application]);

  return (
    <div
      className={`rounded-xl p-6 border transition-all duration-200 hover:shadow-lg ${
        isDark
          ? "bg-white/5 border-white/10 hover:bg-white/10"
          : "bg-white border-gray-200 hover:border-gray-300"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          {application.company.logo ? (
            <img
              src={application.company.logo}
              className="w-12 h-12 rounded-full object-cover border"
            />
          ) : (
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border ${
                isDark
                  ? "bg-white/10 border-white/20"
                  : "bg-gray-100 border-gray-300"
              }`}
            >
              <Building2 className="w-6 h-6 opacity-70" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-lg">{application.jobTitle}</h3>
            <p className="text-sm opacity-70">{application.company.name}</p>
          </div>
        </div>

        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(
          application.applicationStatus
        )} ${isDark ? "border-current/20" : "border-current/30"}`}>
          {getStatusIcon(application.applicationStatus)}
          <span className="text-sm font-medium">
            {getStatusText(application.applicationStatus)}
          </span>
        </div>
      </div>

      {/* Job Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm opacity-70">
          <MapPin className="w-4 h-4" />
          {application.jobLocation}
        </div>
        <div className="flex items-center gap-2 text-sm opacity-70">
          <Briefcase className="w-4 h-4" />
          {application.jobType} • {application.jobLevel}
        </div>
        <div className="flex items-center gap-2 text-sm opacity-70">
          <Clock className="w-4 h-4" />
          Applied {new Date(application.appliedAt).toLocaleDateString()}
        </div>
      </div>

      {/* Scores */}
      <div className="flex items-center gap-6 text-sm">
        {application.enableCVAnalysis && application.cvScore !== null && (
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500" />
            <span>CV: {application.cvScore}</span>
          </div>
        )}
        {application.interviewType !== "none" && application.interviewScore !== null && (
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-purple-500" />
            <span>Interview: {application.interviewScore}</span>
          </div>
        )}
        {performanceScore !== null && (
          <div className="flex items-center gap-2 font-semibold">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span>Performance: {performanceScore}%</span>
          </div>
        )}
      </div>

      {/* Skills */}
      {application.skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {application.skills.slice(0, 4).map((skill, index) => (
            <span
              key={index}
              className={`px-2 py-1 text-xs rounded-full border ${
                isDark
                  ? "bg-white/5 border-white/10"
                  : "bg-gray-100 border-gray-200"
              }`}
            >
              {skill}
            </span>
          ))}
          {application.skills.length > 4 && (
            <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              +{application.skills.length - 4} more
            </span>
          )}
        </div>
      )}
    </div>
  );
}

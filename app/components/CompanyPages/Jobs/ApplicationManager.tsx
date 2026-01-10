"use client";

import React, { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  MessageSquare,
  FileText,
  Video,
  User,
  Mail,
  Phone,
  Send,
  Star,
  TrendingUp,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  X,
} from "lucide-react";
import InterviewScheduler from "./InterviewScheduler";

type Applicant = {
  _id: string;
  status: string;
  createdAt: string;
  mentee: {
    _id: string;
    full_name: string;
    email: string;
    phoneNumber: string;
    Country: string;
  };
  cvScore: number | null;
  atsScore: number | null;
  interviewScore: number | null;
  analysisId: string | null;
  interviewId: string | null;
  notes?: Array<{
    content: string;
    createdAt: string;
    createdBy: string;
  }>;
};

type Job = {
  _id: string;
  title: string;
  enableCVAnalysis: boolean;
  interviewType: string;
  skills: string[];
};

type Props = {
  applicants: Applicant[];
  job: Job;
  theme: "dark" | "light";
  onViewProfile: (menteeId: string) => void;
  onStatusUpdate: () => void;
  companyId: string;
};

export default function ApplicationManager({
  applicants,
  job,
  theme,
  onViewProfile,
  onStatusUpdate,
  companyId,
}: Props) {
  const isDark = theme === "dark";
  const [expandedApplicant, setExpandedApplicant] = useState<string | null>(null);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [selectedApplicantForMessage, setSelectedApplicantForMessage] = useState<string | null>(null);
  const [showScheduler, setShowScheduler] = useState<string | null>(null);

  const updateApplicantStatus = async (applicantId: string, newStatus: string, note?: string) => {
    setStatusUpdating(applicantId);
    try {
      const res = await fetch(
        `/api/company/${companyId}/jobs/${job._id}/applicants/${applicantId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus, note }),
        }
      );

      if (res.ok) {
        onStatusUpdate(); // Refresh the data
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setStatusUpdating(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return isDark ? "text-yellow-400 bg-yellow-400/20" : "text-yellow-600 bg-yellow-100";
      case "interview_pending":
        return isDark ? "text-blue-400 bg-blue-400/20" : "text-blue-600 bg-blue-100";
      case "interview_completed":
        return isDark ? "text-purple-400 bg-purple-400/20" : "text-purple-600 bg-purple-100";
      case "shortlisted":
        return isDark ? "text-green-400 bg-green-400/20" : "text-green-600 bg-green-100";
      case "rejected":
        return isDark ? "text-red-400 bg-red-400/20" : "text-red-600 bg-red-100";
      default:
        return isDark ? "text-gray-400 bg-gray-400/20" : "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "interview_pending":
        return <Calendar className="w-4 h-4" />;
      case "interview_completed":
        return <Video className="w-4 h-4" />;
      case "shortlisted":
        return <Star className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending Review";
      case "interview_pending":
        return "Interview Scheduled";
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

  const calculatePerformanceScore = (applicant: Applicant) => {
    let score = 0;
    let components = 0;

    if (job.enableCVAnalysis && applicant.cvScore !== null) {
      score += applicant.cvScore * 0.4;
      components += 0.4;
    }

    if (job.interviewType !== "none" && applicant.interviewScore !== null) {
      score += applicant.interviewScore * 0.6;
      components += 0.6;
    }

    if (components === 0) return null;
    if (components < 1) score = score / components;

    return Math.round(score);
  };

  const sendMessage = async (applicantId: string) => {
    if (!message.trim()) return;

    try {
      // TODO: Implement messaging API
      console.log("Sending message to applicant:", applicantId, message);
      setMessage("");
      setSelectedApplicantForMessage(null);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleScheduleInterview = (applicantId: string, slot: any) => {
    setShowScheduler(null);
    onStatusUpdate(); // Refresh the data
  };

  return (
    <div className="space-y-4">
      {applicants.map((applicant) => {
        const isExpanded = expandedApplicant === applicant._id;
        const performanceScore = calculatePerformanceScore(applicant);

        return (
          <div
            key={applicant._id}
            className={`rounded-xl border overflow-hidden transition-all duration-200 ${
              isDark
                ? "bg-[#1b2333] border-[#1e293b] hover:border-[#374151]"
                : "bg-white border-gray-200 hover:border-gray-300"
            }`}
          >
            {/* Main Applicant Row */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isDark ? "bg-white/10" : "bg-gray-100"
                      }`}
                    >
                      <User className="w-6 h-6 opacity-70" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{applicant.mentee?.full_name || "N/A"}</h3>
                      <div className="flex items-center gap-4 text-sm opacity-70">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {applicant.mentee?.email || "N/A"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {applicant.mentee?.phoneNumber || "N/A"}
                        </span>
                        <span>{applicant.mentee?.Country || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Performance Score */}
                  {performanceScore !== null && (
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${
                        performanceScore >= 80 ? "text-green-500" :
                        performanceScore >= 60 ? "text-yellow-500" : "text-red-500"
                      }`}>
                        {performanceScore}%
                      </div>
                      <div className="text-xs opacity-60">Performance</div>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(applicant.status)}`}>
                    {getStatusIcon(applicant.status)}
                    <span className="text-sm font-medium">{getStatusText(applicant.status)}</span>
                  </div>

                  {/* Expand/Collapse Button */}
                  <button
                    onClick={() => setExpandedApplicant(isExpanded ? null : applicant._id)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark ? "hover:bg-white/10" : "hover:bg-gray-100"
                    }`}
                  >
                    {isExpanded ? <ChevronDown /> : <ChevronRight />}
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onViewProfile(applicant.mentee?._id)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    isDark
                      ? "border-white/20 hover:bg-white/10"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <User className="w-4 h-4 inline mr-2" />
                  View Profile
                </button>

                {applicant.analysisId && (
                  <button
                    onClick={() => window.open(`/company/cv-analysis/${applicant.analysisId}`, "_blank")}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      isDark
                        ? "border-white/20 hover:bg-white/10"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <FileText className="w-4 h-4 inline mr-2" />
                    CV Analysis
                  </button>
                )}

                {applicant.interviewId && (
                  <button
                    onClick={() => window.open(`/company/jobs/${job._id}/applicants/${applicant._id}/interview`, "_blank")}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      isDark
                        ? "border-white/20 hover:bg-white/10"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <Video className="w-4 h-4 inline mr-2" />
                    View Interview
                  </button>
                )}

                <button
                  onClick={() => setSelectedApplicantForMessage(applicant._id)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    isDark
                      ? "border-white/20 hover:bg-white/10"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  Message
                </button>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="mt-6 pt-6 border-t border-gray-200/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Scores Section */}
                    <div>
                      <h4 className="font-semibold mb-3">Performance Metrics</h4>
                      <div className="space-y-2">
                        {job.enableCVAnalysis && applicant.cvScore !== null && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm opacity-70">CV Score</span>
                            <span className="font-semibold">{applicant.cvScore}</span>
                          </div>
                        )}
                        {job.interviewType !== "none" && applicant.interviewScore !== null && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm opacity-70">Interview Score</span>
                            <span className="font-semibold">{applicant.interviewScore}</span>
                          </div>
                        )}
                        {applicant.atsScore !== null && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm opacity-70">ATS Score</span>
                            <span className="font-semibold">{applicant.atsScore}%</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-sm opacity-70">Applied</span>
                          <span className="font-semibold">{new Date(applicant.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Actions */}
                    <div>
                      <h4 className="font-semibold mb-3">Update Status</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setShowScheduler(applicant._id)}
                          disabled={statusUpdating === applicant._id}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isDark
                              ? "bg-teal-500/20 text-teal-300 hover:bg-teal-500/30"
                              : "bg-teal-100 text-teal-700 hover:bg-teal-200"
                          }`}
                        >
                          {statusUpdating === applicant._id ? "Updating..." : "Schedule Interview"}
                        </button>
                        <button
                          onClick={() => updateApplicantStatus(applicant._id, "shortlisted")}
                          disabled={statusUpdating === applicant._id}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isDark
                              ? "bg-green-500/20 text-green-300 hover:bg-green-500/30"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          {statusUpdating === applicant._id ? "Updating..." : "Shortlist"}
                        </button>
                        <button
                          onClick={() => updateApplicantStatus(applicant._id, "rejected")}
                          disabled={statusUpdating === applicant._id}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isDark
                              ? "bg-red-500/20 text-red-300 hover:bg-red-500/30"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          }`}
                        >
                          {statusUpdating === applicant._id ? "Updating..." : "Reject"}
                        </button>
                        <button
                          onClick={() => updateApplicantStatus(applicant._id, "pending")}
                          disabled={statusUpdating === applicant._id}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isDark
                              ? "bg-gray-500/20 text-gray-300 hover:bg-gray-500/30"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {statusUpdating === applicant._id ? "Updating..." : "Reset to Pending"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Notes Section */}
                  {applicant.notes && applicant.notes.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold mb-3">Notes</h4>
                      <div className="space-y-2">
                        {applicant.notes.map((note, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg text-sm ${
                              isDark ? "bg-white/5" : "bg-gray-50"
                            }`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-medium">{note.createdBy}</span>
                              <span className="text-xs opacity-60">
                                {new Date(note.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p>{note.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Message Modal */}
              {selectedApplicantForMessage === applicant._id && (
                <div className="mt-4 pt-4 border-t border-gray-200/20">
                  <div className="space-y-3">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message to the applicant..."
                      className={`w-full p-3 rounded-lg border resize-none ${
                        isDark
                          ? "bg-white/5 border-white/20 text-white placeholder-gray-400"
                          : "bg-gray-50 border-gray-300 text-black placeholder-gray-500"
                      }`}
                      rows={3}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedApplicantForMessage(null)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isDark
                            ? "bg-gray-500/20 text-gray-300 hover:bg-gray-500/30"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => sendMessage(applicant._id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isDark
                            ? "bg-teal-500 text-black hover:bg-teal-400"
                            : "bg-teal-600 text-white hover:bg-teal-700"
                        }`}
                      >
                        <Send className="w-4 h-4 inline mr-2" />
                        Send Message
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Interview Scheduler Modal */}
              {showScheduler === applicant._id && (
                <div className="mt-4 pt-4 border-t border-gray-200/20">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold">Schedule Interview</h4>
                    <button
                      onClick={() => setShowScheduler(null)}
                      className={`p-2 rounded-lg transition-colors ${
                        isDark ? "hover:bg-white/10" : "hover:bg-gray-100"
                      }`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <InterviewScheduler
                    applicants={[applicant]}
                    job={job}
                    theme={theme}
                    onScheduleInterview={handleScheduleInterview}
                    companyId={companyId}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

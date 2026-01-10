"use client";

import React, { useMemo } from "react";
import {
  TrendingUp,
  Users,
  Briefcase,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  BarChart3,
  PieChart,
  Calendar,
  Target,
} from "lucide-react";

type Job = {
  _id: string;
  title: string;
  skills: string[];
  applicants: Array<{
    status: string;
    createdAt: string;
    evaluation?: {
      cvScore: number;
      interviewScore: number;
      finalScore: number;
      skills?: string[];
    };
  }>;
  enableCVAnalysis: boolean;
  interviewType: string;
  createdAt: string;
};

type Props = {
  jobs: Job[];
  theme: "dark" | "light";
};

export default function ApplicationAnalytics({ jobs, theme }: Props) {
  const isDark = theme === "dark";

  const analytics = useMemo(() => {
    const allApplicants = jobs.flatMap(job => 
      job.applicants.map(applicant => ({
        ...applicant,
        jobTitle: job.title,
        jobId: job._id,
        jobCreated: job.createdAt,
        enableCVAnalysis: job.enableCVAnalysis,
        interviewType: job.interviewType,
      }))
    );

    // Overall stats
    const totalApplications = allApplicants.length;
    const pending = allApplicants.filter(a => a.status === "pending").length;
    const interviewPending = allApplicants.filter(a => a.status === "interview_pending").length;
    const interviewCompleted = allApplicants.filter(a => a.status === "interview_completed").length;
    const shortlisted = allApplicants.filter(a => a.status === "shortlisted").length;
    const rejected = allApplicants.filter(a => a.status === "rejected").length;

    // Conversion rates
    const interviewRate = totalApplications > 0 ? (interviewCompleted / totalApplications) * 100 : 0;
    const shortlistRate = totalApplications > 0 ? (shortlisted / totalApplications) * 100 : 0;
    const rejectionRate = totalApplications > 0 ? (rejected / totalApplications) * 100 : 0;

    // Performance metrics
    const applicantsWithScores = allApplicants.filter(a => a.evaluation?.finalScore);
    const averageScore = applicantsWithScores.length > 0 
      ? applicantsWithScores.reduce((sum, a) => sum + a.evaluation!.finalScore, 0) / applicantsWithScores.length 
      : 0;

    // Job performance
    const jobPerformance = jobs.map(job => {
      const jobApplicants = job.applicants.length;
      const jobShortlisted = job.applicants.filter(a => a.status === "shortlisted").length;
      const jobConversionRate = jobApplicants > 0 ? (jobShortlisted / jobApplicants) * 100 : 0;
      
      return {
        _id: job._id,
        title: job.title,
        total: jobApplicants,
        shortlisted: jobShortlisted,
        conversionRate: jobConversionRate,
        status: jobConversionRate >= 20 ? "excellent" : jobConversionRate >= 10 ? "good" : "needs_improvement"
      };
    }).sort((a, b) => b.conversionRate - a.conversionRate);

    // Timeline data (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const timelineData = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const applicationsOnDate = allApplicants.filter(a => 
        a.createdAt.split('T')[0] === dateStr
      ).length;
      
      timelineData.push({
        date: dateStr,
        applications: applicationsOnDate,
      });
    }

    return {
      totalApplications,
      pending,
      interviewPending,
      interviewCompleted,
      shortlisted,
      rejected,
      interviewRate,
      shortlistRate,
      rejectionRate,
      averageScore,
      jobPerformance,
      timelineData,
      totalJobs: jobs.length,
    };
  }, [jobs]);

  const StatCard = ({ title, value, icon, color, trend }: any) => {
    const colorClasses = {
      teal: isDark ? "bg-teal-500/20 text-teal-300 border-teal-500/30" : "bg-teal-50 text-teal-700 border-teal-200",
      blue: isDark ? "bg-blue-500/20 text-blue-300 border-blue-500/30" : "bg-blue-50 text-blue-700 border-blue-200",
      green: isDark ? "bg-green-500/20 text-green-300 border-green-500/30" : "bg-green-50 text-green-700 border-green-200",
      red: isDark ? "bg-red-500/20 text-red-300 border-red-500/30" : "bg-red-50 text-red-700 border-red-200",
      yellow: isDark ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" : "bg-yellow-50 text-yellow-700 border-yellow-200",
      purple: isDark ? "bg-purple-500/20 text-purple-300 border-purple-500/30" : "bg-purple-50 text-purple-700 border-purple-200",
    };

    return (
      <div className={`p-6 rounded-xl border ${colorClasses[color as keyof typeof colorClasses]}`}>
        <div className="flex items-center justify-between mb-4">
          {icon}
          {trend && (
            <div className={`flex items-center text-sm ${
              trend > 0 ? "text-green-500" : "text-red-500"
            }`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {trend > 0 ? "+" : ""}{trend}%
            </div>
          )}
        </div>
        <div className="text-3xl font-bold mb-1">{value}</div>
        <div className="text-sm opacity-80">{title}</div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
          Application Analytics
        </h2>
        <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Comprehensive insights into your recruitment performance
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Applications"
          value={analytics.totalApplications}
          icon={<Users className="w-6 h-6" />}
          color="teal"
        />
        <StatCard
          title="Interview Rate"
          value={`${analytics.interviewRate.toFixed(1)}%`}
          icon={<CheckCircle className="w-6 h-6" />}
          color="blue"
        />
        <StatCard
          title="Shortlist Rate"
          value={`${analytics.shortlistRate.toFixed(1)}%`}
          icon={<Star className="w-6 h-6" />}
          color="green"
        />
        <StatCard
          title="Avg. Score"
          value={`${analytics.averageScore.toFixed(0)}`}
          icon={<Target className="w-6 h-6" />}
          color="purple"
        />
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div
          className={`p-6 rounded-xl border ${
            isDark ? "bg-[#1b2333] border-[#1e293b]" : "bg-white border-gray-200"
          }`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
            Application Status Breakdown
          </h3>
          <div className="space-y-4">
            <StatusRow
              label="Pending"
              value={analytics.pending}
              total={analytics.totalApplications}
              color="yellow"
              isDark={isDark}
            />
            <StatusRow
              label="Interview Pending"
              value={analytics.interviewPending}
              total={analytics.totalApplications}
              color="blue"
              isDark={isDark}
            />
            <StatusRow
              label="Interview Completed"
              value={analytics.interviewCompleted}
              total={analytics.totalApplications}
              color="purple"
              isDark={isDark}
            />
            <StatusRow
              label="Shortlisted"
              value={analytics.shortlisted}
              total={analytics.totalApplications}
              color="green"
              isDark={isDark}
            />
            <StatusRow
              label="Rejected"
              value={analytics.rejected}
              total={analytics.totalApplications}
              color="red"
              isDark={isDark}
            />
          </div>
        </div>

        {/* Job Performance */}
        <div
          className={`p-6 rounded-xl border ${
            isDark ? "bg-[#1b2333] border-[#1e293b]" : "bg-white border-gray-200"
          }`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
            Job Performance Ranking
          </h3>
          <div className="space-y-3">
            {analytics.jobPerformance.slice(0, 5).map((job, index) => (
              <div key={job._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0
                        ? "bg-yellow-500/20 text-yellow-300"
                        : index === 1
                        ? "bg-gray-500/20 text-gray-300"
                        : index === 2
                        ? "bg-orange-500/20 text-orange-300"
                        : isDark
                        ? "bg-gray-600/20 text-gray-400"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <div className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                      {job.title}
                    </div>
                    <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      {job.total} applicants
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold ${
                    job.conversionRate >= 20 ? "text-green-500" :
                    job.conversionRate >= 10 ? "text-yellow-500" : "text-red-500"
                  }`}>
                    {job.conversionRate.toFixed(1)}%
                  </div>
                  <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    conversion
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusRow({ label, value, total, color, isDark }: {
  label: string;
  value: number;
  total: number;
  color: string;
  isDark: boolean;
}) {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  
  const colorClasses = {
    yellow: isDark ? "bg-yellow-500" : "bg-yellow-600",
    blue: isDark ? "bg-blue-500" : "bg-blue-600",
    purple: isDark ? "bg-purple-500" : "bg-purple-600",
    green: isDark ? "bg-green-500" : "bg-green-600",
    red: isDark ? "bg-red-500" : "bg-red-600",
  };

  return (
    <div className="flex items-center gap-4">
      <div className={`w-32 text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
        {label}
      </div>
      <div className="flex-1">
        <div className={`h-2 rounded-full ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>
          <div
            className={`h-2 rounded-full ${colorClasses[color as keyof typeof colorClasses]}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <div className={`w-16 text-right text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
        {value} ({percentage.toFixed(1)}%)
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, Users, Calendar, Briefcase, MapPin, Clock, Building2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

import JobInfoCard from "@/app/components/CompanyPages/Jobs/JobInfoCard";
import ApplicationManager from "@/app/components/CompanyPages/Jobs/ApplicationManager";
import PublicMenteeProfile from "@/app/components/PublicProfiles/PublicMenteeProfile";

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
  companyId: {
    _id: string;
    name: string;
    logo?: string;
    industry: string;
    location: string;
    website?: string;
    foundedYear?: number;
    description?: string;
  };
  applicants: Array<{
    _id: string;
    status: string;
    createdAt: string;
    mentee?: {
      _id: string;
      full_name: string;
      email: string;
      phoneNumber: string;
      Country: string;
    };
  }>;
};

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId as string;
  const [job, setJob] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMenteeId, setSelectedMenteeId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "applicants">("overview");
  const [isDark, setIsDark] = useState(false);

  // Detect theme - same pattern as layout
  useEffect(() => {
    const getTheme = () => {
      if (typeof window !== "undefined") {
        const savedTheme = localStorage.getItem("theme") as "dark" | "light";
        return savedTheme || "dark";
      }
      return "dark";
    };
    
    const currentTheme = getTheme();
    setIsDark(currentTheme === "dark");
    
    // Listen for theme changes
    const handleThemeChange = () => {
      const theme = document.documentElement.classList.contains("dark") ? "dark" : "light";
      setIsDark(theme === "dark");
    };
    
    // Check immediately
    handleThemeChange();
    
    // Listen for class changes
    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    
    return () => observer.disconnect();
  }, []);

  // Fetch job details
  useEffect(() => {
    if (!jobId) return;

    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        
        // Get company ID from session
        const raw = sessionStorage.getItem("user");
        if (!raw) return;
        
        const user = JSON.parse(raw);
        const companyId = user.companyId;

        // Fetch job with applicants (company view - all jobs)
        const res = await fetch(`/api/company/${companyId}/jobs/${jobId}?view=company`);
        const data = await res.json();

        if (data.ok) {
          setJob(data.job);
          
          // Fetch applicants for this job
          const applicantsRes = await fetch(`/api/company/${companyId}/jobs/${jobId}/applicants`);
          const applicantsData = await applicantsRes.json();
          
          if (applicantsData.ok) {
            setApplicants(applicantsData.applicants);
          }
        } else {
          console.error("Job fetch error:", data.message);
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const handleViewProfile = (menteeId: string) => {
    setSelectedMenteeId(menteeId);
  };

  const handleStatusUpdate = async () => {
    // Refresh applicants data
    if (job) {
      const raw = sessionStorage.getItem("user");
      if (!raw) return;
      
      const user = JSON.parse(raw);
      const companyId = user.companyId;

      const applicantsRes = await fetch(`/api/company/${companyId}/jobs/${job._id}/applicants`);
      const applicantsData = await applicantsRes.json();
      
      if (applicantsData.ok) {
        setApplicants(applicantsData.applicants);
      }
    }
  };

  const getCompanyId = () => {
    const raw = sessionStorage.getItem("user");
    if (!raw) return null;
    const user = JSON.parse(raw);
    return user.companyId;
  };

  // Full profile mode
  if (selectedMenteeId) {
    return (
      <div className={`min-h-screen p-8 ${isDark ? "bg-[#020617] text-white" : "bg-white text-black"}`}>
        <button
          onClick={() => setSelectedMenteeId(null)}
          className="mb-6 text-sm underline opacity-80 hover:opacity-100 transition"
        >
          ← Back to job
        </button>

        <PublicMenteeProfile menteeId={selectedMenteeId} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-[#020617] text-white" : "bg-white text-black"}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-[#020617] text-white" : "bg-white text-black"}`}>
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Job not found</h2>
          <p className={`mb-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            The job you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Link
            href="/company?tab=candidates"
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isDark
                ? "bg-teal-500 text-black hover:bg-teal-400"
                : "bg-teal-600 text-white hover:bg-teal-700"
            }`}
          >
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? "bg-[#020617] text-white" : "bg-white text-black"}`}>
      {/* Header */}
      <div className="border-b border-gray-200/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/company?tab=candidates"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                isDark
                  ? "border-white/20 hover:bg-white/10"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Jobs
            </Link>

            <div className="flex items-center gap-3">
              {job.companyId?.logo ? (
                <img
                  src={job.companyId.logo}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200/20"
                  alt={job.companyId.name}
                />
              ) : (
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                  isDark ? "border-white/20" : "border-gray-300"
                }`}>
                  <Building2 className="w-5 h-5 opacity-70" />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold">{job.title}</h1>
                <p className="text-sm opacity-70">{job.companyId?.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div
            className={`inline-flex rounded-xl p-1 gap-1 ${
              isDark
                ? "bg-white/5 border border-white/10"
                : "bg-gray-100 border border-gray-200"
            }`}
          >
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === "overview"
                  ? isDark
                    ? "bg-purple-500 text-white"
                    : "bg-purple-600 text-white"
                  : isDark
                  ? "text-gray-300 hover:text-white hover:bg-white/5"
                  : "text-gray-600 hover:text-black hover:bg-gray-200"
              }`}
            >
              <Briefcase className="w-4 h-4 inline mr-2" />
              Job Overview
            </button>
            
            <button
              onClick={() => setActiveTab("applicants")}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === "applicants"
                  ? isDark
                    ? "bg-purple-500 text-white"
                    : "bg-purple-600 text-white"
                  : isDark
                  ? "text-gray-300 hover:text-white hover:bg-white/5"
                  : "text-gray-600 hover:text-black hover:bg-gray-200"
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Applicants ({applicants.length})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <JobInfoCard
              job={job}
              theme={isDark ? "dark" : "light"}
              isExpanded={true}
              onToggle={() => {}} // Always expanded in this view
            />
          </div>
        )}

        {activeTab === "applicants" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Applicants Management</h2>
              <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                {applicants.length} total applicants
              </div>
            </div>

            <ApplicationManager
              applicants={applicants}
              job={job}
              theme={isDark ? "dark" : "light"}
              onViewProfile={handleViewProfile}
              onStatusUpdate={handleStatusUpdate}
              companyId={getCompanyId() || ""}
            />
          </div>
        )}
      </div>
    </div>
  );
}

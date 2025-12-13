"use client";

import {
  X,
  MapPin,
  Briefcase,
  GraduationCap,
  Clock,
  Building2,
  Globe,
  ArrowRightCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function JobDetailsDrawer({ job, isDark, open, onClose }: any) {
  if (!open || !job) return null;

  const router = useRouter();
  const company = job.companyId;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* PANEL */}
      <div
        className={`
          relative h-full p-6 overflow-y-auto shadow-2xl border-l border-white/10
          ${isDark ? "bg-[#0d1528] text-white" : "bg-white text-black"}
          w-[520px] md:w-[560px]
          transform transition-all duration-300 ease-out
          ${open ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
          animate-[slideIn_0.35s_ease-out]
        `}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 opacity-70 hover:opacity-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* COMPANY HEADER */}
        <div className="flex items-center gap-4 mt-12">
          {company?.logo ? (
            <img
              src={company.logo}
              className="w-16 h-16 rounded-full border border-white/10 object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-white/10 border border-white/10 flex items-center justify-center">
              <Building2 className="w-8 h-8 opacity-70" />
            </div>
          )}

          <div>
            <h3 className="text-xl font-semibold">{company?.name}</h3>
            <p className="text-sm opacity-80">{company?.industry}</p>

            <button className="flex items-center gap-1 mt-2 text-sm underline opacity-90 hover:opacity-100">
              <ArrowRightCircle className="w-4 h-4" />
              View Company Profile
            </button>
          </div>
        </div>

        <hr className="my-4 border-white/10" />

        {/* JOB MAIN INFO */}
        <h2 className="text-2xl font-bold">{job.title}</h2>

        <p className="flex items-center gap-1 text-sm mt-2 opacity-80">
          <MapPin className="w-4 h-4 opacity-70" />
          {job.location}
        </p>

        {/* META */}
        <div className="flex flex-wrap gap-2 mt-4">
          {job.type && <Tag icon={<Briefcase />} text={job.type} />}
          {job.level && <Tag icon={<GraduationCap />} text={job.level} />}
          {job.deadline && (
            <Tag
              icon={<Clock />}
              text={`Deadline: ${new Date(job.deadline).toLocaleDateString()}`}
            />
          )}
          {job.salaryRange && <Tag text={`Salary: ${job.salaryRange}`} />}
        </div>

        {/* JOB EXTRA DETAILS */}
        <div className="mt-6 space-y-2 text-sm opacity-90">
          <h3 className="font-semibold text-lg">Job Info</h3>
          <p>Status: {job.status}</p>
          <p>Posted: {new Date(job.createdAt).toLocaleDateString()}</p>
          <p>Applicants: {job.applicants?.length || 0}</p>
          {job.enableCVAnalysis && <p>CV Analysis: Enabled</p>}
          {job.interviewType && <p>Interview Type: {job.interviewType}</p>}
          {job.humanType && job.interviewType === "human" && (
            <p>Human Interview By: {job.humanType.toUpperCase()}</p>
          )}
          {job.aiFocus?.length > 0 && (
            <p>AI Interview Focus: {job.aiFocus.join(", ")}</p>
          )}
        </div>

        {/* DESCRIPTION */}
        <h3 className="mt-6 font-semibold text-lg">Job Description</h3>
        <p className="text-sm opacity-90 mt-2 leading-relaxed whitespace-pre-wrap">
          {job.description}
        </p>

        {/* SKILLS */}
        {job.skills?.length > 0 && (
          <>
            <h3 className="mt-6 font-semibold text-lg">Required Skills</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {job.skills.map((s: string, i: number) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs rounded bg-white/10 border border-white/10"
                >
                  {s}
                </span>
              ))}
            </div>
          </>
        )}

        {/* COMPANY DETAILS */}
        <h3 className="mt-8 font-semibold text-lg">About the Company</h3>
        <div className="text-sm opacity-90 mt-2 space-y-2">
          <p>{company.description || "No description available."}</p>
          <p>Location: {company.location || "Not specified"}</p>
          <p>Industry: {company.industry}</p>
          <p>Founded: {company.foundedYear || "N/A"}</p>
        </div>

        {/* SOCIAL LINKS */}
        <div className="mt-4 space-y-2">
          {company.website && (
            <a
              href={company.website}
              target="_blank"
              className="flex items-center gap-2 text-sm underline opacity-80 hover:opacity-100"
            >
              <Globe className="w-4 h-4" /> Visit Website
            </a>
          )}
        </div>

        {/* APPLY BUTTON */}
        <div className="fixed bottom-6 right-6">
          <button
          onClick={() => router.push(`/mentee/JobForm/${job.companyId._id}/jobs/${job._id}/apply`)}
            className={`
              px-6 py-3 rounded-xl font-semibold shadow-lg 
              ${isDark ? "bg-teal-400 text-black" : "bg-teal-600 text-white"}
              hover:brightness-110 transition
            `}
          >
            Apply Now
          </button>
        </div>
      </div>

      {/* ANIMATION */}
      <style jsx>{`
        @keyframes slideIn {
          0% {
            transform: translateX(100%);
          }
          75% {
            transform: translateX(-4%);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}

function Tag({ icon, text }: any) {
  return (
    <span className="px-3 py-1 text-xs rounded-full bg-white/10 border border-white/10 flex items-center gap-1">
      {icon}
      {text}
    </span>
  );
}

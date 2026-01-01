"use client";

import {
  Building2,
  MapPin,
  Briefcase,
  GraduationCap,
  Clock,
} from "lucide-react";

type Props = {
  job: any;
  isDark?: boolean;
  onSelect: (job: any) => void;
};

export default function JobCard({ job, isDark = true, onSelect }: Props) {
  const isClosed = job.status === "closed";

return (
  <div
    className={`
      rounded-xl p-6 border transition-all duration-300 flex flex-col gap-5
      ${
        isDark
          ? "bg-gradient-to-br from-[#0b1220] to-[#111827] border-[rgba(94,234,212,0.25)] hover:shadow-[0_0_30px_rgba(94,234,212,0.18)]"
          : "bg-white border-[#ddd6fe] hover:bg-purple-50"
      }
      ${
        isClosed
          ? "opacity-60"
          : "hover:border-[#5eead4]/50 hover:scale-[1.01]"
      }
    `}
  >
    {/* ================= COMPANY HEADER ================= */}
    <div className="flex items-center gap-4">
      {job.companyId?.logo ? (
        <img
          src={job.companyId.logo}
          alt="Company Logo"
          className={`w-12 h-12 rounded-full object-cover border ${
            isDark
              ? "border-[rgba(94,234,212,0.25)]"
              : "border-[#ddd6fe]"
          }`}
        />
      ) : (
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center border
            ${
              isDark
                ? "bg-[#0f172a] border-[rgba(94,234,212,0.25)]"
                : "bg-purple-100 border-[#ddd6fe]"
            }
          `}
        >
          <Building2
            className={`w-6 h-6 ${
              isDark ? "text-teal-300" : "text-purple-600"
            }`}
          />
        </div>
      )}

      <div>
        <p
          className={`font-semibold text-base ${
            isDark ? "text-white" : "text-[#2e1065]"
          }`}
        >
          {job.companyId?.name || "Company"}
        </p>
        {job.companyId?.industry && (
          <p className="text-sm opacity-70">{job.companyId.industry}</p>
        )}
      </div>
    </div>

    {/* ================= JOB TITLE ================= */}
    <div>
      <h2
        className={`text-xl font-semibold mb-1 ${
          isDark ? "text-white" : "text-[#2e1065]"
        }`}
      >
        {job.title}
      </h2>
      <p className="flex items-center gap-1 text-sm opacity-75">
        <MapPin className="w-4 h-4 opacity-70" />
        {job.location || "Location not specified"}
      </p>
    </div>

    {/* ================= META INFO ================= */}
    <div className="flex flex-wrap gap-2 mt-2">
      {job.type && (
        <span
          className={`px-3 py-1 text-xs rounded-full flex items-center gap-1 border
            ${
              isDark
                ? "bg-[#0f172a] border-[rgba(94,234,212,0.25)] text-teal-300"
                : "bg-purple-50 border-[#ddd6fe] text-[#2e1065]"
            }
          `}
        >
          <Briefcase className="w-3 h-3" /> {job.type}
        </span>
      )}

      {job.level && (
        <span
          className={`px-3 py-1 text-xs rounded-full flex items-center gap-1 border
            ${
              isDark
                ? "bg-[#0f172a] border-[rgba(94,234,212,0.25)] text-teal-300"
                : "bg-purple-50 border-[#ddd6fe] text-[#2e1065]"
            }
          `}
        >
          <GraduationCap className="w-3 h-3" /> {job.level}
        </span>
      )}

      {job.deadline && (
        <span
          className={`px-3 py-1 text-xs rounded-full flex items-center gap-1 border
            ${
              isDark
                ? "bg-[#0f172a] border-[rgba(94,234,212,0.25)] text-teal-300"
                : "bg-purple-50 border-[#ddd6fe] text-[#2e1065]"
            }
          `}
        >
          <Clock className="w-3 h-3" />
          Deadline: {new Date(job.deadline).toLocaleDateString()}
        </span>
      )}
    </div>

    {/* ================= SKILLS ================= */}
    {job.skills?.length > 0 && (
      <div className="flex flex-wrap gap-2 mt-1">
        {job.skills.slice(0, 4).map((skill: string, index: number) => (
          <span
            key={index}
            className={`px-2 py-1 text-xs rounded border
              ${
                isDark
                  ? "bg-[#0f172a] border-[rgba(94,234,212,0.25)] text-teal-200"
                  : "bg-purple-100 border-[#ddd6fe] text-[#2e1065]"
              }
            `}
          >
            {skill}
          </span>
        ))}
      </div>
    )}

    {/* ================= DESCRIPTION ================= */}
    <p
      className={`text-sm leading-relaxed mt-2 ${
        isDark ? "text-[#c3d4d8]" : "text-[#4c1d95]"
      }`}
    >
      {job.description
        ? job.description.slice(0, 120) + "..."
        : "No description available"}
    </p>

    {/* ================= FOOTER ================= */}
    <div className="flex justify-end">
      <button
        disabled={isClosed}
        onClick={() => onSelect(job)}
        className={`mt-4 underline text-sm transition
          ${
            isClosed
              ? "cursor-not-allowed opacity-50"
              : isDark
              ? "text-teal-300 hover:text-teal-200"
              : "text-purple-600 hover:text-purple-500"
          }
        `}
      >
        {isClosed ? "Job Closed" : "View Details"}
      </button>
    </div>
  </div>
);


}

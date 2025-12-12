"use client";

import { Building2, Globe, MapPin, Briefcase, GraduationCap, Clock } from "lucide-react";

export default function JobCard({ job, isDark, onSelect }: any) {
  return (
    <div
      className={`
        rounded-xl p-6 border transition-all duration-300 flex flex-col gap-5
        ${isDark 
          ? "bg-white/5 border-white/10 hover:bg-white/[0.07]" 
          : "bg-white border-gray-200 hover:bg-gray-50"}
        hover:border-[#1CD6D0]/40 
        hover:shadow-[0_0_20px_rgba(28,214,208,0.25)] 
        hover:scale-[1.01]
      `}
    >
      {/* COMPANY HEADER */}
      <div className="flex items-center gap-4">

        {job.companyId?.logo ? (
          <img
            src={job.companyId.logo}
            alt="Company Logo"
            className="w-12 h-12 rounded-full object-cover border border-white/10"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center">
            <Building2 className="w-6 h-6 opacity-70" />
          </div>
        )}

        <div>
          <p className="font-semibold text-base">{job.companyId?.name}</p>
          <p className="text-sm opacity-70">{job.companyId?.industry}</p>
        </div>
      </div>

      {/* JOB TITLE */}
      <div>
        <h2 className="text-xl font-semibold mb-1">{job.title}</h2>
        <p className="flex items-center gap-1 text-sm opacity-75">
          <MapPin className="w-4 h-4 opacity-70" />
          {job.location || "Location not specified"}
        </p>
      </div>

      {/* META INFO */}
      <div className="flex flex-wrap gap-2 mt-2">

        {job.type && (
          <span className="px-3 py-1 text-xs rounded-full bg-white/10 border border-white/10 flex items-center gap-1">
            <Briefcase className="w-3 h-3" /> {job.type}
          </span>
        )}

        {job.level && (
          <span className="px-3 py-1 text-xs rounded-full bg-white/10 border border-white/10 flex items-center gap-1">
            <GraduationCap className="w-3 h-3" /> {job.level}
          </span>
        )}

        {job.deadline && (
          <span className="px-3 py-1 text-xs rounded-full bg-white/10 border border-white/10 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Deadline: {new Date(job.deadline).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* SKILLS */}
      {job.skills?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {job.skills.slice(0, 4).map((skill: string, index: number) => (
            <span
              key={index}
              className="px-2 py-1 text-xs rounded bg-white/10 border border-white/10"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* DESCRIPTION */}
      <p className="text-sm opacity-90 leading-relaxed mt-2">
        {job.description?.slice(0, 120) || "No description available"}...
      </p>

      {/* FOOTER */}
      <div className="flex justify-end">
        <button className="mt-4 underline text-sm" onClick={onSelect}>
          View Details
        </button>
      </div>
    </div>
  );
}

"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/app/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

export default function JobCard({
  job,
  theme,
  onEdit,
  onClose,
  onDelete,
  onViewApplicants,
  onViewProfile,
  onViewSuggested,
  onJobClick,
}: {
  job: any;
  theme: "dark" | "light";
  onEdit: () => void;
  onClose: () => void;
  onDelete: () => void;
  onViewApplicants: (job: any) => void; // ✅ FIX
  onViewProfile: (menteeId: string) => void;
  onViewSuggested: (job: any) => void;
  onJobClick: (job: any) => void;
}) {
  const isDark = theme === "dark";

  const muted = isDark ? "text-gray-300" : "text-gray-600";

  const statusColor = (status: string) => {
    if (status === "active")
      return isDark
        ? "bg-green-300 text-green-900"
        : "bg-green-100 text-green-700";
    if (status === "closed")
      return isDark
        ? "bg-red-300 text-red-900"
        : "bg-red-100 text-red-700";
    return isDark
      ? "bg-gray-400 text-gray-900"
      : "bg-gray-200 text-gray-700";
  };

  const bubble = (value: string) => (
    <span
      className={`
        px-2 py-1 rounded-full text-xs font-medium
        ${
          isDark
            ? "bg-gray-700 text-gray-100 border border-gray-600"
            : "bg-gray-100 text-gray-800"
        }
      `}
    >
      {value}
    </span>
  );

return (
  <div
    onClick={() => onJobClick(job)}
    className={`
      relative rounded-2xl p-5 transition-all duration-200 backdrop-blur-sm cursor-pointer
      ${
        isDark
          ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border border-[rgba(94,234,212,0.2)] shadow-[0_0_25px_rgba(0,0,0,0.6)] text-white"
          : "bg-white border border-[#ddd6fe] shadow-lg text-[#2e1065]"
      }
      hover:shadow-xl hover:-translate-y-1
    `}
  >
    {/* MENU */}
    <div className="absolute top-4 right-4">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical
            className={`w-5 h-5 cursor-pointer ${
              isDark ? "text-teal-300" : "text-purple-600"
            }`}
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className={`rounded-lg ${
            isDark
              ? "bg-[#0f172a] border border-[rgba(94,234,212,0.2)] text-white"
              : "bg-white border border-[#ddd6fe] text-[#2e1065]"
          }`}
        >
          <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={onClose}>Close</DropdownMenuItem>
          <DropdownMenuItem className="text-red-500" onClick={onDelete}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    {/* TITLE + FEATURES */}
    <div className="mb-5">
      <h2 className="text-xl font-semibold mb-2">{job.title}</h2>

      <div className="flex flex-wrap gap-2">
        {job.enableCVAnalysis && (
          <span
            className={`px-2 py-0.5 text-xs rounded-full ${
              isDark
                ? "bg-teal-500/20 text-teal-300"
                : "bg-purple-100 text-purple-700"
            }`}
          >
            CV Analysis
          </span>
        )}

        {job.interviewType === "ai" && (
          <span
            className={`px-2 py-0.5 text-xs rounded-full ${
              isDark
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-indigo-100 text-indigo-700"
            }`}
          >
            AI Interview
          </span>
        )}

        {job.interviewType === "human" && (
          <span
            className={`px-2 py-0.5 text-xs rounded-full ${
              isDark
                ? "bg-white/10 text-gray-300"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Human Interview
          </span>
        )}
      </div>
    </div>

    {/* INFO GRID */}
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div>
        <p className="text-xs font-semibold mb-1 opacity-70">Status</p>
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(
            job.status
          )}`}
        >
          {job.status}
        </span>
      </div>

      <div>
        <p className="text-xs font-semibold mb-1 opacity-70">Location</p>
        {bubble(job.location || "—")}
      </div>

      <div>
        <p className="text-xs font-semibold mb-1 opacity-70">Type</p>
        {bubble(job.type || "—")}
      </div>

      <div>
        <p className="text-xs font-semibold mb-1 opacity-70">Level</p>
        {bubble(job.level || "—")}
      </div>

      <div>
        <p className="text-xs font-semibold mb-1 opacity-70">Deadline</p>
        {bubble(
          job.deadline
            ? new Date(job.deadline).toLocaleDateString()
            : "—"
        )}
      </div>
    </div>

    {/* DESCRIPTION */}
    {job.description && (
      <div className="mb-4">
        <p className="text-xs font-semibold mb-1 opacity-70">Description</p>
        <p
          className={`text-sm line-clamp-2 ${
            isDark ? "text-[#c3d4d8]" : "text-[#4c1d95]"
          }`}
        >
          {job.description}
        </p>
      </div>
    )}

    {/* SKILLS */}
    {job.skills?.length > 0 && (
      <div className="mb-4">
        <p className="text-xs font-semibold mb-1 opacity-70">Skills</p>
        <div className="flex flex-wrap gap-2">
          {job.skills.map((skill: string, idx: number) => (
            <span key={idx}>{bubble(skill)}</span>
          ))}
        </div>
      </div>
    )}

    {/* FOOTER */}
    <div
      className={`flex justify-between items-center mt-6 pt-3 text-sm border-t ${
        isDark
          ? "border-[rgba(94,234,212,0.2)]"
          : "border-[#e9d5ff]"
      }`}
    >
      <span className={isDark ? "text-gray-400" : "text-gray-500"}>
        Applicants: {job.applicants?.length || 0}
      </span>

      <button
        onClick={() => onViewApplicants(job)}
        className={`font-semibold underline transition ${
          isDark
            ? "text-teal-300 hover:text-teal-200"
            : "text-purple-600 hover:text-purple-500"
        }`}
      >
        View Applicants →
      </button>

      <button
        onClick={() => onViewSuggested(job)}
        className={`font-semibold underline transition ${
          isDark
            ? "text-emerald-300 hover:text-emerald-200"
            : "text-green-600 hover:text-green-500"
        }`}
      >
        View Suggested Mentees →
      </button>

     
    </div>
  </div>
);

}

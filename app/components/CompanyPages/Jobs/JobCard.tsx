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
}: {
  job: any;
  theme: "dark" | "light";
  onEdit: () => void;
  onClose: () => void;
  onDelete: () => void;
  onViewApplicants: (id: string) => void;
}) {
  const isDark = theme === "dark";

  // TEXT COLOR
  const muted = isDark ? "text-gray-300" : "text-gray-600";

  // STATUS COLORS
  const statusColor = (status: string) => {
    if (status === "active")
      return isDark
        ? "bg-green-300 text-green-900"
        : "bg-green-100 text-green-700";
    if (status === "closed")
      return isDark ? "bg-red-300 text-red-900" : "bg-red-100 text-red-700";
    return isDark ? "bg-gray-400 text-gray-900" : "bg-gray-200 text-gray-700";
  };

  // BUBBLE STYLE
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
      className={`
        relative rounded-2xl p-5 transition-all duration-200
        ${
          isDark
            ? "bg-[#1b2333] border border-[#2e3a55] shadow-[0_0_20px_rgba(0,0,0,0.6)] text-white"
            : "bg-white border-gray-200 shadow-sm text-black"
        }
        hover:shadow-xl hover:-translate-y-1
      `}
    >
      {/* ⋮ MENU */}
      <div className="absolute top-4 right-4">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical className={`w-5 h-5 cursor-pointer ${muted}`} />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className={`${
              isDark ? "bg-[#1f2333] text-white" : "bg-white text-black"
            }`}
          >
            <DropdownMenuItem onClick={onEdit}> Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={onClose}> Close</DropdownMenuItem>
            <DropdownMenuItem className="text-red-500" onClick={onDelete}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* TITLE */}
      <h2 className="text-xl font-semibold mb-4">{job.title}</h2>

      {/* GRID INFO */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-xs font-semibold mb-1">Status</p>
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(
              job.status
            )}`}
          >
            {job.status}
          </span>
        </div>

        <div>
          <p className="text-xs font-semibold mb-1">Location</p>
          {bubble(job.location || "—")}
        </div>

        <div>
          <p className="text-xs font-semibold mb-1">Type</p>
          {bubble(job.type || "—")}
        </div>

        <div>
          <p className="text-xs font-semibold mb-1">Level</p>
          {bubble(job.level || "—")}
        </div>

        <div>
          <p className="text-xs font-semibold mb-1">Deadline</p>
          {bubble(new Date(job.deadline).toLocaleDateString())}
        </div>
      </div>

      {/* DESCRIPTION */}
      {job.description && (
        <div className="mb-4">
          <p className="text-xs font-semibold mb-1">Description</p>
          <p className={`text-sm line-clamp-2 ${muted}`}>
            {job.description}
          </p>
        </div>
      )}

      {/* SKILLS */}
      {job.skills?.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold mb-1">Skills</p>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill: string, idx: number) => (
              <span key={idx}>{bubble(skill)}</span>
            ))}
          </div>
        </div>
      )}

      {/* INTERVIEW */}
      {job.interviewType !== "none" && (
        <div className="mb-5">
          <p className="text-xs font-semibold mb-2">Interview</p>

          <div className="flex flex-wrap gap-2 items-center">
            {bubble(`Type: ${job.interviewType}`)}

            {job.interviewType === "human" && bubble(`By: ${job.humanType}`)}

            {job.interviewType === "ai" &&
              job.aiFocus?.map((f: string, idx: number) => (
                <span key={idx}>{bubble(`Focus: ${f}`)}</span>
              ))}

            {job.interviewType === "ai" && job.aiQuestions && (
              <p className={`italic text-xs ${muted}`}>
                “{job.aiQuestions.substring(0, 40)}...”
              </p>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="flex justify-between items-center mt-6 pt-3 border-t border-gray-700 text-sm">
        <span className={muted}>
          Applicants: {job.applicants?.length || 0}
        </span>

        <button
          onClick={() => onViewApplicants(job._id)}
          className="font-semibold underline hover:opacity-70 transition"
        >
          View Applicants →
        </button>
      </div>
    </div>
  );
}

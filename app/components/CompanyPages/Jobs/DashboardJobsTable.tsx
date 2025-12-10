"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Briefcase, Clock, CircleDot } from "lucide-react";

export default function DashboardJobsTable({ jobs, theme, onGoToJobs }) {
  const isDark = theme === "dark";

  return (
    <div
      className={`
        mt-8 p-5 rounded-xl
        ${isDark ? "bg-[#1b2333] border border-[#2e3a55] text-white" : "bg-white border text-black"}
      `}
    >
      <h2 className="text-lg font-semibold mb-4">All Job Posts</h2>

      {jobs.length === 0 ? (
        <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
          No jobs posted yet.
        </p>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-lg"
        >
          <table className="w-full text-sm">
            <thead
              className={`${
                isDark ? "bg-[#232b3e] text-gray-300" : "bg-gray-100 text-gray-600"
              }`}
            >
              <tr>
                <th className="px-4 py-3 text-left">Job Title</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Deadline</th>
                <th className="px-4 py-3 text-left">Applicants</th>

                <th className="px-4 py-3"></th>
              </tr>
            </thead>

            <tbody>
              {jobs.slice(0, 6).map((job, idx) => (
                <motion.tr
  key={job._id}
  initial={{ opacity: 0, x: -10 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: idx * 0.05 }}
  className={`
    border-b 
    ${isDark ? "border-gray-700 hover:bg-[#26304a]" : "border-gray-200 hover:bg-gray-50"}
    transition cursor-pointer
  `}
>
  {/* Job Title */}
  <td className="px-4 py-3 flex items-center gap-2">
    <Briefcase className="w-4 h-4 opacity-70" />
    {job.title}
  </td>

  {/* Status */}
  <td className="px-4 py-3">
    <span
      className={`
        px-2 py-1 rounded-full text-xs font-medium
        ${
          job.status === "active"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }
      `}
    >
      {job.status}
    </span>
  </td>

  {/* Deadline */}
  <td className="px-4 py-3 flex items-center gap-2">
    <Clock className="w-4 h-4 opacity-70" />
    {new Date(job.deadline).toLocaleDateString()}
  </td>

  {/* Applicants Count — NEW */}
  <td className="px-4 py-3">
    <span
      className={`
        px-2 py-1 rounded-full text-xs font-semibold
        ${isDark ? "bg-purple-900 text-purple-200" : "bg-purple-100 text-purple-700"}
      `}
    >
      {job.applicants?.length || 0}
    </span>
  </td>


</motion.tr>

              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Link to full jobs */}
      <div className="mt-4 text-right">
              {/* Link to full jobs */}
                <button
            onClick={onGoToJobs}
            className={`
                text-sm font-semibold
                ${isDark ? "text-purple-300" : "text-purple-700"}
                hover:underline
            `}
            >
            View All Jobs →
            </button>
      </div>
    </div>
  );
}

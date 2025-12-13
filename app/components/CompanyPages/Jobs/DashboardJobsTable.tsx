"use client";

import { motion } from "framer-motion";
import { Briefcase, Clock } from "lucide-react";

export default function DashboardJobsTable({
  jobs,
  theme,
  onGoToJobs,
  onSelectJob,
}: {
  jobs: any[];
  theme: "dark" | "light";
  onGoToJobs: () => void;
  onSelectJob: (job: any) => void;
}) {
  const isDark = theme === "dark";

  return (
    <div
      className={`mt-8 p-5 rounded-xl border ${
        isDark
          ? "bg-[#1b2333] border-[#2e3a55] text-white"
          : "bg-white border-gray-200 text-black"
      }`}
    >
      <h2 className="text-lg font-semibold mb-4">All Job Posts</h2>

      {/* ===== TABLE WITH SCROLL ===== */}
      <div className="overflow-y-auto rounded-lg" style={{ maxHeight: 420 }}>
        <table className="w-full text-sm">
          <thead
            className={`sticky top-0 z-10 ${
              isDark
                ? "bg-[#232b3e] text-gray-300"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            <tr>
              <th className="px-4 py-3 text-left">Job Title</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Deadline</th>
              <th className="px-4 py-3 text-left">Applicants</th>
            </tr>
          </thead>

          <tbody>
            {jobs.map((job, idx) => (
              <motion.tr
                key={job._id}
                onClick={() => onSelectJob(job)} // ⭐ click row
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                className={`cursor-pointer border-b transition ${
                  isDark
                    ? "border-gray-700 hover:bg-[#26304a]"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <td className="px-4 py-3 flex items-center gap-2">
                  <Briefcase size={14} />
                  {job.title}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      job.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {job.status}
                  </span>
                </td>

                <td className="px-4 py-3 flex items-center gap-2">
                  <Clock size={14} />
                  {new Date(job.deadline).toLocaleDateString()}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      isDark
                        ? "bg-purple-900 text-purple-200"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {job.applicants?.length || 0}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== FOOTER ===== */}
      <div className="mt-4 text-right">
        <button
          onClick={onGoToJobs}
          className={`text-sm font-semibold ${
            isDark ? "text-purple-300" : "text-purple-700"
          } hover:underline`}
        >
          View All Jobs →
        </button>
      </div>
    </div>
  );
}

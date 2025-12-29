"use client";

import {
  FileText,
  CheckCircle,
  Mic,
} from "lucide-react";

export default function HiringPipelineVisual({
  jobs,
  theme,
}: {
  jobs: any[];
  theme: "dark" | "light";
}) {
  const isDark = theme === "dark";

  /* ================= DATA ================= */
  const applicants = jobs.flatMap((j) => j.applicants || []);

  const totalApplications = applicants.length;
  const cvAnalyzed = applicants.filter((a) => a.analysisId).length;
  const interviews = applicants.filter((a) => a.interviewId).length;

  const max = Math.max(
    totalApplications,
    cvAnalyzed,
    interviews,
    1
  );

  /* ================= STYLES ================= */
  const barBg = isDark ? "bg-[#1e293b]" : "bg-gray-200";
  const barFill = "bg-purple-500";

  const Item = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value: number;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 font-medium">
          <span className="text-purple-500">{icon}</span>
          {label}
        </div>
        <span className="font-semibold">{value}</span>
      </div>

      <div className={`w-full h-3 rounded-full ${barBg}`}>
        <div
          className={`h-3 rounded-full ${barFill} transition-all duration-500`}
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
    </div>
  );

  return (
    <div
      className={`
        w-full h-[380px]
        rounded-xl border p-6
        flex flex-col
        ${
          isDark
            ? "bg-[#0F172A]/50 border-gray-700 text-white"
            : "bg-white border-gray-200 text-black"
        }
      `}
    >
      {/* ===== HEADER ===== */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">
          Hiring Pipeline
        </h3>
        <p className="text-sm opacity-60">
          Overview based on real applicant data
        </p>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="flex-1 flex flex-col justify-center space-y-6">
        <Item
          icon={<FileText size={18} />}
          label="Applications"
          value={totalApplications}
        />

        <Item
          icon={<CheckCircle size={18} />}
          label="CVs Analyzed"
          value={cvAnalyzed}
        />

        <Item
          icon={<Mic size={18} />}
          label="Interviews"
          value={interviews}
        />
      </div>
    </div>
  );
}

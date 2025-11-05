"use client";

import { Target, CheckCircle, Sparkles } from "lucide-react";
import type { CvType } from "@/app/components/MenteeCV/create/types";

export default function TypeStep({
  cvType,
  setCvType,
  isDark,
}: {
  cvType: CvType;
  setCvType: (t: CvType) => void;
  isDark: boolean;
}) {
  const C = palette(isDark);

  const Card = ({
    keyType,
    title,
    desc,
    points,
  }: {
    keyType: CvType;
    title: string;
    desc: string;
    points: string[];
  }) => {
    const active = cvType === keyType;
    return (
      <button
        type="button"
        onClick={() => setCvType(keyType)}
        className={`text-left p-5 rounded-xl border transition-all ${active ? C.card.active : C.card.idle}`}
      >
        <div className={`font-semibold ${C.text.title}`}>{title}</div>
        <div className={`${C.text.muted} text-sm mt-1`}>{desc}</div>

        {/* نقاط إضافية لكل كارد */}
        <ul className="mt-4 space-y-1 text-sm">
          {points.map((p, i) => (
            <li key={i} className="flex items-center gap-2">
              {/* أيقونة ثابتة اللون حتى لا تورّث currentColor */}
              <CheckCircle className={C.icon.check} size={16} />
              <span className={C.text.body}>{p}</span>
            </li>
          ))}
        </ul>

        {/* لمسة لطيفة */}
        <div className="mt-4 inline-flex items-center gap-2 text-xs">
          <Sparkles className={C.icon.spark} size={14} />
          <span className={C.text.hint}>{active ? "Selected" : "Click to select"}</span>
        </div>
      </button>
    );
  };

  return (
    <div
      className={`${
        isDark
          ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]"
          : "bg-white shadow-lg"
      } border ${C.border} rounded-xl p-8 backdrop-blur-sm`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className={`w-12 h-12 rounded-lg border flex items-center justify-center ${
            isDark ? "bg-teal-500/20 border-teal-500/30" : "bg-purple-100 border-purple-300"
          }`}
        >
          <Target className={isDark ? "text-teal-400" : "text-purple-600"} size={24} />
        </div>
        <div>
          <h2 className={`${C.text.title} font-semibold`}>Choose CV Type</h2>
          <p className={`${C.text.muted} text-sm`}>Pick the mode that fits your goal</p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-5">
        <Card
          keyType="general"
          title="General"
          desc="Standard CV for broad sharing"
          points={[
            "Classic, recruiter-friendly layout",
            "Balanced sections (experience, education, skills)",
            "Best for quick sharing and job portals",
          ]}
        />
        <Card
          keyType="role"
          title="Role-Based"
          desc="Customize for a specific role"
          points={[
            "Highlights role-relevant achievements",
            "Emphasizes required tech/soft skills",
            "Optimized summary & bullets for the role",
          ]}
        />
        <Card
          keyType="job"
          title="Job-Based"
          desc="Match a pasted JD"
          points={[
            "Paste job description and extract keywords",
            "Alignment score & missing skills hints",
            "Tailored bullets to match JD phrasing",
          ]}
        />
      </div>

      {/* Helper under cards */}
      {cvType === "general" && (
        <p className={`${C.text.muted} text-sm mt-6`}>
          No extra info needed. You can proceed to the next step.
        </p>
      )}
      {cvType === "role" && (
        <p className={`${C.text.muted} text-sm mt-6`}>
          Select or type your target role in the next step to tailor content.
        </p>
      )}
      {cvType === "job" && (
        <p className={`${C.text.muted} text-sm mt-6`}>
          Paste or upload the job description next to generate a targeted CV.
        </p>
      )}
    </div>
  );
}

function palette(isDark: boolean) {
  return {
    card: {
      active: isDark
        ? "border-teal-400 bg-teal-500/10"
        : "border-purple-500 bg-purple-50",
      idle: isDark
        ? "border-[rgba(94,234,212,0.2)] hover:border-teal-400/60"
        : "border-[#ddd6fe] hover:border-purple-400",
    },
    border: isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]",
    text: {
      title: isDark ? "text-white" : "text-[#2e1065]",
      body: isDark ? "text-[#e5e7eb]" : "text-[#3b0764]",
      hint: isDark ? "text-teal-200" : "text-purple-700",
      muted: isDark ? "text-[#99a1af]" : "text-[#6b21a8]",
    },
    icon: {
      check: isDark ? "text-emerald-400" : "text-green-600",
      spark: isDark ? "text-teal-300" : "text-purple-600",
    },
  };
}

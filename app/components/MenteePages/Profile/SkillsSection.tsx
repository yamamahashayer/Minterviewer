"use client";

import { Target } from "lucide-react";

export default function SkillsSection({ profile, isDark }: any) {
  const classifiedCategories = Array.isArray(profile?.classified_skills?.categories)
    ? profile.classified_skills.categories
    : [];

  const hasClassified = classifiedCategories.some(
    (c: any) => String(c?.category || "").trim() && Array.isArray(c?.skills) && c.skills.length > 0
  );

  return (
    <div
      className={`${
        isDark
          ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]"
          : "bg-white shadow-lg"
      } border ${
        isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"
      } rounded-xl p-6 backdrop-blur-sm`}
    >
      <h3
        className={`${
          isDark ? "text-white" : "text-[#2e1065]"
        } mb-6 flex items-center gap-2 font-semibold`}
      >
        <Target className={isDark ? "text-teal-300" : "text-purple-600"} size={20} />
        Skills & Expertise
      </h3>

      <div className="space-y-4">
        {hasClassified ? (
          <div className="space-y-5">
            {classifiedCategories.map((c: any, idx: number) => {
              const title = String(c?.category || "").trim();
              const skills = Array.isArray(c?.skills) ? c.skills : [];
              if (!title || skills.length === 0) return null;

              return (
                <div key={`${title}-${idx}`} className="space-y-2">
                  <div
                    className={`${
                      isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"
                    } font-semibold`}
                  >
                    {title}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {skills.map((s: any, sIdx: number) => {
                      const label = String(s || "").trim();
                      if (!label) return null;

                      return (
                        <span
                          key={`${label}-${sIdx}`}
                          className={`${
                            isDark
                              ? "bg-[rgba(255,255,255,0.06)] text-[#e5e7eb] border-[rgba(94,234,212,0.18)]"
                              : "bg-purple-50 text-[#2e1065] border-purple-200"
                          } border px-3 py-1 rounded-full text-sm`}
                        >
                          {label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : Array.isArray(profile.skills) && profile.skills.length > 0 ? (
          profile.skills.map((skill: any, index: number) => {
            const lvl = Math.max(0, Math.min(100, Number(skill.level) || 0));

            return (
              <div key={`${skill.name}-${index}`}>
                <div className="flex justify-between mb-2">
                  <span
                    className={`${
                      isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"
                    } font-medium`}
                  >
                    {skill.name}
                  </span>

                  <span
                    className={`${
                      isDark ? "text-teal-300" : "text-purple-600"
                    } font-bold`}
                  >
                    {lvl}%
                  </span>
                </div>

                <div
                  className={`h-2 ${
                    isDark
                      ? "bg-[rgba(255,255,255,0.05)]"
                      : "bg-purple-100"
                  } rounded-full overflow-hidden`}
                >
                  <div
                    style={{ width: `${lvl}%` }}
                    className={`h-full bg-gradient-to-r ${
                      isDark
                        ? "from-teal-300 to-emerald-400"
                        : "from-purple-600 to-pink-600"
                    } rounded-full transition-all duration-500`}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-6 opacity-80">
            <div className="flex justify-center mb-3">
              <Target className={isDark ? "text-teal-300" : "text-purple-600"} size={28} />
            </div>

            <p className={isDark ? "text-[#c3d4d8]" : "text-[#4c1d95]"}>
              No skills recorded yet.
            </p>
            <p className={isDark ? "text-[#9bb0b5]" : "text-[#6b21a8]"}>
              Complete your first AI interview to start building your skills profile!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

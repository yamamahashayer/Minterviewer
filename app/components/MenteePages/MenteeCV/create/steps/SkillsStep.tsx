"use client";

import SectionCard from "../shared/SectionCard";
import StepHeader from "../shared/StepHeader";
import { Textarea } from "../../../../ui/textarea";
import { Label } from "../../../../ui/label";
import { Code, Sparkles } from "lucide-react";

type Skills = { technical: string; soft?: string; languages?: string };

export default function SkillsStep({
  skills,
  update,
  isDark,
}: {
  skills: Skills;
  update: (k: keyof Skills, v: string) => void;
  isDark?: boolean;
}) {
  // ===== suggestions =====
  const techSuggestions = [
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Express",
    "MongoDB",
    "Prisma",
    "REST APIs",
    "GraphQL",
    "Docker",
    "CI/CD",
    "Git",
    "Linux",
    "AWS",
  ];

  const softSuggestions = [
    "Communication",
    "Problem Solving",
    "Teamwork",
    "Time Management",
    "Leadership",
    "Adaptability",
    "Attention to Detail",
  ];

  const langSuggestions = ["Arabic", "English", "French", "German", "Turkish"];

  // ===== helpers =====
  const pillClass =
    "px-3 py-1 text-xs rounded-lg border transition-colors select-none";

  const wrap = (txt?: string) =>
    (txt || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  function addToken(field: keyof Skills, token: string) {
    const cur = wrap(skills[field] as string);
    const exists = cur.some((s) => s.toLowerCase() === token.toLowerCase());
    const next = exists ? cur : [...cur, token];
    update(field, next.join(", "));
  }

  const cardBg =
    isDark ? "bg-violet-500/10 border-violet-500/30" : "bg-purple-50 border-purple-200";
  const textMuted = isDark ? "text-[#aab3c2]" : "text-[#6b21a8]";

  return (
    <SectionCard
      className={
        isDark
          ? "border-[rgba(94,234,212,0.2)]"
          : "border-[#ddd6fe] bg-white shadow-lg"
      }
    >
      <StepHeader
        Icon={Code}
        title="Skills & Competencies"
        subtitle="Highlight your skills"
        badgeClass={
          isDark ? "bg-teal-500/20 border-teal-500/30" : "bg-purple-100 border-purple-300"
        }
      />

      <div className="space-y-8">
        {/* Technical */}
        <div>
          <Label className="mb-2 block">Technical Skills *</Label>
          <Textarea
            className="min-h-[120px]"
            value={skills.technical}
            onChange={(e) => update("technical", e.target.value)}
            placeholder="e.g., TypeScript, React, Next.js, REST APIs…"
          />
          <div className={`mt-3 p-4 border rounded-lg ${cardBg}`}>
            <div className={`flex items-center gap-2 text-sm ${textMuted}`}>
              <Sparkles size={18} />
              <span>Click suggestions to add:</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {techSuggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addToken("technical", s)}
                  className={`${pillClass} ${
                    isDark
                      ? "border-[rgba(94,234,212,0.35)] hover:bg-[rgba(94,234,212,0.12)] text-[#cdeffd]"
                      : "border-[#e9d5ff] hover:bg-purple-100 text-[#6b21a8]"
                  }`}
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Soft */}
        <div>
          <Label className="mb-2 block">Soft Skills</Label>
          <Textarea
            className="min-h-[100px]"
            value={skills.soft || ""}
            onChange={(e) => update("soft", e.target.value)}
            placeholder="e.g., Communication, Teamwork, Problem Solving…"
          />
          <div className={`mt-3 p-4 border rounded-lg ${cardBg}`}>
            <div className={`flex items-center gap-2 text-sm ${textMuted}`}>
              <Sparkles size={18} />
              <span>Suggested soft skills:</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {softSuggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addToken("soft", s)}
                  className={`${pillClass} ${
                    isDark
                      ? "border-[rgba(94,234,212,0.35)] hover:bg-[rgba(94,234,212,0.12)] text-[#cdeffd]"
                      : "border-[#e9d5ff] hover:bg-purple-100 text-[#6b21a8]"
                  }`}
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Languages */}
        <div>
          <Label className="mb-2 block">Languages</Label>
          <Textarea
            className="min-h-[80px]"
            value={skills.languages || ""}
            onChange={(e) => update("languages", e.target.value)}
            placeholder="e.g., Arabic (Native), English (Fluent)…"
          />
          <div className={`mt-3 p-4 border rounded-lg ${cardBg}`}>
            <div className={`flex items-center gap-2 text-sm ${textMuted}`}>
              <Sparkles size={18} />
              <span>Common languages:</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {langSuggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addToken("languages", s)}
                  className={`${pillClass} ${
                    isDark
                      ? "border-[rgba(94,234,212,0.35)] hover:bg-[rgba(94,234,212,0.12)] text-[#cdeffd]"
                      : "border-[#e9d5ff] hover:bg-purple-100 text-[#6b21a8]"
                  }`}
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

"use client";

import { useState, useEffect } from "react";
import SectionCard from "../shared/SectionCard";
import StepHeader from "../shared/StepHeader";
import { Textarea } from "../../../../ui/textarea";
import { Label } from "../../../../ui/label";
import { Code, Sparkles } from "lucide-react";

type Skills = { technical: string; soft?: string; languages?: string };

export default function SkillsStep({
  skills,
  update,
  isDark = true,
  menteeId,
  cvType,
  cvData,
  targetRole,
  jobDescription,
}: {
  skills: Skills;
  update: (k: keyof Skills, v: string) => void;
  isDark?: boolean;
  menteeId?: string | null;
  cvType: string;
  cvData: any;
  targetRole: string;
  jobDescription: string;
}) {
  // ==========================
  // State
  // ==========================
  const [aiSug, setAiSug] = useState({
    technicalSkills: [] as string[],
    softSkills: [] as string[],
    languages: [] as string[],
  });

  const [loading, setLoading] = useState(false);
  const [loadedOnce, setLoadedOnce] = useState(false);

  // Auto-fetch once
  useEffect(() => {
    if (!menteeId || loadedOnce) return;
    fetchSuggestions();
    setLoadedOnce(true);
  }, [menteeId]);

  // ==========================
  // Fetch Gemini Skills
  // ==========================
  async function fetchSuggestions() {
    if (!menteeId) return;

    try {
      setLoading(true);

      const res = await fetch(
        `/api/mentees/${menteeId}/cv/suggestions/skills`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cvType,
            cvData,
            targetRole,
            jobDescription,
          }),
        }
      );

      const data = await res.json();

      setAiSug({
        technicalSkills: data.technicalSkills || [],
        softSkills: data.softSkills || [],
        languages: data.languages || [],
      });
    } catch (err) {
      console.error("❌ Skills Suggestion Error:", err);
    } finally {
      setLoading(false);
    }
  }

  // ==========================
  // Helpers
  // ==========================
  const pillClass =
    "px-3 py-1 text-xs rounded-lg border transition-colors select-none";

  const wrap = (txt?: string) =>
    (txt || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  function addToken(field: keyof Skills, token: string) {
    const cur = wrap(skills[field]);
    const exists = cur.some((s) => s.toLowerCase() === token.toLowerCase());
    const next = exists ? cur : [...cur, token];
    update(field, next.join(", "));
  }

  const cardBg =
    isDark
      ? "bg-violet-500/10 border-violet-500/30"
      : "bg-purple-50 border-purple-200";

  const textMuted = isDark ? "text-[#aab3c2]" : "text-[#6b21a8]";

  // ==========================
  // 🔥 Animated AI Button (SAME AS SUMMARY BUTTON)
  // ==========================
  const AnimatedButton = (
    <button
      onClick={fetchSuggestions}
      disabled={loading}
      className={`
        group relative overflow-hidden rounded-xl px-5 py-2.5
        font-semibold flex items-center gap-2
        transition-all duration-300
        ${loading ? "opacity-60 cursor-not-allowed" : ""}
        ${
          isDark
            ? "bg-emerald-600 text-white hover:bg-emerald-500"
            : "bg-purple-600 text-white hover:bg-purple-700"
        }
        shadow-lg shadow-emerald-600/30
        hover:shadow-emerald-500/50
      `}
    >
      {/* خلفية متحركة */}
      <span
        className="
          absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600
          opacity-0 group-hover:opacity-20
          blur-2xl transition duration-500
        "
      />

      <span className="relative flex items-center gap-2">
        {loading ? (
          <>
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Generating…</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Generate</span>
          </>
        )}
      </span>

      {!loading && (
        <span
          className="
            absolute right-2 top-1/2 -translate-y-1/2
            text-white/60 opacity-0 group-hover:opacity-100
            transition duration-500
            animate-[spin_2.5s_linear_infinite]
          "
        >
          
        </span>
      )}
    </button>
  );

  // ==========================
  // UI
  // ==========================
  return (
    <SectionCard
      className={
        isDark
          ? "border-[rgba(94,234,212,0.2)]"
          : "border-[#ddd6fe] bg-white shadow-lg"
      }
    >
      {/* HEADER WITH ANIMATED BUTTON */}
      <StepHeader
        Icon={Code}
        title="Skills & Competencies"
        subtitle="Highlight your strongest capabilities"
        badgeClass={
          isDark
            ? "bg-teal-500/20 border-teal-500/30"
            : "bg-purple-100 border-purple-300"
        }
        rightElement={AnimatedButton}
      />

      {/* BODY */}
      <div className="space-y-8">
        {/* TECHNICAL SKILLS */}
        <div>
          <Label className="mb-2 block">Technical Skills *</Label>
          <Textarea
            className="min-h-[120px]"
            value={skills.technical}
            onChange={(e) => update("technical", e.target.value)}
            placeholder="e.g., TypeScript, React, Next.js…"
          />

          {/* AI SUGGESTIONS */}
          {aiSug.technicalSkills.length > 0 && !loading && (
            <div className={`mt-3 p-4 border rounded-lg ${cardBg}`}>
              <div className={`flex items-center gap-2 text-sm ${textMuted}`}>
                <Sparkles size={18} />
                <span>AI Suggestions:</span>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {aiSug.technicalSkills.map((s, i) => (
                  <button
                    key={i}
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
          )}
        </div>

        {/* SOFT SKILLS */}
        <div>
          <Label className="mb-2 block">Soft Skills</Label>
          <Textarea
            className="min-h-[100px]"
            value={skills.soft || ""}
            onChange={(e) => update("soft", e.target.value)}
            placeholder="e.g., Communication, Problem Solving…"
          />

          {aiSug.softSkills.length > 0 && !loading && (
            <div className={`mt-3 p-4 border rounded-lg ${cardBg}`}>
              <div className={`flex items-center gap-2 text-sm ${textMuted}`}>
                <Sparkles size={18} />
                <span>AI Suggestions:</span>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {aiSug.softSkills.map((s, i) => (
                  <button
                    key={i}
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
          )}
        </div>

        {/* LANGUAGES */}
        <div>
          <Label className="mb-2 block">Languages</Label>
          <Textarea
            className="min-h-[80px]"
            value={skills.languages || ""}
            onChange={(e) => update("languages", e.target.value)}
            placeholder="e.g., Arabic (Native)"
          />

          {aiSug.languages.length > 0 && !loading && (
            <div className={`mt-3 p-4 border rounded-lg ${cardBg}`}>
              <div className={`flex items-center gap-2 text-sm ${textMuted}`}>
                <Sparkles size={18} />
                <span>AI Suggestions:</span>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {aiSug.languages.map((s, i) => (
                  <button
                    key={i}
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
          )}
        </div>
      </div>
    </SectionCard>
  );
}

"use client";

import { useEffect, useState } from "react";
import SectionCard from "../shared/SectionCard";
import StepHeader from "../shared/StepHeader";
import { Textarea } from "@/app/components/ui/textarea";
import { FileText, Sparkles } from "lucide-react";

// ==========================
// 🔥 Props Types
// ==========================
interface SummaryStepProps {
  value: string;
  onChange: (v: string) => void;
  isDark: boolean;
  menteeId?: string | null;
  cvType: string;
  cvData: any;
  targetRole?: string;
  jobDescription?: string;
}

// ==========================
// 🔥 Main Component
// ==========================
export default function SummaryStep({
  value,
  onChange,
  isDark,
  menteeId,
  cvType,
  cvData,
  targetRole,
  jobDescription,
}: SummaryStepProps) {
  const [loading, setLoading] = useState(false);
  const [loadedOnce, setLoadedOnce] = useState(false);

  const [aiSug, setAiSug] = useState<{
    summaryTemplates: string[];
  }>({
    summaryTemplates: [],
  });

  // Fetch AI suggestions
  useEffect(() => {
    if (!menteeId || loadedOnce) return;
    fetchSummary();
    setLoadedOnce(true);
  }, [menteeId]);

  async function fetchSummary() {
    if (!menteeId) return;

    try {
      setLoading(true);

      const res = await fetch(
        `/api/mentees/${menteeId}/cv/suggestions/summary`,
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
        summaryTemplates: data.summaryTemplates || [],
      });
    } catch (err) {
      console.error("❌ Summary Suggestion Error:", err);
    } finally {
      setLoading(false);
    }
  }

  const pillClass =
    "px-3 py-2 rounded-lg border text-xs cursor-pointer truncate hover:opacity-90";
  const border = isDark ? "border-white/10" : "border-[#e9d5ff]";

  const card =
    "rounded-xl shadow-2xl overflow-hidden " +
    (isDark
      ? "border-[rgba(94,234,212,0.2)]"
      : "border-[#ddd6fe] bg-white shadow-lg");

  // ==========================
  // 🔥 Animated AI Button
  // ==========================
  const AnimatedButton = (
    <button
      onClick={fetchSummary}
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

  return (
    <SectionCard className={card}>
      
      {/* Header + Button */}
      <StepHeader
        Icon={FileText}
        title="Professional Summary"
        subtitle="2–3 sentences highlighting your strengths"
        badgeClass={
          isDark
            ? "bg-teal-500/20 border-teal-500/30"
            : "bg-purple-100 border-purple-300"
        }
        rightElement={AnimatedButton}
      />

      {/* AI Templates */}
      {aiSug.summaryTemplates.length > 0 && !loading && (
        <div className={`mb-4 p-3 rounded-xl border ${border}`}>
          <div className="text-xs mb-2 opacity-80 flex gap-2 items-center">
            <Sparkles size={16} /> AI Summary Templates
          </div>

          <div className="grid gap-2 md:grid-cols-3">
            {aiSug.summaryTemplates.map((t, i) => (
              <button
                key={i}
                onClick={() => onChange(t)}
                className={`${pillClass} ${border} text-left`}
              >
                {t.slice(0, 140)}
                {t.length > 140 ? "…" : ""}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Textarea */}
      <Textarea
        rows={7}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write a concise 2–3 sentence summary…"
        className="mb-3"
      />

      <div className="text-xs opacity-70 mb-2">
        Aim for 2–3 strong sentences (~200–400 chars).
      </div>
    </SectionCard>
  );
}

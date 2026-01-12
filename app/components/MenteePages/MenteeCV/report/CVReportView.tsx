"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Download } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import html2pdf from "html2pdf.js";
import Analyzed from "./History/Analyzed";
import { generateCvReportPDF } from "@/app/utils/generateCvPdf";

export default function CVReportView({
  data,
  menteeId,
  resumeId,
  isDark,
  mode = "mentee",
}: {
  data?: any;
  menteeId?: string;
  resumeId?: string;
  isDark?: boolean;
  mode?: "mentee" | "company";
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [fetched, setFetched] = useState<any | null>(data || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "details" | "improve" | "history"
  >("details");

  const resumeIdFromUrl = searchParams.get("resumeId") || resumeId;

  useEffect(() => {
    if (mode === "company") return;
    if (fetched || !menteeId || !resumeIdFromUrl) return;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `/api/mentees/${menteeId}/cv/report/${resumeIdFromUrl}`,
          { cache: "no-store" }
        );

        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Failed to load analysis");

        setFetched(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [menteeId, resumeIdFromUrl, fetched, mode]);

  const result = fetched?.analysis || fetched || data;
  const categories = result?.categories || {};

  /* ================= FIXED SCORES ================= */

  const matched = result?.keywordCoverage?.matched?.length || 0;
  const missing = result?.keywordCoverage?.missing?.length || 0;

  const keywordMatchPercent = Math.min(
    Math.round((matched / Math.max(matched + missing, 1)) * 100),
    100
  );

  const impactScore = Math.min(
    Math.round(((result?.strengths?.length || 1) / 5) * 100),
    100
  );

  if (loading)
    return (
      <div className="text-center py-16 text-white/50 animate-pulse">
        Loading CV analysis…
      </div>
    );

  if (error)
    return (
      <div className="text-center py-12 text-rose-400">
        ⚠️ {error}
      </div>
    );

  if (!result)
    return (
      <div className="text-center py-12 text-white/50">
        No analysis data available.
      </div>
    );

  return (
    <div
      id="cv-report-content"
      className={`min-h-screen px-8 py-10 ${
        isDark
          ? "bg-[#0b1020] text-white"
          : "bg-[#f5f3ff] text-[#2e1065]"
      }`}
    >
      {/* ================= HEADER ================= */}
      <div
        className={`rounded-2xl border p-6 mb-10 backdrop-blur ${
          isDark
            ? "bg-gradient-to-br from-[#0f172a] to-[#020617] border-white/10"
            : "bg-white border-[#e9d5ff]"
        }`}
      >
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              CV Review & Optimization
            </h1>
            <p className={isDark ? "text-white/60" : "text-purple-700"}>
              AI-powered resume evaluation
            </p>
          </div>

          {mode === "mentee" && (
            <Button
              variant="outline"
              onClick={() => generateCvReportPDF(result)}
              className="flex items-center gap-2 hover:bg-purple-50 dark:hover:bg-white/10"
            >
              <Download size={16} />
              Download Report
            </Button>
          )}
        </div>

        {/* ================= SCORES ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <ScoreBox label="Overall" value={result.score} />
          <ScoreBox label="ATS" value={result.atsScore} />
          <ScoreBox label="Keyword Match" value={keywordMatchPercent} />
          <ScoreBox label="Impact" value={impactScore} />
        </div>
      </div>

      {/* ================= TABS ================= */}
      <div className="flex gap-6 mb-6 text-sm">
        {["details", "improve", "history"].map((t) =>
          mode === "company" && t !== "details" ? null : (
            <button
              key={t}
              onClick={() => setActiveTab(t as any)}
              className={`pb-1 ${
                activeTab === t
                  ? "border-b-2 border-purple-500 font-semibold"
                  : isDark
                  ? "text-white/60 hover:text-white"
                  : "text-purple-600"
              }`}
            >
              {t === "details"
                ? "Detailed Feedback"
                : t === "improve"
                ? "Improvements"
                : "History"}
            </button>
          )
        )}
      </div>

      {/* ================= CONTENT ================= */}
      {activeTab === "details" && (
        <div className="grid md:grid-cols-2 gap-6">
          <CategoryCard title="Formatting" data={categories.formatting} />
          <CategoryCard title="Content" data={categories.content} />
          <CategoryCard title="Keywords" data={categories.keywords} />
          <CategoryCard title="Experience" data={categories.experience} />
        </div>
      )}

      {mode === "mentee" && activeTab === "improve" && (
        <ImprovementSection improvements={result.improvements || []} />
      )}

      {mode === "mentee" && activeTab === "history" && (
        <Analyzed menteeId={menteeId} isDark={isDark} />
      )}
    </div>
  );
}

/* ================= HELPERS ================= */

function ScoreBox({ label, value }: any) {
  return (
    <div className="p-4 rounded-xl border bg-gradient-to-br from-[#020617] to-[#0f172a] border-white/10">
      <div className="text-white/60">{label}</div>
      <div className="text-2xl font-bold">{value}/100</div>
    </div>
  );
}

function CategoryCard({ title, data }: any) {
  return (
    <div className="p-6 rounded-xl border bg-gradient-to-br from-[#020617] to-[#0f172a] border-white/10">
      <h3 className="font-semibold mb-2">
        {title} ({data?.score || 0}/10)
      </h3>
      <ul className="text-white/70">
        {(data?.insights || []).map((i: string, idx: number) => (
          <li key={idx}>• {i}</li>
        ))}
      </ul>
    </div>
  );
}

function ImprovementSection({ improvements }: any) {
  return (
    <div className="p-6 rounded-xl border bg-gradient-to-br from-[#020617] to-[#0f172a] border-white/10">
      <h3 className="font-semibold mb-3">AI Recommendations</h3>
      <ul className="text-white/70">
        {improvements.map((i: string, idx: number) => (
          <li key={idx}>• {i}</li>
        ))}
      </ul>
    </div>
  );
}

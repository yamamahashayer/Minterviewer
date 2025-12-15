"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Download,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import html2pdf from "html2pdf.js";
import Analyzed from "./History/Analyzed";
import { useRouter } from "next/navigation";
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
  const [fetched, setFetched] = useState<any | null>(data || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

  const handleDownload = () => {
    const el = document.getElementById("cv-report-content");
    if (!el) return;
    html2pdf().from(el).save("CV_Analysis_Report.pdf");
  };

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
            <div className="flex gap-3">
              <Button
              variant="outline"
              onClick={() => generateCvReportPDF(result)}
              className="flex items-center gap-2 hover:bg-purple-50 dark:hover:bg-white/10"
            >
              <Download size={16} />
              Download Report
            </Button>


             



            </div>
          )}
        </div>

        {/* Scores */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <ScoreBox label="Overall" value={result.score} isDark={isDark} />
          <ScoreBox label="ATS" value={result.atsScore} isDark={isDark} />
          <ScoreBox
            label="Keyword Match"
            value={(result.keywordCoverage?.matched?.length || 0) * 10}
            isDark={isDark}
          />
          <ScoreBox
            label="Impact"
            value={(result.strengths?.length || 1) * 10}
            isDark={isDark}
          />
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
          <CategoryCard title="Formatting" data={categories.formatting} isDark={isDark} />
          <CategoryCard title="Content" data={categories.content} isDark={isDark} />
          <CategoryCard title="Keywords" data={categories.keywords} isDark={isDark} />
          <CategoryCard title="Experience" data={categories.experience} isDark={isDark} />
        </div>
      )}

      {mode === "mentee" && activeTab === "improve" && (
        <ImprovementSection improvements={result.improvements || []} isDark={isDark} />
      )}

      {mode === "mentee" && activeTab === "history" && (
        <Analyzed menteeId={menteeId} isDark={isDark} />
      )}
    </div>
  );
}

/* ================= HELPERS ================= */

function ScoreBox({ label, value, isDark }: any) {
  return (
    <div
      className={`p-4 rounded-xl border ${
        isDark
          ? "bg-gradient-to-br from-[#020617] to-[#0f172a] border-white/10"
          : "bg-white border-[#e9d5ff]"
      }`}
    >
      <div className={isDark ? "text-white/60" : "text-purple-600"}>
        {label}
      </div>
      <div className="text-2xl font-bold">{value}/100</div>
    </div>
  );
}

function CategoryCard({ title, data, isDark }: any) {
  return (
    <div
      className={`p-6 rounded-xl border ${
        isDark
          ? "bg-gradient-to-br from-[#020617] to-[#0f172a] border-white/10"
          : "bg-white border-[#e9d5ff]"
      }`}
    >
      <h3 className="font-semibold mb-2">
        {title} ({data?.score || 0}/10)
      </h3>
      <ul className={isDark ? "text-white/70" : "text-purple-700"}>
        {(data?.insights || []).map((i: string, idx: number) => (
          <li key={idx}>• {i}</li>
        ))}
      </ul>
    </div>
  );
}

function ImprovementSection({ improvements, isDark }: any) {
  return (
    <div
      className={`p-6 rounded-xl border ${
        isDark
          ? "bg-gradient-to-br from-[#020617] to-[#0f172a] border-white/10"
          : "bg-white border-[#e9d5ff]"
      }`}
    >
      <h3 className="font-semibold mb-3">AI Recommendations</h3>
      <ul className={isDark ? "text-white/70" : "text-purple-700"}>
        {improvements.map((i: string, idx: number) => (
          <li key={idx}>• {i}</li>
        ))}
      </ul>
    </div>
  );
}

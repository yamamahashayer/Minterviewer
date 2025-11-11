"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  FileText,
  Target,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Layers,
  BookOpen,
  Brain,
  Award,
  Download,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import html2pdf from "html2pdf.js";
import HistorySection from "./History/Analyzed";
import Analyzed from "./History/Analyzed";

export default function CVReportView({
  data,
  menteeId,
  resumeId,
  isDark,
}: {
  data?: any;
  menteeId?: string;
  resumeId?: string;
  isDark?: boolean;
}) {
  const searchParams = useSearchParams();
  const [fetched, setFetched] = useState<any | null>(data || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "details" | "improve" | "keywords" | "history"
  >("details");

  const resumeIdFromUrl = searchParams.get("resumeId") || resumeId;

  useEffect(() => {
    if (fetched || !menteeId || !resumeIdFromUrl) return;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `/api/mentees/${menteeId}/cv/report?resumeId=${resumeIdFromUrl}`,
          { cache: "no-store" }
        );
        const json = await res.json();

        if (!res.ok) throw new Error(json?.error || "Failed to load analysis");

        setFetched(json);
      } catch (err: any) {
        console.error("❌ Error fetching report:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [menteeId, resumeIdFromUrl, fetched]);

  const result = fetched?.analysis || fetched || data;

  if (loading) {
    return (
      <div className="text-center py-16 text-gray-400 animate-pulse">
        <p>Analyzing your resume with Gemini AI...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-rose-500">
        <p>⚠️ {error}</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>No analysis data available yet.</p>
      </div>
    );
  }

  const categories = result.categories || {};

  const handleDownload = () => {
    const element = document.getElementById("cv-report-content");
    if (!element) return;
    html2pdf().set({
      margin: 0.5,
      filename: "CV_Analysis_Report.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    }).from(element).save();
  };

  return (
    <div
      id="cv-report-content"
      className={`min-h-screen px-8 py-10 transition-colors duration-300 ${
        isDark
          ? "bg-[#0b1020] text-white"
          : "bg-gradient-to-br from-[#fdfbff] via-[#f5f0ff] to-[#faf5ff] text-[#2e1065]"
      }`}
    >
      {/* Header */}
      <div
        className={`rounded-2xl border p-6 mb-10 ${
          isDark
            ? "bg-white/5 border-white/10"
            : "bg-white border-[#e9d5ff] shadow-sm"
        }`}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1
              className={`text-3xl font-extrabold ${
                isDark
                  ? "bg-gradient-to-r from-teal-300 to-emerald-400 bg-clip-text text-transparent"
                  : "bg-gradient-to-r from-[#9333ea] to-[#ec4899] bg-clip-text text-transparent"
              }`}
            >
              CV Review & Optimization
            </h1>
            <p
              className={`text-sm mt-1 ${
                isDark ? "text-gray-400" : "text-[#7e22ce]/80"
              }`}
            >
              AI-powered feedback to perfect your resume.
            </p>
            {menteeId && (
              <p className="text-xs text-gray-500 mt-1">
                Mentee: {menteeId} • Resume: {resumeIdFromUrl}
              </p>
            )}
          </div>

          <div className="flex gap-3 mt-2 md:mt-0">
            <Button
              onClick={handleDownload}
              variant="outline"
              className={`transition-all ${
                isDark
                  ? "border-white/20 hover:bg-white/10"
                  : "border-[#e9d5ff] text-[#6b21a8] hover:bg-[#f3e8ff]"
              }`}
            >
              <Download size={16} className="mr-2" /> Download Optimized
            </Button>
            <Button
              onClick={() => (window.location.href = "/mentee?tab=cv-review")}
              className={
                isDark
                  ? "bg-teal-400 text-[#0a0f1e] hover:bg-teal-300"
                  : "bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white hover:opacity-90"
              }
            >
              <RefreshCw size={16} className="mr-2" /> Upload New CV
            </Button>
          </div>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <ScoreBox
            icon={<FileText size={18} />}
            label="Overall Score"
            value={result?.score || 0}
            color="emerald"
            isDark={isDark}
          />
          <ScoreBox
            icon={<Target size={18} />}
            label="ATS Score"
            value={result?.atsScore || 0}
            color="teal"
            isDark={isDark}
          />
          <ScoreBox
            icon={<TrendingUp size={18} />}
            label="Keyword Match"
            value={result?.keywordCoverage?.matched?.length * 10 || 0}
            color="purple"
            isDark={isDark}
          />
          <ScoreBox
            icon={<CheckCircle2 size={18} />}
            label="Impact"
            value={Math.min(100, (result?.strengths?.length || 1) * 10)}
            color="amber"
            isDark={isDark}
          />
        </div>
      </div>

      {/* Tabs */}
      <div
        className={`flex gap-6 text-sm mb-8 ${
          isDark ? "text-gray-300" : "text-[#5b21b6]"
        }`}
      >
        {[
          { key: "details", label: "Detailed Feedback" },
          { key: "improve", label: "Improvements" },
          { key: "history", label: "History" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`pb-1 transition-all ${
              activeTab === tab.key
                ? "font-semibold border-b-2 border-teal-400 text-teal-400"
                : "hover:text-teal-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "details" && (
        <div className="grid md:grid-cols-2 gap-6">
          <CategoryCard
            title={categories.formatting?.title || "Formatting & Structure"}
            icon={<Layers />}
            score={categories.formatting?.score || 0}
            insights={categories.formatting?.insights || []}
            color="teal"
            isDark={isDark}
          />
          <CategoryCard
            title={categories.content?.title || "Content Quality"}
            icon={<BookOpen />}
            score={categories.content?.score || 0}
            insights={categories.content?.insights || []}
            color="emerald"
            isDark={isDark}
          />
          <CategoryCard
            title={categories.keywords?.title || "Keywords & ATS"}
            icon={<Brain />}
            score={categories.keywords?.score || 0}
            insights={categories.keywords?.insights || []}
            color="purple"
            isDark={isDark}
          />
          <CategoryCard
            title={categories.experience?.title || "Experience & Impact"}
            icon={<Award />}
            score={categories.experience?.score || 0}
            insights={categories.experience?.insights || []}
            color="amber"
            isDark={isDark}
          />
        </div>
      )}

      {activeTab === "improve" && (
        <ImprovementSection
          improvements={result?.improvements || []}
          isDark={isDark}
        />
      )}



      {activeTab === "history" && <Analyzed menteeId={menteeId} isDark={isDark} />}
    </div>
  );
}

/* ✅ Score Box */
function ScoreBox({ icon, label, value, color, isDark }: any) {
  const colorMap = {
    teal: "from-teal-400 to-emerald-400",
    emerald: "from-emerald-400 to-lime-400",
    purple: "from-purple-400 to-pink-400",
    amber: "from-amber-400 to-yellow-400",
  };

  return (
    <div
      className={`p-4 rounded-xl border flex flex-col gap-2 ${
        isDark
          ? "border-white/10 bg-white/5"
          : "border-[#e9d5ff] bg-white hover:bg-[#faf5ff]"
      }`}
    >
      <div
        className={`text-sm flex items-center gap-2 ${
          isDark ? "text-gray-300" : "text-[#4c1d95]"
        }`}
      >
        {icon} {label}
      </div>
      <div
        className={`text-2xl font-bold bg-gradient-to-r ${colorMap[color]} bg-clip-text text-transparent`}
      >
        {value}/100
      </div>
      <div
        className={`h-2 rounded-full overflow-hidden ${
          isDark ? "bg-white/10" : "bg-[#f3e8ff]"
        }`}
      >
        <div
          className={`h-full bg-gradient-to-r ${colorMap[color]}`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );
}

/* ✅ Category Card */
function CategoryCard({ title, icon, score, insights, color, isDark }: any) {
  const colorGradients = {
    teal: "from-teal-400 to-emerald-400",
    emerald: "from-emerald-400 to-lime-400",
    purple: "from-purple-400 to-pink-400",
    amber: "from-amber-400 to-yellow-400",
  };

  return (
    <div
      className={`p-6 rounded-2xl border shadow-sm transition-all ${
        isDark
          ? "bg-white/5 border-white/10 hover:border-teal-400/30"
          : "bg-white border-[#e9d5ff] hover:border-[#d8b4fe] shadow-md"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg bg-gradient-to-r ${colorGradients[color]} text-transparent bg-clip-text`}
          >
            {icon}
          </div>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div
          className={`text-sm font-semibold bg-gradient-to-r ${colorGradients[color]} bg-clip-text text-transparent`}
        >
          {score.toFixed(1)}/10
        </div>
      </div>

      <ul
        className={`space-y-2 text-sm ${
          isDark ? "text-gray-300" : "text-[#3b0764]/80"
        }`}
      >
        {insights.length > 0 ? (
          insights.map((point: string, i: number) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-lg">•</span>
              <span>{point}</span>
            </li>
          ))
        ) : (
          <li className="italic opacity-70">No insights available</li>
        )}
      </ul>
    </div>
  );
}

/* ✅ Improvements Section */
function ImprovementSection({ improvements, isDark }: any) {
  return (
    <div
      className={`p-6 rounded-xl border ${
        isDark
          ? "bg-white/5 border-white/10"
          : "bg-white border-[#e9d5ff] shadow-sm"
      }`}
    >
      <h3 className="text-lg font-semibold mb-4">AI Recommendations</h3>
      <ul
        className={`space-y-2 text-sm ${
          isDark ? "text-gray-300" : "text-[#3b0764]/80"
        }`}
      >
        {improvements.length > 0 ? (
          improvements.map((tip: string, i: number) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-teal-400 font-bold">•</span>
              <span>{tip}</span>
            </li>
          ))
        ) : (
          <li className="italic opacity-70">
            No improvement suggestions available.
          </li>
        )}
      </ul>
    </div>
  );
}


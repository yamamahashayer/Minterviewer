"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  FileText,
  TrendingUp,
  Target,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";

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

  // 🔹 اختيار النتيجة الصحيحة (من props أو DB)
  const result = fetched?.analysis || fetched || data;

  // 🔹 حالة التحميل
  if (loading) {
    return (
      <div className="text-center py-16 text-gray-400 animate-pulse">
        <p>Loading your AI report...</p>
      </div>
    );
  }

  // 🔹 حالة الخطأ
  if (error) {
    return (
      <div className="text-center py-12 text-rose-400">
        <p>⚠️ {error}</p>
      </div>
    );
  }

  // 🔹 حالة عدم وجود بيانات
  if (!result) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>No analysis data available.</p>
      </div>
    );
  }

  // ✅ عرض التقرير
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1
            className={`text-3xl font-bold ${
              isDark
                ? "bg-gradient-to-r from-teal-300 to-emerald-400 bg-clip-text text-transparent"
                : "text-[#2e1065]"
            }`}
          >
            CV Review & Optimization
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Personalized AI insights for your resume
          </p>
          {menteeId && (
            <p className="text-xs text-gray-500 mt-1">
              Mentee: {menteeId} • Resume: {resumeIdFromUrl}
            </p>
          )}
        </div>

        <div className="flex gap-3 mt-4 md:mt-0">
          <Button
            variant="outline"
            className="border-white/20 hover:bg-white/10"
          >
            Download Optimized
          </Button>
          <Button
            onClick={() => window.location.reload()}
            className="bg-teal-400 text-[#0a0f1e] hover:bg-teal-300"
          >
            Upload New CV
          </Button>
        </div>
      </div>

      {/* Scores */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ScoreCard
          icon={<FileText size={20} />}
          label="Overall Score"
          value={result?.score || 0}
          color="teal"
        />
        <ScoreCard
          icon={<Target size={20} />}
          label="ATS Score"
          value={result?.atsScore || 0}
          color="emerald"
        />
        <ScoreCard
          icon={<TrendingUp size={20} />}
          label="Keyword Match"
          value={(result?.keywordCoverage?.matched?.length || 0) * 10}
          color="purple"
        />
        <ScoreCard
          icon={<CheckCircle2 size={20} />}
          label="Impact"
          value={Math.min(100, (result?.strengths?.length || 1) * 10)}
          color="orange"
        />
      </div>

      {/* Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        <Section title="Strengths" items={result?.strengths || []} color="emerald" />
        <Section title="Weaknesses" items={result?.weaknesses || []} color="rose" />
        <Section
          title="Recommended Improvements"
          items={result?.improvements || []}
          color="purple"
        />
        <Section
          title="Missing Keywords"
          items={result?.keywordCoverage?.missing || []}
          color="amber"
        />
      </div>

      {/* 🔹 Recommended Job Titles */}
      {result?.recommendedJobTitles?.length > 0 && (
        <div
          className={`rounded-xl border border-white/10 p-6 ${
            isDark ? "bg-white/5" : "bg-purple-50"
          }`}
        >
          <h3 className="text-lg font-semibold mb-3">Recommended Job Titles</h3>
          <div className="flex flex-wrap gap-2">
            {result.recommendedJobTitles.map((title: string, i: number) => (
              <span
                key={i}
                className="px-3 py-1 text-sm rounded-full bg-teal-500/10 border border-teal-400/20 text-teal-300"
              >
                {title}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center mt-10">
        <Sparkles className="inline-block text-teal-400 mb-2" />
        <p className="text-sm text-gray-400">
          Analysis powered by <span className="text-teal-300">Gemini AI</span>
        </p>
      </div>
    </div>
  );
}

/* 🔹 مكون بطاقة النتيجة */
function ScoreCard({
  icon,
  label,
  value,
  color = "teal",
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color?: string;
}) {
  const colorMap: Record<string, string> = {
    teal: "from-teal-400 to-emerald-400",
    emerald: "from-emerald-400 to-lime-400",
    purple: "from-purple-400 to-pink-400",
    orange: "from-orange-400 to-amber-400",
    rose: "from-rose-400 to-pink-400",
    amber: "from-amber-400 to-yellow-300",
  };

  return (
    <div
      className={`p-5 rounded-xl border border-white/10 bg-white/5 flex flex-col gap-2`}
    >
      <div className="text-sm font-medium flex items-center gap-2 text-gray-300">
        {icon} {label}
      </div>
      <div
        className={`text-3xl font-bold bg-gradient-to-r ${colorMap[color]} bg-clip-text text-transparent`}
      >
        {value}
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden mt-1">
        <div
          className={`h-full bg-gradient-to-r ${colorMap[color]}`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );
}

/* 🔹 مكون عرض القوائم */
function Section({
  title,
  items,
  color = "teal",
}: {
  title: string;
  items: string[];
  color?: string;
}) {
  const colorMap: Record<string, string> = {
    teal: "border-teal-400/30 bg-teal-500/5",
    emerald: "border-emerald-400/30 bg-emerald-500/5",
    purple: "border-purple-400/30 bg-purple-500/5",
    rose: "border-rose-400/30 bg-rose-500/5",
    amber: "border-amber-400/30 bg-amber-500/5",
    orange: "border-orange-400/30 bg-orange-500/5",
  };

  return (
    <div
      className={`rounded-xl p-5 border ${colorMap[color]} transition-all duration-200`}
    >
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <ul className="space-y-2 text-sm text-gray-300">
        {items.length > 0 ? (
          items.map((i, idx) => (
            <li key={idx} className="leading-relaxed">
              • {i}
            </li>
          ))
        ) : (
          <li className="text-gray-500 italic">No data available</li>
        )}
      </ul>
    </div>
  );
}

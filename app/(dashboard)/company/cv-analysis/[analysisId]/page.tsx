"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import CVReportView from "@/app/components/MenteePages/MenteeCV/report/CVReportView";

export default function CompanyCVAnalysisPage() {
  const { analysisId } = useParams<{ analysisId: string }>();

  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDark, setIsDark] = useState(false);

  /* ================= THEME ================= */
  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  /* ================= FETCH ANALYSIS ================= */
  useEffect(() => {
    if (!analysisId) return;

    fetch(`/api/company/cv-analysis/${analysisId}`, {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setAnalysis(data.analysis);
        }
      })
      .catch(() => setError("Failed to load CV analysis"))
      .finally(() => setLoading(false));
  }, [analysisId]);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-400">
        Loading CV analysis…
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <CVReportView
      data={analysis}
      isDark={isDark} 
      mode="company" 
    />
  );
}

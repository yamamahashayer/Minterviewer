"use client";

import React, { useState } from "react";
import type { CVData, CvType } from "@/app/components/MenteePages/MenteeCV/create/types";
import { FileDown, FileText, Save } from "lucide-react";

export default function PreviewStep({
  data,
  cvType,
  onDownload,
  isDark,
  menteeId, // 🟢 يجي من CreateMode
}: {
  data: CVData;
  cvType: CvType;
  onDownload: () => void;
  isDark?: boolean;
  menteeId?: string | null;
}) {
  const [loading, setLoading] = useState<"save" | "pdf" | "docx" | null>(null);
  const [lastResumeId, setLastResumeId] = useState<string | null>(null);

  const safe = (x?: string) =>
    (x ?? "").replace(/[&<>]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[m]!));

  function buildResumeHtml(d: CVData) {
    return `
<div style="font-family:Arial,system-ui;color:#111;">
  <h1>${safe(d.personal.fullName || "Your Name")}</h1>
  <p>${safe(d.personal.email || "")}${
      d.personal.phone ? " · " + safe(d.personal.phone) : ""
    }</p>
</div>`;
  }

  async function saveToDB(): Promise<string | null> {
    if (!menteeId) {
      alert("⚠️ menteeId missing from props");
      console.error("menteeId not provided");
      return null;
    }

    setLoading("save");
    try {
      const html = buildResumeHtml(data);
      console.log("🚀 Creating CV for mentee:", menteeId);

      const res = await fetch(`/api/mentees/${menteeId}/cv/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html, parsed: {} }),
      });

      const json = await res.json();
      if (!res.ok || !json?.ok) {
        alert(json?.error || "Save failed");
        console.error("❌ Save error:", json);
        return null;
      }

      const id = json?.resume?._id as string | undefined;
      if (id) setLastResumeId(id);
      console.log("✅ Resume saved:", id);
      return id || null;
    } catch (err) {
      console.error("💥 Save failed:", err);
      alert("Save failed");
      return null;
    } finally {
      setLoading(null);
    }
  }

  async function exportNow(format: "pdf" | "docx") {
    if (!menteeId) {
      alert("⚠️ menteeId missing");
      return;
    }
    setLoading(format);
    try {
      const resumeId = lastResumeId || (await saveToDB());
      if (!resumeId) return;
      const qs = new URLSearchParams();
      qs.set("format", format === "pdf" ? "pdf" : "word");
      qs.set("resumeId", resumeId);
      window.open(`/api/mentees/${menteeId}/cv/create?${qs.toString()}`, "_blank");
    } finally {
      setLoading(null);
    }
  }

  const sessionReady = !!menteeId;
console.log("🧩 menteeId in PreviewStep:", menteeId);

  return (
    <div className="space-y-6">
      <div
        className={
          "rounded-xl shadow-2xl overflow-hidden " +
          (isDark
            ? "bg-[#0b1020]/60 border border-teal-400/30"
            : "bg-white border border-[#e9d5ff]")
        }
      >
        <div
          className={`p-12 ${
            isDark
              ? "border-b border-teal-400/40"
              : "border-b-2 border-teal-600/90"
          }`}
        >
          <h1
            className={`text-4xl font-semibold mb-2 ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            {data.personal.fullName || "Your Name"}
          </h1>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={saveToDB}
            disabled={!sessionReady || loading !== null}
            className="inline-flex items-center gap-1 px-4 py-1.5 text-sm font-medium rounded-md transition-all bg-emerald-600/10 text-emerald-700 hover:bg-emerald-600/20 border border-emerald-600/30 shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading === "save" ? "Saving..." : "Save"}
          </button>

          <button
            onClick={() => exportNow("pdf")}
            disabled={!sessionReady || loading !== null}
            className="inline-flex items-center gap-1 px-4 py-1.5 text-sm font-medium rounded-md transition-all bg-teal-600/10 text-teal-700 hover:bg-teal-600/20 border border-teal-600/30 shadow-sm disabled:opacity-50"
          >
            <FileText className="w-4 h-4" />
            {loading === "pdf" ? "Exporting..." : "PDF"}
          </button>

          <button
            onClick={() => exportNow("docx")}
            disabled={!sessionReady || loading !== null}
            className="inline-flex items-center gap-1 px-4 py-1.5 text-sm font-medium rounded-md transition-all bg-purple-600/10 text-purple-700 hover:bg-purple-600/20 border border-purple-600/30 shadow-sm disabled:opacity-50"
          >
            <FileDown className="w-4 h-4" />
            {loading === "docx" ? "Exporting..." : "DOCX"}
          </button>
        </div>
      </div>
    </div>
  );
}

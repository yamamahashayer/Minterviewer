"use client";

import React, { useState } from "react";
import type { CVData, CvType } from "@/app/components/MenteePages/MenteeCV/create/types";
import { FileDown, FileText, Save } from "lucide-react";

export default function PreviewStep({
  data,
  cvType,
  onDownload,
  isDark,
  menteeId,
}: {
  data: CVData;
  cvType: CvType;
  onDownload: () => void;
  isDark?: boolean;
  menteeId?: string | null;
}) {
  const [loading, setLoading] = useState<"save" | "pdf" | "docx" | null>(null);
  const [lastResumeId, setLastResumeId] = useState<string | null>(null);

  // ========= Safe HTML helper =========
  const safe = (t?: string) =>
    (t ?? "").replace(/[&<>]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[m]!));

  // ========= BUILD RESUME HTML (Classic Template) =========
  function buildResumeHtml(d: CVData) {
    const safe = (t?: string) =>
      (t ?? "").replace(/[&<>]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[m]!));

    const short = (s?: string, n = 160) => {
      if (!s) return "";
      const t = s.replace(/\s+/g, " ").trim();
      return t.length > n ? t.slice(0, n - 1) + "…" : t;
    };

    return `
<div style="font-family:Arial,Helvetica,sans-serif;color:#111;line-height:1.45;padding:40px;max-width:760px;margin:auto;">

  <!-- NAME -->
  <h1 style="margin:0;font-size:28px;font-weight:700;text-align:center;">
    ${safe(d.personal.fullName || "Your Name")}
  </h1>

  <!-- CONTACTS -->
  <div style="font-size:13px;color:#333;margin-top:8px;margin-bottom:22px;text-align:center;line-height:1.45;">
    ${[
      d.personal.email ? safe(d.personal.email) : "",
      d.personal.phone ? safe(d.personal.phone) : "",
      d.personal.location ? safe(d.personal.location) : "",
    ]
      .filter(Boolean)
      .join(" · ")}

    <div style="margin-top:4px; font-size:13px;">
      ${d.personal.linkedin
        ? `<a href="${safe(d.personal.linkedin)}" target="_blank" style="color:#0645AD;text-decoration:none;">LinkedIn</a>`
        : ""}

      ${d.personal.linkedin && d.personal.github ? " | " : ""}

      ${d.personal.github
        ? `<a href="${safe(d.personal.github)}" target="_blank" style="color:#0645AD;text-decoration:none;">GitHub</a>`
        : ""}
    </div>
  </div>

  <hr style="border:none;border-top:1px solid #000;margin:16px 0;" />

  <!-- SUMMARY -->
  ${
    d.personal.summary?.trim()
      ? `
  <div style="margin-bottom:22px;">
    <h2 style="font-size:15px;font-weight:700;margin-bottom:6px;">Summary</h2>
    <div style="font-size:13px;color:#333;">${safe(d.personal.summary)}</div>
  </div>
  <hr style="border:none;border-top:1px solid #000;margin:16px 0;" />
  `
      : ""
  }

  <!-- SKILLS -->
  ${
    d.skills.technical || d.skills.soft || d.skills.languages
      ? `
  <div style="margin-bottom:22px;">
    <h2 style="font-size:15px;font-weight:700;margin-bottom:6px;">Skills</h2>
    <div style="font-size:13px;color:#333;line-height:1.45;">
      ${d.skills.technical ? `<div><strong>Technical:</strong> ${safe(d.skills.technical)}</div>` : ""}
      ${d.skills.soft ? `<div><strong>Soft Skills:</strong> ${safe(d.skills.soft)}</div>` : ""}
      ${d.skills.languages ? `<div><strong>Languages:</strong> ${safe(d.skills.languages)}</div>` : ""}
    </div>
  </div>

  <hr style="border:none;border-top:1px solid #000;margin:16px 0;" />
  `
      : ""
  }

  <!-- PROJECTS -->
  ${
    d.projects?.some((p) => p.name || p.description)
      ? `
  <div style="margin-bottom:22px;">
    <h2 style="font-size:15px;font-weight:700;margin-bottom:6px;">Projects</h2>

    <ul style="padding-left:18px;margin:0;font-size:13px;color:#333;line-height:1.45;">
      ${d.projects
        .map((p) => {
          if (!p || (!p.name && !p.description)) return "";
          return `
      <li style="margin-bottom:8px;">
        <strong>${safe(p.name || "Project")}</strong> — ${p.description ? safe(short(p.description)) : ""}
        ${p.github ? ` — <a href="${safe(p.github)}" target="_blank" style="color:#0645AD;">GitHub</a>` : ""}
        ${p.link ? ` — <a href="${safe(p.link)}" target="_blank" style="color:#0645AD;">Live</a>` : ""}
      </li>`;
        })
        .join("")}
    </ul>
  </div>

  <hr style="border:none;border-top:1px solid #000;margin:16px 0;" />
  `
      : ""
  }

  <!-- EDUCATION -->
  ${
    d.education?.some((e) => e.degree || e.institution)
      ? `
  <div style="margin-bottom:10px;">
    <h2 style="font-size:15px;font-weight:700;margin-bottom:6px;">Education</h2>

    ${d.education
      .map((e) => {
        if (!e || (!e.degree && !e.institution)) return "";
        return `
  <div style="margin-bottom:14px;line-height:1.45;">
    <strong style="font-size:14px;">${safe(e.degree || "Degree")}</strong>
    <div style="font-size:13px;color:#333;">${safe(e.institution || "")}</div>

    ${e.location ? `<div style="font-size:13px;color:#333;">${safe(e.location)}</div>` : ""}
    ${e.graduationDate ? `<div style="font-size:12px;color:#444;">${safe(e.graduationDate)}</div>` : ""}
    ${e.gpa ? `<div style="font-size:12px;color:#0a7f5a;">GPA: ${safe(e.gpa)}</div>` : ""}
  </div>
  `;
      })
      .join("")}
  </div>
  `
      : ""
  }

</div>
`.trim();
  }

  // ========= SAVE TO DB =========
  async function saveToDB(): Promise<string | null> {
    if (!menteeId) {
      alert("⚠️ menteeId missing!");
      return null;
    }

    setLoading("save");
    try {
      const html = buildResumeHtml(data);

      const res = await fetch(`/api/mentees/${menteeId}/cv/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html, parsed: {} }),
      });

      const json = await res.json();
      if (!res.ok || !json?.ok) return null;

      const id = json.resume?._id;
      setLastResumeId(id);
      return id || null;
    } finally {
      setLoading(null);
    }
  }

  // ========= EXPORT =========
  async function exportNow(format: "pdf" | "docx") {
    if (!menteeId) return;

    setLoading(format);
    const resumeId = lastResumeId || (await saveToDB());
    if (!resumeId) return;

    const qs = new URLSearchParams();
    qs.set("format", format === "pdf" ? "pdf" : "word");
    qs.set("resumeId", resumeId);

    window.open(`/api/mentees/${menteeId}/cv/create?${qs.toString()}`, "_blank");
    setLoading(null);
  }

  return (
    <div className="space-y-6">
      {/* === FULL CV HTML PREVIEW === */}
      <div
        style={{
          background: "white",
          color: "black",
          padding: "40px",
          borderRadius: "12px",
          margin: "40px auto", 
          width: "760px",         
          maxWidth: "100%",
          boxShadow: "0 0 25px rgba(0,0,0,0.15)",
        }}
        dangerouslySetInnerHTML={{ __html: buildResumeHtml(data) }}
      />

      {/* Buttons */}
      <div className="mt-8 flex justify-center">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={saveToDB}
            disabled={loading !== null}
            className="px-4 py-2 bg-emerald-500 text-white rounded-md shadow"
          >
            {loading === "save" ? "Saving..." : "Save"}
          </button>

          <button
            onClick={() => exportNow("pdf")}
            className="px-4 py-2 bg-teal-500 text-white rounded-md shadow"
          >
            PDF
          </button>

          <button
            onClick={() => exportNow("docx")}
            className="px-4 py-2 bg-purple-500 text-white rounded-md shadow"
          >
            DOCX
          </button>
        </div>
      </div>
    </div>
  );
}

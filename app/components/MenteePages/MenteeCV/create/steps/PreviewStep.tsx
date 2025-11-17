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

  // ========= BUILD RESUME HTML =========
     function buildResumeHtml(d: CVData) {
  const safe = (t?: string) =>
    (t ?? "").replace(/[&<>]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[m]!));

  const short = (s?: string, n = 160) => {
    if (!s) return "";
    const t = s.replace(/\s+/g, " ").trim();
    return t.length > n ? t.slice(0, n - 1) + "…" : t;
  };

  return `
<div style="font-family:Arial,Helvetica,sans-serif;color:#111;line-height:1.45;padding:32px;max-width:760px;margin:auto;">

  <!-- NAME -->
  <h1 style="margin:0;font-size:26px;font-weight:700;">${safe(d.personal.fullName || "Your Name")}</h1>

  <!-- CONTACTS -->
  <div style="font-size:13px;color:#333;margin-top:6px;margin-bottom:18px;">
    ${safe(d.personal.email || "")}
    ${d.personal.phone ? " · " + safe(d.personal.phone) : ""}
    ${d.personal.location ? " · " + safe(d.personal.location) : ""}
    ${
      d.personal.linkedin
        ? ` · <a href="${safe(d.personal.linkedin)}" target="_blank" style="color:#0645AD;text-decoration:none;">LinkedIn</a>`
        : ""
    }
    ${
      d.personal.portfolio
        ? ` · <a href="${safe(d.personal.portfolio)}" target="_blank" style="color:#0645AD;text-decoration:none;">Portfolio</a>`
        : ""
    }
  </div>

  <!-- SECTION TITLE STYLE -->
  <style>
    .section-title {
      font-size: 15px;
      font-weight: 700;
      margin-bottom: 6px;
      padding-bottom: 2px;
      border-bottom: 1px solid #000;
    }
  </style>

  <!-- SUMMARY -->
  ${
    d.personal.summary?.trim()
      ? `
  <div style="margin-bottom:18px;">
    <div class="section-title">Professional Summary</div>
    <div style="font-size:13px;color:#333;">
      ${safe(d.personal.summary)}
    </div>
  </div>`
      : ""
  }

  <!-- SKILLS -->
  ${
    d.skills.technical || d.skills.soft || d.skills.languages
      ? `
  <div style="margin-bottom:18px;">
    <div class="section-title">Skills</div>
    <div style="font-size:13px;color:#333;">
      ${
        d.skills.technical
          ? `<div><strong>Technical:</strong> ${safe(d.skills.technical)}</div>`
          : ""
      }
      ${
        d.skills.soft
          ? `<div><strong>Soft Skills:</strong> ${safe(d.skills.soft)}</div>`
          : ""
      }
      ${
        d.skills.languages
          ? `<div><strong>Languages:</strong> ${safe(d.skills.languages)}</div>`
          : ""
      }
    </div>
  </div>`
      : ""
  }

  <!-- EXPERIENCE -->
  ${
    d.experience?.some((e) => e.title || e.company)
      ? `
  <div style="margin-bottom:18px;">
    <div class="section-title">Work Experience</div>
    ${d.experience
      .map((e) => {
        if (!e?.title && !e?.company) return "";

        const dates = `${safe(e.startDate || "")}${
          e.startDate && (e.current || e.endDate) ? " — " : ""
        }${e.current ? "Present" : safe(e.endDate || "")}`;

        return `
    <div style="margin-bottom:12px;">
      <div style="display:flex;justify-content:space-between;">
        <strong style="font-size:14px;">${safe(e.title || "Role")}</strong>
        <span style="font-size:12px;color:#444;">${dates}</span>
      </div>

      <div style="font-size:13px;color:#333;margin-bottom:2px;">
        ${safe(e.company || "")}${e.location ? ", " + safe(e.location) : ""}
      </div>

      ${
        e.description
          ? `<div style="white-space:pre-line;font-size:13px;color:#222;">${safe(
              e.description
            )}</div>`
          : ""
      }
    </div>`;
      })
      .join("")}
  </div>`
      : ""
  }

  <!-- PROJECTS -->
  ${
    d.projects?.some((p) => p.name || p.description)
      ? `
  <div style="margin-bottom:18px;">
    <div class="section-title">Projects</div>
    <ul style="padding-left:16px;margin:0;font-size:13px;color:#333;">
      ${d.projects
        .map((p) => {
          if (!p || (!p.name && !p.description)) return "";

          return `
      <li style="margin-bottom:6px;">
        <strong>${safe(p.name || "Project")}</strong>
        ${p.description ? ` — ${safe(short(p.description))}` : ""}
        ${
          p.github
            ? ` — <a href="${safe(p.github)}" target="_blank" style="color:#0645AD;">GitHub</a>`
            : ""
        }
        ${
          p.link
            ? ` — <a href="${safe(p.link)}" target="_blank" style="color:#0645AD;">Live</a>`
            : ""
        }
      </li>`;
        })
        .join("")}
    </ul>
  </div>`
      : ""
  }

  <!-- EDUCATION -->
  ${
    d.education?.some((e) => e.degree || e.institution)
      ? `
  <div style="margin-bottom:8px;">
    <div class="section-title">Education</div>
    ${d.education
      .map((e) => {
        if (!e || (!e.degree && !e.institution)) return "";

        return `
    <div style="margin-bottom:8px;">
      <strong style="font-size:14px;">${safe(e.degree || "Degree")}</strong>
      <div style="font-size:13px;color:#333;">
        ${safe(e.institution || "")}${e.location ? ", " + safe(e.location) : ""}
      </div>
      ${
        e.graduationDate
          ? `<div style="font-size:12px;color:#444;">${safe(e.graduationDate)}</div>`
          : ""
      }
      ${e.gpa ? `<div style="font-size:12px;color:#0a7f5a;">GPA: ${safe(e.gpa)}</div>` : ""}
    </div>`;
      })
      .join("")}
  </div>`
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

  const card =
    "rounded-xl shadow-2xl overflow-hidden " +
    (isDark ? "bg-[#0b1020]/60 border border-teal-400/30" : "bg-white border border-[#e9d5ff]");

  return (
    <div className="space-y-6">
      <div className={card}>
        <div className="p-12 border-b border-teal-400/40">
          <h1 className="text-4xl font-semibold mb-2 text-white">
            {data.personal.fullName || "Your Name"}
          </h1>
        </div>

        {/* === FULL CV HTML PREVIEW === */}
        <div
          className="bg-white text-black p-10 rounded-xl shadow-xl m-10"
          dangerouslySetInnerHTML={{ __html: buildResumeHtml(data) }}
        />
      </div>

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

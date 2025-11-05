"use client";

import React, { useEffect, useState } from "react";
import type { CVData, CvType } from "@/app/components/MenteeCV/create/types";

export default function PreviewStep({
  data,
  cvType,
  onDownload,
  isDark,
}: {
  data: CVData;
  cvType: CvType;
  onDownload: () => void;
  isDark?: boolean;
}) {
  const [userId, setUserId] = useState<string | null>(null);
  const [menteeId, setMenteeId] = useState<string | null>(null);
  const [loading, setLoading] = useState<"save" | "pdf" | "docx" | null>(null);
  const [lastResumeId, setLastResumeId] = useState<string | null>(null);
  const [sessionTried, setSessionTried] = useState(false); 

  useEffect(() => {
    if (sessionTried) return;
    const token =
      typeof window !== "undefined" ? sessionStorage.getItem("token") : null;
    if (!token) {
      setSessionTried(true);
      return;
    }
    (async () => {
      try {
        const r = await fetch("/api/auth/session", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        const j = await r.json();
        if (j?.ok && j?.user) {
          setUserId(j.user.id || null);
          setMenteeId(j.user.menteeId || null);
        }
      } catch {
        // تجاهل
      } finally {
        setSessionTried(true);
      }
    })();
  }, [sessionTried]);

  // ====== Styles ======
  const card =
    "rounded-xl shadow-2xl overflow-hidden " +
    (isDark ? "bg-[#0b1020]/60 border border-teal-400/30" : "bg-white border border-[#e9d5ff]");
  const headerBar = isDark ? "border-b border-teal-400/40" : "border-b-2 border-teal-600/90";
  const sectionTitle = isDark ? "text-teal-300 uppercase tracking-wide" : "text-teal-600 uppercase tracking-wide";
  const subText = isDark ? "text-[#aab3c2]" : "text-gray-600";
  const bodyText = isDark ? "text-[#e7ecf3]" : "text-gray-800";

  // ====== Helpers ======
  const safe = (x?: string) =>
    (x ?? "").replace(/[&<>]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[m]!));

  function buildResumeHtml(d: CVData) {
    return `
<div style="font-family:Arial,system-ui;color:#111;">
  <header>
    <h1 style="margin:0 0 4px;font-size:28px;">${safe(d.personal.fullName || "Your Name")}</h1>
    <p style="margin:0 0 14px;font-size:14px;">
      ${safe(d.personal.email || "")}${
      d.personal.phone ? " · " + safe(d.personal.phone) : ""
    }${d.personal.location ? " · " + safe(d.personal.location) : ""}${
      d.personal.linkedin ? " · " + safe(d.personal.linkedin) : ""
    }${d.personal.portfolio ? " · " + safe(d.personal.portfolio) : ""}
    </p>
  </header>

  ${
    (d.personal.summary || "").trim()
      ? `
  <section style="margin:0 0 14px;">
    <h2 style="margin:0 0 6px;font-size:18px;">Professional Summary</h2>
    <p style="margin:0;">${safe(d.personal.summary!)}</p>
  </section>`
      : ""
  }

  ${
    cvType !== "fresh" && d.experience.some((e) => e.title || e.company)
      ? `
  <section style="margin:0 0 14px;">
    <h2 style="margin:0 0 6px;font-size:18px;">Work Experience</h2>
    ${d.experience
      .map((e) => {
        if (!e.title && !e.company) return "";
        const dates = `${safe(e.startDate || "")}${
          e.startDate && (e.current || e.endDate) ? " — " : ""
        }${e.current ? "Present" : safe(e.endDate || "")}`;
        return `
      <div style="margin:0 0 10px;">
        <div style="display:flex;justify-content:space-between;gap:12px;">
          <strong>${safe(e.title || "Position")}</strong>
          <span style="font-size:12px;color:#666;">${dates}</span>
        </div>
        <div style="font-size:13px;color:#444;">
          ${safe(e.company || "")}${e.location ? ", " + safe(e.location) : ""}
        </div>
        ${
          (e.description || "").trim()
            ? `<div style="white-space:pre-line;font-size:13px;margin-top:4px;">${safe(e.description!)}</div>`
            : ""
        }
      </div>`;
      })
      .join("")}
  </section>`
      : ""
  }

  ${
    d.education.some((e) => e.degree || e.institution)
      ? `
  <section style="margin:0 0 14px;">
    <h2 style="margin:0 0 6px;font-size:18px;">Education</h2>
    ${d.education
      .map((e) => {
        if (!e.degree && !e.institution) return "";
        return `
      <div style="display:flex;justify-content:space-between;margin:0 0 8px;">
        <div>
          <strong>${safe(e.degree || "Degree")}</strong>
          <div style="font-size:13px;color:#444;">
            ${safe(e.institution || "")}${e.location ? ", " + safe(e.location) : ""}
          </div>
          ${e.gpa ? `<div style="font-size:12px;color:#0a7f5a;">GPA: ${safe(e.gpa)}</div>` : ""}
        </div>
        ${e.graduationDate ? `<span style="font-size:12px;color:#666;">${safe(e.graduationDate)}</span>` : ""}
      </div>`;
      })
      .join("")}
  </section>`
      : ""
  }

  ${
    d.skills.technical || d.skills.soft || d.skills.languages
      ? `
  <section style="margin:0 0 6px;">
    <h2 style="margin:0 0 6px;font-size:18px;">Skills</h2>
    <div style="font-size:14px;">
      ${d.skills.technical ? `<div><span style="color:#666;text-transform:uppercase;font-size:12px;">Technical: </span>${safe(d.skills.technical)}</div>` : ""}
      ${d.skills.soft ? `<div><span style="color:#666;text-transform:uppercase;font-size:12px;">Soft Skills: </span>${safe(d.skills.soft)}</div>` : ""}
      ${d.skills.languages ? `<div><span style="color:#666;text-transform:uppercase;font-size:12px;">Languages: </span>${safe(d.skills.languages)}</div>` : ""}
    </div>
  </section>`
      : ""
  }
</div>
`.trim();
  }

  // ====== API actions ======
  async function saveToDB(): Promise<string | null> {
    if (!userId) return null; 
    setLoading("save");
    try {
      const html = buildResumeHtml(data);
      const res = await fetch(`/api/mentees/${userId}/cv`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html,
          role: "Software Engineer",
          source: "fallback",
          parsed: {},
          menteeId: menteeId || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json?.ok) return null;
      const id = json?.resume?._id as string | undefined;
      if (id) setLastResumeId(id || null);
      return id || null;
    } catch {
      return null;
    } finally {
      setLoading(null);
    }
  }

  async function exportNow(format: "pdf" | "docx") {
    if (!userId) return;
    setLoading(format === "pdf" ? "pdf" : "docx");
    try {
      const resumeId = lastResumeId || (await saveToDB());
      if (!resumeId) return;
      const qs = new URLSearchParams();
      qs.set("format", format === "pdf" ? "pdf" : "word");
      qs.set("resumeId", resumeId);
      window.open(`/api/mentees/${userId}/cv?${qs.toString()}`, "_blank");
    } finally {
      setLoading(null);
    }
  }

  // ====== UI ======
  const sessionReady = !!userId; 

  return (
    <div className="space-y-6">
      <div className={card}>
        {/* Header */}
        <div className={`p-12 ${headerBar}`}>
          <h1 className={`text-4xl font-semibold mb-2 ${isDark ? "text-white" : "text-black"}`}>
            {data.personal.fullName || "Your Name"}
          </h1>

          <div className={`flex flex-wrap gap-4 text-sm ${subText}`}>
            {data.personal.email && <span>{data.personal.email}</span>}
            {data.personal.phone && <span>{data.personal.phone}</span>}
            {data.personal.location && <span>{data.personal.location}</span>}
            {data.personal.linkedin && <span>{data.personal.linkedin}</span>}
            {data.personal.portfolio && <span>{data.personal.portfolio}</span>}
          </div>
        </div>

        {/* Projects */}
        {data.projects?.length > 0 && data.projects.some(p => p.name) && (
          <div className="mb-8">
            <h2 className={`text-xl mb-3 ${sectionTitle}`}>Projects</h2>
            <div className="space-y-4">
              {data.projects.map((p, i) => (
                p.name && (
                  <div key={i}>
                    <div className={`text-lg font-medium ${bodyText}`}>{p.name}</div>
                    {p.description && <p className={`${bodyText} text-sm`}>{p.description}</p>}
                    <div className="text-sm mt-1">
                      {p.github && (
                        <a href={p.github} target="_blank" className="text-teal-500 hover:underline">
                          GitHub →
                        </a>
                      )}
                      {p.link && (
                        <a href={p.link} target="_blank" className="text-purple-500 hover:underline ml-3">
                          Live Demo →
                        </a>
                      )}
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        <div className="p-12">
          {/* Summary */}
          {data.personal.summary?.trim() && (
            <div className="mb-8">
              <h2 className={`text-xl mb-3 ${sectionTitle}`}>Professional Summary</h2>
              <p className={`${bodyText} leading-relaxed`}>{data.personal.summary}</p>
            </div>
          )}

          {/* Experience */}
          {cvType !== "fresh" && data.experience.some((e) => e.title || e.company) && (
            <div className="mb-8">
              <h2 className={`text-xl mb-3 ${sectionTitle}`}>Work Experience</h2>
              <div className="space-y-4">
                {data.experience.map((e, i) =>
                  e.title || e.company ? (
                    <div key={i}>
                      <div className="flex justify-between">
                        <h3 className={`text-lg font-medium ${bodyText}`}>{e.title || "Position"}</h3>
                        <span className={`text-sm ${subText}`}>
                          {e.startDate}
                          {e.startDate && (e.current || e.endDate) ? " — " : ""}
                          {e.current ? "Present" : e.endDate}
                        </span>
                      </div>
                      <p className={subText}>
                        {e.company}
                        {e.location ? `, ${e.location}` : ""}
                      </p>
                      {e.description && (
                        <p className={`${bodyText} text-sm whitespace-pre-line mt-1`}>{e.description}</p>
                      )}
                    </div>
                  ) : null
                )}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education.some((e) => e.degree || e.institution) && (
            <div className="mb-8">
              <h2 className={`text-xl mb-3 ${sectionTitle}`}>Education</h2>
              <div className="space-y-3">
                {data.education.map((e, i) =>
                  e.degree || e.institution ? (
                    <div key={i} className="flex justify-between">
                      <div>
                        <h3 className={`text-lg font-medium ${bodyText}`}>{e.degree || "Degree"}</h3>
                        <p className={subText}>
                          {e.institution}
                          {e.location ? `, ${e.location}` : ""}
                        </p>
                        {e.gpa && <p className="text-sm text-emerald-600">GPA: {e.gpa}</p>}
                      </div>
                      {e.graduationDate && <span className={`text-sm ${subText}`}>{e.graduationDate}</span>}
                    </div>
                  ) : null
                )}
              </div>
            </div>
          )}

          {/* Skills */}
          {(data.skills.technical || data.skills.soft || data.skills.languages) && (
            <div>
              <h2 className={`text-xl mb-3 ${sectionTitle}`}>Skills</h2>
              <div className={`space-y-2 ${bodyText}`}>
                {data.skills.technical && (
                  <div>
                    <span className={`text-sm uppercase tracking-wide mr-2 ${subText}`}>Technical:</span>
                    {data.skills.technical}
                  </div>
                )}
                {data.skills.soft && (
                  <div>
                    <span className={`text-sm uppercase tracking-wide mr-2 ${subText}`}>Soft Skills:</span>
                    {data.skills.soft}
                  </div>
                )}
                {data.skills.languages && (
                  <div>
                    <span className={`text-sm uppercase tracking-wide mr-2 ${subText}`}>Languages:</span>
                    {data.skills.languages}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap justify-end gap-3">
        <button
          onClick={saveToDB}
          disabled={!sessionReady || loading !== null}
          title={!sessionReady ? "Sign in required" : undefined}
          className={
            "px-5 py-2 rounded-lg font-medium transition " +
            (isDark ? "bg-emerald-400 text-[#0b1020] hover:bg-emerald-300" : "bg-emerald-600 text-white hover:bg-emerald-700") +
            ((!sessionReady || loading) ? " opacity-60 cursor-not-allowed" : "")
          }
        >
          {loading === "save" ? "Saving..." : "Save to Database"}
        </button>

        <button
          onClick={() => exportNow("pdf")}
          disabled={!sessionReady || loading !== null}
          title={!sessionReady ? "Sign in required" : undefined}
          className={
            "px-5 py-2 rounded-lg font-medium transition " +
            (isDark ? "bg-teal-400 text-[#0b1020] hover:bg-teal-300" : "bg-teal-600 text-white hover:bg-teal-700") +
            ((!sessionReady || loading) ? " opacity-60 cursor-not-allowed" : "")
          }
        >
          {loading === "pdf" ? "Exporting PDF..." : "Export PDF"}
        </button>

        <button
          onClick={() => exportNow("docx")}
          disabled={!sessionReady || loading !== null}
          title={!sessionReady ? "Sign in required" : undefined}
          className={
            "px-5 py-2 rounded-lg font-medium transition " +
            (isDark ? "bg-purple-400 text-[#0b1020] hover:bg-purple-300" : "bg-purple-600 text-white hover:bg-purple-700") +
            ((!sessionReady || loading) ? " opacity-60 cursor-not-allowed" : "")
          }
        >
          {loading === "docx" ? "Exporting DOCX..." : "Export DOCX"}
        </button>
      </div>
    </div>
  );
}

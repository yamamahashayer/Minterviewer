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

  // -------- session fetch once --------
  useEffect(() => {
    if (sessionTried) return;
    const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null;
    if (!token) { setSessionTried(true); return; }
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
      } catch {/* ignore */} finally { setSessionTried(true); }
    })();
  }, [sessionTried]);

  // -------- styles --------
  const card =
    "rounded-xl shadow-2xl overflow-hidden " +
    (isDark ? "bg-[#0b1020]/60 border border-teal-400/30" : "bg-white border border-[#e9d5ff]");
  const headerBar = isDark ? "border-b border-white/10" : "border-b border-[#e9d5ff]";
  const sectionTitle =
    "text-sm font-semibold tracking-wide uppercase " +
    (isDark ? "text-teal-300" : "text-teal-700");
  const subText = isDark ? "text-[#aab3c2]" : "text-gray-600";
  const bodyText = isDark ? "text-[#e7ecf3]" : "text-gray-800";

  // -------- helpers --------
  const safe = (s?: string) =>
    (s ?? "").replace(/[&<>]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[m]!));

  const contactLine = [
    data.personal.email,
    data.personal.phone,
    data.personal.location,
    data.personal.linkedin,
    data.personal.portfolio,
  ]
    .filter(Boolean)
    .join(" • ");

  function buildResumeHtml(d: CVData) {
    return `
<div style="font-family:Arial,system-ui;color:#111;">
  <header>
    <h1 style="margin:0 0 4px;font-size:28px;">${safe(d.personal.fullName || "Your Name")}</h1>
    <p style="margin:0 0 14px;font-size:14px;">${safe(contactLine)}</p>
  </header>

  ${d.personal.summary?.trim() ? `
  <section style="margin:0 0 14px;">
    <h2 style="margin:0 0 6px;font-size:18px;">Professional Summary</h2>
    <p style="margin:0;">${safe(d.personal.summary!)}</p>
  </section>` : ""}

  ${(d.skills.technical || d.skills.soft || d.skills.languages) ? `
  <section style="margin:0 0 12px;">
    <h2 style="margin:0 0 6px;font-size:18px;">Skills</h2>
    ${d.skills.technical ? `<div><b>Technical:</b> ${safe(d.skills.technical)}</div>` : ""}
    ${d.skills.soft ? `<div><b>Soft Skills:</b> ${safe(d.skills.soft)}</div>` : ""}
    ${d.skills.languages ? `<div><b>Languages:</b> ${safe(d.skills.languages)}</div>` : ""}
  </section>` : ""}

  ${d.projects?.some(p=>p.name) ? `
  <section style="margin:0 0 12px;">
    <h2 style="margin:0 0 6px;font-size:18px;">Projects</h2>
    ${d.projects.map(p => p.name ? `
      <div style="margin:0 0 8px;">
        <div style="font-weight:600">${safe(p.name)}</div>
        ${p.description ? `<div style="font-size:13px">${safe(p.description)}</div>` : ""}
        <div style="font-size:12px;margin-top:2px">
          ${p.github ? `<a href="${safe(p.github)}" target="_blank">GitHub</a>` : ""}
          ${p.github && p.link ? " • " : ""}
          ${p.link ? `<a href="${safe(p.link)}" target="_blank">Live Demo</a>` : ""}
        </div>
      </div>` : "").join("")}
  </section>` : ""}

  ${d.experience.some(e => e.title || e.company) ? `
  <section style="margin:0 0 12px;">
    <h2 style="margin:0 0 6px;font-size:18px;">Work Experience</h2>
    ${d.experience.map(e => (e.title || e.company) ? `
      <div style="margin:0 0 10px;">
        <div style="display:flex;justify-content:space-between;gap:12px;">
          <strong>${safe(e.title || "Position")}</strong>
          <span style="font-size:12px;color:#666;">
            ${safe(e.startDate || "")}${e.startDate && (e.current || e.endDate) ? " — " : ""}${e.current ? "Present" : safe(e.endDate || "")}
          </span>
        </div>
        <div style="font-size:13px;color:#444;">
          ${safe(e.company || "")}${e.location ? ", " + safe(e.location) : ""}
        </div>
        ${e.description ? `<div style="white-space:pre-line;font-size:13px;margin-top:4px;">${safe(e.description)}</div>` : ""}
      </div>` : "").join("")}
  </section>` : ""}

  ${d.education.some(e => e.degree || e.institution) ? `
  <section style="margin:0 0 6px;">
    <h2 style="margin:0 0 6px;font-size:18px;">Education</h2>
    ${d.education.map(e => (e.degree || e.institution) ? `
      <div style="display:flex;justify-content:space-between;margin:0 0 8px;">
        <div>
          <strong>${safe(e.degree || "Degree")}</strong>
          <div style="font-size:13px;color:#444;">${safe(e.institution || "")}${e.location ? ", " + safe(e.location) : ""}</div>
          ${e.gpa ? `<div style="font-size:12px;color:#0a7f5a;">GPA: ${safe(e.gpa)}</div>` : ""}
        </div>
        ${e.graduationDate ? `<span style="font-size:12px;color:#666;">${safe(e.graduationDate)}</span>` : ""}
      </div>` : "").join("")}
  </section>` : ""}
</div>
`.trim();
  }

  // -------- api actions --------
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
          source: "builder",
          parsed: {},
          menteeId: menteeId || undefined,
        }),
      });
      const j = await res.json();
      if (!res.ok || !j?.ok) return null;
      const id = (j?.resume?._id as string) || null;
      setLastResumeId(id);
      return id;
    } catch {
      return null;
    } finally {
      setLoading(null);
    }
  }

  async function exportNow(format: "pdf" | "docx") {
    if (!userId) return;
    setLoading(format);
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

  const sessionReady = !!userId;

  // -------- UI --------
  return (
    <div className="space-y-6">
      {/* CV Card */}
      <div className={card}>
        {/* Header */}
        <div className={`px-10 py-8 ${headerBar}`}>
          <h1 className={`text-4xl font-semibold mb-2 ${isDark ? "text-white" : "text-black"}`}>
            {data.personal.fullName || "Your Name"}
          </h1>
          <div className={`text-sm ${subText}`}>{contactLine || "email • phone • location"}</div>
        </div>

        {/* Body (ordered cleanly) */}
        <div className="px-10 py-8 space-y-8">
          {/* Summary */}
          {data.personal.summary?.trim() && (
            <section>
              <h2 className={sectionTitle}>Professional Summary</h2>
              <p className={`${bodyText} leading-relaxed mt-2`}>{data.personal.summary}</p>
            </section>
          )}

          {/* Skills */}
          {(data.skills.technical || data.skills.soft || data.skills.languages) && (
            <section>
              <h2 className={sectionTitle}>Skills</h2>
              <div className={`mt-2 space-y-1 ${bodyText}`}>
                {data.skills.technical && (
                  <div>
                    <span className={`text-xs uppercase tracking-wide mr-2 ${subText}`}>Technical:</span>
                    {data.skills.technical}
                  </div>
                )}
                {data.skills.soft && (
                  <div>
                    <span className={`text-xs uppercase tracking-wide mr-2 ${subText}`}>Soft Skills:</span>
                    {data.skills.soft}
                  </div>
                )}
                {data.skills.languages && (
                  <div>
                    <span className={`text-xs uppercase tracking-wide mr-2 ${subText}`}>Languages:</span>
                    {data.skills.languages}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Projects */}
          {data.projects?.length > 0 && data.projects.some((p) => p.name) && (
            <section>
              <h2 className={sectionTitle}>Projects</h2>
              <div className="mt-2 space-y-4">
                {data.projects.map(
                  (p, i) =>
                    p.name && (
                      <div key={i}>
                        <div className={`text-lg font-medium ${bodyText}`}>{p.name}</div>
                        {p.description && (
                          <p className={`${bodyText} text-sm mt-1`}>{p.description}</p>
                        )}
                        <div className="text-sm mt-1">
                          {p.github && (
                            <a href={p.github} target="_blank" className="text-teal-500 hover:underline">
                              GitHub →
                            </a>
                          )}
                          {p.github && p.link ? <span className={`mx-2 ${subText}`}>•</span> : null}
                          {p.link && (
                            <a href={p.link} target="_blank" className="text-purple-500 hover:underline">
                              Live Demo →
                            </a>
                          )}
                        </div>
                      </div>
                    )
                )}
              </div>
            </section>
          )}

          {/* Work Experience */}
          {data.experience.some((e) => e.title || e.company) && (
            <section>
              <h2 className={sectionTitle}>Work Experience</h2>
              <div className="mt-2 space-y-4">
                {data.experience.map(
                  (e, i) =>
                    (e.title || e.company) && (
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
                    )
                )}
              </div>
            </section>
          )}

          {/* Education */}
          {data.education.some((e) => e.degree || e.institution) && (
            <section>
              <h2 className={sectionTitle}>Education</h2>
              <div className="mt-2 space-y-3">
                {data.education.map(
                  (e, i) =>
                    (e.degree || e.institution) && (
                      <div key={i} className="flex justify-between">
                        <div>
                          <h3 className={`text-lg font-medium ${bodyText}`}>{e.degree || "Degree"}</h3>
                          <p className={subText}>
                            {e.institution}
                            {e.location ? `, ${e.location}` : ""}
                          </p>
                          {e.gpa && <p className="text-sm text-emerald-600">GPA: {e.gpa}</p>}
                        </div>
                        {e.graduationDate && (
                          <span className={`text-sm ${subText}`}>{e.graduationDate}</span>
                        )}
                      </div>
                    )
                )}
              </div>
            </section>
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
          {loading === "save" ? "Saving…" : "Save"}
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
          {loading === "pdf" ? "Generating…" : "Download PDF"}
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
          {loading === "docx" ? "Generating…" : "Download DOCX"}
        </button>
      </div>
    </div>
  );
}

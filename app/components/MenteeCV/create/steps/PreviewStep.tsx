"use client";

import React, { useEffect, useState } from "react";
import type { CVData, CvType } from "@/app/components/MenteeCV/create/types";
import { FileDown, FileText, Save } from "lucide-react";

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
  const short = (s?: string, n = 140) => {
    if (!s) return "";
    const t = String(s).replace(/\s+/g, " ").trim();
    return t.length > n ? t.slice(0, n - 1) + "…" : t;
  };

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
    d.skills.technical || d.skills.soft || d.skills.languages
      ? `
  <section style="margin:0 0 14px;">
    <h2 style="margin:0 0 6px;font-size:18px;">Skills</h2>
    <div style="font-size:14px;">
      ${d.skills.technical ? `<div><span style="color:#666;text-transform:uppercase;font-size:12px;">Technical: </span>${safe(d.skills.technical)}</div>` : ""}
      ${d.skills.soft ? `<div><span style="color:#666;text-transform:uppercase;font-size:12px;">Soft Skills: </span>${safe(d.skills.soft)}</div>` : ""}
      ${d.skills.languages ? `<div><span style="color:#666;text-transform:uppercase;font-size:12px;">Languages: </span>${safe(d.skills.languages)}</div>` : ""}
    </div>
  </section>`
      : ""
  }

  ${
    Array.isArray(d.projects) && d.projects.some(p => (p?.name || p?.description || p?.github || p?.link))
      ? `
  <section style="margin:0 0 14px;">
    <h2 style="margin:0 0 6px;font-size:18px;">Projects</h2>
    <div style="border-top:1px solid #ccc;margin:0 0 6px;"></div>
    <ul style="margin:0;padding-left:18px;list-style:disc;">
      ${d.projects.map((p:any) => {
        if (!p || !(p.name || p.description || p.github || p.link)) return "";
        const stack =
          Array.isArray(p.stack) ? p.stack :
          (typeof p.stack === "string"
            ? p.stack.split(/[,\u061B;]/).map((s:string)=>s.trim()).filter(Boolean)
            : []);
        const parts:string[] = [];
        parts.push('<span style="font-weight:600;color:#111;">'+safe(p.name || "Untitled project")+'</span>');
        if (p.description) parts.push(' — '+safe(short(p.description)));
        if (stack.length) parts.push('. <span style="color:#555;">Tech:</span> '+safe(stack.slice(0,6).join(", ")));
        const links:string[] = [];
        if (p.github) links.push('<a href="'+safe(p.github)+'" target="_blank" style="color:#333;text-decoration:underline;">[GitHub]</a>');
        if (p.link)   links.push('<a href="'+safe(p.link)+'" target="_blank" style="color:#333;text-decoration:underline;">[Live]</a>');
        if (links.length) parts.push('. '+links.join(' '));
        return '<li style="font-size:13px;line-height:1.35;color:#111;margin:0 0 4px;">'+parts.join('')+'</li>';
      }).join("")}
    </ul>
  </section>`
      : ""
  }

  ${
    d.experience && d.experience.some((e) => e.title || e.company)
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
    d.education && d.education.some((e) => e.degree || e.institution)
      ? `
  <section style="margin:0 0 6px;">
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
</div>
`.trim();
}


  // ====== API actions ======
async function saveToDB(): Promise<string | null> {
    if (!userId) {
      alert("Sign in required");
      return null;
    }
    setLoading("save");
    try {
      const html = buildResumeHtml(data);

      const res = await fetch(`/api/mentees/${userId}/cv/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html,
          parsed: {},
          menteeId: menteeId || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json?.ok) {
        alert(json?.error || "Save failed");
        return null;
      }
      const id = json?.resume?._id as string | undefined;
      if (id) setLastResumeId(id || null);
      return id || null;
    } catch {
      alert("Save failed");
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
      window.open(`/api/mentees/${userId}/cv/create?${qs.toString()}`, "_blank");
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


        <div className="p-12">
          {/* Summary */}
          {data.personal.summary?.trim() && (
            <div className="mb-8">
              <h2 className={`text-xl mb-3 ${sectionTitle}`}>Professional Summary</h2>
              <p className={`${bodyText} leading-relaxed`}>{data.personal.summary}</p>
            </div>
          )}
        {/* Experience */}
        {Array.isArray(data.experience) &&
          data.experience.some((e) => e?.title || e?.company) && (
            <div className="mt-8 mb-8">
              <h2 className={`text-xl mb-3 ${sectionTitle}`}>Work Experience</h2>
              <div className="space-y-4">
                {data.experience.map((e, i) => {
                  if (!e || (!e.title && !e.company)) return null;

                  const range =
                    (e.startDate ? e.startDate : "") +
                    (e.startDate && (e.current || e.endDate) ? " — " : "") +
                    (e.current ? "Present" : (e.endDate ?? ""));

                  return (
                    <div key={i}>
                      <div className="flex justify-between gap-3">
                        <h3 className={`text-lg font-medium ${bodyText}`}>
                          {e.title || "Position"}
                        </h3>
                        {range.trim() && (
                          <span className={`text-sm ${subText}`}>{range}</span>
                        )}
                      </div>

                      {(e.company || e.location) && (
                        <p className={subText}>
                          {e.company}
                          {e.location ? `, ${e.location}` : ""}
                        </p>
                      )}

                      {e.description?.trim() && (
                        <p className={`${bodyText} text-sm whitespace-pre-line mt-1`}>
                          {e.description}
                        </p>
                      )}
                    </div>
                  );
                })}
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


          {/* Projects – same level & formal */}
          {Array.isArray(data.projects) &&
            data.projects.some(p => (p?.name || p?.description || p?.github || p?.link)) && (
          <div className="mt-10 mb-8">
                <h2 className={`text-xl mb-3 ${sectionTitle}`}>Projects</h2>

                <ul className={`list-disc pl-5 space-y-1 ${bodyText}`}>
                  {data.projects.map((p, i) => {
                    if (!p || !(p.name || p.description || p.github || p.link)) return null;

                    const stack =
                      Array.isArray(p.stack) ? p.stack :
                      (typeof p.stack === "string"
                        ? p.stack.split(/[,\u061B;]/).map((s:string)=>s.trim()).filter(Boolean)
                        : []);

                    const short = (s?: string, n = 140) => {
                      if (!s) return "";
                      const t = s.replace(/\s+/g, " ").trim();
                      return t.length > n ? t.slice(0, n - 1) + "…" : t;
                    };

                    return (
                      <li key={i} className="text-sm leading-tight">
                        <span className="font-semibold">{p.name || "Untitled project"}</span>
                        {p.description ? <> — {short(p.description)}</> : null}
                        {stack.length ? (
                          <>. <span className={`${subText}`}>Tech:</span> {stack.slice(0, 6).join(", ")}</>
                        ) : null}
                        {(p.github || p.link) && (
                          <>
                            . {p.github ? (
                              <a href={p.github} target="_blank" rel="noreferrer" className="underline">
                                [GitHub]
                              </a>
                            ) : null}
                            {p.github && p.link ? " " : null}
                            {p.link ? (
                              <a href={p.link} target="_blank" rel="noreferrer" className="underline">
                                [Live]
                              </a>
                            ) : null}
                          </>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
          )}


        </div>
      </div>


      {/* Actions
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
      </div> */}


        {/* Actions */}
<div className="mt-8 flex justify-center">
  <div className="flex flex-wrap gap-2">

    {/* Save */}
    <button
      onClick={saveToDB}
      disabled={!sessionReady || loading !== null}
      className={
        "inline-flex items-center gap-1 px-4 py-1.5 text-sm font-medium rounded-md transition-all backdrop-blur " +
        "shadow-sm hover:shadow active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed " +
        (isDark
          ? "bg-emerald-400/20 text-emerald-200 hover:bg-emerald-400/30 border border-emerald-300/30"
          : "bg-emerald-600/10 text-emerald-700 hover:bg-emerald-600/20 border border-emerald-600/30")
      }
    >
      <Save className="w-4 h-4" />
      {loading === "save" ? "Saving..." : "Save"}
    </button>

    {/* PDF */}
    <button
      onClick={() => exportNow("pdf")}
      disabled={!sessionReady || loading !== null}
      className={
        "inline-flex items-center gap-1 px-4 py-1.5 text-sm font-medium rounded-md transition-all backdrop-blur " +
        "shadow-sm hover:shadow active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed " +
        (isDark
          ? "bg-teal-400/20 text-teal-200 hover:bg-teal-400/30 border border-teal-300/30"
          : "bg-teal-600/10 text-teal-700 hover:bg-teal-600/20 border border-teal-600/30")
      }
    >
      <FileText className="w-4 h-4" />
      {loading === "pdf" ? "Exporting..." : "PDF"}
    </button>

    {/* DOCX */}
    <button
      onClick={() => exportNow("docx")}
      disabled={!sessionReady || loading !== null}
      className={
        "inline-flex items-center gap-1 px-4 py-1.5 text-sm font-medium rounded-md transition-all backdrop-blur " +
        "shadow-sm hover:shadow active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed " +
        (isDark
          ? "bg-purple-400/20 text-purple-200 hover:bg-purple-400/30 border border-purple-300/30"
          : "bg-purple-600/10 text-purple-700 hover:bg-purple-600/20 border border-purple-600/30")
      }
    >
      <FileDown className="w-4 h-4" />
      {loading === "docx" ? "Exporting..." : "DOCX"}
    </button>

  </div>
</div>



    </div>
  
  );
}

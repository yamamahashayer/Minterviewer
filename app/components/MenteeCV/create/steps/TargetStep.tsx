"use client";

import React from "react";
import { Target } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import type { CvType } from "@/app/components/MenteeCV/create/types";

type JDMode = "paste" | "upload" | "url";

const ROLE_OPTIONS = [
  "Frontend Developer","Backend Developer","Full-Stack Engineer","Mobile Developer",
  "Data Analyst","Data Scientist","ML Engineer","DevOps Engineer","Cloud Engineer",
  "QA Engineer","Product Manager","UI/UX Designer","Other"
];

export default function TargetStep({
  cvType,
  setCvType,
  targetRole,
  setTargetRole,
  jobDescription,
  setJobDescription,
  isDark,
}: {
  cvType: CvType;
  setCvType: (t: CvType) => void;
  targetRole: string;
  setTargetRole: (v: string) => void;
  jobDescription: string;
  setJobDescription: (v: string) => void;
  isDark: boolean;
}) {
  const [jdMode, setJdMode] = React.useState<JDMode>("paste");
  const [jdFile, setJdFile] = React.useState<File | null>(null);
  const [jdUrl, setJdUrl] = React.useState("");

  const [rolePickerOpen, setRolePickerOpen] = React.useState(false);
  const [roleQuery, setRoleQuery] = React.useState("");
  const [showCustomRole, setShowCustomRole] = React.useState(false);

  function handleJdFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    setJdFile(f);
  }

  async function extractFromFile() {
    if (!jdFile) return;
    if (jdFile.type === "text/plain") {
      const txt = await jdFile.text();
      setJobDescription(txt);
    } else {
      alert("Hook: /api/jd/parse لاستخراج النص من PDF/DOCX");
    }
  }

  async function fetchJdFromUrl() {
    if (!jdUrl.trim()) return;
    alert("Hook: /api/jd/fetch لجلب توصيف الوظيفة من الرابط");
  }

  const wrap = `rounded-xl p-8 backdrop-blur-sm border ${
    isDark
      ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border-[rgba(94,234,212,0.2)]"
      : "bg-white shadow-lg border-[#ddd6fe]"
  }`;

  return (
    <div className={wrap}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-12 h-12 rounded-lg border flex items-center justify-center ${isDark ? "bg-teal-500/20 border-teal-500/30" : "bg-purple-100 border-purple-300"}`}>
          <Target className={isDark ? "text-teal-400" : "text-purple-600"} size={24} />
        </div>
        <div>
          <h2 className={`${isDark ? "text-white" : "text-[#2e1065]"} font-semibold`}>
            Targeting Details {cvType === "role" ? "(Role-Based)" : "(Job-Based)"}
          </h2>
          <p className={`${isDark ? "text-[#99a1af]" : "text-[#6b21a8]"} text-sm`}>
            وفّري معلومات الاستهداف عشان نخصّص الـ CV.
          </p>
        </div>
      </div>

      {/* Toggle Role/Job */}
      <div className="mb-4">
        <div className={`inline-flex rounded-lg border overflow-hidden ${isDark ? "border-[rgba(94,234,212,0.25)]" : "border-[#e9d5ff]"}`}>
          {(["role", "job"] as CvType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setCvType(t)}
              className={`px-4 py-2 text-sm ${
                cvType === t
                  ? isDark ? "bg-teal-500/20 text-teal-200" : "bg-purple-100 text-purple-700"
                  : isDark ? "bg-transparent text-[#aab3c2]" : "bg-white text-[#6b21a8]"
              }`}
            >
              {t === "role" ? "Role-Based" : "Job-Based"}
            </button>
          ))}
        </div>
      </div>

      {/* ROLE-BASED */}
      {cvType === "role" && (
        <div className="space-y-2">
          <Label className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} font-medium`}>Target Role *</Label>

          <div className="relative">
            <button
              type="button"
              onClick={() => setRolePickerOpen(v => !v)}
              className={`w-full text-left px-4 py-3 rounded-lg border ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}`}
            >
              {targetRole || (showCustomRole ? "Enter a custom role…" : "Select or type a role…")}
            </button>

            {rolePickerOpen && (
              <div className={`absolute z-10 mt-2 w-full rounded-xl border p-2 ${isDark ? "bg-[#0b1220] border-[rgba(94,234,212,0.25)]" : "bg-white border-[#e9d5ff]"} shadow-lg`}>
                <Input
                  autoFocus
                  placeholder="Search roles…"
                  value={roleQuery}
                  onChange={(e) => setRoleQuery(e.target.value)}
                  className={isDark ? "w-full mb-2 bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.25)] text-white" : "w-full mb-2 bg-white border-[#ddd6fe] text-[#2e1065]"}
                />
                <div className="max-h-56 overflow-auto space-y-1">
                  {ROLE_OPTIONS.filter(r => r.toLowerCase().includes(roleQuery.toLowerCase()))
                    .slice(0, 40)
                    .map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => {
                          if (r === "Other") { setTargetRole(""); setShowCustomRole(true); }
                          else { setTargetRole(r); setShowCustomRole(false); }
                          setRolePickerOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md ${isDark ? "hover:bg-[rgba(255,255,255,0.06)] text-[#d1d5dc]" : "hover:bg-purple-50 text-[#2e1065]"}`}
                      >
                        {r}
                      </button>
                    ))}
                </div>

                <div className="mt-2 flex gap-2">
                  <Input
                    placeholder="Or type a custom role…"
                    value={targetRole}
                    onChange={(e) => { setTargetRole(e.target.value); if (e.target.value) setShowCustomRole(true); }}
                    className={isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}
                  />
                  <Button onClick={() => setRolePickerOpen(false)}>OK</Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {ROLE_OPTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  if (s === "Other") { setTargetRole(""); setShowCustomRole(true); }
                  else { setTargetRole(s); setShowCustomRole(false); }
                  setRolePickerOpen(false);
                }}
                className={`px-3 py-1 rounded-lg text-xs border ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.25)] text-[#cdeffd]" : "bg-white border-[#e9d5ff] text-[#6b21a8]"}`}
              >
                + {s}
              </button>
            ))}
          </div>

          {showCustomRole && (
            <div className="pt-2">
              <Label className={`${isDark ? "text-[#cbd5e1]" : "text-[#3b0764]"} text-sm`}>Enter Custom Role *</Label>
              <Input
                placeholder="e.g., Robotics Engineer / Research Assistant / Social Media Specialist"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className={isDark ? "mt-1 bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "mt-1 bg-white border-[#ddd6fe] text-[#2e1065]"}
              />
            </div>
          )}

          {!targetRole.trim() && <p className="text-xs text-rose-500">This field is required for Role-Based.</p>}
        </div>
      )}

      {/* JOB-BASED */}
      {cvType === "job" && (
        <div className="space-y-3">
          <Label className={`${isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"} font-medium`}>Job Description *</Label>

          <div className={`inline-flex rounded-lg border overflow-hidden ${isDark ? "border-[rgba(94,234,212,0.25)]" : "border-[#e9d5ff]"}`}>
            {(["paste", "upload", "url"] as JDMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setJdMode(m)}
                className={`px-4 py-2 text-sm ${
                  jdMode === m
                    ? isDark ? "bg-teal-500/20 text-teal-200" : "bg-purple-100 text-purple-700"
                    : isDark ? "bg-transparent text-[#aab3c2]" : "bg-white text-[#6b21a8]"
                }`}
              >
                {m === "paste" ? "Paste" : m === "upload" ? "Upload" : "URL"}
              </button>
            ))}
          </div>

          {jdMode === "paste" && (
            <>
              <Textarea
                placeholder="Paste the full job description here…"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className={`min-h-[160px] ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}`}
              />
              <div className="flex items-center justify-between text-xs opacity-70">
                <span>{jobDescription.length} chars</span>
                <Button variant="outline" onClick={() => setJobDescription(prev => prev.trim())}>
                  Clean text
                </Button>
              </div>
            </>
          )}

          {jdMode === "upload" && (
            <div className={`p-4 rounded-lg border ${isDark ? "border-[rgba(94,234,212,0.25)]" : "border-[#e9d5ff]"}`}>
              <input type="file" accept=".pdf,.txt,.doc,.docx" onChange={handleJdFile} className="block w-full text-sm" />
              {jdFile && (
                <div className="mt-3 flex items-center gap-3 text-sm">
                  <span className="font-medium">{jdFile.name}</span>
                  <Button size="sm" onClick={extractFromFile} className="bg-gradient-to-r from-teal-400 to-emerald-400 text-[#0a0f1e]">
                    Extract
                  </Button>
                </div>
              )}
              {!!jobDescription && (
                <Textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className={`mt-3 min-h-[140px] ${isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}`}
                />
              )}
            </div>
          )}

          {jdMode === "url" && (
            <div className="flex gap-2">
              <Input
                placeholder="https://company.com/careers/job-123"
                value={jdUrl}
                onChange={(e) => setJdUrl(e.target.value)}
                className={isDark ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white" : "bg-white border-[#ddd6fe] text-[#2e1065]"}
              />
              <Button onClick={fetchJdFromUrl}>Fetch</Button>
            </div>
          )}

          {!jobDescription.trim() && <p className="text-xs text-rose-500">Job description is required for Job-Based.</p>}
        </div>
      )}
    </div>
  );
}

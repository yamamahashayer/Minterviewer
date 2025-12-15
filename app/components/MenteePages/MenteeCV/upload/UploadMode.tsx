"use client";

import { useEffect, useRef, useState } from "react";
import {
  Upload,
  RefreshCw,
  ArrowLeft,
  Info,
  Brain,
  UploadCloud,
  FileText,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";

type Props = {
  isDark?: boolean;
  onBack?: () => void;
  onSuccess?: (result: any) => void;
};

const MAX_MB = 5;
const ACCEPT = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

type MsgKind = "ok" | "warn" | "err";

export default function UploadCV({
  isDark = true,
  onBack,
  onSuccess,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [msg, setMsg] = useState("");
  const [msgKind, setMsgKind] = useState<MsgKind>("ok");

  const [menteeId, setMenteeId] = useState<string | null>(null);
  const [userNotes, setUserNotes] = useState("");

  /* ================= menteeId ================= */
  useEffect(() => {
    const cached = sessionStorage.getItem("menteeId");
    if (cached) {
      setMenteeId(cached);
      return;
    }

    const token = sessionStorage.getItem("token");
    if (!token) return;

    (async () => {
      const res = await fetch("/api/auth/session", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const data = await res.json();

      const mid =
        data?.mentee?._id ||
        data?.user?.mentee?._id ||
        data?.user?.menteeId ||
        data?.menteeId ||
        null;

      if (mid) {
        sessionStorage.setItem("menteeId", mid);
        setMenteeId(mid);
      }
    })();
  }, []);

  /* ================= Helpers ================= */
  function pickFile() {
    inputRef.current?.click();
  }

  function validate(f: File) {
    const okMime = ACCEPT.includes(f.type);
    const ext = f.name.split(".").pop()?.toLowerCase();
    const okExt = ["pdf", "doc", "docx"].includes(ext || "");
    if (!(okMime || okExt)) return "Only PDF, DOC, DOCX are allowed.";
    if (f.size > MAX_MB * 1024 * 1024) return `Max size is ${MAX_MB}MB.`;
    return "";
  }

  function handleChosen(f?: File) {
    if (!f) return;
    const m = validate(f);
    if (m) {
      setMsgKind("warn");
      setMsg(m);
      setFile(null);
      return;
    }
    setMsg("");
    setFile(f);
  }

  /* ================= Upload ================= */
  async function sendToAffinda() {
    if (isProcessing || !file || !menteeId) return;
    setIsProcessing(true);

    try {
      setLoading(true);
      setMsg("");

      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch(`/api/mentees/${menteeId}/cv/upload`, {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Upload failed");

      await runAiAnalysisAfterUpload(data.resumeId);
    } catch (e: any) {
      setMsgKind("err");
      setMsg(e.message || "Upload error");
    } finally {
      setLoading(false);
      setIsProcessing(false);
    }
  }

  /* ================= AI ================= */
  async function runAiAnalysisAfterUpload(resumeId: string) {
    try {
      setAiLoading(true);
      setMsgKind("ok");
      setMsg("Analyzing your CV using AI...");

      const token = sessionStorage.getItem("token");

      const parsed = await fetch(
        `/api/mentees/${menteeId}/cv/parsed?resumeId=${resumeId}`
      ).then((r) => r.json());

      const res = await fetch(`/api/mentees/${menteeId}/cv/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          resumeId,
          affindaJson: parsed,
          userNotes: userNotes || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "AI analysis failed");

      setMsg("✅ AI analysis completed successfully!");
      onSuccess?.(json);
    } catch (e: any) {
      setMsgKind("err");
      setMsg(e.message || "AI analysis error");
    } finally {
      setAiLoading(false);
    }
  }

  /* ================= UI ================= */
  return (
    <div
      className={`min-h-screen p-8 ${
        isDark
          ? "bg-gradient-to-b from-[#0a0f1e] to-black text-white"
          : "bg-[#f5f3ff] text-[#2e1065]"
      }`}
    >
      {/* Header */}
      <div
        className={`mb-8 rounded-xl border p-6 ${
          isDark
            ? "bg-white/5 border-white/10"
            : "bg-white border-[#e9d5ff]"
        }`}
      >
        <div className="flex items-center justify-between">
          <h1
            className={`text-2xl font-bold ${
              isDark
                ? "bg-gradient-to-r from-teal-300 to-emerald-300 text-transparent bg-clip-text"
                : "text-[#2e1065]"
            }`}
          >
            Upload your CV
          </h1>

          {onBack && (
            <Button
              onClick={onBack}
             className={
              isDark
                ? "bg-teal-400 text-[#0a0f1e] hover:bg-teal-300"
                : "bg-purple-600 hover:bg-purple-700 text-white"
            }
            >
              <ArrowLeft size={16} className="mr-2" /> Back
            </Button>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div
        className={`max-w-3xl mx-auto mb-6 rounded-xl border p-5 transition-shadow ${
          isDark
            ? "bg-white/5 border-white/10 text-[#a8b3cf] hover:shadow-[0_0_0_1px_rgba(45,212,191,0.25)]"
            : "bg-white border-[#e9d5ff] text-[#6b21a8] hover:shadow-md"
        }`}
      >
        <h3
          className={`font-semibold mb-3 ${
            isDark ? "text-teal-300" : "text-purple-700"
          }`}
        >
          How it works
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${isDark ? "bg-teal-500/20" : "bg-purple-100"}`}>
              <FileText size={16} />
            </div>
            <p>
              Upload your CV <br />
              <span className="opacity-70">PDF or DOCX format</span>
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${isDark ? "bg-teal-500/20" : "bg-purple-100"}`}>
              <UploadCloud size={16} />
            </div>
            <p>
              Add optional notes <br />
              <span className="opacity-70">Job title or focus area</span>
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${isDark ? "bg-teal-500/20" : "bg-purple-100"}`}>
              <Brain size={16} />
            </div>
            <p>
              Get AI analysis <br />
              <span className="opacity-70">ATS + skills insights</span>
            </p>
          </div>
        </div>
      </div>

      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleChosen(e.dataTransfer.files?.[0]);
        }}
        className={`max-w-3xl mx-auto border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
          isDark
            ? dragOver
              ? "border-teal-400 bg-white/10"
              : "border-white/20 bg-white/5"
            : dragOver
            ? "border-purple-500 bg-white"
            : "border-[#ddd6fe] bg-white shadow"
        }`}
      >
        <div
          className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 ${
            isDark
              ? "bg-teal-500/20 border border-teal-400/40"
              : "bg-purple-50 border border-purple-200"
          }`}
        >
          {loading || aiLoading ? (
            <RefreshCw
              size={36}
              className={`${isDark ? "text-teal-300" : "text-purple-600"} animate-spin`}
            />
          ) : (
            <Upload
              size={36}
              className={isDark ? "text-teal-300" : "text-purple-600"}
            />
          )}
        </div>

        <h3 className="font-semibold mb-2">Drag & drop your CV here</h3>
        <p className={isDark ? "text-[#99a1af] mb-6" : "text-[#6b21a8] mb-6"}>or</p>

        <div className="flex justify-center gap-3 mb-2">
          <Button
            type="button"
            onClick={pickFile}
            className={
              isDark
                ? "bg-teal-400 text-[#0a0f1e] hover:bg-teal-300"
                : "bg-purple-600 hover:bg-purple-700 text-white"
            }
          >
            Choose File
          </Button>

          <Button
            type="button"
            onClick={sendToAffinda}
            disabled={!file || loading || aiLoading}
            className={
              isDark
                ? "bg-teal-400 text-[#0a0f1e] hover:bg-teal-300"
                : "bg-purple-600 hover:bg-purple-700 text-white"
            }
          >
            {loading || aiLoading ? (
              <RefreshCw size={16} className="mr-2 animate-spin" />
            ) : (
              <Upload size={16} className="mr-2" />
            )}
            {loading || aiLoading ? "Analyzing..." : "Upload & Analyze"}
          </Button>
        </div>

        {/* Selected file */}
        {file && (
          <p className={`text-sm mt-2 ${isDark ? "text-teal-300" : "text-purple-700"}`}>
            Selected: <span className="font-medium">{file.name}</span>
          </p>
        )}

        {/* Hint */}
        <p className={`mt-1 text-xs ${isDark ? "text-[#6a7282]" : "text-[#7c3aed]"}`}>
          Analysis usually takes 10–20 seconds
        </p>

        {/* Notes */}
        <div className="mt-8 text-left max-w-xl mx-auto">
          <div className={`flex items-center gap-2 mb-2 text-sm ${isDark ? "text-[#a8b3cf]" : "text-[#6b21a8]"}`}>
            <Info size={14} />
            <span className="font-medium">Notes for AI analysis (optional)</span>
          </div>

          <textarea
            value={userNotes}
            onChange={(e) => setUserNotes(e.target.value)}
            rows={4}
            placeholder="• I'm applying for a Frontend Developer role
• Please focus on ATS & missing skills
• This is my first job / junior position"
            className={`w-full rounded-xl p-3 text-sm resize-none outline-none ${
              isDark
                ? "bg-white/5 border border-white/20 text-white placeholder:text-[#6a7282]"
                : "bg-white border border-[#ddd6fe] text-[#2e1065] placeholder:text-[#7c3aed]"
            }`}
          />

          <p className={`mt-2 text-xs ${isDark ? "text-[#6a7282]" : "text-[#7c3aed]"}`}>
            This won’t change your CV — it only helps the AI focus better.
          </p>
        </div>

        {msg && (
          <p
            className={`mt-6 text-sm ${
              msgKind === "ok"
                ? "text-emerald-500"
                : msgKind === "warn"
                ? "text-amber-500"
                : "text-rose-500"
            }`}
          >
            {msg}
          </p>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={(e) => handleChosen(e.target.files?.[0])}
        />
      </div>
    </div>
  );
}

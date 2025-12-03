"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/app/components/ui/button";

type Props = {
  isDark?: boolean;
  onBack?: () => void;
  onSuccess?: (result: any) => void;
  onError?: (msg: string) => void;
};

const MAX_MB = 5;
const ACCEPT = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

type MsgKind = "ok" | "warn" | "err";

export default function UploadCV({ isDark = true, onBack, onSuccess, onError }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgKind, setMsgKind] = useState<MsgKind>("ok");
  const [menteeId, setMenteeId] = useState<string | null>(null);
  const [resumeId, setResumeId] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // 🔹 حماية من التكرار

useEffect(() => {
  const token = sessionStorage.getItem("token");
  if (!token) return;

  (async () => {
    try {
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
        console.log("🧩 menteeId loaded:", mid);
      } else {
        console.warn("⚠️ No menteeId found in session response:", data);
      }

    } catch (err) {
      console.error("⚠️ Failed to fetch session:", err);
    }
  })();
}, []);

  // 🧾 اختيار الملف
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



async function sendToAffinda() {
  if (isProcessing) {
    console.warn("⏳ Upload already in progress, skipping duplicate...");
    return;
  }
  setIsProcessing(true);

  if (!file) {
    setMsgKind("warn");
    setMsg("Please choose a file first.");
    setIsProcessing(false);
    return;
  }

  if (!menteeId) {
    const m = "Mentee not detected — please login again.";
    setMsgKind("err");
    setMsg(m);
    setIsProcessing(false);
    return;
  }

  try {
    setLoading(true);
    setMsg("");
    setResumeId("");

    const fd = new FormData();
    fd.append("file", file);

    console.log("🚀 Uploading to /api/mentees/" + menteeId + "/cv/upload");

    const res = await fetch(`/api/mentees/${menteeId}/cv/upload`, {
      method: "POST",
      body: fd,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Upload failed");

    const newResumeId = data?.resumeId || data?.resume?._id || "";
    setMsgKind("ok");
    setMsg("✅ Uploaded successfully!");
    setFile(null);
    setResumeId(newResumeId);

    // 🔹 تحليل تلقائي بعد الرفع (مرة واحدة فقط)
    await runAiAnalysisAfterUpload(newResumeId);

  } catch (err: any) {
    setMsgKind("err");
    setMsg(err?.message || "Upload error");
  } finally {
    setLoading(false);
    setIsProcessing(false);
  }
}

async function runAiAnalysisAfterUpload(uploadedResumeId: string) {
  if (isProcessing) {
    console.warn("⏳ AI analysis already running, skipping duplicate...");
    return;
  }
  setIsProcessing(true);

  try {
    setAiLoading(true);
    setMsg("Analyzing your CV using Gemini AI...");
    setMsgKind("ok");

    let token = sessionStorage.getItem("token");
    if (!token) {
      const s = await fetch("/api/auth/session", { cache: "no-store" });
      token = (await s.json())?.token || null;
    }
    if (!token) throw new Error("⚠️ Missing token — please sign in again.");

    console.log("📥 Fetching parsed data...");
    const affindaRes = await fetch(
      `/api/mentees/${menteeId}/cv/parsed?resumeId=${uploadedResumeId}`,
      { cache: "no-store" }
    );
    const affindaJson = affindaRes.ok ? await affindaRes.json() : {};

    console.log("🚀 Sending analysis request...");
    const res = await fetch(`/api/mentees/${menteeId}/cv/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ resumeId: uploadedResumeId, affindaJson }),
    });

    const json = await res.json();
    if (!res.ok) {
      const errorMsg = json?.error || "AI analysis failed";

      if (res.status === 503 || /Gemini|busy|overloaded/i.test(errorMsg)) {
        const msg = "⚠️ Gemini AI is busy, please try again later.";
        setMsgKind("warn");
        setMsg(msg);
        return;
      }

      throw new Error(errorMsg);
    }

    console.log("✅ AI Analysis done:", json);
    setMsgKind("ok");
    setMsg("✅ AI analysis completed successfully!");
    onSuccess?.(json);

  } catch (e: any) {
    console.error("❌ AI error:", e);
    setMsgKind("err");
    setMsg(e?.message || "AI analysis error");
  } finally {
    setAiLoading(false);
    setIsProcessing(false);
  }
}


  
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
        className={`mb-8 rounded-xl border ${
          isDark ? "bg-white/5 border-white/10" : "bg-white border-[#e9d5ff]"
        } p-6`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isDark
                  ? "bg-gradient-to-br from-[#5eead4]/15 to-[#22d3ee]/10 border border-teal-400/30"
                  : "bg-gradient-to-br from-[#ede9fe] to-[#fae8ff] border border-[#ddd6fe]"
              }`}
            >
              <span className={isDark ? "text-teal-300" : "text-purple-600"}>
                🧾
              </span>
            </div>
            <div>
              <h1
                className={`text-2xl font-bold ${
                  isDark
                    ? "bg-gradient-to-r from-teal-300 to-emerald-300 text-transparent bg-clip-text"
                    : "text-[#2e1065]"
                }`}
              >
                Upload your CV
              </h1>
              <p
                className={`mt-1 text-sm ${
                  isDark ? "text-[#a8b3cf]" : "text-[#6b21a8]"
                }`}
              >
                Send your resume to Affinda for parsing and AI analysis.
              </p>
            </div>
          </div>

          {onBack && (
            <Button
              onClick={onBack}
              className={
                isDark
                  ? "bg-white/10 hover:bg-white/15 border border-white/20"
                  : "bg-white border border-[#ddd6fe] text-[#2e1065] hover:bg-purple-50"
              }
            >
              <ArrowLeft size={16} className="mr-2" /> Back
            </Button>
          )}
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
          const f = e.dataTransfer.files?.[0];
          handleChosen(f);
        }}
        className={`max-w-3xl mx-auto border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
          isDark
            ? `backdrop-blur-sm ${
                dragOver
                  ? "border-teal-400 bg-white/10"
                  : "border-white/20 bg-white/5"
              }`
            : `${
                dragOver
                  ? "border-purple-500 bg-white"
                  : "border-[#ddd6fe] bg-white shadow"
              }`
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
              className={
                isDark
                  ? "text-teal-300 animate-spin"
                  : "text-purple-600 animate-spin"
              }
              size={36}
            />
          ) : (
            <Upload
              className={isDark ? "text-teal-300" : "text-purple-600"}
              size={36}
            />
          )}
        </div>

        <h3 className="font-semibold mb-2">Drag & drop your CV here</h3>
        <p
          className={isDark ? "text-[#99a1af] mb-6" : "text-[#6b21a8] mb-6"}
        >
          or
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            type="button"
            onClick={pickFile}
            disabled={loading || aiLoading}
            className={
              isDark
                ? "bg-white/10 hover:bg-white/15 border border-white/20"
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
                ? "bg-teal-400 text-[#0a0f1e] hover:bg-teal-300 disabled:opacity-50"
                : "bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
            }
          >
            {loading || aiLoading ? (
              <RefreshCw size={16} className="mr-2 animate-spin" />
            ) : (
              <Upload size={16} className="mr-2" />
            )}
            {aiLoading ? "Analyzing..." : "Send to Affinda"}
          </Button>
        </div>

        <p
          className={`mt-4 text-sm ${
            isDark ? "text-[#6a7282]" : "text-[#7c3aed]"
          }`}
        >
          Supported: PDF, DOC, DOCX — Max {MAX_MB}MB
        </p>

        {file && (
          <p className="mt-3 text-sm font-medium">
            Selected:{" "}
            <span
              className={isDark ? "text-teal-300" : "text-purple-700"}
            >
              {file.name}
            </span>
          </p>
        )}

        {msg && (
          <p
            className={`mt-3 text-sm ${
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
          onChange={(e) =>
            handleChosen(e.target.files?.[0] || undefined)
          }
        />
      </div>
    </div>
  );
}

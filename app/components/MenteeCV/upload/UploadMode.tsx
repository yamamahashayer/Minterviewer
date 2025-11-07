"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, RefreshCw } from "lucide-react";
import { Button } from "@/app/components/ui/button";

type Props = {
  isDark?: boolean;
  onBack?: () => void;                 
  onSuccess?: (docId: string) => void; 
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
  const [msg, setMsg] = useState<string>("");
  const [msgKind, setMsgKind] = useState<MsgKind>("ok");
  const [userId, setUserId] = useState<string | null>(null);


useEffect(() => {
  const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null;
  if (!token) return;

  (async () => {
    try {
      const res = await fetch("/api/auth/session", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data?.ok && data?.user?.id) {
        setUserId(data.user.id); // 👈 هي أهم سطر
      }
    } catch {}
  })();
}, []);


  function pickFile() {
    inputRef.current?.click();
  }

  function validate(f: File) {
    const okMime = ACCEPT.includes(f.type);
    const ext = f.name.toLowerCase().split(".").pop() || "";
    const okExt = ["pdf", "doc", "docx"].includes(ext);
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
      onError?.(m);
      return;
    }
    setMsg("");
    setFile(f);
  }

  async function readErrorMessage(res: Response) {
    try {
      const data = await res.json();
      return data?.error || data?.message || res.statusText || "Upload failed";
    } catch {
      return res.status >= 500 ? "Server error. Please try again." : "Upload failed.";
    }
  }

async function sendToAffinda() {
  if (!file) return;
  if (!userId) {
    setMsgKind("err");
    setMsg("User not detected — login again.");
    return;
  }

  try {
    setLoading(true);
    setMsg("");

    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch(`/api/mentees/${userId}/cv/upload`, {
      method: "POST",
      body: fd,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || "Upload failed");
    }

    const data = await res.json();
    setMsgKind("ok");
    setMsg("Uploaded successfully ✅");
    setFile(null);
  } catch (e: any) {
    setMsgKind("err");
    setMsg(e?.message || "Something went wrong");
  } finally {
    setLoading(false);
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
      <div
        className={`mb-10 rounded-xl border ${
          isDark ? "bg-white/5 border-white/10" : "bg-white border-[#e9d5ff]"
        } p-6`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isDark
                ? "bg-gradient-to-br from-[#5eead4]/15 to-[#22d3ee]/10 border border-teal-400/30"
                : "bg-gradient-to-br from-[#ede9fe] to-[#fae8ff] border border-[#ddd6fe]"
            }`}
          >
            <span className={isDark ? "text-teal-300" : "text-purple-600"}>🧾</span>
          </div>

          <div className="flex-1">
            <h1
              className={`text-2xl font-bold leading-tight ${
                isDark
                  ? "bg-gradient-to-r from-teal-300 to-emerald-300 text-transparent bg-clip-text"
                  : "text-[#2e1065]"
              }`}
            >
              Upload your CV
            </h1>
            <p className={`mt-1 text-sm ${isDark ? "text-[#a8b3cf]" : "text-[#6b21a8]"}`}>
              Upload your resume to forward it to Affinda for parsing & improvement
            </p>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              isDark
                ? "bg-teal-500/10 text-teal-300 border border-teal-500/30"
                : "bg-purple-50 text-purple-700 border border-purple-200"
            }`}
          >
            Affinda • Connected
          </span>
        </div>

        <div
          className={`mt-4 h-[2px] rounded-full ${
            isDark
              ? "bg-gradient-to-r from-transparent via-teal-400/40 to-transparent"
              : "bg-gradient-to-r from-transparent via-[#a855f7]/40 to-transparent"
          }`}
        />
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
                dragOver ? "border-teal-400 bg-white/10" : "border-white/20 bg-white/5"
              }`
            : `${dragOver ? "border-purple-500 bg-white" : "border-[#ddd6fe] bg-white shadow"}`
        }`}
      >
        <div
          className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 ${
            isDark ? "bg-teal-500/20 border border-teal-400/40" : "bg-purple-50 border border-purple-200"
          }`}
        >
          {loading ? (
            <RefreshCw
              className={isDark ? "text-teal-300 animate-spin" : "text-purple-600 animate-spin"}
              size={36}
            />
          ) : (
            <Upload className={isDark ? "text-teal-300" : "text-purple-600"} size={36} />
          )}
        </div>

        <h3 className="font-semibold mb-2">Drag & drop your CV here</h3>
        <p className={isDark ? "text-[#99a1af] mb-6" : "text-[#6b21a8] mb-6"}>or</p>

        <div className="flex items-center justify-center gap-3">
          <Button
            type="button"
            onClick={pickFile}
            disabled={loading}
            className={
              isDark ? "bg-white/10 hover:bg-white/15 border border-white/20" : "bg-purple-600 hover:bg-purple-700 text-white"
            }
          >
            Choose File
          </Button>

          <Button
            type="button"
            onClick={sendToAffinda}
            disabled={!file || loading}
            className={
              isDark
                ? "bg-teal-400 text-[#0a0f1e] hover:bg-teal-300 disabled:opacity-50"
                : "bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
            }
          >
            {loading ? <RefreshCw size={16} className="mr-2 animate-spin" /> : <Upload size={16} className="mr-2" />}
            Send to Affinda
          </Button>
        </div>

        <p className={`mt-4 text-sm ${isDark ? "text-[#6a7282]" : "text-[#7c3aed]"}`}>
          Supported: PDF, DOC, DOCX — Max {MAX_MB}MB
        </p>

        {file && (
          <p className="mt-3 text-sm font-medium">
            Selected:{" "}
            <span className={isDark ? "text-teal-300" : "text-purple-700"}>
              {file.name}
            </span>
          </p>
        )}

        {msg && (
          <p
            className={`mt-3 text-sm ${
              msgKind === "ok" ? "text-emerald-500" : msgKind === "warn" ? "text-amber-500" : "text-rose-500"
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
          onChange={(e) => handleChosen(e.target.files?.[0] || undefined)}
        />
      </div>
    </div>
  );
}

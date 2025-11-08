"use client";

import { useState } from "react";

export default function AnalyzePanel({ affindaJson, resumeId }: { affindaJson: any; resumeId?: string | null }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string>("");

async function runAiAnalysis() {
  if (!resumeId) return;
  try {
    setAiLoading(true);
    setAnalysis(null);
    setMsg(""); 
    setMsgKind("ok");

    // 🟢 نحاول نجيب الـ token من sessionStorage
    let token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null;

    // 🔁 إذا مش موجود، نجيبه من /api/auth/session
    if (!token) {
      const r = await fetch("/api/auth/session", { cache: "no-store" });
      const j = await r.json();
      token = j?.token || null;
    }

    if (!token) {
      throw new Error("⚠️ Missing login token — please log in again.");
    }

    console.log("🎫 Using token:", token.slice(0, 15) + "...");

    // 🔥 الطلب الجديد — بدون userId
    const res = await fetch("/api/mentees/cv/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ resumeId }),
    });

    const json = await res.json();
    if (!res.ok || !json?.ok) {
      throw new Error(json?.error || "AI analysis failed");
    }

    setAnalysis(json.analysis || json);
    setMsgKind("ok");
    setMsg("✅ AI analysis completed successfully!");
  } catch (e: any) {
    setMsgKind("err");
    setMsg(e?.message || "AI analysis error");
    console.error("❌ AI error:", e);
  } finally {
    setAiLoading(false);
  }
}


  return (
    <div className="p-8 text-center">
      <button
        onClick={runAnalysis}
        disabled={!resumeId || loading}
        className="bg-purple-600 text-white px-4 py-2 rounded-lg"
      >
        {loading ? "Analyzing..." : "Analyze CV"}
      </button>
      {msg && <p className="mt-4 text-sm">{msg}</p>}
    </div>
  );
}

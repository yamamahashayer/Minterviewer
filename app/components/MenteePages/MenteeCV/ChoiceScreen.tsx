"use client";

import { useEffect, useState } from "react";
import { Upload, PenTool, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import Analyzed from "./report/History/Analyzed";

export default function ChoiceScreen({
  isDark,
  onUpload,
  onCreate,
  mode = "mentee", // ⭐ NEW
}: {
  isDark: boolean;
  onUpload: () => void;
  onCreate: () => void;
  mode?: "mentee" | "company";
}) {
  const [menteeId, setMenteeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD MENTEE (MENTEE MODE ONLY) ================= */
  useEffect(() => {
    if (mode === "company") {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) return setLoading(false);

        const res = await fetch("/api/auth/session", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        const data = await res.json();

        let mid =
          data?.mentee?._id ||
          data?.menteeId ||
          data?.user?.menteeId ||
          data?.user?.mentee?._id ||
          null;

        if (!mid && data?.user?._id) {
          const res2 = await fetch(`/api/mentees/by-user/${data.user._id}`);
          if (res2.ok) {
            const json2 = await res2.json();
            mid = json2?._id || null;
          }
        }

        if (mid) {
          sessionStorage.setItem("menteeId", mid);
          setMenteeId(mid);
        }
      } catch (err) {
        console.error("Failed to load menteeId", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [mode]);

  return (
    <div
      className={`min-h-screen py-16 px-6 ${
        isDark
          ? "bg-[#0b0f19] text-white"
          : "bg-[#f4edf] text-[#2e1065]"
      }`}
    >
      <div className="max-w-5xl mx-auto text-center">
        {/* Title */}
        <h1 className="text-4xl font-bold mb-3">
          Build Your{" "}
          <span className={isDark ? "text-teal-300" : "text-purple-600"}>
            Dream CV
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className={`text-base mb-10 ${
            isDark ? "text-gray-300" : "text-purple-800"
          }`}
        >
          Upload your resume or craft a new one with AI-powered guidance.
        </p>

        {/* Divider */}
        <div
          className={`h-1 w-48 mx-auto mb-14 rounded-full ${
            isDark
              ? "bg-gradient-to-r from-teal-400 to-transparent"
              : "bg-gradient-to-r from-purple-600 to-transparent"
          }`}
        />

        {/* ================= ACTION CARDS (MENTEE ONLY) ================= */}
        {mode === "mentee" && (
          <div className="grid md:grid-cols-2 gap-10">
            {/* Upload Card */}
            <div
              className={`${
                isDark
                  ? "bg-white/5 border-white/10"
                  : "bg-white border-purple-200"
              } border rounded-2xl p-8 shadow-lg`}
            >
              <div className="flex justify-center mb-4">
                <Upload
                  size={40}
                  className={isDark ? "text-teal-300" : "text-purple-500"}
                />
              </div>
              <h2 className="text-xl font-semibold mb-2">
                Upload Existing CV
              </h2>

              <ul className="space-y-2 text-sm mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle className="text-green-400" size={16} /> Instant AI analysis
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="text-green-400" size={16} /> ATS compatibility check
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="text-green-400" size={16} /> Improvement recommendations
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="text-green-400" size={16} /> Download optimized version
              </li>
            </ul>

              <Button
                onClick={onUpload}
                className={
                  isDark
                    ? "bg-teal-400 text-[#0b0f19] hover:bg-teal-500 w-full"
                    : "bg-purple-600 hover:bg-purple-700 text-white w-full"
                }
              >
                <Upload size={16} className="mr-2" /> Upload My CV
              </Button>
            </div>

            {/* Create Card */}
            <div
              className={`${
                isDark
                  ? "bg-white/5 border-white/10"
                  : "bg-white border-purple-200"
              } border rounded-2xl p-8 shadow-lg`}
            >
              <div className="flex justify-center mb-4">
                <PenTool
                  size={40}
                  className={isDark ? "text-pink-300" : "text-pink-600"}
                />
              </div>
              <h2 className="text-xl font-semibold mb-2">
                Create New CV
              </h2>

             <ul className="space-y-2 text-sm mb-6">
              <li className="flex items-center gap-2">
                <Sparkles className="text-yellow-300" size={16} /> Step-by-step guidance
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="text-yellow-300" size={16} /> AI-powered suggestions
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="text-yellow-300" size={16} /> Professional templates
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="text-yellow-300" size={16} /> Export as PDF
              </li>
            </ul>

              <Button
                onClick={onCreate}
                className={
                  isDark
                    ? "bg-pink-400 text-[#0b0f19] hover:bg-pink-500 w-full"
                    : "bg-pink-600 hover:bg-pink-700 text-white w-full"
                }
              >
                <PenTool size={16} className="mr-2" /> Create My CV
              </Button>
            </div>
          </div>
        )}

        {/* ================= HISTORY (MENTEE ONLY) ================= */}
        {mode === "mentee" && (
          <div className="mt-20">
            {loading ? (
              <p className="text-sm opacity-70">
                Loading your CV history...
              </p>
            ) : menteeId ? (
              <Analyzed menteeId={menteeId} isDark={isDark} />
            ) : (
              <p className="text-sm text-rose-400">
                ⚠️ Mentee not found. Please log in again.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

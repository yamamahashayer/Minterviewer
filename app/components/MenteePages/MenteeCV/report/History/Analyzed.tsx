"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { FileText, Clock, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Analyzed({
  menteeId,
  isDark,
}: {
  menteeId?: string;
  isDark?: boolean;
}) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false); // ⭐ يمنع إعادة التحميل
  const router = useRouter();

  /* 🧠 Fetch CV History (ONCE ONLY) */
  useEffect(() => {
    if (!menteeId || hasFetched.current) return;
    hasFetched.current = true;

    (async () => {
      try {
        const res = await fetch(`/api/mentees/${menteeId}/cv/history`);
        const json = await res.json();
        if (json?.history) setHistory(json.history);
        console.log("📜 Loaded CV History:", json?.history?.length || 0);
      } catch (err) {
        console.error("❌ Failed to fetch CV history:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [menteeId]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`mt-16 rounded-2xl p-6 border shadow-xl ${
        isDark ? "bg-white/5 border-white/10" : "bg-white border-purple-200"
      }`}
    >
      {/* ✨ Title */}
      <h3
        className={`text-2xl font-semibold mb-6 ${
          isDark
            ? "bg-gradient-to-r from-teal-300 to-emerald-400 bg-clip-text text-transparent"
            : "bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent"
        }`}
      >
        Your CV Analysis History
      </h3>

      {/* 💬 States */}
      {loading ? (
        <p className="text-gray-400 animate-pulse">Loading your history...</p>
      ) : history.length === 0 ? (
        <p className="text-sm opacity-70">
          You haven't uploaded any CVs yet.
        </p>
      ) : (
        <div className="flex flex-col gap-4 max-h-[450px] overflow-y-auto pr-2">
          {history.map((item, idx) => (
            <motion.div
              key={item._id || idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25, delay: idx * 0.04 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                if (item.resume?._id && menteeId) {
                  router.push(
                    `/mentee?tab=cv-review&resumeId=${item.resume._id}`
                  );
                }
              }}
              className={`p-4 rounded-xl border shadow-sm cursor-pointer transition-all ${
                isDark
                  ? "bg-white/5 border-white/10 hover:border-teal-300/40 hover:bg-white/10"
                  : "bg-[#faf5ff] border-[#e9d5ff] hover:border-[#d8b4fe] hover:bg-white"
              }`}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <FileText
                    size={18}
                    className={isDark ? "text-teal-300" : "text-purple-600"}
                  />
                  <p className="text-sm font-semibold truncate">
                    Resume: {item.resume?._id || "N/A"}
                  </p>
                </div>
                <span className="text-xs opacity-70">
                  {new Date(item.createdAt).toLocaleDateString()}{" "}
                  <span className="opacity-50">
                    {new Date(item.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </span>
              </div>

              {/* Scores */}
              <div className="text-xs mb-2 space-y-1">
                <p>
                  <strong>Score:</strong> {item.score ?? 0}/100
                </p>
                <p>
                  <strong>ATS:</strong> {item.atsScore ?? 0}/100
                </p>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 mt-1">
                {item.score > 0 ? (
                  <CheckCircle2
                    size={16}
                    className={isDark ? "text-emerald-300" : "text-green-600"}
                  />
                ) : (
                  <Clock
                    size={16}
                    className={isDark ? "text-amber-300" : "text-yellow-600"}
                  />
                )}
                <span
                  className={`text-xs ${
                    item.score > 0
                      ? isDark
                        ? "text-emerald-200"
                        : "text-green-700"
                      : isDark
                      ? "text-amber-200"
                      : "text-yellow-700"
                  }`}
                >
                  {item.score > 0 ? "Analyzed" : "Pending"}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

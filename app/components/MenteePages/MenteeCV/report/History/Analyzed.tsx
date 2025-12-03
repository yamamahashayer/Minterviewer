"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Clock, CheckCircle2 } from "lucide-react";

export default function Analyzed({
  menteeId,
  isDark,
}: {
  menteeId?: string;
  isDark?: boolean;
}) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 🧠 Fetch CV History
  useEffect(() => {
    if (!menteeId) return;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/mentees/${menteeId}/cv/history`, {
          cache: "no-store",
        });
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
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
      className={`mt-16 rounded-2xl p-6 border shadow-xl ${
        isDark ? "bg-white/5 border-white/10" : "bg-white border-purple-200"
      }`}
    >
      {/* ✨ Title */}
      <motion.h3
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className={`text-2xl font-semibold mb-6 ${
          isDark
            ? "bg-gradient-to-r from-teal-300 to-emerald-400 bg-clip-text text-transparent"
            : "bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent"
        }`}
      >
        Your CV Activity
      </motion.h3>

      {/* 💬 States */}
      {loading ? (
        <p className="text-gray-400 animate-pulse">Loading your history...</p>
      ) : history.length === 0 ? (
        <p className="text-sm opacity-70">
          You haven't uploaded any CVs yet.
        </p>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          viewport={{ once: true }}
          className="flex flex-col gap-4 max-h-[450px] overflow-y-auto pr-2 scroll-smooth"
        >
          {history.map((item, idx) => (
            <motion.div
              key={item._id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: idx * 0.08,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (item.resume?._id && menteeId) {
                  window.location.href = `/mentee?tab=cv-review&resumeId=${item.resume._id}`;
                  }
              }}
              className={`p-4 rounded-xl border shadow-sm transition-all cursor-pointer ${
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
        </motion.div>
      )}
    </motion.div>
  );
}

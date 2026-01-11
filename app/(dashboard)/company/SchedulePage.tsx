"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, Clock, Video, Briefcase, User } from "lucide-react";

type Theme = "dark" | "light";

type CompanyInterviewItem = {
  id: string;
  jobTitle: string;
  mentee: {
    id: string;
    full_name: string;
    email: string;
    profile_photo: string;
  };
  scheduledStart: string;
  scheduledEnd: string;
  duration: number;
  status: "scheduled" | "cancelled" | "completed";
  meetingLink: string | null;
  notes: string;
};

export default function SchedulePage({ theme }: { theme: Theme }) {
  const isDark = theme === "dark";

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<CompanyInterviewItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);
        setError(null);

        const raw = sessionStorage.getItem("user");
        const token = sessionStorage.getItem("token");
        if (!raw) {
          setItems([]);
          return;
        }

        const user = JSON.parse(raw);
        const companyId = user.companyId;
        if (!companyId) {
          setItems([]);
          return;
        }

        const res = await fetch(`/api/company/${companyId}/interviews`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const data = await res.json();
        if (!res.ok || !data?.ok) {
          setError(data?.message || "Failed to load schedule");
          setItems([]);
          return;
        }

        setItems(data.interviews || []);
      } catch (e: any) {
        setError(e?.message || "Failed to load schedule");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  const now = useMemo(() => new Date(), []);

  const upcoming = useMemo(() => {
    return items
      .filter((i) => i.status === "scheduled")
      .filter((i) => new Date(i.scheduledEnd).getTime() >= now.getTime())
      .sort((a, b) => new Date(a.scheduledStart).getTime() - new Date(b.scheduledStart).getTime());
  }, [items, now]);

  const past = useMemo(() => {
    return items
      .filter((i) => i.status !== "cancelled")
      .filter((i) => new Date(i.scheduledEnd).getTime() < now.getTime())
      .sort((a, b) => new Date(b.scheduledStart).getTime() - new Date(a.scheduledStart).getTime());
  }, [items, now]);

  return (
    <div className={`min-h-screen p-8 ${isDark ? "bg-[#020617] text-white" : "bg-[#f8fafc] text-black"}`}>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className={`rounded-2xl border p-6 ${isDark ? "bg-[#0b1223] border-white/10" : "bg-white border-gray-200"}`}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Schedule</h1>
              <p className={`text-sm mt-1 ${isDark ? "text-slate-300" : "text-gray-600"}`}>
                Upcoming company interviews and meeting links
              </p>
            </div>
            <div className={`flex items-center gap-2 text-sm ${isDark ? "text-teal-300" : "text-purple-700"}`}>
              <Calendar className="w-4 h-4" />
              {upcoming.length} upcoming
            </div>
          </div>
        </div>

        {loading ? (
          <div className={`rounded-2xl border p-8 text-center ${isDark ? "bg-[#0b1223] border-white/10" : "bg-white border-gray-200"}`}>
            Loading schedule...
          </div>
        ) : error ? (
          <div className={`rounded-2xl border p-6 ${isDark ? "bg-[#0b1223] border-red-500/30" : "bg-white border-red-200"}`}>
            <div className={`font-semibold ${isDark ? "text-red-300" : "text-red-700"}`}>{error}</div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {upcoming.map((i) => {
                const start = new Date(i.scheduledStart);
                const date = start.toLocaleDateString();
                const time = start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                return (
                  <div
                    key={i.id}
                    className={`rounded-2xl border p-6 ${isDark ? "bg-[#0b1223] border-white/10" : "bg-white border-gray-200"}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Briefcase className={`w-4 h-4 ${isDark ? "text-teal-300" : "text-purple-700"}`} />
                          <h2 className="font-semibold">{i.jobTitle}</h2>
                        </div>

                        <div className={`text-sm flex flex-wrap gap-4 ${isDark ? "text-slate-300" : "text-gray-600"}`}>
                          <span className="inline-flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {date} at {time}
                          </span>
                          <span className="inline-flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {i.mentee?.full_name || "Candidate"}
                          </span>
                        </div>

                        {i.notes ? (
                          <div className={`text-sm ${isDark ? "text-slate-300" : "text-gray-700"}`}>{i.notes}</div>
                        ) : null}
                      </div>

                      <div className="flex gap-2">
                        {i.meetingLink ? (
                          <a
                            href={i.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                              isDark
                                ? "bg-teal-500 text-black hover:bg-teal-400"
                                : "bg-purple-600 text-white hover:bg-purple-700"
                            }`}
                          >
                            <Video className="w-4 h-4" />
                            Join
                          </a>
                        ) : (
                          <div className={`px-4 py-2 rounded-xl text-sm ${isDark ? "bg-white/5 text-slate-300" : "bg-gray-100 text-gray-600"}`}>
                            No link
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {upcoming.length === 0 && (
                <div className={`rounded-2xl border p-8 text-center ${isDark ? "bg-[#0b1223] border-white/10" : "bg-white border-gray-200"}`}>
                  No upcoming interviews.
                </div>
              )}
            </div>

            {past.length > 0 && (
              <div className={`rounded-2xl border p-6 ${isDark ? "bg-[#0b1223] border-white/10" : "bg-white border-gray-200"}`}>
                <h3 className="font-semibold mb-4">Past interviews</h3>
                <div className="space-y-3">
                  {past.slice(0, 10).map((i) => {
                    const start = new Date(i.scheduledStart);
                    return (
                      <div key={i.id} className={`flex items-center justify-between gap-4 rounded-xl p-3 ${isDark ? "bg-white/5" : "bg-gray-50"}`}>
                        <div className="min-w-0">
                          <div className="font-medium truncate">{i.jobTitle}</div>
                          <div className={`text-xs mt-1 ${isDark ? "text-slate-300" : "text-gray-600"}`}>
                            {i.mentee?.full_name || "Candidate"} • {start.toLocaleString()}
                          </div>
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full ${isDark ? "bg-white/10 text-slate-200" : "bg-gray-200 text-gray-700"}`}>
                          {i.status}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

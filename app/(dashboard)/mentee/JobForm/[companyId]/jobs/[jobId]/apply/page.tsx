"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Clock,
  Brain,
  UserCheck,
  Building2,
} from "lucide-react";

import UploadCV from "@/app/components/MenteePages/MenteeCV/upload/UploadMode";

/* ================= TYPES ================= */

type Job = {
  title: string;
  type: string;
  level: string;
  location: string;
  deadline?: string;
  enableCVAnalysis: boolean;
  interviewType: "none" | "ai" | "human";
  humanType?: "hr" | "mentor";
  companyId: {
    name: string;
    logo?: string;
  };
};

/* ================= PAGE ================= */

export default function ApplyJobPage() {
  const { companyId, jobId } = useParams() as {
    companyId: string;
    jobId: string;
  };

  const router = useRouter();
  const fetchedOnce = useRef(false);

  /* ================= STATES ================= */
  const [job, setJob] = useState<Job | null>(null);
  const [menteeId, setMenteeId] = useState<string | null>(null);

  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [cvOpen, setCvOpen] = useState(false);

  /* ================= THEME ================= */
  useEffect(() => {
    const updateTheme = () =>
      setIsDark(document.documentElement.classList.contains("dark"));

    updateTheme();
    const obs = new MutationObserver(updateTheme);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => obs.disconnect();
  }, []);

  /* ================= FETCH JOB ================= */
  useEffect(() => {
    if (!companyId || !jobId) return;

    fetch(`/api/company/${companyId}/jobs/${jobId}`)
      .then((r) => r.json())
      .then((d) => setJob(d.job))
      .catch(() => setError("Failed to load job details"));
  }, [companyId, jobId]);

  /* ================= FETCH SESSION ================= */
  useEffect(() => {
    if (fetchedOnce.current) return;

    const token =
      typeof window !== "undefined"
        ? sessionStorage.getItem("token")
        : null;
    if (!token) return;

    const safeSet = (
      current: string,
      setter: (v: string) => void,
      incoming?: string | null
    ) => {
      if (!incoming) return;
      if (!current || !current.trim()) setter(incoming);
    };

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
          setMenteeId(mid);
          sessionStorage.setItem("menteeId", mid);
        }

        const u = data?.user;
        if (u) {
          safeSet(fullName, setFullName, u.full_name);
          safeSet(email, setEmail, u.email);
          safeSet(phone, setPhone, u.phoneNumber);
        }
      } catch {
        /* ignore */
      } finally {
        fetchedOnce.current = true;
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ================= SUBMIT ================= */
  async function handleSubmit() {
    if (loading) return;
    setError("");

    if (!menteeId) {
      setError("Mentee not detected. Please login again.");
      return;
    }

    if (!fullName || !email || !phone) {
      setError("Please fill all required fields.");
      return;
    }

    if (job?.enableCVAnalysis && !analysisId) {
      setError("Please upload your CV first.");
      return;
    }

    setLoading(true);

    const res = await fetch(
      `/api/company/${companyId}/jobs/${jobId}/apply`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          menteeId,
          analysisId: job.enableCVAnalysis ? analysisId : null,
        }),
      }
    );

    setLoading(false);

    if (res.ok) {
      router.push("/mentee/jobs?applied=true");
    } else {
      const j = await res.json();
      setError(j?.message || "Failed to submit application");
    }
  }

  if (!job) return <div className="p-8">Loading…</div>;

  /* ================= UI ================= */
  return (
    <div
      className={`min-h-screen px-8 py-10 ${
        isDark ? "bg-[#0a0f1e] text-white" : "bg-gray-50 text-black"
      }`}
    >
      <div className="max-w-6xl grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8">

        {/* LEFT */}
        <div className="space-y-6">
          {/* JOB CARD */}
          <aside
            className={`rounded-xl p-5 border ${
              isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              {job.companyId.logo ? (
                <img
                  src={job.companyId.logo}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-300">
                  <Building2 className="w-5 h-5 opacity-70" />
                </div>
              )}
              <div>
                <p className="font-semibold text-sm">{job.title}</p>
                <p className="text-xs opacity-70">{job.companyId.name}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs opacity-70">
              <Row icon={<MapPin size={14} />} text={job.location} />
              <Row icon={<Briefcase size={14} />} text={job.type} />
              <Row icon={<GraduationCap size={14} />} text={job.level} />
              {job.deadline && (
                <Row
                  icon={<Clock size={14} />}
                  text={`Deadline: ${new Date(
                    job.deadline
                  ).toLocaleDateString()}`}
                />
              )}
            </div>
          </aside>

          {/* APPLICATION PROCESS */}
          <div
            className={`rounded-xl p-5 border ${
              isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"
            }`}
          >
            <h2 className="font-semibold mb-4">Application Process</h2>

            <div className="space-y-3 text-sm">
              {job.enableCVAnalysis && (
                <ProcessStep
                  icon={<Brain size={14} />}
                  title="CV Analysis"
                  desc="Your CV will be analyzed using AI."
                />
              )}

              {job.interviewType === "ai" && (
                <ProcessStep
                  icon={<Brain size={14} />}
                  title="AI Interview"
                  desc="Automated interview with AI."
                />
              )}

              {job.interviewType === "human" && (
                <ProcessStep
                  icon={<UserCheck size={14} />}
                  title="Human Interview"
                  desc={`Interview with ${job.humanType}`}
                />
              )}

              {job.interviewType === "none" && (
                <ProcessStep
                  icon={<Briefcase size={14} />}
                  title="No Interview"
                  desc="No interview required for this role."
                />
              )}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <section className="lg:sticky lg:top-24 h-fit">
          <div
            className={`rounded-xl p-6 border space-y-4 ${
              isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"
            }`}
          >
            <h2 className="font-semibold">Confirm Your Information</h2>

            <Input label="Full Name *" value={fullName} onChange={setFullName} />
            <Input label="Email *" value={email} onChange={setEmail} />
            <Input label="Phone *" value={phone} onChange={setPhone} />

            {job.enableCVAnalysis ? (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setCvOpen((v) => !v)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border ${
                    isDark
                      ? "bg-[#0f172a] border-white/10"
                      : "bg-gray-50 border-gray-300"
                  }`}
                >
                  <span className="font-medium">
                    {analysisId ? "✔ CV Uploaded" : "Upload & Analyze CV"}
                  </span>
                  <span className="text-sm opacity-70">
                    {cvOpen ? "Hide" : "Open"}
                  </span>
                </button>

                {cvOpen && (
                  <UploadCV
                    isDark={isDark}
                    onSuccess={(res) => {
                      setAnalysisId(res.analysisId);
                      setCvOpen(false);
                    }}
                    onError={(msg) => setError(msg)}
                  />
                )}
              </div>
            ) : (
              <p className="text-sm opacity-70">
                CV upload is not required for this position.
              </p>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading || (job.enableCVAnalysis && !analysisId)}
              className={`w-full py-2 rounded-lg font-semibold transition ${
                loading || (job.enableCVAnalysis && !analysisId)
                  ? "bg-gray-400 cursor-not-allowed"
                  : isDark
                  ? "bg-teal-400 text-black hover:bg-teal-300"
                  : "bg-teal-600 text-white hover:bg-teal-700"
              }`}
            >
              {loading ? "Submitting…" : "Submit Application"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */

function Row({ icon, text }: any) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span>{text}</span>
    </div>
  );
}

function ProcessStep({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-1 opacity-80">{icon}</div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-xs opacity-70">{desc}</p>
      </div>
    </div>
  );
}

function Input({ label, value, onChange }: any) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        className="w-full mt-1 px-3 py-2 rounded-lg border outline-none
          bg-transparent border-gray-300 dark:border-white/10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Clock,
  Brain,
  UserCheck,
  Building2,
} from "lucide-react";

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
  /* ================= ROUTER & PARAMS ================= */
  const { companyId, jobId } = useParams() as {
    companyId: string;
    jobId: string;
  };

  const router = useRouter();

  /* ================= STATES ================= */
  const [job, setJob] = useState<Job | null>(null);
  const [menteeId, setMenteeId] = useState<string | null>(null);

  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState("");

  // applicant fields (auto-filled)
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);

  /* ================= THEME ================= */
  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  /* ================= RESOLVE MENTEE ID (SMART) ================= */
  useEffect(() => {
    let mounted = true;

    const loadMenteeId = async () => {
      try {
        // 1️⃣ sessionStorage
        const rawUser =
          typeof window !== "undefined"
            ? sessionStorage.getItem("user")
            : null;

        if (rawUser) {
          const u = JSON.parse(rawUser);
          const mid = u?.menteeId || u?.mentee?._id;
          if (mid && mounted) {
            setMenteeId(mid);
            return;
          }
        }

        // 2️⃣ fallback API
        const token = sessionStorage.getItem("token");
        if (!token) return;

        const r = await fetch("/api/auth/session", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        const j = await r.json();

        if (j?.ok && j?.user) {
          const mid = j.menteeId || j.user?.menteeId;
          if (mid && mounted) {
            setMenteeId(mid);

            // cache it
            const mergedUser = { ...j.user, menteeId: mid };
            sessionStorage.setItem("user", JSON.stringify(mergedUser));
          }
        }
      } catch (e) {
        console.warn("Failed to resolve menteeId", e);
      }
    };

    loadMenteeId();
    return () => {
      mounted = false;
    };
  }, []);

  /* ================= FETCH JOB ================= */
  useEffect(() => {
    if (!companyId || !jobId) return;

    fetch(`/api/company/${companyId}/jobs/${jobId}`)
      .then((res) => res.json())
      .then((data) => setJob(data.job))
      .catch(() => setError("Failed to load job details."));
  }, [companyId, jobId]);

  /* ================= FETCH MENTEE PROFILE ================= */
  useEffect(() => {
    if (!menteeId) return;

    setProfileLoading(true);

    fetch(`/api/mentees/${menteeId}/profile`, {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          setFullName(data.user.full_name || "");
          setEmail(data.user.email || "");
          setPhone(
            data.user.phoneNumber ||
              data.mentee?.phone ||
              ""
          );
        }
        setProfileLoading(false);
      })
      .catch((err) => {
        console.warn("Failed to load mentee profile", err);
        setProfileLoading(false);
      });
  }, [menteeId]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    setError("");

    if (!fullName || !email || !phone) {
      setError("Please fill all required fields.");
      return;
    }

    if (!cvFile) {
      setError("Please upload your CV.");
      return;
    }

    const fd = new FormData();
    fd.append("fullName", fullName);
    fd.append("email", email);
    fd.append("phone", phone);
    fd.append("cv", cvFile);

    setLoading(true);

    const res = await fetch(
      `/api/company/${companyId}/jobs/${jobId}/apply`,
      {
        method: "POST",
        body: fd,
      }
    );

    setLoading(false);

    if (res.ok) {
      router.push("/mentee/jobs?applied=true");
    } else {
      setError("Failed to submit application.");
    }
  };

  /* ================= EARLY RETURN ================= */
  if (!job) return <div className="p-8">Loading…</div>;

  /* ================= UI ================= */
  return (
    <div
      className={`min-h-screen px-8 py-10 ${
        isDark ? "bg-[#0a0f1e] text-white" : "bg-gray-50 text-black"
      }`}
    >
      <div className="max-w-6xl grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8">

        {/* ================= LEFT ================= */}
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
                  text={`Deadline: ${new Date(job.deadline).toLocaleDateString()}`}
                />
              )}
            </div>
          </aside>

          {/* PROCESS */}
          <div
            className={`rounded-xl p-5 border ${
              isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"
            }`}
          >
            <h2 className="font-semibold mb-4">Application Process</h2>

            <div className="space-y-3">
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

        {/* ================= RIGHT ================= */}
        <section className="lg:sticky lg:top-24 h-fit">
          <div
            className={`rounded-xl p-6 border space-y-4 ${
              isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"
            }`}
          >
            <h2 className="font-semibold">Confirm Your Information</h2>
            <p className="text-xs opacity-60">
              Loaded automatically from your profile.
            </p>

            <Input label="Full Name *" value={fullName} onChange={setFullName} />
            <Input label="Email *" value={email} onChange={setEmail} />
            <Input label="Phone *" value={phone} onChange={setPhone} />

            {/* CV */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Upload CV <span className="text-red-500">*</span>
              </label>

              <div
                className={`flex items-center justify-between gap-4 px-4 py-3 rounded-lg border
                  ${
                    isDark
                      ? "bg-[#0f172a] border-white/10"
                      : "bg-gray-50 border-gray-300"
                  }`}
              >
                <span className="text-sm opacity-80">
                  {cvFile ? cvFile.name : "No file selected (PDF only)"}
                </span>

                <label
                  className={`px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer
                    ${
                      isDark
                        ? "bg-teal-400 text-black"
                        : "bg-teal-600 text-white"
                    }`}
                >
                  Choose File
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) =>
                      setCvFile(e.target.files?.[0] || null)
                    }
                  />
                </label>
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-2 rounded-lg font-semibold transition
                ${
                  loading
                    ? "bg-gray-400"
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

function ProcessStep({ icon, title, desc }: any) {
  return (
    <div className="flex gap-3 text-sm">
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

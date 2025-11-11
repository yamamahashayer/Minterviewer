"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../../components/ui/button";
import StepHeader from "./StepHeader";
import TypeStep from "../create/steps/TypeStep";
import TargetStep from "../create/steps/TargetStep";
import PersonalStep from "./steps/PersonalStep";
import ExperienceStep from "./steps/experience";
import EducationStep from "./steps/education";
import SkillsStep from "./steps/SkillsStep";
import SummaryStep from "./steps/SummaryStep";
import PreviewStep from "./steps/PreviewStep";
import ProjectsStep from "./steps/ProjectsStep";
import { AnimatePresence, motion } from "framer-motion";
import type { CVData, CvType, StepKey, StepMeta } from "../create/types";

type Updater<T> = T | ((prev: T) => T);
const apply = <T,>(prev: T, next: Updater<T>): T =>
  typeof next === "function" ? (next as (p: T) => T)(prev) : next;

export default function CreateMode(props: {
  isDark: boolean;
  allSteps: StepMeta[];
  visibleSteps: StepKey[];
  activeIdx: number;
  setActiveIdx: (updater: (i: number) => number) => void;
  cvType: CvType;
  setCvType: (t: CvType) => void;
  cvData: CVData;
  setCvData: React.Dispatch<React.SetStateAction<CVData>>;
  targetRole: string;
  setTargetRole: (v: string) => void;
  jobDescription: string;
  setJobDescription: (v: string) => void;
  onBack: () => void;
}) {
  const {
    isDark,
    allSteps,
    visibleSteps,
    activeIdx,
    setActiveIdx,
    cvType,
    setCvType,
    cvData,
    setCvData,
    targetRole,
    setTargetRole,
    jobDescription,
    setJobDescription,
    onBack,
  } = props;

  const activeKey = visibleSteps[activeIdx];

  // ✅ menteeId state
  const [menteeId, setMenteeId] = useState<string | null>(null);

  useEffect(() => {
    // نحاول نقرأ user من sessionStorage أولاً
    const rawUser = typeof window !== "undefined" ? sessionStorage.getItem("user") : null;
    if (rawUser) {
      try {
        const u = JSON.parse(rawUser);
        const mid = u?.menteeId || u?.mentee?._id || null;
        if (mid) {
          setMenteeId(mid);
          console.log("🧩 menteeId loaded from sessionStorage:", mid);
          return;
        } else {
          console.warn("⚠️ menteeId not found in session user object");
        }
      } catch (err) {
        console.error("⚠️ Failed to parse user from sessionStorage:", err);
      }
    }

    // إذا ما لقيناه في sessionStorage نحاول نجيبه من الـ API
    const token = sessionStorage.getItem("token");
    if (!token) return;

    (async () => {
      try {
        const r = await fetch("/api/auth/session", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        const j = await r.json();

        if (j?.ok && j?.user) {
          const mid = j.menteeId || j.user?.menteeId || null;
          if (mid) {
            setMenteeId(mid);
            console.log("✅ menteeId loaded from API:", mid);

            // ✅ نخزّنه داخل sessionStorage لتسريع الجلسات القادمة
            const mergedUser = {
              ...j.user,
              menteeId: mid,
            };
            sessionStorage.setItem("user", JSON.stringify(mergedUser));
          }
        } else {
          console.warn("⚠️ Failed to fetch menteeId from API:", j);
        }
      } catch (e) {
        console.error("⚠️ Error fetching /api/auth/session:", e);
      }
    })();
  }, []);

  // ====== Step validation ======
  const canNext = (() => {
    switch (activeKey) {
      case "type":
        return !!cvType;
      case "target":
        if (cvType === "role") return !!targetRole.trim();
        if (cvType === "job") return !!jobDescription.trim();
        return true;
      case "personal": {
        const p = cvData.personal;
        return !!(p.fullName && p.email && p.phone && p.location);
      }
      default:
        return true;
    }
  })();

  const onNext = () => setActiveIdx((i) => Math.min(visibleSteps.length - 1, i + 1));

  // ====== UI ======
  return (
    <div className={`min-h-screen p-8 ${isDark ? "bg-[#0a0f1e]" : "bg-[#f5f3ff]"}`}>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className={isDark ? "text-white" : "text-[#2e1065]"} style={{ fontWeight: 700 }}>
            CV Builder 📝
          </h1>
          <p className={isDark ? "text-[#99a1af]" : "text-[#6b21a8]"}>
            Create your professional resume step-by-step
          </p>
        </div>
        <Button onClick={onBack}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Options
        </Button>
      </div>

      {/* Steps Header */}
      <StepHeader
        steps={allSteps.filter((s) => visibleSteps.includes(s.key))}
        activeIdx={activeIdx}
        isDark={isDark}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeKey}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <div className="max-w-5xl mx-auto mt-6">
            {activeKey === "type" && (
              <TypeStep cvType={cvType} setCvType={setCvType} isDark={isDark} />
            )}

            {activeKey === "target" && (
              <TargetStep
                cvType={cvType}
                setCvType={setCvType}
                targetRole={targetRole}
                setTargetRole={setTargetRole}
                jobDescription={jobDescription}
                setJobDescription={setJobDescription}
                isDark={isDark}
              />
            )}

            {activeKey === "personal" && (
              <PersonalStep
                value={cvData.personal}
                onChange={(k, v) =>
                  setCvData((d) => ({ ...d, personal: { ...d.personal, [k]: v } }))
                }
                isDark={isDark}
              />
            )}

            {activeKey === "experience" && (
              <ExperienceStep
                items={cvData.experience}
                setItems={(next: Updater<typeof cvData.experience>) =>
                  setCvData((d) => ({ ...d, experience: apply(d.experience, next) }))
                }
                isDark={isDark}
              />
            )}

            {activeKey === "education" && (
              <EducationStep
                items={cvData.education}
                setItems={(next) => setCvData((d) => ({ ...d, education: next(d.education) }))}
                isDark={isDark}
              />
            )}

            {activeKey === "skills" && (
              <SkillsStep
                skills={cvData.skills}
                update={(k, v) =>
                  setCvData((d) => ({ ...d, skills: { ...d.skills, [k]: v } }))
                }
                isDark={isDark}
              />
            )}

            {activeKey === "projects" && (
              <ProjectsStep
                projects={cvData.projects}
                setProjects={(next) => setCvData((d) => ({ ...d, projects: next }))}
                isDark={isDark}
              />
            )}

            {activeKey === "summary" && (
              <SummaryStep
                value={cvData.personal.summary}
                onChange={(v) =>
                  setCvData((d) => ({ ...d, personal: { ...d.personal, summary: v } }))
                }
                isDark={isDark}
              />
            )}

            {activeKey === "preview" && (
              <PreviewStep
                cvType={cvType}
                data={cvData}
                isDark={isDark}
                onDownload={() => alert("Exporting...")}
                menteeId={menteeId} // ✅ تمرير menteeId بشكل مضمون
              />
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-10">
              <button
                onClick={() => setActiveIdx((i) => Math.max(0, i - 1))}
                disabled={activeIdx === 0}
                className={`inline-flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition
                  ${
                    activeIdx === 0
                      ? "opacity-40 cursor-not-allowed"
                      : isDark
                      ? "bg-white/10 text-white hover:bg-white/20"
                      : "bg-[#ede9fe] text-[#4c1d95] hover:bg-[#e4dafe]"
                  }`}
              >
                ← Previous
              </button>

              <button
                onClick={onNext}
                disabled={activeKey === "preview" || !canNext}
                className={`inline-flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition
                  ${
                    !canNext
                      ? "opacity-40 cursor-not-allowed"
                      : isDark
                      ? "bg-teal-400 text-[#0b1020] hover:bg-teal-300"
                      : "bg-[#7c3aed] text-white hover:bg-[#6d28d9]"
                  }`}
              >
                {activeKey === "summary" ? "Preview CV" : "Next"} →
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

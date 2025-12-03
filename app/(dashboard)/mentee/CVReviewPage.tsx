"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import {
  User,
  Briefcase,
  GraduationCap,
  Code,
  FileText,
  Eye,
  Target,
  FolderGit2,
} from "lucide-react";

import { Button } from "../../components/ui/button";
import ChoiceScreen from "../../components/MenteePages/MenteeCV/ChoiceScreen";
import CreateMode from "../../components/MenteePages/MenteeCV/create/CreateMode";
import UploadMode from "@/app/components/MenteePages/MenteeCV/upload/UploadMode";
import CVReportView from "@/app/components/MenteePages/MenteeCV/report/CVReportView";

import type {
  CVData,
  CvType,
  StepKey,
  StepMeta,
} from "../../components/MenteePages/MenteeCV/create/types";

export default function CVReviewPage({
  theme = "dark",
}: {
  theme?: "dark" | "light";
}) {
  const isDark = theme === "dark";

  const [mode, setMode] = useState<"choice" | "upload" | "create" | "report">("choice");

  const [analysisData, setAnalysisData] = useState<{
    menteeId?: string;
    resumeId?: string;
    analysis?: any;
  } | null>(null);

  const [cvType, setCvType] = useState<CvType>("general");
  const [cvData, setCvData] = useState<CVData>({
    personal: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
      linkedin: "",
      github: "",
    },
    experience: [
      {
        id: 1,
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      },
    ],
    education: [
      {
        id: 1,
        degree: "",
        institution: "",
        location: "",
        graduationDate: "",
        gpa: "",
      },
    ],
    skills: { technical: "", soft: "", languages: "" },
    projects: [{ id: 1, name: "", description: "", github: "", link: "" }],
  });

  const [targetRole, setTargetRole] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");

  const allSteps: StepMeta[] = [
    { key: "type", title: "CV Type", icon: Target },
    { key: "target", title: "Targeting", icon: Target },
    { key: "personal", title: "Personal", icon: User },
    { key: "experience", title: "Experience", icon: Briefcase },
    { key: "education", title: "Education", icon: GraduationCap },
    { key: "skills", title: "Skills", icon: Code },
    { key: "projects", title: "Projects", icon: FolderGit2 },
    { key: "summary", title: "Summary", icon: FileText },
    { key: "preview", title: "Preview", icon: Eye },
  ];

  const visibleSteps = useMemo<StepKey[]>(() => {
    const base: StepKey[] = ["type"];
    if (cvType !== "general") base.push("target");
    return [
      ...base,
      "personal",
      "experience",
      "education",
      "skills",
      "projects",
      "summary",
      "preview",
    ];
  }, [cvType]);

  const [activeIdx, setActiveIdx] = useState<number>(0);
  useEffect(() => {
    if (activeIdx >= visibleSteps.length) {
      setActiveIdx(visibleSteps.length - 1);
    }
  }, [visibleSteps, activeIdx]);

const searchParams = useSearchParams();
const resumeIdFromURL = searchParams.get("resumeId");

useEffect(() => {
  if (resumeIdFromURL) {
    const menteeId = sessionStorage.getItem("menteeId");

    setAnalysisData({
      resumeId: resumeIdFromURL,
      menteeId: menteeId || undefined,
    });

    setMode("report");
  }
}, [resumeIdFromURL]);


  if (mode === "choice") {
    return (
      <ChoiceScreen
        isDark={isDark}
        onUpload={() => setMode("upload")}
        onCreate={() => {
          setMode("create");
          setActiveIdx(0);
        }}
      />
    );
  }

  if (mode === "create") {
    return (
      <CreateMode
        isDark={isDark}
        allSteps={allSteps}
        visibleSteps={visibleSteps}
        activeIdx={activeIdx}
        setActiveIdx={(updater) => setActiveIdx((i) => updater(i))}
        cvType={cvType}
        setCvType={setCvType}
        cvData={cvData}
        setCvData={setCvData}
        targetRole={targetRole}
        setTargetRole={setTargetRole}
        jobDescription={jobDescription}
        setJobDescription={setJobDescription}
        onBack={() => {
          setMode("choice");
          setCvType("general");
          setActiveIdx(0);
        }}
        onSubmit={(data) => {
          setAnalysisData({
            menteeId: data?.menteeId,
            resumeId: data?.resumeId,
            analysis: data?.analysis || data,
          });
          setMode("report");
        }}
      />
    );
  }

  if (mode === "upload") {
    return (
      <UploadMode
        isDark={isDark}
        onBack={() => setMode("choice")}
        onSuccess={(data) => {
          setAnalysisData({
            menteeId: data?.menteeId,
            resumeId: data?.resumeId,
            analysis: data?.analysis || data,
          });
          setMode("report");
        }}
      />
    );
  }

  if (mode === "report") {
    return (
      <div
        className={`min-h-screen p-8 transition-all ${
          isDark ? "bg-[#0a0f1e] text-white" : "bg-[#f5f3ff] text-[#2e1065]"
        }`}
      >
        <CVReportView
          data={analysisData?.analysis}
          menteeId={analysisData?.menteeId}
          resumeId={analysisData?.resumeId}
          isDark={isDark}
        />

        <div className="flex justify-end mt-8">
          <Button
            onClick={() => setMode("choice")}
            className={
              isDark
                ? "bg-white/10 hover:bg-white/15 border border-white/20"
                : "bg-white border border-[#ddd6fe] text-[#2e1065] hover:bg-purple-50"
            }
          >
            ← Back to Main
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-8 ${
        isDark ? "bg-[#0a0f1e] text-white" : "bg-[#f5f3ff] text-[#2e1065]"
      }`}
    >
      <Button onClick={() => setMode("choice")} className="mb-6">
        Back
      </Button>
      <div
        className={`${
          isDark ? "bg-white/5 border-white/10" : "bg-white border-[#e9d5ff]"
        } border rounded-xl p-8`}
      >
        <h2 className="text-xl font-semibold mb-2">Upload CV (Coming soon)</h2>
        <p className={isDark ? "text-[#99a1af]" : "text-[#6b21a8]"}>
          ATS check, parsing، و AI feedback.
        </p>
      </div>
    </div>
  );
}

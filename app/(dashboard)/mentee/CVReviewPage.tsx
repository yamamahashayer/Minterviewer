"use client";

import React, { useMemo, useState, useEffect } from "react";
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
import ChoiceScreen from "../../components/MenteeCV/ChoiceScreen";
import CreateMode from "../../components/MenteeCV/create/CreateMode";

import type {
  CVData,
  CvType,
  StepKey,
  StepMeta,
} from "../../components/MenteeCV/create/types";
import UploadMode from "@/app/components/MenteeCV/upload/UploadMode";

export default function CVReviewPage({
  theme = "dark",
}: {
  theme?: "dark" | "light";
}) {
  const isDark = theme === "dark";

  const [mode, setMode] = useState<"choice" | "upload" | "create">("choice");
  const [cvType, setCvType] = useState<CvType>("general");
  const [cvData, setCvData] = useState<CVData>({
    personal: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
      linkedin: "",
      portfolio: "",
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
      "projects", // ✅
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

  // ========== واجهات ==========
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
            />
          );
        }
        if (mode === "upload") {
        return (
          <UploadMode
            isDark={isDark}
            onBack={() => setMode("choice")}
            
          />
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

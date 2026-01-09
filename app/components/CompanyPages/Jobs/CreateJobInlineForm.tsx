"use client";

import React, { useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/app/components/ui/tabs";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/app/components/ui/select";

import ApplicationProcessTab from "./ApplicationProcessTab";

type Theme = "dark" | "light";

interface Props {
  onCancel: () => void;
  onSaved: () => void;
  theme: Theme;
  job?: any;
}

export default function CreateJobInlineForm({ onCancel, onSaved, theme, job }: Props) {
  const isDark = theme === "dark";

  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(false);

  // BASIC FIELDS
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [level, setLevel] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [deadline, setDeadline] = useState("");

  // INTERVIEW PROCESS STATES
  const [enableCVAnalysis, setEnableCVAnalysis] = useState(true);
  const [interviewType, setInterviewType] = useState<"none" | "ai" | "human">(
    "none"
  );
  const [questionCount, setQuestionCount] = useState(5);
  const [aiFocus, setAiFocus] = useState<string[]>([]);
  const [aiQuestions, setAiQuestions] = useState("");
  const [humanType, setHumanType] = useState<"hr" | "mentor" | "">("");

  // ERROR STATES
  const [errors, setErrors] = useState<any>({});

  const inputClass = `w-full px-3 py-2 rounded-lg border outline-none ${isDark
    ? "bg-[#141414] border-gray-700 text-white placeholder-gray-400"
    : "bg-white border-gray-300 text-black placeholder-gray-500"
    }`;

  const cardClass = `p-6 rounded-xl border shadow-sm ${isDark ? "bg-[#161821] border-gray-700" : "bg-white border-gray-200"
    } space-y-4`;

    const generatedUserNotes = `
     You are analyzing a CV for the following job position.

      Job Title: ${title}
      Job Type: ${type}
      Level: ${level}

      Required Skills:
      ${skills
        .split(",")
        .map((s) => `- ${s.trim()}`)
        .join("\n")}

      Evaluation Focus:
      ${aiFocus.map((f) => `- ${f}`).join("\n")}

      Instructions:
      - Evaluate how well the candidate matches the job requirements.
      - Focus on ATS compatibility and keyword alignment.
      - Identify missing or weak skills.
      - Assess suitability for the specified job level.
      - Provide a concise and objective evaluation.

      `;



  // ============================
  //         VALIDATION
  // ============================
  const validate = () => {
    const err: any = {};

    if (!title.trim()) err.title = "Job title is required.";
    if (!type.trim()) err.type = "Employment type is required.";
    if (!location.trim()) err.location = "Location is required.";
    if (!level.trim()) err.level = "Seniority level is required.";
    if (!deadline.trim()) err.deadline = "Deadline is required.";

    if (!description.trim()) err.description = "Job description is required.";
    if (!skills.trim()) err.skills = "Add at least one skill.";

    if (interviewType === "ai" && aiFocus.length === 0)
      err.aiFocus = "Select at least one AI focus.";

    if (interviewType === "human" && !humanType)
      err.humanType = "Select interview type.";

    return err;
  };

  // ============================
  //        CREATE JOB
  // ============================
  const createJob = async () => {
    const err = validate();
    setErrors(err);

    if (Object.keys(err).length > 0) return; // ❌ stop

    setLoading(true);

    const raw = sessionStorage.getItem("user");
    if (!raw) return;
    const user = JSON.parse(raw);

    const payload = {
      title,
      type,
      location,
      level,
      salaryRange,
      description,
      skills: skills.split(",").map((s) => s.trim()),
      deadline,
      enableCVAnalysis,
      interviewType,
      questionCount,
      aiFocus,
      aiQuestions,
      humanType,
      userNotes: generatedUserNotes,
    };

    const res = await fetch(`/api/company/${user.companyId}/jobs`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setLoading(false);

    if (data.ok) {
      onSaved();
      setActiveTab("basic");
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-2">Create Job Post</h2>
      <p className="text-gray-500 mb-6">
        Fill out the information to publish a new job opening.
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList
          className={`mb-4 rounded-lg ${isDark ? "bg-white/10" : "bg-gray-100"
            }`}
        >
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="desc">Description</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="process">Application Process</TabsTrigger>
        </TabsList>

        {/* ==================== BASIC INFO ==================== */}
        <TabsContent value="basic">
          <div className={cardClass}>
            {/* Job Title + Type */}
            <div className="grid grid-cols-2 gap-4">
              {/* TITLE */}
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Job Title <span className="text-red-500">*</span>
                </label>

                <input
                  className={inputClass}
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setErrors({ ...errors, title: "" });
                  }}
                />

                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title}</p>
                )}
              </div>

              {/* TYPE */}
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Employment Type <span className="text-red-500">*</span>
                </label>

                <Select
                  onValueChange={(v) => {
                    setType(v);
                    setErrors({ ...errors, type: "" });
                  }}
                >
                  <SelectTrigger className={inputClass}>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>

                {errors.type && (
                  <p className="text-red-500 text-sm">{errors.type}</p>
                )}
              </div>
            </div>

            {/* Location + Level */}
            <div className="grid grid-cols-2 gap-4">
              {/* LOCATION */}
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Location <span className="text-red-500">*</span>
                </label>

                <input
                  className={inputClass}
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setErrors({ ...errors, location: "" });
                  }}
                />

                {errors.location && (
                  <p className="text-red-500 text-sm">{errors.location}</p>
                )}
              </div>

              {/* LEVEL */}
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Seniority Level <span className="text-red-500">*</span>
                </label>

                <Select
                  onValueChange={(v) => {
                    setLevel(v);
                    setErrors({ ...errors, level: "" });
                  }}
                >
                  <SelectTrigger className={inputClass}>
                    <SelectValue placeholder="Select Level" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="Intern">Intern</SelectItem>
                    <SelectItem value="Junior">Junior</SelectItem>
                    <SelectItem value="Mid">Mid</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                    <SelectItem value="Lead">Lead</SelectItem>
                  </SelectContent>
                </Select>

                {errors.level && (
                  <p className="text-red-500 text-sm">{errors.level}</p>
                )}
              </div>
            </div>

            {/* Salary */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Salary Range</label>

              <input
                className={inputClass}
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
              />
            </div>

            {/* Deadline */}
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Application Deadline <span className="text-red-500">*</span>
              </label>

              <input
                type="date"
                className={inputClass}
                value={deadline}
                onChange={(e) => {
                  setDeadline(e.target.value);
                  setErrors({ ...errors, deadline: "" });
                }}
              />

              {errors.deadline && (
                <p className="text-red-500 text-sm">{errors.deadline}</p>
              )}
            </div>

            <button
              onClick={() => setActiveTab("desc")}
              className="mt-4 px-6 py-2 rounded-lg text-white bg-purple-600 hover:bg-purple-700"
            >
              Next →
            </button>
          </div>
        </TabsContent>

        {/* ==================== DESCRIPTION ==================== */}
        <TabsContent value="desc">
          <div className={cardClass}>
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Job Description <span className="text-red-500">*</span>
              </label>

              <textarea
                className={`${inputClass} min-h-[140px]`}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setErrors({ ...errors, description: "" });
                }}
              />

              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
              )}
            </div>

            <button
              onClick={() => setActiveTab("skills")}
              className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Next →
            </button>
          </div>
        </TabsContent>

        {/* ==================== SKILLS ==================== */}
        <TabsContent value="skills">
          <div className={cardClass}>
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Required Skills <span className="text-red-500">*</span>
              </label>

              <input
                className={inputClass}
                value={skills}
                onChange={(e) => {
                  setSkills(e.target.value);
                  setErrors({ ...errors, skills: "" });
                }}
              />

              {errors.skills && (
                <p className="text-red-500 text-sm">{errors.skills}</p>
              )}

              <p className="text-xs text-gray-500">
                Add skills separated by commas.
              </p>
            </div>

            <button
              onClick={() => setActiveTab("process")}
              className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Next →
            </button>
          </div>
        </TabsContent>

        {/* ==================== PROCESS ==================== */}
        <TabsContent value="process">
          <ApplicationProcessTab
            theme={theme}
            inputClass={inputClass}
            enableCVAnalysis={enableCVAnalysis}
            setEnableCVAnalysis={setEnableCVAnalysis}
            interviewType={interviewType}
            setInterviewType={setInterviewType}
            questionCount={questionCount}
            setQuestionCount={setQuestionCount}
            aiFocus={aiFocus}
            setAiFocus={setAiFocus}
            aiQuestions={aiQuestions}
            setAiQuestions={setAiQuestions}
            humanType={humanType}
            setHumanType={setHumanType}
            onSubmit={createJob}
            loading={loading}
            errors={errors}
            setErrors={setErrors}
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end mt-4">
        <button onClick={onCancel} className="text-gray-500 hover:text-black">
          Cancel
        </button>
      </div>
    </div>
  );
}

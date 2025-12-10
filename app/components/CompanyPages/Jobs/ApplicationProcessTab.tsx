"use client";

import React from "react";
import FlowToggle from "./FlowToggle";

interface ApplicationProcessTabProps {
  theme: "dark" | "light";
  inputClass: string;

  enableCVAnalysis: boolean;
  setEnableCVAnalysis: (v: boolean) => void;

  interviewType: "none" | "ai" | "human";
  setInterviewType: (v: "none" | "ai" | "human") => void;

  aiFocus: string[];
  setAiFocus: (v: string[]) => void;

  aiQuestions: string;
  setAiQuestions: (v: string) => void;

  humanType: "" | "hr" | "mentor";
  setHumanType: (v: "" | "hr" | "mentor") => void;

  onSubmit: () => void;
}

export default function ApplicationProcessTab({
  theme,
  inputClass,
  enableCVAnalysis,
  setEnableCVAnalysis,
  interviewType,
  setInterviewType,
  aiFocus,
  setAiFocus,
  aiQuestions,
  setAiQuestions,
  humanType,
  setHumanType,
  onSubmit,
}: ApplicationProcessTabProps) {

  const isDark = theme === "dark";

  const cardClass = `p-6 rounded-xl border shadow-sm ${
    isDark ? "bg-[#161821] border-gray-700" : "bg-white border-gray-200"
  } space-y-6`;

  return (
    <div className={cardClass}>

      {/* ===========================
          OVERVIEW
      ============================ */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">
          How the Application Process Works
        </h3>

        <p className={`text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Your job post can include optional steps such as CV evaluation, AI screening,
          and human interviews. These steps help your company identify the most qualified
          candidates while providing a smooth and structured application experience.
        </p>

        <ul className={`list-disc pl-5 space-y-1 text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          <li><strong>AI CV Analysis:</strong> The system reviews the applicant’s CV automatically.</li>
          <li><strong>Interview Stage:</strong> Select either AI or Human interviews.</li>
          <li><strong>Final Selection:</strong> Candidates move forward depending on your settings.</li>
        </ul>
      </div>


      {/* ===========================
          CV REQUIREMENTS
      ============================ */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">CV Requirements</h3>

        <FlowToggle
          label="Enable AI CV Analysis"
          value={enableCVAnalysis}
          onChange={setEnableCVAnalysis}
          theme={theme}
        />

        <p className="text-xs text-gray-500">
          AI evaluates CV quality, relevance, strengths, and matching score.
        </p>
      </div>


      {/* ===========================
          INTERVIEW TYPE
      ============================ */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Interview Type</h3>

        {/* None */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="interview"
              checked={interviewType === "none"}
              onChange={() => setInterviewType("none")}
            />
            <span>No Interview Required</span>
          </label>

          {interviewType === "none" && (
            <p className="text-xs ml-6 text-gray-500">
              Applicants proceed based on CV analysis only.
            </p>
          )}
        </div>

        {/* AI Interview */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="interview"
              checked={interviewType === "ai"}
              onChange={() => setInterviewType("ai")}
            />
            <span>AI Interview</span>
          </label>

          <p className="text-xs ml-6 text-gray-500">
            AI generates and evaluates all interview questions automatically.
          </p>

          {interviewType === "ai" && (
            <div className="mt-3 ml-6 p-4 rounded-lg border bg-purple-50/10 space-y-4">

              <h4 className="font-semibold text-purple-600">AI Interview Settings</h4>

              {/* Focus Areas */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Focus Areas</label>
                <input
                  className={inputClass}
                  value={aiFocus.join(", ")}
                  onChange={(e) =>
                    setAiFocus(e.target.value.split(",").map((s) => s.trim()))
                  }
                  placeholder="e.g. JavaScript, Problem Solving, Communication"
                />
              </div>

              {/* Custom Questions */}
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Custom Interview Questions
                </label>
                <textarea
                  className={`${inputClass} min-h-[100px]`}
                  value={aiQuestions}
                  onChange={(e) => setAiQuestions(e.target.value)}
                  placeholder="Optional guidelines or required questions..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Human Interview */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="interview"
              checked={interviewType === "human"}
              onChange={() => setInterviewType("human")}
            />
            <span>Human Interview</span>
          </label>

          <p className="text-xs ml-6 text-gray-500">
            Choose whether interviews are handled by HR or a certified mentor.
          </p>

          {interviewType === "human" && (
            <div className="mt-3 ml-6 p-4 rounded-lg border bg-blue-50/10 space-y-4">

              <h4 className="font-semibold text-blue-600">Human Interview Settings</h4>

              {/* HR */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="humanType"
                  checked={humanType === "hr"}
                  onChange={() => setHumanType("hr")}
                />
                <span>HR Interview</span>
              </label>

              {/* Mentor */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="humanType"
                  checked={humanType === "mentor"}
                  onChange={() => setHumanType("mentor")}
                />
                <span>Mentor Interview</span>
              </label>
            </div>
          )}
        </div>
      </div>


      {/* SUBMIT BUTTON */}
      <button
        onClick={onSubmit}
        className="mt-6 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
      >
        Publish Job
      </button>
    </div>
  );
}

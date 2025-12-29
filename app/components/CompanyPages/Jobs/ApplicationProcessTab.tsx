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

  questionCount: number;
  setQuestionCount: (v: number) => void;

  aiFocus: string[];
  setAiFocus: (v: string[]) => void;

  aiQuestions: string;
  setAiQuestions: (v: string) => void;

  humanType: "" | "hr" | "mentor";
  setHumanType: (v: "" | "hr" | "mentor") => void;

  errors: any;
  setErrors: (v: any) => void;

  loading: boolean;
  onSubmit: () => void;
}

export default function ApplicationProcessTab(props: ApplicationProcessTabProps) {
  const {
    theme,
    inputClass,
    enableCVAnalysis,
    setEnableCVAnalysis,
    interviewType,
    setInterviewType,
    questionCount,
    setQuestionCount,
    aiFocus,
    setAiFocus,
    aiQuestions,
    setAiQuestions,
    humanType,
    setHumanType,
    errors,
    setErrors,
    loading,
    onSubmit,
  } = props;
  const isDark = theme === "dark";

  const cardClass = `p-6 rounded-xl border shadow-sm ${isDark ? "bg-[#161821] border-gray-700" : "bg-white border-gray-200"
    } space-y-6`;

  return (
    <div className={cardClass}>
      {/* ===========================
          OVERVIEW
      ============================ */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">How the Application Process Works</h3>

        <p className={`text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Your job post can include optional steps such as CV evaluation, AI
          screening, and human interviews. These steps help your company identify the
          most qualified candidates.
        </p>
      </div>

      {/* ===========================
          CV REQUIREMENTS
      ============================ */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">CV Requirements</h3>

        <FlowToggle
          label="Enable AI CV Analysis"
          value={enableCVAnalysis}
          onChange={(v) => {
            setEnableCVAnalysis(v);
          }}
          theme={theme}
        />

        <p className="text-xs text-gray-500">
          AI evaluates CV quality, relevance, strengths, and matching score.
        </p>
      </div>

      {/* ===========================
          INTERVIEW TYPES
      ============================ */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Interview Type</h3>

        {/* No Interview */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={interviewType === "none"}
              onChange={() => {
                setInterviewType("none");
                setErrors({ ...errors, aiFocus: "", humanType: "" });
              }}
            />
            <span>No Interview Required</span>
          </label>
        </div>

        {/* AI Interview */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={interviewType === "ai"}
              onChange={() => {
                setInterviewType("ai");
                setErrors({ ...errors, humanType: "" });
              }}
            />
            <span>AI Interview</span>
          </label>

          {interviewType === "ai" && (
            <div className="mt-3 ml-6 p-4 rounded-lg border bg-purple-50/10 space-y-4">
              <h4 className="font-semibold text-purple-600">AI Interview Settings</h4>

              {/* Number of Questions */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex justify-between">
                  <span>Number of Questions</span>
                  <span className="text-purple-600 font-bold">{questionCount}</span>
                </label>
                <input
                  type="range"
                  min="3"
                  max="10"
                  step="1"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>3 Questions</span>
                  <span>10 Questions</span>
                </div>
              </div>

              {/* Focus Areas */}
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Focus Areas <span className="text-red-500">*</span>
                </label>

                <input
                  className={inputClass}
                  value={aiFocus.join(", ")}
                  onChange={(e) => {
                    setAiFocus(e.target.value.split(",").map((s) => s.trim()));
                    setErrors({ ...errors, aiFocus: "" });
                  }}
                  placeholder="e.g. JavaScript, Communication..."
                />

                {errors.aiFocus && (
                  <p className="text-red-500 text-sm">{errors.aiFocus}</p>
                )}
              </div>

              {/* Custom Questions */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Custom Interview Questions</label>
                <textarea
                  className={`${inputClass} min-h-[100px]`}
                  value={aiQuestions}
                  onChange={(e) => setAiQuestions(e.target.value)}
                  placeholder="Optional custom questions..."
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
              checked={interviewType === "human"}
              onChange={() => {
                setInterviewType("human");
                setErrors({ ...errors, aiFocus: "" });
              }}
            />
            <span>Human Interview</span>
          </label>

          {interviewType === "human" && (
            <div className="mt-3 ml-6 p-4 rounded-lg border bg-blue-50/10 space-y-4">
              <h4 className="font-semibold text-blue-600">Human Interview Settings</h4>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="humanType"
                  checked={humanType === "hr"}
                  onChange={() => {
                    setHumanType("hr");
                    setErrors({ ...errors, humanType: "" });
                  }}
                />
                <span>HR Interview</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="humanType"
                  checked={humanType === "mentor"}
                  onChange={() => {
                    setHumanType("mentor");
                    setErrors({ ...errors, humanType: "" });
                  }}
                />
                <span>Mentor Interview</span>
              </label>

              {errors.humanType && (
                <p className="text-red-500 text-sm">{errors.humanType}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <button
        onClick={onSubmit}
        disabled={loading}
        className={`
          mt-6 px-6 py-3 rounded-lg text-white font-semibold
          ${loading
            ? "bg-purple-400 cursor-not-allowed"
            : "bg-purple-600 hover:bg-purple-700"
          }
          flex items-center justify-center gap-2
        `}
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          "Publish Job"
        )}
      </button>
    </div>
  );
}

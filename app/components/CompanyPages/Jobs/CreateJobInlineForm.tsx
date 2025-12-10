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

export default function CreateJobInlineForm({ onCancel, onSaved, theme }) {
  const isDark = theme === "dark";

  const [activeTab, setActiveTab] = useState("basic");

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
  const [interviewType, setInterviewType] = useState<"none" | "ai" | "human">("none");
  const [aiFocus, setAiFocus] = useState<string[]>([]);
  const [aiQuestions, setAiQuestions] = useState("");
  const [humanType, setHumanType] = useState<"hr" | "mentor" | "">("");

  const inputClass = `w-full px-3 py-2 rounded-lg border outline-none ${
    isDark
      ? "bg-[#141414] border-gray-700 text-white placeholder-gray-400"
      : "bg-white border-gray-300 text-black placeholder-gray-500"
  }`;

  const cardClass = `p-6 rounded-xl border shadow-sm ${
isDark ? "bg-[#161821] border-gray-700" : "bg-white border-gray-200"
  } space-y-4`;

  const createJob = async () => {
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
      aiFocus,
      aiQuestions,
      humanType,
    };

    const res = await fetch(`/api/company/${user.companyId}/jobs`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (data.ok) onSaved();
  };

  return (
    <div className="mt-4">

      <h2 className="text-2xl font-bold mb-2">Create Job Post</h2>
      <p className="text-gray-500 mb-6">Fill out the information to publish a new job opening.</p>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className={`mb-4 rounded-lg ${isDark ? "bg-white/10" : "bg-gray-100"}`}>
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="desc">Description</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="process">Application Process</TabsTrigger>
        </TabsList>

        {/* BASIC INFO */}
          <TabsContent value="basic">
  <div className={cardClass}>

    {/* Job Title + Type */}
    <div className="grid grid-cols-2 gap-4">

      {/* Job Title */}
      <div className="space-y-1">
        <label className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          Job Title
        </label>
        <input
          className={inputClass}
          placeholder="e.g. Frontend Developer"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Employment Type */}
      <div className="space-y-1">
        <label className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          Employment Type
        </label>

        <Select onValueChange={setType}>
          <SelectTrigger className={inputClass + " cursor-pointer"}>
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
      </div>

    </div>

    {/* Location + Level */}
    <div className="grid grid-cols-2 gap-4">

      {/* Location */}
      <div className="space-y-1">
        <label className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          Location
        </label>
        <input
          className={inputClass}
          placeholder="e.g. Ramallah"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      {/* Seniority Level */}
      <div className="space-y-1">
        <label className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          Seniority Level
        </label>

        <Select onValueChange={setLevel}>
          <SelectTrigger className={inputClass + " cursor-pointer"}>
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
      </div>

    </div>

    {/* Salary */}
    <div className="space-y-1">
      <label className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
        Salary Range
      </label>
      <input
        className={inputClass}
        placeholder="e.g. $800–$1200"
        value={salaryRange}
        onChange={(e) => setSalaryRange(e.target.value)}
      />
    </div>

    {/* Deadline */}
    <div className="space-y-1">
      <label className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
        Application Deadline
      </label>

      <input
        className={inputClass}
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />
    </div>

    <button
      onClick={() => setActiveTab("desc")}
      className="mt-4 px-6 py-2 rounded-lg text-white bg-purple-600 hover:bg-purple-700"
    >
      Next →
    </button>

  </div>
          </TabsContent>


          {/* DESCRIPTION */}
      <TabsContent value="desc">
        <div className={cardClass}>

          <div className="space-y-1">
            <label className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Job Description
            </label>

            <textarea
              className={`${inputClass} min-h-[140px]`}
              placeholder="Write a clear description of the responsibilities, requirements, and expectations..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button
            onClick={() => setActiveTab("skills")}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Next →
          </button>

        </div>
      </TabsContent>


      {/* SKILLS */}
      <TabsContent value="skills">
        <div className={cardClass}>

          <div className="space-y-1">
            <label className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Required Skills
            </label>

            <input
              className={inputClass}
              placeholder="e.g. React, JavaScript, Problem-Solving"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />

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


        {/* APPLICATION PROCESS — MOVED TO SEPARATE COMPONENT */}
        <TabsContent value="process">
        <ApplicationProcessTab
          theme={theme}
          inputClass={inputClass}
          enableCVAnalysis={enableCVAnalysis}
          setEnableCVAnalysis={setEnableCVAnalysis}
          interviewType={interviewType}
          setInterviewType={setInterviewType}
          aiFocus={aiFocus}
          setAiFocus={setAiFocus}
          aiQuestions={aiQuestions}
          setAiQuestions={setAiQuestions}
          humanType={humanType}
          setHumanType={setHumanType}
          onSubmit={createJob}
        />
      </TabsContent>


      </Tabs>

      <div className="flex justify-end mt-4">
        <button onClick={onCancel} className="text-gray-500 hover:text-black">Cancel</button>
      </div>
    </div>
  );
}

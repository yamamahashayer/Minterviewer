"use client";

import React from "react";
import {
  Briefcase,
  Languages,
  Tag,
  X,
} from "lucide-react";

import MentorBackgroundSection from "../../Background/MentorBackgroundSection";
import CertificationsSection from "./certificationsSection";

/* ============================================
   OPTIONS (Dropdown lists)
============================================ */
const EXPERTISE_OPTIONS = [
  "Frontend Development",
  "Backend Development",
  "Full-Stack Development",
  "Mobile Development",
  "Cloud Engineering",
  "DevOps Engineering",
  "Cyber Security",
  "Data Engineering",
  "Machine Learning",
  "AI Engineering",
  "UI/UX Design",
  "Game Development",
];

const FOCUS_OPTIONS = [
  "Interview Preparation",
  "System Design",
  "Career Coaching",
  "Mock Interviews",
  "CV Review",
  "Portfolio Review",
  "Tech Roadmapping",
  "Skill Upskilling",
];

const LANGUAGE_OPTIONS = [
  "English",
  "Arabic",
  "French",
  "Spanish",
  "German",
  "Turkish",
  "Portuguese",
];

/* ============================================
   PROPS
============================================ */
type ExpertiseProps = {
  profile: any;
  mentorId: string | null;
  isEditing: boolean;
  isDark: boolean;
  onFieldChange: (key: string, value: any) => void;
};

/* ============================================
   MAIN COMPONENT
============================================ */
export default function ExpertiseSection({
  profile,
  mentorId,
  isEditing,
  isDark,
  onFieldChange
}: ExpertiseProps) {

  /* ---------- Helpers ---------- */
  const addToArray = (key: string, value: string) => {
    if (!value.trim()) return;

    const arr = [...(profile[key] || [])];
    const val = value.trim();

    if (!arr.includes(val)) {
      arr.push(val);
      onFieldChange(key, arr);
    }
  };

  const removeFromArray = (key: string, index: number) => {
    const arr = [...(profile[key] || [])];
    arr.splice(index, 1);
    onFieldChange(key, arr);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* BACKGROUND */}
      <div className="md:col-span-2">
        <MentorBackgroundSection
          mentorId={mentorId}
          theme={isDark ? "dark" : "light"}
        />
      </div>

      {/* CERTIFICATIONS */}
      <div className="md:col-span-2">
       <CertificationsSection
              profile={profile}
              isEditing={isEditing}
              isDark={isDark}  // ← مهم
              onFieldChange={onFieldChange}
          />
      </div>

      {/* AREAS OF EXPERTISE */}
      <Card isDark={isDark}>
        <TagInput
          label="Areas of Expertise"
          icon={<Tag className="w-5 h-5 text-purple-400" />}
          items={profile.area_of_expertise || []}
          isEditing={isEditing}
          isDark={isDark}
          onAdd={(v) => addToArray("area_of_expertise", v)}
          onRemove={(i) => removeFromArray("area_of_expertise", i)}
          dropdown={EXPERTISE_OPTIONS}
        />
      </Card>

      {/* FOCUS AREAS */}
      <Card isDark={isDark}>
        <TagInput
          label="Focus Areas"
          icon={<Tag className="w-5 h-5 text-purple-400" />}
          items={profile.focusAreas || []}
          isEditing={isEditing}
          isDark={isDark}
          onAdd={(v) => addToArray("focusAreas", v)}
          onRemove={(i) => removeFromArray("focusAreas", i)}
          dropdown={FOCUS_OPTIONS}
        />
      </Card>

      {/* YEARS OF EXPERIENCE */}
      <Card isDark={isDark}>
        <SectionTitle
          title="Years of Experience"
          icon={<Briefcase className="w-5 h-5 text-purple-400" />}
          isDark={isDark}
        />

        {isEditing ? (
          <input
            type="number"
            min={0}
            className={
              `w-full rounded-md p-2 border outline-none ${
                isDark
                  ? "bg-[rgba(255,255,255,0.05)] text-white border-teal-300/20"
                  : "bg-[var(--card)] border-[var(--border)]"
              }`
            }
            value={profile.yearsOfExperience || ""}
            onChange={(e) =>
              onFieldChange("yearsOfExperience", Number(e.target.value))
            }
          />
        ) : (
          <ValueText
            isDark={isDark}
            value={`${profile.yearsOfExperience || 0} years`}
          />
        )}
      </Card>

      {/* LANGUAGES */}
      <Card isDark={isDark}>
        <TagInput
          label="Languages"
          icon={<Languages className="w-5 h-5 text-purple-400" />}
          items={profile.languages || []}
          isEditing={isEditing}
          isDark={isDark}
          onAdd={(v) => addToArray("languages", v)}
          onRemove={(i) => removeFromArray("languages", i)}
          dropdown={LANGUAGE_OPTIONS}
        />
      </Card>
    </div>
  );
}

/* ============================================
   SUB COMPONENTS — DARK MODE COMPLETE
============================================ */

function Card({ children, isDark }: any) {
  return (
    <div
      className={
        `p-6 rounded-xl border backdrop-blur-sm ${
          isDark
            ? "bg-gradient-to-br from-[rgba(255,255,255,0.06)] to-[rgba(255,255,255,0.02)] border-teal-300/20 shadow-[0_0_25px_rgba(0,255,255,0.06)]"
            : "bg-white border-[#e5d4ff]"
        }`
      }
    >
      {children}
    </div>
  );
}

function SectionTitle({ title, icon, isDark }: any) {
  return (
    <h3
      className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
        isDark ? "text-white" : "text-[var(--foreground)]"
      }`}
    >
      {icon}
      {title}
    </h3>
  );
}

function ValueText({ value, isDark }: any) {
  return (
    <p className={isDark ? "text-white/70" : "text-[var(--foreground-muted)]"}>
      {value || "—"}
    </p>
  );
}

/* ============================================
   TAG INPUT (FINAL DARK MODE VERSION)
============================================ */
function TagInput({
  label,
  icon,
  items = [],
  isEditing,
  onAdd,
  onRemove,
  dropdown = null,
  isDark,
}: any) {
  const [input, setInput] = React.useState("");

  const handleAdd = () => {
    if (input.trim()) {
      onAdd(input.trim());
      setInput("");
    }
  };

  return (
    <div className="flex flex-col gap-3">

      {/* LABEL */}
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <p
          className={`text-sm font-medium ${
            isDark ? "text-white" : "text-[var(--foreground)]"
          }`}
        >
          {label}
        </p>
      </div>

      {/* TAGS BOX */}
      <div
        className={`flex flex-wrap gap-2 p-3 rounded-md border min-h-[50px] ${
          isDark
            ? "bg-[rgba(255,255,255,0.04)] border-teal-300/20"
            : "bg-[var(--card)] border-[var(--border)]"
        }`}
      >
        {items.length === 0 && (
          <p
            className={
              isDark ? "text-white/40 italic" : "text-[var(--foreground-muted)] italic"
            }
          >
            None
          </p>
        )}

        {items.map((item: string, i: number) => (
          <div
            key={i}
            className={`px-3 py-1 rounded-md flex items-center gap-2 border ${
              isDark
                ? "bg-[rgba(255,255,255,0.05)] text-teal-200 border-teal-300/20"
                : "bg-purple-100 text-purple-700 border-purple-300"
            }`}
          >
            {item}

            {isEditing && (
              <X
                className={
                  `w-4 h-4 cursor-pointer ${
                    isDark ? "hover:text-red-300" : "hover:text-red-500"
                  }`
                }
                onClick={() => onRemove(i)}
              />
            )}
          </div>
        ))}

        {/* INPUT */}
        {isEditing && (
          <input
            className={
              `flex-1 min-w-[120px] bg-transparent outline-none ${
                isDark
                  ? "text-white placeholder:text-white/50"
                  : "text-[var(--foreground)]"
              }`
            }
            placeholder="Type and press Enter…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
          />
        )}
      </div>

      {/* ADD BUTTON + DROPDOWN */}
      {isEditing && (
        <div className="flex items-center gap-2 mt-2">

          {/* Add by button */}
          <button
            onClick={handleAdd}
            className={
              `px-4 py-2 rounded-md border ${
                isDark
                  ? "border-teal-400/50 text-teal-300 hover:bg-teal-400/10"
                  : "border-purple-500/40 text-purple-700 hover:bg-purple-500/10"
              }`
            }
          >
            Add
          </button>

          {/* Dropdown */}
          {dropdown && (
            <select
              className={
                `p-2 rounded-md border ${
                  isDark
                    ? "bg-[rgba(255,255,255,0.04)] text-white border-teal-300/20"
                    : "bg-[var(--card)] border-[var(--border)]"
                }`
              }
              value=""
              onChange={(e) => {
                const val = e.target.value;
                if (val) onAdd(val);
              }}
            >
              <option value="">Select…</option>
              {dropdown.map((opt: string, idx: number) => (
                <option key={idx} value={opt}>{opt}</option>
              ))}
            </select>
          )}
        </div>
      )}
    </div>
  );
}

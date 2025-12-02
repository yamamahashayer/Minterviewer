"use client";

import React from "react";
import {
  Briefcase,
  Languages,
  Tag,
  Plus,
  X
} from "lucide-react";

import { Badge } from "@/app/components/ui/badge";
import MentorBackgroundSection from "../../Background/MentorBackgroundSection";

/* ============================================
   Props
============================================ */
type ExpertiseProps = {
  profile: any;
  mentorId: string | null;
  isEditing: boolean;
  onFieldChange: (key: string, value: any) => void;
  onSave: () => void;
  onCancel: () => void;
};

/* ============================================
   MAIN COMPONENT
============================================ */
export default function ExpertiseSection({
  profile,
  mentorId,
  isEditing,
  onFieldChange,
  onSave,
  onCancel,
}: ExpertiseProps) {

  const data = profile || {};
  const iconClass = "w-5 h-5 text-purple-600";

  /* ---------- Helpers ---------- */
  const addToArray = (key: string, item: string) => {
    if (!item.trim()) return;
    const arr = [...(data[key] || []), item.trim()];
    onFieldChange(key, arr);
  };

  const removeFromArray = (key: string, index: number) => {
    const arr = [...(data[key] || [])];
    arr.splice(index, 1);
    onFieldChange(key, arr);
  };

  /* ---------- Input States ---------- */
  const [expertiseInput, setExpertiseInput] = React.useState("");
  const [focusInput, setFocusInput] = React.useState("");
  const [langInput, setLangInput] = React.useState("");

  /* ============================================
     RETURN UI
  ============================================ */
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* ===============================
          🔥 FIRST ROW — ONLY Background
      ================================= */}
      <div className="md:col-span-2">
        <MentorBackgroundSection mentorId={mentorId} theme="light" />
      </div>

      {/* ===============================
          AREAS OF EXPERTISE
      ================================= */}
      <Card>
        <SectionTitle title="Areas of Expertise" icon={<Tag className={iconClass} />} />

        <BadgeList
          items={data.area_of_expertise || []}
          isEditing={isEditing}
          onRemove={(i) => removeFromArray("area_of_expertise", i)}
        />

        {isEditing && (
          <AddRow
            placeholder="Add expertise…"
            value={expertiseInput}
            onChange={setExpertiseInput}
            onAdd={() => {
              addToArray("area_of_expertise", expertiseInput);
              setExpertiseInput("");
            }}
          />
        )}
      </Card>

      {/* ===============================
          FOCUS AREAS
      ================================= */}
      <Card>
        <SectionTitle title="Focus Areas" icon={<Tag className={iconClass} />} />

        <BadgeList
          items={data.focusAreas || []}
          isEditing={isEditing}
          onRemove={(i) => removeFromArray("focusAreas", i)}
        />

        {isEditing && (
          <AddRow
            placeholder="Add focus area…"
            value={focusInput}
            onChange={setFocusInput}
            onAdd={() => {
              addToArray("focusAreas", focusInput);
              setFocusInput("");
            }}
          />
        )}
      </Card>

      {/* ===============================
          YEARS OF EXPERIENCE
      ================================= */}
      <Card>
        <SectionTitle title="Years of Experience" icon={<Briefcase className={iconClass} />} />

        {isEditing ? (
          <input
            type="number"
            min={0}
            className="w-full bg-[var(--card)] border border-[var(--border)] rounded-md p-2"
            value={data.yearsOfExperience || ""}
            onChange={(e) => onFieldChange("yearsOfExperience", e.target.value)}
          />
        ) : (
          <ValueText value={`${data.yearsOfExperience || 0} years`} />
        )}
      </Card>

      {/* ===============================
          LANGUAGES
      ================================= */}
      <Card>
        <SectionTitle title="Languages" icon={<Languages className={iconClass} />} />

        <BadgeList
          items={data.languages || []}
          isEditing={isEditing}
          onRemove={(i) => removeFromArray("languages", i)}
        />

        {isEditing && (
          <div className="mt-4">
            <label className="text-sm text-[var(--foreground-muted)] mb-1 block">
              Add Language
            </label>

            <select
              className="w-full p-2 rounded-md border border-[var(--border)] bg-[var(--card)]"
              value=""
              onChange={(e) => {
                const val = e.target.value;
                if (!val) return;
                if (data.languages?.includes(val)) return;
                addToArray("languages", val);
              }}
            >
              <option value="">Select language…</option>
              <option>English</option>
              <option>Arabic</option>
              <option>French</option>
              <option>Spanish</option>
              <option>German</option>
              <option>Turkish</option>
              <option>Portuguese</option>
            </select>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ============================================
   SUB COMPONENTS
============================================ */

function Card({ children }: any) {
  return (
    <div
      className="p-6 rounded-xl"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ title, icon }: any) {
  return (
    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
      {icon}
      {title}
    </h3>
  );
}

function ValueText({ value }: any) {
  return <p className="text-[var(--foreground-muted)]">{value || "—"}</p>;
}

function BadgeList({ items, isEditing, onRemove }: any) {
  const safeItems = Array.isArray(items) ? items : [];

  if (safeItems.length === 0) {
    return <p className="text-[var(--foreground-muted)] text-sm italic">None</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {safeItems.map((item: string, i: number) => (
        <Badge key={i} variant="outline" className="flex items-center gap-1">
          {item}
          {isEditing && (
            <X
              className="w-3 h-3 cursor-pointer hover:text-red-500"
              onClick={() => onRemove(i)}
            />
          )}
        </Badge>
      ))}
    </div>
  );
}

function AddRow({ placeholder, value, onChange, onAdd }: any) {
  return (
    <div className="mt-3 flex gap-2">
      <input
        className="flex-1 p-2 border border-[var(--border)] rounded-md"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      <button
        onClick={onAdd}
        className="px-3 py-2 bg-purple-600 text-white rounded-md"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}

"use client";

import SectionCard from "../../shared/SectionCard";
import StepHeader from "../../shared/StepHeader";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { GraduationCap, Trash2, Plus } from "lucide-react";

export type Edu = {
  id: number;
  degree: string;
  institution: string;
  location: string;
  graduationDate: string; // "YYYY-MM" or "YYYY"
  gpa?: string;
};

type Props = {
  items: Edu[];
  setItems: (next: (prev: Edu[]) => Edu[]) => void;
  isDark?: boolean;
};

export default function EducationStep({ items, setItems, isDark }: Props) {
  const add = () =>
    setItems((prev) => [
      ...prev,
      { id: Date.now(), degree: "", institution: "", location: "", graduationDate: "", gpa: "" },
    ]);

  const remove = (id: number) => setItems((prev) => prev.filter((x) => x.id !== id));

  const update = <K extends keyof Edu>(id: number, k: K, v: Edu[K]) =>
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, [k]: v } : x)));

  const card =
    "rounded-xl shadow-2xl overflow-hidden " +
    (isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe] bg-white shadow-lg");
  const rowBorder = isDark ? "border-white/10" : "border-[#e9d5ff]";
  const addBtn =
    isDark
      ? "bg-teal-400 text-[#0b1020] hover:bg-teal-300"
      : "bg-purple-600 text-white hover:bg-purple-700";

  return (
    <SectionCard className={card}>
      <StepHeader
        Icon={GraduationCap}
        title="Education"
        subtitle="Add your educational background"
        badgeClass={isDark ? "bg-teal-500/20 border-teal-500/30" : "bg-purple-100 border-purple-300"}
      />

      {items.length === 0 && (
        <div className={`mb-6 rounded-xl border ${rowBorder} p-6 flex items-center justify-between`}>
          <div>
            <div className={isDark ? "text-white font-medium" : "text-[#2e1065] font-medium"}>
              No education entries yet
            </div>
            <div className={isDark ? "text-[#8b95a7] text-sm" : "text-[#7e22ce] text-sm"}>
              Add your degree, institution, and graduation date.
            </div>
          </div>
          <button type="button" onClick={add} className={`px-4 py-2 rounded-lg font-medium ${addBtn}`}>
            <Plus size={16} className="inline mr-2" />
            Add Education
          </button>
        </div>
      )}

      <div className="space-y-5">
        {items.map((ed) => (
          <div key={ed.id} className={`rounded-xl border ${rowBorder}`}>
            <div className={`flex items-center justify-between px-4 py-3 border-b ${rowBorder}`}>
              <span className={isDark ? "text-white/90" : "text-[#2e1065]/90"}>Education</span>
              <button
                type="button"
                onClick={() => remove(ed.id)}
                className="inline-flex items-center gap-1 text-rose-500 hover:text-rose-400 text-sm"
                title="Remove"
              >
                <Trash2 size={16} /> Remove
              </button>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Degree *</Label>
                <Input
                  value={ed.degree}
                  onChange={(e) => update(ed.id, "degree", e.target.value)}
                  placeholder="B.Sc. Computer Science"
                />
              </div>
              <div>
                <Label>Institution *</Label>
                <Input
                  value={ed.institution}
                  onChange={(e) => update(ed.id, "institution", e.target.value)}
                  placeholder="University name"
                />
              </div>
              <div>
                <Label>Location</Label>
                <Input
                  value={ed.location}
                  onChange={(e) => update(ed.id, "location", e.target.value)}
                  placeholder="City, Country"
                />
              </div>
              <div>
                <Label>Graduation Date *</Label>
                <Input
                  value={ed.graduationDate}
                  onChange={(e) => update(ed.id, "graduationDate", e.target.value)}
                  placeholder="2025-06"
                  type="month"
                />
              </div>
              <div className="md:col-span-2">
                <Label>GPA</Label>
                <Input
                  value={ed.gpa || ""}
                  onChange={(e) => update(ed.id, "gpa", e.target.value)}
                  placeholder="3.8/4.0"
                />
              </div>
            </div>
          </div>
        ))}

        {items.length > 0 && (
          <button
            type="button"
            onClick={add}
            className={`w-full border-2 border-dashed rounded-xl py-3 text-sm ${rowBorder} hover:opacity-90`}
          >
            + Add another education
          </button>
        )}
      </div>
    </SectionCard>
  );
}

"use client";

import { useMemo } from "react";
import SectionCard from "../../shared/SectionCard";
import StepHeader from "../../shared/StepHeader";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import { Briefcase, Trash2, Plus } from "lucide-react";

export type Exp = {
  id: number;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string; // "YYYY-MM"
  endDate: string;   // "YYYY-MM"
  current: boolean;
  description: string;
};

type Props = {
  items: Exp[];
  setItems: (next: (prev: Exp[]) => Exp[]) => void;
  isDark?: boolean;
};

export default function ExperienceStep({ items, setItems, isDark }: Props) {
  const add = () =>
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        jobTitle: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      },
    ]);

  const remove = (id: number) =>
    setItems((prev) => prev.filter((x) => x.id !== id));

  const update = <K extends keyof Exp>(id: number, k: K, v: Exp[K]) =>
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, [k]: v } : x)));

  const card =
    "rounded-xl shadow-2xl overflow-hidden " +
    (isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe] bg-white shadow-lg");
  const rowBorder = isDark ? "border-white/10" : "border-[#e9d5ff]";
  const addBtn =
    isDark
      ? "bg-teal-400 text-[#0b1020] hover:bg-teal-300"
      : "bg-purple-600 text-white hover:bg-purple-700";

  const empty = useMemo(() => items.length === 0, [items.length]);

  return (
    <SectionCard className={card}>
      <StepHeader
        Icon={Briefcase}
        title="Work Experience"
        subtitle="Add your professional experience"
        badgeClass={isDark ? "bg-teal-500/20 border-teal-500/30" : "bg-purple-100 border-purple-300"}
      />

      {empty && (
        <div className={`mb-6 rounded-xl border ${rowBorder} p-6 flex items-center justify-between`}>
          <div>
            <div className={isDark ? "text-white font-medium" : "text-[#2e1065] font-medium"}>
              No positions added yet
            </div>
            <div className={isDark ? "text-[#8b95a7] text-sm" : "text-[#7e22ce] text-sm"}>
              Start with your most recent role.
            </div>
          </div>
          <button type="button" onClick={add} className={`px-4 py-2 rounded-lg font-medium ${addBtn}`}>
            <Plus size={16} className="inline mr-2" />
            Add Position
          </button>
        </div>
      )}

      <div className="space-y-5">
        {items.map((it) => (
          <div key={it.id} className={`rounded-xl border ${rowBorder}`}>
            <div className={`flex items-center justify-between px-4 py-3 border-b ${rowBorder}`}>
              <span className={isDark ? "text-white/90" : "text-[#2e1065]/90"}>Position</span>
              <button
                type="button"
                onClick={() => remove(it.id)}
                className="inline-flex items-center gap-1 text-rose-500 hover:text-rose-400 text-sm"
                title="Remove"
              >
                <Trash2 size={16} /> Remove
              </button>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Job Title *</Label>
                <Input
                  value={it.jobTitle}
                  onChange={(e) => update(it.id, "jobTitle", e.target.value)}
                  placeholder="Software Engineer"
                />
              </div>
              <div>
                <Label>Company *</Label>
                <Input
                  value={it.company}
                  onChange={(e) => update(it.id, "company", e.target.value)}
                  placeholder="Tech Corp"
                />
              </div>
              <div>
                <Label>Location</Label>
                <Input
                  value={it.location}
                  onChange={(e) => update(it.id, "location", e.target.value)}
                  placeholder="City, Country"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="month"
                    value={it.startDate}
                    onChange={(e) => update(it.id, "startDate", e.target.value)}
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input
                    type="month"
                    value={it.endDate}
                    onChange={(e) => update(it.id, "endDate", e.target.value)}
                    disabled={it.current}
                  />
                </div>
                <label className="col-span-2 inline-flex items-center gap-2 text-sm mt-1">
                  <input
                    type="checkbox"
                    checked={it.current}
                    onChange={(e) => update(it.id, "current", e.target.checked)}
                  />
                  Currently working here
                </label>
              </div>

              <div className="md:col-span-2">
                <Label>Description & Achievements</Label>
                <Textarea
                  rows={3}
                  value={it.description}
                  onChange={(e) => update(it.id, "description", e.target.value)}
                  placeholder="• Built X\n• Improved Y by 40%"
                />
              </div>
            </div>
          </div>
        ))}

        {!empty && (
          <button
            type="button"
            onClick={add}
            className={`w-full border-2 border-dashed rounded-xl py-3 text-sm ${rowBorder} hover:opacity-90`}
          >
            + Add another position
          </button>
        )}
      </div>
    </SectionCard>
  );
}

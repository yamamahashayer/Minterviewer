// app/components/MenteeCV/create/steps/ProjectsStep.tsx
"use client";

import { useMemo } from "react";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import SectionCard from "../shared/SectionCard";
import StepHeader from "../shared/StepHeader";
import type { Project } from "../types";
import {
  Plus,
  Trash2,
  FolderGit2,
  Link as LinkIcon,
  GripVertical,
} from "lucide-react";

type Props = {
  projects: Project[];
  setProjects: (next: Project[]) => void;
  isDark?: boolean;
};

export default function ProjectsStep({ projects, setProjects, isDark }: Props) {
  const add = () =>
    setProjects([
      ...projects,
      { id: Date.now(), name: "", description: "", github: "", link: "" },
    ]);

  const update = <K extends keyof Project>(
    id: number,
    key: K,
    value: Project[K]
  ) =>
    setProjects(projects.map((p) => (p.id === id ? { ...p, [key]: value } : p)));

  const remove = (id: number) =>
    setProjects(projects.filter((p) => p.id !== id));

  const cardBase =
    "rounded-xl border transition shadow-sm hover:shadow-md";
  const cardBorder = isDark
    ? "border-white/10 bg-white/5"
    : "border-[#e9d5ff] bg-white";
  const labelCls = `text-sm ${isDark ? "text-[#aab3c2]" : "text-[#6b21a8]"}`;
  const hintCls = `text-xs ${isDark ? "text-[#8b95a7]" : "text-[#7e22ce]"}`;
  const badgeClass = isDark
    ? "bg-teal-500/20 border-teal-500/30"
    : "bg-purple-100 border-purple-300";

  const empty = useMemo(() => projects.length === 0, [projects.length]);

  const outerCard =
    "rounded-xl shadow-2xl overflow-hidden " +
    (isDark
      ? "border-[rgba(94,234,212,0.2)]"
      : "border-[#ddd6fe] bg-white shadow-lg");

  return (
    <SectionCard className={outerCard}>
      <StepHeader
        Icon={FolderGit2}
        title="Projects"
        subtitle="Showcase your selected projects"
        badgeClass={badgeClass}
      />

      {/* Empty State */}
      {empty && (
        <div
          className={`mb-6 ${cardBase} ${cardBorder} p-6 flex items-center justify-between`}
        >
          <div>
            <div
              className={`font-medium ${
                isDark ? "text-white" : "text-[#2e1065]"
              }`}
            >
              No projects added yet
            </div>
            <div className={hintCls}>
              Add your notable projects with GitHub & demo links.
            </div>
          </div>
          <button
            type="button"
            onClick={add}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium
              ${
                isDark
                  ? "bg-teal-400 text-[#0b1020] hover:bg-teal-300"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
          >
            <Plus size={16} /> Add Project
          </button>
        </div>
      )}

      {/* List */}
      <div className="space-y-5">
        {projects.map((p, idx) => (
          <div key={p.id} className={`${cardBase} ${cardBorder}`}>
            {/* Item Header */}
            <div
              className={`flex items-center justify-between px-4 py-3 border-b ${
                isDark ? "border-white/10" : "border-[#e9d5ff]"
              }`}
            >
              <div className="flex items-center gap-2">
                <GripVertical
                  size={16}
                  className={isDark ? "text-[#8b95a7]" : "text-[#7e22ce]"}
                />
                <span
                  className={`text-sm px-2 py-0.5 rounded-full ${
                    isDark
                      ? "bg-white/10 text-white"
                      : "bg-purple-50 text-[#6b21a8]"
                  }`}
                >
                  Project #{idx + 1}
                </span>
              </div>

              <button
                type="button"
                onClick={() => remove(p.id)}
                className="inline-flex items-center gap-1 text-rose-500 hover:text-rose-400 text-sm"
                title="Remove"
              >
                <Trash2 size={16} /> Remove
              </button>
            </div>

            {/* Item Body */}
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={labelCls}>Project Name</label>
                  <Input
                    placeholder="e.g., Minterviewer"
                    value={p.name}
                    onChange={(e) => update(p.id, "name", e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelCls}>Short Description</label>
                  <Textarea
                    placeholder="What it does, tech stack, and your contribution…"
                    rows={3}
                    value={p.description}
                    onChange={(e) => update(p.id, "description", e.target.value)}
                  />
                  <p className={`${hintCls} mt-1`}>
                    Example: Built with Next.js + Tailwind + MongoDB. Implemented authentication,
                    dashboards, and CI/CD.
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <label className={labelCls}>
                    <span className="inline-flex items-center gap-2">
                      <FolderGit2 size={14} />
                      GitHub Link
                    </span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className={hintCls}>https://</span>
                    <Input
                      placeholder="github.com/username/repo"
                      value={p.github || ""}
                      onChange={(e) => update(p.id, "github", e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className={labelCls}>
                    <span className="inline-flex items-center gap-2">
                      <LinkIcon size={14} />
                      Live Demo (optional)
                    </span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className={hintCls}>https://</span>
                    <Input
                      placeholder="your-domain.com/app"
                      value={p.link || ""}
                      onChange={(e) => update(p.id, "link", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add More */}
        {!empty && (
          <button
            type="button"
            onClick={add}
            className={`w-full border-2 border-dashed rounded-xl py-3 flex items-center justify-center gap-2
              ${
                isDark
                  ? "border-white/15 text-[#aab3c2] hover:bg-white/5"
                  : "border-[#e9d5ff] text-[#6b21a8] hover:bg-purple-50"
              }`}
          >
            <Plus size={16} /> Add another project
          </button>
        )}
      </div>
    </SectionCard>
  );
}

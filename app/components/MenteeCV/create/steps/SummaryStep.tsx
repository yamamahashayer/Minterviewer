"use client";

import SectionCard from "../shared/SectionCard";
import StepHeader from "../shared/StepHeader";
import { Textarea } from "@/app/components/ui/textarea";
import { FileText } from "lucide-react";

const TEMPLATES = [
  "Motivated Computer Engineering student with strong foundations in software development and problem-solving. Skilled in JavaScript, React, and backend REST APIs. Passionate about building clean, user-focused applications and continuously improving technical abilities.",

  "Results-driven Full-Stack Developer with experience building scalable web applications using React, Node.js, and MongoDB. Strong focus on clean code, performance optimization, and intuitive UI. Able to collaborate effectively across teams and deliver end-to-end features.",

  "AI-focused Engineer skilled in Python, machine learning models, and data pipeline optimization. Hands-on experience with model deployment and prompt engineering. Passionate about applying AI to solve real-world problems and improve decision-making through data.",

  "Front-End Developer with strong UI/UX mindset and experience designing responsive user interfaces using React, Tailwind CSS, and Figma. Focused on delivering clean, accessible, and user-centered digital experiences.",

  "Backend Developer experienced in designing scalable REST APIs, relational databases, and authentication systems. Strong understanding of distributed systems and clean architecture principles.",
];

const PHRASES = [
  "results-driven",
  "detail-oriented",
  "customer-focused",
  "cross-functional collaboration",
  "scalable architectures",
  "performance optimization",
  "CI/CD",
  "Docker & containers",
  "REST/GraphQL APIs",
  "clean code",
];

export default function SummaryStep({
  value,
  onChange,
  isDark,
}: {
  value: string;
  onChange: (v: string) => void;
  isDark?: boolean;
}) {
  const card =
    "rounded-xl shadow-2xl overflow-hidden " +
    (isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe] bg-white shadow-lg");

  const pill =
    "px-3 py-2 rounded-lg border text-xs cursor-pointer truncate hover:opacity-90";
  const border = isDark ? "border-white/10" : "border-[#e9d5ff]";

  const append = (txt: string) =>
    onChange((value ? value.trim() + " " : "") + txt);

  return (
    <SectionCard className={card}>
      <StepHeader
        Icon={FileText}
        title="Professional Summary"
        subtitle="2–3 sentences highlighting your strengths"
        badgeClass={isDark ? "bg-teal-500/20 border-teal-500/30" : "bg-purple-100 border-purple-300"}
      />

      {/* Quick templates */}
      <div className={`mb-4 p-3 rounded-xl border ${border}`}>
        <div className="text-xs mb-2 opacity-80">Quick templates — click to use, then edit freely:</div>
        <div className="grid gap-2 md:grid-cols-3">
          {TEMPLATES.map((t, i) => (
            <button
              key={i}
              className={`${pill} ${border} text-left`}
              onClick={() => onChange(t)}
              title="Use template"
            >
              {t.slice(0, 120)}{t.length > 120 ? "…" : ""}
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="mb-2">
        <Textarea
          rows={7}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write a concise 2–3 sentence summary…"
        />
      </div>

      <div className="text-xs opacity-70 mb-4">
        Try 2–3 concise sentences (~200–400 chars).
      </div>

      {/* Phrase chips */}
      <div className={`p-3 rounded-xl border ${border}`}>
        <div className="text-xs mb-2 opacity-80">Click to append phrases:</div>
        <div className="flex flex-wrap gap-2">
          {PHRASES.map((p) => (
            <button key={p} onClick={() => append(p)} className={`${pill} ${border}`}>
              + {p}
            </button>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

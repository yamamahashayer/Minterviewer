"use client";

import { Input } from "../../../../../ui/input";
import { Label } from "../../../../../ui/label";
import type { Education } from "../../types";

type Props = {
  value: Education;
  onChange: (k: keyof Education, v: string) => void;
  isDark?: boolean;
};

export default function EducationItem({ value, onChange, isDark }: Props) {
  const box =
    isDark
      ? "bg-[rgba(255,255,255,0.03)] border-[rgba(94,234,212,0.2)]"
      : "bg-white border-[#e9d5ff]";

  return (
    <div className={`mb-6 p-6 rounded-lg border ${box}`}>
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <Label className="mb-2 block">Degree *</Label>
          <Input
            value={value.degree}
            onChange={(e) => onChange("degree", e.target.value)}
            placeholder="B.Sc. Computer Science"
          />
        </div>

        <div>
          <Label className="mb-2 block">Institution *</Label>
          <Input
            value={value.institution}
            onChange={(e) => onChange("institution", e.target.value)}
            placeholder="University name"
          />
        </div>

        <div>
          <Label className="mb-2 block">Location *</Label>
          <Input
            value={value.location}
            onChange={(e) => onChange("location", e.target.value)}
            placeholder="City, Country"
          />
        </div>

        <div>
          <Label className="mb-2 block">Graduation Date *</Label>
          <Input
            type="month"
            value={value.graduationDate}
            onChange={(e) => onChange("graduationDate", e.target.value)}
            placeholder="2025-06"
          />
        </div>

        <div>
          <Label className="mb-2 block">GPA</Label>
          <Input
            value={value.gpa}
            onChange={(e) => onChange("gpa", e.target.value)}
            placeholder="3.8/4.0"
          />
        </div>
      </div>
    </div>
  );
}

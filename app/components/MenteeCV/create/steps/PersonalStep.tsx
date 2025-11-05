// app/components/MenteeCV/create/steps/PersonalStep.tsx
"use client";
import React, { useEffect, useRef } from "react";
import SectionCard from "../shared/SectionCard";
import StepHeader from "../shared/StepHeader";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { User } from "lucide-react";
import type { Personal } from "../types";

export default function PersonalStep({
  value,
  onChange,
  isDark,
}: {
  value: Personal;
  onChange: (key: keyof Personal, val: string) => void;
  isDark?: boolean;
}) {
  const prefilledOnce = useRef(false);

  useEffect(() => {
    if (prefilledOnce.current) return;

    const token =
      typeof window !== "undefined" ? sessionStorage.getItem("token") : null;
    if (!token) return;

    (async () => {
      try {
        const r = await fetch("/api/auth/session", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const j = await r.json();
        if (!j?.ok || !j?.user) return;

        const u = j.user as {
          full_name?: string;
          email?: string;
          phoneNumber?: string | null;
          Country?: string | null;
          linkedin_url?: string | null;
        };

        const safeSet = (k: keyof Personal, v?: string | null) => {
          if (!v) return;
          const cur = (value?.[k] as string) || "";
          if (!cur.trim()) onChange(k, v);
        };

        safeSet("fullName", u.full_name);
        safeSet("email", u.email);
        safeSet("phone", u.phoneNumber || undefined);
        safeSet("location", u.Country || undefined);
        safeSet("linkedin", u.linkedin_url || undefined);

      } catch {/* تجاهل */}
      finally { prefilledOnce.current = true; }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const card =
    "rounded-xl shadow-2xl overflow-hidden " +
    (isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe] bg-white shadow-lg");

  return (
    <SectionCard className={card}>
      <StepHeader
        Icon={User}
        title="Personal Information"
        subtitle="Tell us about yourself"
        badgeClass={isDark ? "bg-teal-500/20 border-teal-500/30" : "bg-purple-100 border-purple-300"}
      />

      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label className="mb-2 block">Full Name *</Label>
          <Input
            value={value.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            placeholder="John Doe"
          />
        </div>

        <div>
          <Label className="mb-2 block">Email *</Label>
          <Input
            type="email"
            value={value.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="john@email.com"
          />
        </div>

        <div>
          <Label className="mb-2 block">Phone *</Label>
          <Input
            value={value.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <Label className="mb-2 block">Location *</Label>
          <Input
            value={value.location}
            onChange={(e) => onChange("location", e.target.value)}
            placeholder="New York, NY"
          />
        </div>

        <div>
          <Label className="mb-2 block">LinkedIn</Label>
          <Input
            value={value.linkedin || ""}
            onChange={(e) => onChange("linkedin", e.target.value)}
            placeholder="linkedin.com/in/you"
          />
        </div>

        <div>
          <Label className="mb-2 block">Portfolio</Label>
          <Input
            value={value.portfolio || ""}
            onChange={(e) => onChange("portfolio", e.target.value)}
            placeholder="yourdomain.com"
          />
        </div>
      </div>
    </SectionCard>
  );
}

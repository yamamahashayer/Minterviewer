"use client";

import { Badge } from "@/app/components/ui/badge";
import { Briefcase, Layers, BookOpen, Sparkles } from "lucide-react";

export default function ExpertiseSection({ profile }) {
  const data = profile || {};

  return (
    <div className="space-y-6">

      <Section title="Expertise Areas" icon={<Briefcase />}>
        {data.expertise?.map((x, i) => (
          <Badge key={i}>{x}</Badge>
        ))}
      </Section>

      <Section title="Industries" icon={<Layers />}>
        {data.industries?.map((x, i) => (
          <Badge key={i}>{x}</Badge>
        ))}
      </Section>

      <Section title="Languages" icon={<Sparkles />}>
        {data.languages?.map((x, i) => (
          <Badge key={i}>{x}</Badge>
        ))}
      </Section>

      <Section title="Session Types" icon={<BookOpen />}>
        {data.sessionTypes?.map((x, i) => (
          <Badge key={i}>{x}</Badge>
        ))}
      </Section>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div
      className="p-6 rounded-xl border backdrop-blur-xl"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      <div className="flex items-center gap-2 mb-4 text-[var(--foreground)]">
        {icon}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>

      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

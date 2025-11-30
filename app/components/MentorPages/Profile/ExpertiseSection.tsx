"use client";

import { Progress } from "@/app/components/ui/progress";

export default function ExpertiseSection({ expertise }: any) {
  return (
    <div
      className="relative overflow-hidden rounded-xl backdrop-blur-xl p-6"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      <h3 className="text-[var(--foreground)] mb-6">Areas of Expertise</h3>

      <div className="space-y-6">
        {expertise.map((item: any, index: number) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[var(--foreground)]">{item.name}</span>
              <span className="text-cyan-400">{item.level}%</span>
            </div>
            <Progress value={item.level} className="h-2" />
          </div>
        ))}
      </div>
    </div>
  );
}

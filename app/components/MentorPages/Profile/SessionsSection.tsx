"use client";

import { Calendar } from "lucide-react";

export default function SessionsSection({ profile }) {
  const data = profile || {};

  return (
    <div
      className="p-6 rounded-xl border backdrop-blur-xl"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="text-purple-500" />
        <h3 className="text-lg font-semibold text-[var(--foreground)]">
          Available Sessions
        </h3>
      </div>

      {data.availability?.length > 0 ? (
        <ul className="space-y-3">
          {data.availability.map((slot, i) => (
            <li
              key={i}
              className="p-3 rounded-lg border"
              style={{ borderColor: "var(--border)" }}
            >
              {slot.day} — {slot.time}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[var(--foreground-muted)]">No availability set.</p>
      )}
    </div>
  );
}

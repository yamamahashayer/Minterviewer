"use client";

export default function AchievementsSection({ profile }) {
  const data = profile || {};

  return (
    <div
      className="p-6 rounded-xl border backdrop-blur-xl"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">
        Achievements
      </h3>

      {data.achievements?.length > 0 ? (
        <div className="space-y-3">
          {data.achievements.map((a, i) => (
            <div
              key={i}
              className="p-4 rounded-lg border"
              style={{ borderColor: "var(--border)" }}
            >
              {a}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[var(--foreground-muted)]">No achievements listed.</p>
      )}
    </div>
  );
}

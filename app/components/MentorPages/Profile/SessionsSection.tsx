"use client";

export default function SessionsSection({ sessionTypes }: any) {
  return (
    <div
      className="relative overflow-hidden rounded-xl backdrop-blur-xl p-6"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      <h3 className="text-[var(--foreground)] mb-4">Session Types & Pricing</h3>

      <div className="space-y-3">
        {sessionTypes.map((session: any, index: number) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 rounded-lg"
            style={{ background: "var(--background-muted)", border: "1px solid var(--border)" }}
          >
            <div className="flex-1">
              <h4 className="text-[var(--foreground)] text-sm mb-1">
                {session.type}
              </h4>
              <p className="text-[var(--foreground-muted)] text-xs">
                {session.duration} • {session.sessions} sessions completed
              </p>
            </div>

            <div className="text-right">
              <p className="text-cyan-400">${session.price}</p>
              <p className="text-[var(--foreground-muted)] text-xs">per session</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

export default function AchievementsSection({ isDark }: { isDark: boolean }) {
  const items = [
    { title: "Interview Master", desc: "Completed 50+ AI interviews", icon: "✨" },
    { title: "Top Performer", desc: "Ranked in top 10% this month", icon: "🏆" },
    { title: "Skill Builder", desc: "Improved skills by 40%", icon: "🎯" },
  ];

  return (
    <div
      className={`rounded-2xl p-6 border ${
        isDark
          ? "bg-[rgba(255,255,255,0.06)] border-[rgba(94,234,212,0.2)]"
          : "bg-white border-[#ddd6fe]"
      }`}
    >
      <h2
        className={`font-semibold mb-4 ${
          isDark ? "text-white" : "text-[#2e1065]"
        }`}
      >
        Achievements
      </h2>

      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-4">
            <div
              className={`text-2xl ${
                isDark ? "text-teal-300" : "text-purple-600"
              }`}
            >
              {item.icon}
            </div>

            <div>
              <p
                className={`font-medium ${
                  isDark ? "text-[#d1d5dc]" : "text-[#4c1d95]"
                }`}
              >
                {item.title}
              </p>
              <p
                className={`text-sm ${
                  isDark ? "text-[#8ca3b5]" : "text-[#6b21a8]"
                }`}
              >
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

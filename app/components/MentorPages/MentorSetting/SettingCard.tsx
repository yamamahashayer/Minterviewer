"use client";

export default function SettingCard({
  children,
  theme = "dark",
}: any) {
  const isDark = theme === "dark";

  return (
    <div
      className={`
        rounded-2xl p-6 backdrop-blur-xl transition-all

        ${
          isDark
            ? `
              bg-[rgba(255,255,255,0.03)]
              border border-[rgba(255,255,255,0.08)]
              shadow-[0_0_20px_rgba(0,0,0,0.4)]
            `
            : `
              bg-[#fafaff] 
              border border-[#e9d5ff]
              shadow-[0_4px_16px_rgba(168,85,247,0.12)]
            `
        }
      `}
    >
      {children}
    </div>
  );
}

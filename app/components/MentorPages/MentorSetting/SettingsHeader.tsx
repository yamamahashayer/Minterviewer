"use client";

export default function SettingsHeader({ theme }: { theme: "dark" | "light" }) {
  const isDark = theme === "dark";

  return (
    <div className="mb-8">
      <h1
        className={isDark ? "text-white" : "text-[#2e1065]"}
        style={{ marginBottom: "0.5rem", fontWeight: 700 }}
      >
        Settings ⚙️
      </h1>

      <p className={isDark ? "text-[#99a1af]" : "text-[#6b21a8]"}>
        Manage your account preferences and settings
      </p>

      <div
        className={`h-1 w-[200px] rounded-full mt-4 ${
          isDark
            ? "bg-gradient-to-r from-[#5eead4] to-transparent shadow-[0px_0px_10px_rgba(94,234,212,0.5)]"
            : "bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-transparent shadow-[0px_0px_15px_rgba(124,58,237,0.4)]"
        }`}
      />
    </div>
  );
}

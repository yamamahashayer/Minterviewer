"use client";

type Theme = "dark" | "light";

export default function FlowToggle({
  label,
  value,
  onChange,
  theme,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  theme: Theme;
}) {
  const isDark = theme === "dark";

  return (
    <div className="flex items-center justify-between py-2">
      <span className={isDark ? "text-gray-300" : "text-gray-700"}>
        {label}
      </span>

      <button
        onClick={() => onChange(!value)}
        className={`w-10 h-5 rounded-full transition flex items-center ${
          value
            ? "bg-purple-600 justify-end"
            : isDark
            ? "bg-gray-700 justify-start"
            : "bg-gray-300 justify-start"
        }`}
      >
        <div className="w-4 h-4 bg-white rounded-full shadow"></div>
      </button>
    </div>
  );
}

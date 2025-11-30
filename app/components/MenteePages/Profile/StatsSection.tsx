"use client";

export default function StatsSection({ stats, isDark }: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat: any, index: number) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`${
              isDark
                ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]"
                : "bg-white shadow-lg"
            } border ${
              isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"
            } rounded-xl p-6 backdrop-blur-sm ${
              isDark
                ? "hover:border-[rgba(94,234,212,0.4)]"
                : "hover:border-[#a855f7] hover:shadow-xl"
            } transition-all`}
          >
            <div className="flex items-center justify-between mb-3">
              <Icon
                className={isDark ? "text-teal-300" : "text-purple-600"}
                size={24}
              />
            </div>

            <div
              className={`${
                isDark ? "text-white" : "text-[#2e1065]"
              } mb-1 font-bold text-xl`}
            >
              {stat.value}
            </div>

            <p
              className={`${
                isDark ? "text-[#99a1af]" : "text-[#6b21a8]"
              } text-xs mb-2`}
            >
              {stat.label}
            </p>

            {stat.change && (
              <p
                className={`${
                  isDark ? "text-emerald-400" : "text-green-600"
                } text-xs font-semibold`}
              >
                {stat.change}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

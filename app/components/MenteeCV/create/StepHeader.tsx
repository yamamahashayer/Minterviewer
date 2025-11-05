"use client";
import { CheckCircle2 } from "lucide-react";

export type StepMeta = { key: string; title: string; icon: any };
export default function StepHeader({
  steps, activeIdx, isDark
}: { steps: StepMeta[]; activeIdx: number; isDark: boolean }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isActive = idx === activeIdx;
          const isDone = idx < activeIdx;
          return (
            <div key={s.key} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                  isActive ? (isDark ? "bg-gradient-to-br from-teal-500/30 to-emerald-500/30 border-2 border-teal-400"
                                     : "bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-500")
                           : isDone ? (isDark ? "bg-emerald-500/20 border-2 border-emerald-400"
                                               : "bg-green-100 border-2 border-green-500")
                                    : (isDark ? "bg-[rgba(255,255,255,0.05)] border-2 border-[rgba(94,234,212,0.2)]"
                                              : "bg-purple-50 border-2 border-purple-200")
                }`}>
                  {isDone ? (
                    <CheckCircle2 className={isDark ? "text-emerald-400" : "text-green-600"} size={24}/>
                  ) : (
                    <Icon className={isActive ? (isDark ? "text-teal-300" : "text-purple-600")
                                               : (isDark ? "text-[#6a7282]" : "text-purple-300")} size={24}/>
                  )}
                </div>
                <p className={`text-xs text-center font-medium ${
                  isActive ? (isDark ? "text-teal-300" : "text-purple-700")
                           : isDone ? (isDark ? "text-emerald-400" : "text-green-600")
                                    : (isDark ? "text-[#6a7282]" : "text-purple-400")}`}>
                  {s.title}
                </p>
              </div>
              {idx < steps.length - 1 && (
                <div className={`h-0.5 flex-1 ${idx < activeIdx ? (isDark ? "bg-emerald-400" : "bg-green-500")
                                                                  : (isDark ? "bg-[rgba(94,234,212,0.2)]" : "bg-purple-200")}`}/>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { LucideIcon } from "lucide-react";

type StepHeaderProps = {
  Icon: LucideIcon;
  title: string;
  subtitle?: string;
  badgeClass?: string;
  rightElement?: React.ReactNode;
};

export default function StepHeader({
  Icon,
  title,
  subtitle,
  badgeClass = "",
  rightElement,
}: StepHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      
      {/* Left side */}
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg border ${badgeClass}`}>
          <Icon size={16} />
        </div>

        <div>
          <h3 className="text-lg font-semibold">{title}</h3>

          {subtitle && (
            <p className="text-sm opacity-70 -mt-1">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right side (AI Button) */}
      {rightElement && (
        <div className="ml-4 flex-shrink-0">{rightElement}</div>
      )}
    </div>
  );
}

import { LucideIcon } from "lucide-react";

export default function StepHeader({
  Icon, title, subtitle, badgeClass = "",
}: { Icon: LucideIcon; title: string; subtitle?: string; badgeClass?: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className={`w-12 h-12 rounded-lg border flex items-center justify-center ${badgeClass}`}>
        <Icon size={24} />
      </div>
      <div>
        <h2 className="font-semibold">{title}</h2>
        {subtitle && <p className="text-sm opacity-80">{subtitle}</p>}
      </div>
    </div>
  );
}

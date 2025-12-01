import { Input } from "../../../../../ui/input";
import { Textarea } from "../../../../../ui/textarea";
import { Label } from "../../../../../ui/label";

type ExpValue = {
  id?: number;
  jobTitle?: string;     // الاسم المعتمد
  title?: string;        // دعم قديم fallback
  company?: string;
  location?: string;
  startDate?: string;    // ISO مثل "2023-07-01" أو "2023-07"
  endDate?: string;      // نفس الشي
  current?: boolean;
  description?: string;
};

export default function ExperienceItem({
  value,
  onChange,
  isDark,
}: {
  value: ExpValue;
  onChange: (k: string, v: any) => void;
  isDark?: boolean;
}) {
  const jobTitle = value.jobTitle ?? value.title ?? "";

  const toMonth = (s?: string) => {
    if (!s) return "";
    if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 7);
    if (/^\d{4}-\d{2}$/.test(s)) return s;
    try {
      const d = new Date(s);
      if (!isNaN(d.getTime())) {
        const m = String(d.getMonth() + 1).padStart(2, "0");
        return `${d.getFullYear()}-${m}`;
      }
    } catch {}
    return s;
  };

  return (
    <div
      className={`mb-6 p-6 border rounded-lg ${
        isDark
          ? "bg-[rgba(255,255,255,0.03)] border-[rgba(94,234,212,0.1)]"
          : "bg-purple-50 border-purple-200"
      }`}
    >
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label className="mb-2 block">Job Title</Label>
          <Input
            value={jobTitle}
            onChange={(e: any) => onChange("jobTitle", e.target.value)} // نكتب دائمًا في jobTitle
            placeholder="Software Engineer"
          />
        </div>

        <div>
          <Label className="mb-2 block">Company</Label>
          <Input
            value={value.company ?? ""}
            onChange={(e: any) => onChange("company", e.target.value)}
            placeholder="Tech Corp"
          />
        </div>

        <div>
          <Label className="mb-2 block">Location</Label>
          <Input
            value={value.location ?? ""}
            onChange={(e: any) => onChange("location", e.target.value)}
            placeholder="City, Country"
          />
        </div>

        <div>
          <Label className="mb-2 block">Start Date</Label>
          <Input
            type="month"
            value={toMonth(value.startDate)}
            onChange={(e: any) => onChange("startDate", e.target.value)}
          />
        </div>

        <div>
          <Label className="mb-2 block">End Date</Label>
          <Input
            type="month"
            value={toMonth(value.endDate)}
            onChange={(e: any) => onChange("endDate", e.target.value)}
            disabled={!!value.current}
          />
          <div className="mt-2 flex items-center gap-2 text-sm">
            <input
              id={`current-${value.id ?? ""}`}
              type="checkbox"
              checked={!!value.current}
              onChange={(e) => onChange("current", e.target.checked)}
            />
            <label htmlFor={`current-${value.id ?? ""}`}>Currently working here</label>
          </div>
        </div>
      </div>

      <Label className="mb-2 block">Description & Achievements</Label>
      <Textarea
        className="min-h-[100px]"
        value={value.description ?? ""}
        onChange={(e: any) => onChange("description", e.target.value)}
        placeholder={"• Built X\n• Improved Y by 40%"}
      />
    </div>
  );
}

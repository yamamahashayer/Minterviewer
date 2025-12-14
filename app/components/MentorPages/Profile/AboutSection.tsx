"use client";

import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Linkedin,
  Github,
  Briefcase,
  Languages,
  Tag,
  UserCircle,
  X,
} from "lucide-react";

import { Badge } from "@/app/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/app/components/ui/select";

export default function AboutSection({
  profile,
  isEditing,
  onFieldChange,
  onSave,
  onCancel,
  isDark, // ←🔥 مهم جداً
}) {
  const data = JSON.parse(JSON.stringify(profile || {}));
  const iconClass = `w-5 h-5 ${isDark ? "text-teal-300" : "text-purple-600"}`;

  return (
    <div className="space-y-8">

      {/* BIO */}
      {(data.short_bio || data.headline || isEditing) && (
        <Card isDark={isDark}>
          <SectionTitle
            title="Bio"
            icon={<UserCircle className={iconClass} />}
            isDark={isDark}
          />

          <div className="space-y-2 text-sm ml-7">


            {/* Bio */}
            {isEditing ? (
              <TextareaField
                value={data.short_bio}
                onChange={(v) => onFieldChange("short_bio", v)}
                placeholder="Write your bio..."
                isDark={isDark}
              />
            ) : data.short_bio ? (
              <p className={isDark ? "text-gray-400" : "text-[var(--foreground-muted)]"}>
                {data.short_bio}
              </p>
            ) : (
              <p className={isDark ? "text-gray-500 italic" : "text-[var(--foreground-muted)] italic"}>
                No bio added yet
              </p>
            )}
          </div>
        </Card>
      )}

      {/* GRID: Contact + Professional */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* CONTACT */}
        <Card isDark={isDark}>
          <SectionTitle title="Contact Information" isDark={isDark} />

          <div className="space-y-4 text-sm">
            <InfoEdit
              label="Email"
              value={data.email}
              icon={<Mail className={iconClass} />}
              onChange={(v) => onFieldChange("email", v)}
              isEditing={isEditing}
              isDark={isDark}
            />

            <InfoEdit
              label="Phone"
              value={data.phoneNumber}
              icon={<Phone className={iconClass} />}
              onChange={(v) => onFieldChange("phoneNumber", v)}
              isEditing={isEditing}
              isDark={isDark}
            />

            <InfoEdit
              label="Location"
              value={data.Country}
              icon={<MapPin className={iconClass} />}
              onChange={(v) => onFieldChange("Country", v)}
              isEditing={isEditing}
              isDark={isDark}
            />

            <InfoItem
              label="Joined"
              value={data.created_at ? new Date(data.created_at).toLocaleDateString() : "N/A"}
              icon={<Calendar className={iconClass} />}
              isDark={isDark}
            />
          </div>

          <Divider isDark={isDark} />

          <h4 className={`text-sm mb-3 ${isDark ? "text-gray-200" : "text-[var(--foreground)]"}`}>
            Social Links
          </h4>

          <div className="flex gap-3">
            <SocialEdit
              icon={<Linkedin className={iconClass} />}
              value={data.linkedin_url}
              onChange={(v) => onFieldChange("linkedin_url", v)}
              isEditing={isEditing}
              isDark={isDark}
            />

            <SocialEdit
              icon={<Github className={iconClass} />}
              value={data.github}
              onChange={(v) => onFieldChange("github", v)}
              isEditing={isEditing}
              isDark={isDark}
            />
          </div>
        </Card>

        {/* PROFESSIONAL */}
        <Card isDark={isDark}>
          <SectionTitle title="Professional Details" isDark={isDark} />

          <div className="space-y-4 text-sm">

            {/* AREAS OF EXPERTISE */}
            <MultiSelect
              title="Areas of Expertise"
              icon={<Tag className={iconClass} />}
              items={data.area_of_expertise}
              options={[
                "Frontend Development",
                "Backend Development",
                "Full-Stack Development",
                "Mobile Development",
                "System Design",
                "AI/ML",
              ]}
              isEditing={isEditing}
              onAdd={(v) =>
                onFieldChange("area_of_expertise", [...(data.area_of_expertise || []), v])
              }
              onRemove={(i) => {
                const arr = [...data.area_of_expertise];
                arr.splice(i, 1);
                onFieldChange("area_of_expertise", arr);
              }}
              isDark={isDark}
            />

            {/* FOCUS AREAS */}
            <MultiSelect
              title="Focus Areas"
              icon={<Tag className={iconClass} />}
              items={data.focusAreas}
              options={[
                "Interview Prep",
                "System Design",
                "Mock Interviews",
                "Career Guidance",
              ]}
              isEditing={isEditing}
              onAdd={(v) =>
                onFieldChange("focusAreas", [...(data.focusAreas || []), v])
              }
              onRemove={(i) => {
                const arr = [...data.focusAreas];
                arr.splice(i, 1);
                onFieldChange("focusAreas", arr);
              }}
              isDark={isDark}
            />

            {/* EXP */}
            <InfoEdit
              label="Years of Experience"
              value={data.yearsOfExperience}
              icon={<Briefcase className={iconClass} />}
              onChange={(v) => onFieldChange("yearsOfExperience", v)}
              isEditing={isEditing}
              isDark={isDark}
            />

            {/* LANGUAGES */}
            <DetailBlock
              title="Languages"
              items={data.languages}
              icon={<Languages className={iconClass} />}
              isDark={isDark}
            />
          </div>
        </Card>
      </div>

      {isEditing && (
        <div className="flex gap-3 mt-4">
          <button className="px-4 py-2 rounded-md bg-purple-600 text-white" onClick={onSave}>
            Save Changes
          </button>
          <button className="px-4 py-2 rounded-md bg-gray-300" onClick={onCancel}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

/* ========================================================================================= */
/* COMPONENTS */
/* ========================================================================================= */

function Card({ children, isDark }) {
  return (
    <div
      className={`p-6 rounded-xl border backdrop-blur-lg transition-all
        ${isDark
          ? "bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.08)] shadow-[0_0_25px_rgba(0,255,255,0.05)]"
          : "bg-white border-[#eaeaea] shadow-[0_0_20px_rgba(147,51,234,0.08)]"
        }`}
    >
      {children}
    </div>
  );
}

function SectionTitle({ title, icon, isDark }) {
  return (
    <h3
      className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
        isDark ? "text-white" : "text-[var(--foreground)]"
      }`}
    >
      {icon}
      {title}
    </h3>
  );
}

function Divider({ isDark }) {
  return (
    <div className={`mt-6 pt-6 border-t ${isDark ? "border-white/10" : "border-[var(--border)]"}`} />
  );
}

function InfoItem({ label, value, icon, isDark }) {
  return (
    <div className="flex items-start gap-3">
      {icon}
      <div>
        <p className={isDark ? "text-xs text-gray-400" : "text-xs text-[var(--foreground-muted)]"}>
          {label}
        </p>
        <p className={isDark ? "text-white" : "text-[var(--foreground)]"}>{value}</p>
      </div>
    </div>
  );
}

function InfoEdit({ label, value, icon, isEditing, isDark, onChange }) {
  return (
    <div className="flex items-start gap-3">
      {icon}
      <div className="w-full">
        <p className={isDark ? "text-xs text-gray-400" : "text-xs text-[var(--foreground-muted)]"}>
          {label}
        </p>

        {isEditing ? (
          <InputField value={value} onChange={onChange} isDark={isDark} />
        ) : (
          <p className={isDark ? "text-white" : "text-[var(--foreground)]"}>{value || "—"}</p>
        )}
      </div>
    </div>
  );
}

function InputField({ value, onChange, placeholder, isDark }) {
  return (
    <input
      value={value || ""}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`
        w-full p-2 rounded-md border 
        ${isDark
          ? "bg-white/10 border-white/20 text-white"
          : "bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]"
        }
      `}
    />
  );
}

function TextareaField({ value, onChange, placeholder, isDark }) {
  return (
    <textarea
      value={value || ""}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`
        w-full p-2 rounded-md border min-h-[100px]
        ${isDark
          ? "bg-white/10 border-white/20 text-white"
          : "bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]"
        }
      `}
    />
  );
}

function SocialEdit({ icon, value, isEditing, onChange, isDark }) {
  if (isEditing) {
    return (
      <InputField value={value} onChange={onChange} isDark={isDark} placeholder="Link..." />
    );
  }

  return (
    <a
      href={value || "#"}
      target="_blank"
      onClick={(e) => !value && e.preventDefault()}
      className={`
        w-10 h-10 flex items-center justify-center rounded-md border 
        ${value
          ? isDark
            ? "border-teal-300/40 text-teal-200 hover:bg-teal-400/10"
            : "border-purple-500/40 text-purple-600 hover:bg-purple-500/10"
          : "opacity-30 cursor-not-allowed border-[var(--border)]"
        }
      `}
    >
      {icon}
    </a>
  );
}

function MultiSelect({ title, icon, items = [], options, isEditing, onAdd, onRemove, isDark }) {
  const safe = Array.isArray(items) ? items : [];

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h4 className={isDark ? "text-gray-200" : "text-[var(--foreground)]"}>{title}</h4>
      </div>

      {isEditing && (
        <Select
          onValueChange={(v) => !safe.includes(v) && onAdd(v)}
        >
          <SelectTrigger
            className={`
              ml-7 
              ${isDark
                ? "bg-white/10 border-white/20 text-white"
                : "bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]"
              }
            `}
          >
            <SelectValue placeholder={`Select ${title}`} />
          </SelectTrigger>

          <SelectContent className={isDark ? "bg-[#1c1c1c] text-white" : ""}>
            {options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <div className="flex flex-wrap gap-2 ml-7 mt-2">
        {safe.map((item, idx) => (
          <Badge
            key={idx}
            variant="outline"
            className={`
              flex items-center gap-1 px-2 py-1 
              ${isDark
                ? "border-white/20 text-white"
                : "border-purple-400/40 text-purple-700"
              }
            `}
          >
            {item}

            {isEditing && (
              <X
                className="w-3 h-3 cursor-pointer hover:text-red-500"
                onClick={() => onRemove(idx)}
              />
            )}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function DetailBlock({ title, items = [], icon, isDark }) {
  if (!items.length) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h4 className={isDark ? "text-gray-200" : "text-[var(--foreground)]"}>{title}</h4>
      </div>

      <div className="flex flex-wrap gap-2 ml-7">
        {items.map((item, i) => (
          <Badge
            key={i}
            variant="outline"
            className={isDark ? "border-white/20 text-white" : ""}
          >
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );
}

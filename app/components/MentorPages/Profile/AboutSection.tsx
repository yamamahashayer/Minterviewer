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
  Award,
  UserCircle,
  X,
} from "lucide-react";

import { Badge } from "@/app/components/ui/badge";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/app/components/ui/select";
import { useState } from "react";

type AboutSectionProps = {
  profile: any;
  isEditing: boolean;
  onFieldChange: (key: string, value: any) => void;
  onSave: () => void;
  onCancel: () => void;
};

export default function AboutSection({
  profile,
  isEditing,
  onFieldChange,
  onSave,
  onCancel,
}: AboutSectionProps) {

  // 🔥🔥 أهم إصلاح — deep clone لضمان rerender عند حذف عنصر
  const data = JSON.parse(JSON.stringify(profile || {}));
  const iconClass = "w-5 h-5 text-purple-600";

  return (
    <div className="space-y-8">

      {/* ================== BIO ================== */}
      {(data.short_bio || data.headline || isEditing) && (
        <Card>
          <SectionTitle title="Bio" icon={<UserCircle className={iconClass} />} />

          <div className="space-y-2 text-sm ml-7">

            {/* HEADLINE */}
            {isEditing ? (
              <input
                className="w-full bg-[var(--card)] border border-[var(--border)] rounded-md p-2 text-[var(--foreground)]"
                value={data.headline || ""}
                placeholder="Headline..."
                onChange={(e) => onFieldChange("headline", e.target.value)}
              />
            ) : (
              data.headline && (
                <p className="text-[var(--foreground)] font-medium leading-snug">
                  {data.headline}
                </p>
              )
            )}

            {/* BIO */}
            {isEditing ? (
              <textarea
                className="w-full bg-[var(--card)] border border-[var(--border)] rounded-md p-2 text-[var(--foreground)] min-h-[100px]"
                value={data.short_bio || ""}
                placeholder="Write your bio..."
                onChange={(e) => onFieldChange("short_bio", e.target.value)}
              />
            ) : data.short_bio ? (
              <p className="text-[var(--foreground-muted)] leading-relaxed">
                {data.short_bio}
              </p>
            ) : (
              <p className="text-[var(--foreground-muted)] italic">No bio added yet</p>
            )}
          </div>
        </Card>
      )}

      {/* ================== CONTACT + PROFESSIONAL SIDE ================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* LEFT SIDE */}
        <Card>
          <SectionTitle title="Contact Information" />

          <div className="space-y-4 text-sm">

            <InfoEdit
              isEditing={isEditing}
              label="Email"
              value={data.email}
              icon={<Mail className={iconClass} />}
              onChange={(v) => onFieldChange("email", v)}
            />

            <InfoEdit
              isEditing={isEditing}
              label="Phone"
              value={data.phoneNumber}
              icon={<Phone className={iconClass} />}
              onChange={(v) => onFieldChange("phoneNumber", v)}
            />

            <InfoEdit
              isEditing={isEditing}
              label="Location"
              value={data.Country}
              icon={<MapPin className={iconClass} />}
              onChange={(v) => onFieldChange("Country", v)}
            />

            <InfoItem
              label="Joined"
              value={data.created_at ? new Date(data.created_at).toLocaleDateString() : "N/A"}
              icon={<Calendar className={iconClass} />}
            />
          </div>

          <Divider />

          <h4 className="text-sm mb-3 text-[var(--foreground)]">Social Links</h4>
          <div className="flex gap-3">

            <SocialEdit
              isEditing={isEditing}
              icon={<Linkedin className={iconClass} />}
              value={data.linkedin_url}
              onChange={(v) => onFieldChange("linkedin_url", v)}
            />

            <SocialEdit
              isEditing={isEditing}
              icon={<Github className={iconClass} />}
              value={data.github}
              onChange={(v) => onFieldChange("github", v)}
            />

          </div>
        </Card>

        {/* RIGHT SIDE */}
        <Card>
          <SectionTitle title="Professional Details" />

          <div className="space-y-4 text-sm">

            {/* AREA OF EXPERTISE */}
            <DetailEditableMultiSelect
              title="Areas of Expertise"
              icon={<Tag className={iconClass} />}
              items={data.area_of_expertise || []}
              options={[
                "Frontend Development", "Backend Development", "Full-Stack Development",
                "Mobile Development", "Cybersecurity", "AI / ML", "DevOps",
                "Cloud", "Database Administration", "QA / Automation",
              ]}
              isEditing={isEditing}
              onAdd={(v) => {
                if (!data.area_of_expertise.includes(v)) {
                  onFieldChange("area_of_expertise", [...data.area_of_expertise, v]);
                }
              }}
              onRemove={(index) => {
                const arr = [...data.area_of_expertise];
                arr.splice(index, 1);
                onFieldChange("area_of_expertise", arr);
              }}
            />

            {/* FOCUS AREAS */}
            <DetailEditableMultiSelect
              title="Focus Areas"
              icon={<Tag className={iconClass} />}
              items={data.focusAreas || []}
              options={[
                "Interview Preparation", "System Design", "Mock Interviews",
                "Career Guidance", "Resume Review", "Portfolio Review",
                "Coding Interview Coaching", "Job Search Strategy",
                "Skill Upskilling",
              ]}
              isEditing={isEditing}
              onAdd={(v) => {
                if (!data.focusAreas.includes(v)) {
                  onFieldChange("focusAreas", [...data.focusAreas, v]);
                }
              }}
              onRemove={(index) => {
                const arr = [...data.focusAreas];
                arr.splice(index, 1);
                onFieldChange("focusAreas", arr);
              }}
            />

            <InfoEdit
              isEditing={isEditing}
              label="Availability"
              value={data.availabilityType}
              icon={<Calendar className={iconClass} />}
              onChange={(v) => onFieldChange("availabilityType", v)}
            />

            <InfoEdit
              isEditing={isEditing}
              label="Years of Experience"
              value={data.yearsOfExperience}
              icon={<Briefcase className={iconClass} />}
              onChange={(v) => onFieldChange("yearsOfExperience", v)}
            />

            {/* LANGUAGES */}
            <DetailBlock
              title="Languages"
              icon={<Languages className={iconClass} />}
              items={data.languages}
            />

            {/* Sessions */}
            <DetailBlock
              title="Session Types"
              icon={<Calendar className={iconClass} />}
              items={data.sessionTypes}
            />

          </div>
        </Card>
      </div>

      {/* SAVE/CANCEL */}
      {isEditing && (
        <div className="flex gap-3 mt-4">
          <button onClick={onSave} className="px-4 py-2 rounded-md bg-purple-600 text-white">
            Save Changes
          </button>

          <button onClick={onCancel} className="px-4 py-2 rounded-md bg-gray-300 text-black">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

/* ========================================================= */
/* =================== Helper Components ==================== */
/* ========================================================= */

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="p-6 rounded-xl"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ title, icon }: { title: string; icon?: React.ReactNode }) {
  return (
    <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)] flex items-center gap-2">
      {icon}
      {title}
    </h3>
  );
}

function Divider() {
  return <div className="mt-6 pt-6 border-t border-[var(--border)]" />;
}

function InfoItem({ label, value, icon }: any) {
  if (!value) return null;

  return (
    <div className="flex items-start gap-3">
      {icon}
      <div>
        <p className="text-xs text-[var(--foreground-muted)]">{label}</p>
        <p className="font-medium text-[var(--foreground)]">{value}</p>
      </div>
    </div>
  );
}

function InfoEdit({ label, value, icon, isEditing, onChange }: any) {
  return (
    <div className="flex items-start gap-3">
      {icon}
      <div className="w-full">
        <p className="text-xs text-[var(--foreground-muted)]">{label}</p>

        {isEditing ? (
          <input
            className="w-full bg-[var(--card)] border border-[var(--border)] rounded-md p-2 text-[var(--foreground)]"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <p className="font-medium text-[var(--foreground)]">{value || "—"}</p>
        )}
      </div>
    </div>
  );
}

function SocialEdit({ icon, value, isEditing, onChange }: any) {
  if (isEditing) {
    return (
      <input
        className="flex-1 bg-[var(--card)] border border-[var(--border)] rounded-md p-2 text-[var(--foreground)]"
        placeholder="Link..."
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  return (
    <a
      href={value || "#"}
      onClick={(e) => !value && e.preventDefault()}
      className={`p-2 rounded-md border w-10 h-10 flex items-center justify-center ${
        value
          ? "border-purple-500/40 hover:bg-purple-500/10"
          : "opacity-30 border-[var(--border)] cursor-not-allowed"
      }`}
      target="_blank"
    >
      {icon}
    </a>
  );
}

/* ========= MULTI-SELECT + DELETE (FIXED) ========= */
function DetailEditableMultiSelect({ 
  title, icon, items = [], options = [], isEditing, onAdd, onRemove 
}: any) {

  const safeItems = Array.isArray(items) ? items : [];

  return (
    <div className="mt-4">
      {/* TITLE */}
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h4 className="font-medium text-[var(--foreground)]">{title}</h4>
      </div>

      {/* SELECT */}
      {isEditing && (
        <div className="ml-7 mb-3">
          <Select
            onValueChange={(value) => {
              if (!safeItems.includes(value)) onAdd(value);
            }}
          >
            <SelectTrigger className="bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)]">
              <SelectValue placeholder={`Select ${title}`} />
            </SelectTrigger>

            <SelectContent>
              {options.map((opt: string) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* BADGES */}
      <div className="flex flex-wrap gap-2 ml-7">
        {safeItems.length > 0 ? (
          safeItems.map((item: string, idx: number) => (
            <Badge key={idx} variant="outline" className="flex items-center gap-1 px-2 py-1">
              {item}

              {isEditing && (
                <X
                  className="w-3 h-3 cursor-pointer hover:text-red-500"
                  onClick={() => {
                    onRemove(idx); // 🔥 يعمل الآن 100%
                  }}
                />
              )}
            </Badge>
          ))
        ) : (
          <p className="text-[var(--foreground-muted)] italic text-sm">No items</p>
        )}
      </div>
    </div>
  );
}

/* ========= STATIC LIST ========= */
function DetailBlock({ title, icon, items = [] }: any) {
  if (!items.length) return null;

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h4 className="font-medium text-[var(--foreground)]">{title}</h4>
      </div>

      <div className="flex flex-wrap gap-2 ml-7">
        {items.map((item: string, i: number) => (
          <Badge key={i} variant="outline">
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );
}

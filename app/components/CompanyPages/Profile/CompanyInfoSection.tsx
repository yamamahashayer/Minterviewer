"use client";

import {
  Mail,
  Globe,
  MapPin,
  Building2,
  Briefcase,
  Calendar,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Check,
  X,
  UserCircle,
  Pencil,
} from "lucide-react";

/* نفس ستايلات المنتور */
const iconColor = (isDark: boolean) =>
  `w-4 h-4 ${isDark ? "text-teal-300" : "text-purple-600"}`;

export default function CompanyInfoSection({
  edited,
  isEditing,
  setIsEditing,
  onFieldChange,
  onSave,
  onCancel,
  isDark,
  isOwner, // ⭐ التعديل هون
}: {
  edited: any;
  isEditing: boolean;
  setIsEditing: (v: boolean) => void;
  onFieldChange: (key: string, value: any) => void;
  onSave: () => void;
  onCancel: () => void;
  isDark: boolean;
  isOwner: boolean;
}) {
  return (
    <div className="space-y-6 mt-6">

      {/* CARD */}
      <Card isDark={isDark}>
        <div className="flex justify-between items-center mb-3">
          <SectionTitle
            title="Company Information"
            icon={<UserCircle className={iconColor(isDark)} />}
            isDark={isDark}
          />

          {/* ===== ACTIONS (OWNER ONLY) ===== */}
          {isOwner && (
            !isEditing ? (
              <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 flex items-center gap-2 rounded-lg 
              bg-purple-600 text-white shadow hover:bg-purple-700 transition"
            >
              <Pencil size={16} />
              Edit
            </button>

            ) : (
              <div className="flex gap-2">
                <button
                  onClick={onSave}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm"
                >
                  <Check className="w-4 h-4 inline-block mr-1" />
                  Save
                </button>

                <button
                  onClick={onCancel}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    isDark
                      ? "bg-white/10 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <X className="w-4 h-4 inline-block mr-1" />
                  Cancel
                </button>
              </div>
            )
          )}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* LEFT */}
          <div>
            <SmallTitle title="Contact Information" isDark={isDark} />

            <InfoItem
              label="Work Email"
              value={edited.workEmail}
              icon={<Mail className={iconColor(isDark)} />}
              editable={isEditing && isOwner}
              onChange={(v) => onFieldChange("workEmail", v)}
              isDark={isDark}
            />

            <InfoItem
              label="Website"
              value={edited.website}
              icon={<Globe className={iconColor(isDark)} />}
              editable={isEditing && isOwner}
              onChange={(v) => onFieldChange("website", v)}
              isDark={isDark}
            />

            <InfoItem
              label="Location"
              value={edited.location}
              icon={<MapPin className={iconColor(isDark)} />}
              editable={isEditing && isOwner}
              onChange={(v) => onFieldChange("location", v)}
              isDark={isDark}
            />

            <InfoItem
              label="Founded Year"
              value={edited.foundedYear}
              icon={<Calendar className={iconColor(isDark)} />}
              editable={isEditing && isOwner}
              onChange={(v) => onFieldChange("foundedYear", v)}
              isDark={isDark}
            />

            <Divider isDark={isDark} />

            <SmallTitle title="Social Profiles" isDark={isDark} />

            <div className="flex items-center gap-3 mt-2">
              <SocialIcon
                icon={<Linkedin className="w-4 h-4" />}
                value={edited.social?.linkedin}
                isEditing={isEditing && isOwner}
                onChange={(v) =>
                  onFieldChange("social", { ...edited.social, linkedin: v })
                }
                isDark={isDark}
              />

              <SocialIcon
                icon={<Twitter className="w-4 h-4" />}
                value={edited.social?.twitter}
                isEditing={isEditing && isOwner}
                onChange={(v) =>
                  onFieldChange("social", { ...edited.social, twitter: v })
                }
                isDark={isDark}
              />

              <SocialIcon
                icon={<Facebook className="w-4 h-4" />}
                value={edited.social?.facebook}
                isEditing={isEditing && isOwner}
                onChange={(v) =>
                  onFieldChange("social", { ...edited.social, facebook: v })
                }
                isDark={isDark}
              />

              <SocialIcon
                icon={<Instagram className="w-4 h-4" />}
                value={edited.social?.instagram}
                isEditing={isEditing && isOwner}
                onChange={(v) =>
                  onFieldChange("social", {
                    ...edited.social,
                    instagram: v,
                  })
                }
                isDark={isDark}
              />
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <SmallTitle title="Company Details" isDark={isDark} />

            <InfoItem
              label="Company Name"
              value={edited.name}
              icon={<Building2 className={iconColor(isDark)} />}
              editable={isEditing && isOwner}
              onChange={(v) => onFieldChange("name", v)}
              isDark={isDark}
            />

            <InfoItem
              label="Industry"
              value={edited.industry}
              icon={<Building2 className={iconColor(isDark)} />}
              editable={isEditing && isOwner}
              onChange={(v) => onFieldChange("industry", v)}
              isDark={isDark}
            />

            <InfoSelect
              label="Hiring Status"
              value={edited.hiringStatus}
              icon={<Briefcase className={iconColor(isDark)} />}
              editable={isEditing && isOwner}
              isDark={isDark}
              onChange={(v) => onFieldChange("hiringStatus", v)}
              options={[
                { value: "open", text: "Open" },
                { value: "closed", text: "Closed" },
              ]}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Card({ children, isDark }: any) {
  return (
    <div
      className={`p-5 rounded-xl border ${
        isDark
          ? "bg-white/5 border-white/10"
          : "bg-white border-purple-100 shadow-md"
      }`}
    >
      {children}
    </div>
  );
}

function SectionTitle({ title, icon, isDark }: any) {
  return (
    <h3
      className={`flex items-center gap-2 text-lg font-semibold ${
        isDark ? "text-white" : "text-purple-900"
      }`}
    >
      {icon}
      {title}
    </h3>
  );
}

function SmallTitle({ title, isDark }: any) {
  return (
    <h4
      className={`text-sm mb-2 font-medium ${
        isDark ? "text-gray-200" : "text-purple-800"
      }`}
    >
      {title}
    </h4>
  );
}

function Divider({ isDark }: any) {
  return (
    <div
      className={`my-4 border-t ${
        isDark ? "border-white/10" : "border-purple-200"
      }`}
    />
  );
}

function InfoItem({
  label,
  value,
  icon,
  editable,
  onChange,
  isDark,
}: any) {
  return (
    <div className="flex gap-3 mb-3">
      {icon}
      <div className="w-full leading-tight">
        <p
          className={`text-xs ${
            isDark ? "text-gray-400" : "text-purple-700"
          }`}
        >
          {label}
        </p>

        {!editable ? (
          <p className={isDark ? "text-white" : "text-purple-900 text-sm"}>
            {value || "Not provided"}
          </p>
        ) : (
          <input
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-3 py-1.5 rounded-md border text-sm ${
              isDark
                ? "bg-white/10 border-white/20 text-white"
                : "bg-purple-50 border-purple-200 text-purple-900"
            }`}
          />
        )}
      </div>
    </div>
  );
}

function InfoSelect({
  label,
  value,
  icon,
  editable,
  onChange,
  isDark,
  options,
}: any) {
  return (
    <div className="flex gap-3 mb-3">
      {icon}
      <div className="w-full">
        <p
          className={`text-xs ${
            isDark ? "text-gray-400" : "text-purple-700"
          }`}
        >
          {label}
        </p>

        {!editable ? (
          <p className="text-sm">{value}</p>
        ) : (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-3 py-1.5 rounded-md border text-sm ${
              isDark
                ? "bg-white/10 border-white/20 text-white"
                : "bg-purple-50 border-purple-200 text-purple-900"
            }`}
          >
            {options.map((opt: any) => (
              <option key={opt.value} value={opt.value}>
                {opt.text}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}

function SocialIcon({ icon, value, isEditing, onChange, isDark }: any) {
  if (isEditing) {
    return (
      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className={`px-3 py-1.5 rounded-md border text-sm ${
          isDark
            ? "bg-white/10 border-white/20 text-white"
            : "bg-purple-50 border-purple-200 text-purple-900"
        }`}
      />
    );
  }

  return (
    <a
      href={value || "#"}
      target="_blank"
      className={`w-9 h-9 flex items-center justify-center rounded-md border ${
        value
          ? isDark
            ? "border-teal-300/40 text-teal-200 hover:bg-teal-400/10"
            : "border-purple-300 text-purple-700 hover:bg-purple-500/10"
          : "opacity-30 cursor-not-allowed border-purple-200"
      }`}
    >
      {icon}
    </a>
  );
}

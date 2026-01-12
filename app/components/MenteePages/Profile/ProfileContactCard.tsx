"use client";

import { Mail, Phone, Linkedin, Github } from "lucide-react";
import { Input } from "@/app/components/ui/input";

type Props = {
  profile: any;
  editedProfile?: any;
  setEditedProfile?: (v: any) => void;
  isEditing?: boolean;
  isDark: boolean;
  readOnly?: boolean;
};

export default function ProfileContactCard({
  profile,
  editedProfile,
  setEditedProfile,
  isEditing = false,
  isDark,
  readOnly = false,
}: Props) {
  const canEdit = !readOnly && isEditing && setEditedProfile;
  const data = canEdit ? editedProfile : profile;

  return (
    <div
      className={`rounded-2xl p-6 border ${
        isDark
          ? "bg-white/5 border-white/10"
          : "bg-white border-[#e9d5ff] shadow"
      }`}
    >
      <h3 className="font-semibold mb-4">Contact & Links</h3>

      {/* ================= EMAIL (READ ONLY) ================= */}
      {profile.email && (
        <div className="flex items-start gap-3 mb-3 text-sm">
          <Mail
            size={18}
            className={isDark ? "text-teal-300" : "text-purple-600"}
          />
          <div>
            <div
              className={`font-medium ${
                isDark ? "text-teal-300" : "text-purple-600"
              }`}
            >
              Email
            </div>

            <a
              href={`mailto:${profile.email}`}
              className={`transition ${
                isDark
                  ? "text-teal-200 hover:text-teal-100"
                  : "text-purple-500 hover:text-purple-600"
              }`}
            >
              {profile.email}
            </a>
          </div>
        </div>
      )}



      {/* ================= PHONE ================= */}
      <Field
        icon={<Phone size={18} />}
        label="Phone"
        value={data.phone}
        link={!canEdit ? `tel:${data.phone}` : undefined}
        canEdit={canEdit}
        onChange={(v: string) =>
          setEditedProfile?.({ ...data, phone: v })
        }
        isDark={isDark}
      />

      {/* ================= LINKEDIN ================= */}
      <Field
        icon={<Linkedin size={18} />}
        label="LinkedIn"
        value={data.linkedin}
        link={!canEdit ? data.linkedin : undefined}
        canEdit={canEdit}
        onChange={(v: string) =>
          setEditedProfile?.({ ...data, linkedin: v })
        }
        isDark={isDark}
      />

      {/* ================= GITHUB ================= */}
      <Field
        icon={<Github size={18} />}
        label="GitHub"
        value={data.github}
        link={!canEdit ? data.github : undefined}
        canEdit={canEdit}
        onChange={(v: string) =>
          setEditedProfile?.({ ...data, github: v })
        }
        isDark={isDark}
      />
    </div>
  );
}

/* ================= FIELD ================= */

function Field({
  icon,
  label,
  value,
  link,
  canEdit,
  onChange,
  isDark,
}: any) {
  if (!value && !canEdit) return null;

  return (
    <div className="flex items-center gap-3 mb-3 text-sm">
      <span
        className={
          isDark ? "text-teal-300" : "text-purple-600"
        }
      >
        {icon}
      </span>

      {canEdit ? (
        <Input
          placeholder={label}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <a
          href={link}
          target="_blank"
          className={`transition ${
            isDark
              ? "text-teal-300 hover:text-teal-200"
              : "text-purple-600 hover:text-purple-500"
          }`}
        >
          {value}
        </a>
      )}
    </div>
  );
}

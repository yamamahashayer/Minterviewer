"use client";

import { Mail, Phone, MapPin, Calendar, Edit2, Check, X } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";

export default function Header({
  profile,
  editedProfile,
  setEditedProfile,
  isEditing,
  setIsEditing,
  isDark,
  onSave,
  onCancel,
}: {
  profile: any;
  editedProfile: any;
  setEditedProfile: (v: any) => void;
  isEditing: boolean;
  setIsEditing: (b: boolean) => void;
  isDark: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {

  return (
    <div
      className={`${
        isDark
          ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]"
          : "bg-white shadow-lg"
      } border ${
        isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"
      } rounded-2xl p-8 mb-6 backdrop-blur-sm`}
    >
      {/* ============ TOP AREA ============ */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-6">
          {/* ===== Avatar ===== */}
          <div className="relative group">
            {isEditing && (
              <input
                type="file"
                accept="image/*"
                id="menteePhotoInput"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    setEditedProfile((prev: any) => ({
                      ...prev,
                      profile_photo: ev.target?.result,
                    }));
                  };
                  reader.readAsDataURL(file);
                }}
              />
            )}

            <div
              className={`relative w-24 h-24 rounded-full overflow-hidden cursor-pointer ${
                isEditing ? "ring-2 ring-purple-400" : ""
              }`}
              onClick={() => {
                if (isEditing) document.getElementById("menteePhotoInput")?.click();
              }}
            >
              {editedProfile.profile_photo ? (
                <img
                  src={editedProfile.profile_photo}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className={`w-full h-full bg-gradient-to-br ${
                    isDark
                      ? "from-teal-300 to-emerald-400"
                      : "from-purple-400 to-pink-500"
                  } flex items-center justify-center text-white`}
                >
                  <span className="text-4xl">
                    {(profile.name || "M")[0]}
                  </span>
                </div>
              )}

              {isEditing && (
                <div className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  Change Photo
                </div>
              )}
            </div>
          </div>

          {/* ===== Main Info ===== */}
          <div>
            {/* NAME */}
            {isEditing ? (
              <Input
                value={editedProfile.name}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, name: e.target.value })
                }
                className={`mb-2 ${
                  isDark
                    ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white"
                    : "bg-white border-[#ddd6fe] text-[#2e1065]"
                }`}
              />
            ) : (
              <h2
                className={`${
                  isDark ? "text-white" : "text-[#2e1065]"
                } mb-1 font-bold text-xl`}
              >
                {profile.name}
              </h2>
            )}

            {/* TITLE */}
            <p
              className={`${
                isDark ? "text-teal-300" : "text-purple-600"
              } mb-3`}
            >
              {profile.title}
            </p>

            <Badge
              className={
                isDark
                  ? "bg-[rgba(94,234,212,0.2)] text-teal-300 border-[rgba(94,234,212,0.3)]"
                  : "bg-purple-100 text-purple-700 border-purple-300"
              }
            >
              {profile.active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
          {/* ===== EDIT / SAVE / CANCEL ===== */}
          <div className="flex gap-2">
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className={
                  isDark
                    ? "bg-[rgba(94,234,212,0.2)] text-teal-300 border border-[rgba(94,234,212,0.3)]"
                    : "bg-white text-purple-700 border border-[#ddd6fe] hover:bg-purple-50"
                }
              >
                <Edit2 size={16} className="mr-2" />
                Edit
              </Button>
            ) : (
              <>
                {/* CANCEL */}
                <Button
                  onClick={onCancel}
                  className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  <X size={16} />
                </Button>

                {/* SAVE */}
                <Button
                  onClick={onSave}
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  <Check size={16} />
                </Button>
              </>
            )}
          </div>

      </div>

      {/* ============ BIO ============ */}
      {isEditing ? (
        <Input
          value={editedProfile.bio}
          onChange={(e) =>
            setEditedProfile({ ...editedProfile, bio: e.target.value })
          }
          className={`mb-6 ${
            isDark
              ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white"
              : "bg-white border-[#ddd6fe] text-[#2e1065]"
          }`}
        />
      ) : (
        <p
          className={`${
            isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"
          } mb-6 leading-relaxed`}
        >
          {profile.bio}
        </p>
      )}

      {/* ============ CONTACT INFO ============ */}
      <div
        className={`grid grid-cols-2 gap-4 pt-6 border-t ${
          isDark ? "border-[rgba(94,234,212,0.1)]" : "border-[#ddd6fe]"
        }`}
      >
        {/* EMAIL */}
        <ContactField
          icon={<Mail size={18} />}
          value={profile.email}
          isDark={isDark}
          editable={false}
        />

        {/* PHONE */}
        <ContactField
          icon={<Phone size={18} />}
          value={editedProfile.phone}
          isDark={isDark}
          editable={isEditing}
          onChange={(v) =>
            setEditedProfile({ ...editedProfile, phone: v })
          }
        />

        {/* LOCATION */}
        <ContactField
          icon={<MapPin size={18} />}
          value={editedProfile.location}
          isDark={isDark}
          editable={isEditing}
          onChange={(v) =>
            setEditedProfile({ ...editedProfile, location: v })
          }
        />

        {/* JOINED DATE */}
        <ContactField
          icon={<Calendar size={18} />}
          value={`Joined ${profile.joinedDate}`}
          isDark={isDark}
          editable={false}
        />
      </div>
    </div>
  );
}

/* ============ CONTACT FIELD COMPONENT ============ */
function ContactField({
  icon,
  value,
  isDark,
  editable,
  onChange,
}: any) {
  return (
    <div className="flex items-center gap-3">
      <span className={isDark ? "text-teal-300" : "text-purple-600"}>
        {icon}
      </span>

      {editable ? (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={
            isDark
              ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white"
              : "bg-white border-[#ddd6fe] text-[#2e1065]"
          }
        />
      ) : (
        <span className={isDark ? "text-[#99a1af]" : "text-[#6b21a8]"}>
          {value}
        </span>
      )}
    </div>
  );
}

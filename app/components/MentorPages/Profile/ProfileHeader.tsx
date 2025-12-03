"use client";

import {
  Award,
  Users,
  Calendar,
  DollarSign,
  Clock,
  MapPin,
  Pencil,
  Check,
  X
} from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";

export default function ProfileHeader({
  profile,
  stats,
  isEditing,
  setIsEditing,
  onFieldChange,
  onSave,
  onCancel,
  isDark,
  hideEdit = false, 
}) {
 {
  const user = profile || {};

  const headerClass = `
    relative overflow-hidden rounded-2xl backdrop-blur-xl p-8 mb-8 border
    ${isDark
      ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border-[rgba(94,234,212,0.25)] shadow-[0_0_35px_rgba(0,255,255,0.08)]"
      : "bg-white border-[#e9d5ff] shadow-[0_0_25px_rgba(147,51,234,0.12)]"
    }
  `;

  const textMuted = isDark ? "text-white/60" : "text-[var(--foreground-muted)]";
  const textNormal = isDark ? "text-white" : "text-[var(--foreground)]";

  return (
    <div className={headerClass}>
      
      {/* Background blob */}
      <div
        className={`absolute top-0 right-0 w-72 h-72 blur-3xl rounded-full
          ${isDark 
            ? "bg-[rgba(0,255,255,0.15)]" 
            : "bg-gradient-to-br from-purple-500/10 to-pink-500/10"
          }
        `}
      />

      {/* ================= HEADER ACTIONS ================= */}
      <div className="relative flex justify-end mb-4">
        {!hideEdit && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 flex items-center gap-2 rounded-lg 
                bg-purple-600 text-white shadow hover:bg-purple-700 transition"
            >
              <Pencil className="w-4 h-4" />
              Edit Profile
            </button>
          )}

        {isEditing && (
          <div className="flex gap-3">
            <button
              onClick={onSave}
              className="px-4 py-2 flex items-center gap-2 rounded-lg 
                bg-green-600 text-white shadow hover:bg-green-700"
            >
              <Check className="w-4 h-4" />
              Save
            </button>

            <button
              onClick={onCancel}
              className={`px-4 py-2 flex items-center gap-2 rounded-lg 
                ${isDark 
                  ? "bg-white/10 text-white hover:bg-white/20" 
                  : "bg-gray-300 text-gray-800 hover:bg-gray-400"
                }`}
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* ================= MAIN PROFILE INFO ================= */}
      <div className="relative flex flex-col md:flex-row gap-6 items-center md:items-start">

        {/* Avatar */}
          <div className="relative group">
            {/* Hidden file input */}
            {isEditing && (
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="profilePhotoInput"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    const base64 = ev.target?.result;
                    onFieldChange("profile_photo", base64);
                  };
                  reader.readAsDataURL(file);
                }}
              />
            )}

            {/* Image Preview */}
            <div
              className={`relative w-28 h-28 rounded-full cursor-pointer ${
                isEditing ? "ring-2 ring-purple-400" : ""
              }`}
              onClick={() => {
                if (isEditing) {
                  document.getElementById("profilePhotoInput")?.click();
                }
              }}
            >
              <Avatar
                className={`w-28 h-28 border-4 ${
                  isDark ? "border-teal-400/40" : "border-purple-500/30"
                }`}
              >
                <AvatarImage src={user.profile_photo} />
                <AvatarFallback className="text-3xl">
                  {user.full_name?.charAt(0) || "M"}
                </AvatarFallback>
              </Avatar>

              {/* Hover Overlay */}
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition">
                  Change Photo
                </div>
              )}
            </div>

            {/* Award Badge */}
            <div
              className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full 
                  bg-gradient-to-br from-yellow-500 to-orange-500 
                  flex items-center justify-center border-4
                  ${isDark ? "border-[rgba(0,0,0,0.5)]" : "border-[var(--card)]"}`}
            >
              <Award className="text-white w-5 h-5" />
            </div>
          </div>


        {/* TEXT INFO */}
        <div className="flex-1 w-full">
          <div className="flex flex-col md:flex-row md:justify-between w-full">
            <div>

              {/* NAME */}
              {!isEditing && (
                <h2 className={`${textNormal} text-2xl font-semibold`}>
                  {user.full_name}
                </h2>
              )}

              {isEditing && (
                <input
                  value={user.full_name}
                  onChange={(e) => onFieldChange("full_name", e.target.value)}
                  className="text-xl font-semibold bg-white/20 border rounded-xl px-3 py-2"
                />
              )}

              {/* SKILLS PREVIEW */}
              <p className={`${textMuted} mt-1`}>
                {(() => {
                  const expertise = user.area_of_expertise || [];
                  const focus = user.focusAreas || [];
                  const selected = [];

                  if (expertise.length > 0) selected.push(expertise[0]);
                  if (focus.length > 0) selected.push(focus[0]);
                  if (focus.length > 1) selected.push(focus[1]);

                  const remaining =
                    expertise.length + focus.length - selected.length;

                  return (
                    <>
                      {selected.join(", ")}
                      {remaining > 0 && ` • +${remaining} more`}
                    </>
                  );
                })()}
              </p>

              {/* Experience + Location */}
              <div className="mt-2 flex items-center gap-2">
                <Badge
                  className={`border ${
                    isDark
                      ? "bg-teal-400/10 text-teal-300 border-teal-400/40"
                      : "bg-purple-500/20 text-purple-600 border-purple-400/40"
                  }`}
                >
                  {user.yearsOfExperience || 0} yrs exp
                </Badge>

                {user.Country && (
                  <Badge
                    variant="outline"
                    className={`flex items-center gap-1 border ${
                      isDark
                        ? "border-teal-300/40 text-teal-200"
                        : "border-purple-300/40 text-purple-600"
                    }`}
                  >
                    <MapPin className="w-3 h-3" /> {user.Country}
                  </Badge>
                )}
              </div>
            </div>

            {/* Rating */}
            <div
              className={`flex items-center gap-2 mt-4 md:mt-0 px-3 py-1 rounded-lg border h-fit
                ${isDark
                  ? "bg-yellow-500/10 border-yellow-400/40 text-yellow-300"
                  : "bg-yellow-500/20 border-yellow-500/30"
                }
              `}
            >
              <Award className="w-4 h-4" />
              <span className={`${textNormal} font-medium`}>
                {stats?.rating || 0}
              </span>
            </div>
          </div>

          {/* ================= QUICK STATS ================= */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            <SimpleStat
              icon={<Calendar className="text-purple-400" />}
              title="Sessions"
              value={stats?.sessions || 0}
              isDark={isDark}
            />

            <SimpleStat
              icon={<Users className="text-purple-400" />}
              title="Mentees"
              value={stats?.mentees || 0}
              isDark={isDark}
            />

            <SimpleStat
              icon={<DollarSign className="text-purple-400" />}
              title="Earned"
              value={`$${stats?.earned || 0}`}
              isDark={isDark}
            />

            <SimpleStat
              icon={<Clock className="text-purple-400" />}
              title="Response"
              value={stats?.responseTime || "<2 hrs"}
              isDark={isDark}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ======================= SIMPLE STAT ======================= */
function SimpleStat({ icon, title, value, isDark }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-6 h-6 flex items-center justify-center">{icon}</span>
      <div>
        <p
          className={`text-xs ${
            isDark ? "text-white/60" : "text-[var(--foreground-muted)]"
          }`}
        >
          {title}
        </p>
        <p
          className={`font-semibold ${
            isDark ? "text-white" : "text-[var(--foreground)]"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
}
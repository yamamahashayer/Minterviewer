"use client";

import { Mail, Phone, MapPin, Calendar, Edit2 } from "lucide-react";
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
}: {
  profile: any;
  editedProfile: any;
  setEditedProfile: (v: any) => void;
  isEditing: boolean;
  setIsEditing: (b: boolean) => void;
  isDark: boolean;
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
      {/* Top: Avatar + Name + Buttons */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div
            className={`w-24 h-24 rounded-full bg-gradient-to-br ${
              isDark ? "from-teal-300 to-emerald-400" : "from-purple-400 to-pink-500"
            } flex items-center justify-center text-white shadow-lg`}
          >
            <span className="text-4xl">{(profile.name || "M")[0]}</span>
          </div>

          {/* Name + Title */}
          <div>
            {isEditing ? (
              <>
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

                <Input
                  value={profile.title}
                  readOnly
                  className={`mb-3 ${
                    isDark
                      ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white"
                      : "bg-white border-[#ddd6fe] text-[#2e1065]"
                  }`}
                />
              </>
            ) : (
              <>
                <h2
                  className={`${isDark ? "text-white" : "text-[#2e1065]"} mb-1 font-bold`}
                >
                  {profile.name}
                </h2>
                <p className={`${isDark ? "text-teal-300" : "text-purple-600"} mb-3`}>
                  {profile.title}
                </p>
              </>
            )}

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

        {/* Edit Button */}
        <div>
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
              Edit Profile
            </Button>
          ) : null}
        </div>
      </div>

      {/* Bio */}
      <p
        className={`${
          isDark ? "text-[#d1d5dc]" : "text-[#2e1065]"
        } mb-6 leading-relaxed`}
      >
        {profile.bio}
      </p>

      {/* Contact Info */}
      <div
        className={`grid grid-cols-2 gap-4 pt-6 border-t ${
          isDark ? "border-[rgba(94,234,212,0.1)]" : "border-[#ddd6fe]"
        }`}
      >
        {/* Email */}
        <div className="flex items-center gap-3">
          <Mail size={18} className={isDark ? "text-teal-300" : "text-purple-600"} />
          <span className={isDark ? "text-[#99a1af]" : "text-[#6b21a8]"}>
            {profile.email}
          </span>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-3">
          <Phone size={18} className={isDark ? "text-teal-300" : "text-purple-600"} />
          <span className={isDark ? "text-[#99a1af]" : "text-[#6b21a8]"}>
            {profile.phone}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-3">
          <MapPin size={18} className={isDark ? "text-teal-300" : "text-purple-600"} />
          <span className={isDark ? "text-[#99a1af]" : "text-[#6b21a8]"}>
            {profile.location}
          </span>
        </div>

        {/* Joined Date */}
        <div className="flex items-center gap-3">
          <Calendar size={18} className={isDark ? "text-teal-300" : "text-purple-600"} />
          <span className={isDark ? "text-[#99a1af]" : "text-[#6b21a8]"}>
            Joined {profile.joinedDate}
          </span>
        </div>
      </div>
    </div>
  );
}

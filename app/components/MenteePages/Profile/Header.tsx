"use client";

import {
  MapPin,
  Calendar,
  Edit2,
  Check,
  X,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

type Props = {
  profile: any;
  editedProfile: any;
  targetUserId?: string; // ✅ للببلك بروفايل (المسج)
  setEditedProfile?: (v: any) => void;
  isEditing?: boolean;
  setIsEditing?: (b: boolean) => void;
  isDark: boolean;
  onSave?: () => void;
  onCancel?: () => void;
  readOnly?: boolean;
};

export default function Header({
  profile,
  editedProfile,
  targetUserId,
  setEditedProfile,
  isEditing = false,
  setIsEditing,
  isDark,
  onSave,
  onCancel,
  readOnly = false,
}: Props) {
  const canEdit = !readOnly && isEditing && setEditedProfile;
  const data = canEdit ? editedProfile : profile;

  return (
    <div
      className={`${
        isDark
          ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]"
          : "bg-white shadow-lg"
      } border ${
        isDark ? "border-[rgba(94,234,212,0.2)]" : "border-[#ddd6fe]"
      } rounded-xl p-8 backdrop-blur-sm mb-6`}
    >
      {/* ================= TOP ================= */}
      <div className="flex justify-between items-start gap-6 flex-wrap">
        {/* Identity */}
        <div className="flex gap-6">
          {/* Avatar */}
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center
            text-3xl font-bold
            ${
              isDark
                ? "bg-gradient-to-br from-teal-300 to-emerald-400 text-black"
                : "bg-gradient-to-br from-purple-600 to-pink-600 text-white"
            }`}
          >
            {data.name?.[0] || "U"}
          </div>

          <div className="space-y-2">
            {/* Name */}
            {canEdit ? (
              <Input
                value={data.name}
                onChange={(e) =>
                  setEditedProfile?.({ ...data, name: e.target.value })
                }
                className="max-w-xs"
              />
            ) : (
              <h1
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-[#2e1065]"
                }`}
              >
                {data.name}
              </h1>
            )}

            {/* Interests */}
            {canEdit ? (
              <Input
                className="mt-1 max-w-md"
                placeholder="Interests (comma separated)"
                value={(data.area_of_expertise || []).join(", ")}
                onChange={(e) =>
                  setEditedProfile?.({
                    ...data,
                    area_of_expertise: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
              />
            ) : (
              data.area_of_expertise?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {console.log('Type of data.area_of_expertise:', typeof data.area_of_expertise, 'Value:', data.area_of_expertise)}
                  {(Array.isArray(data.area_of_expertise) ? data.area_of_expertise : []).map((tag: string) => (
                    <Badge
                      key={tag}
                      className={
                        isDark
                          ? "bg-teal-500/20 text-teal-300"
                          : "bg-purple-100 text-purple-700"
                      }
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )
            )}

            {/* Social links */}
            <div className="flex items-center gap-2 pt-1">
              {data.linkedin && (
                <a
                  href={data.linkedin}
                  target="_blank"
                  className={`w-9 h-9 rounded-full flex items-center justify-center border transition
                  ${
                    isDark
                      ? "border-[rgba(94,234,212,0.2)] text-teal-300 hover:bg-teal-500/20"
                      : "border-[#ddd6fe] text-purple-600 hover:bg-purple-100"
                  }`}
                >
                  <Linkedin size={18} />
                </a>
              )}
              {data.github && (
                <a
                  href={data.github}
                  target="_blank"
                  className={`w-9 h-9 rounded-full flex items-center justify-center border transition
                  ${
                    isDark
                      ? "border-[rgba(94,234,212,0.2)] text-teal-300 hover:bg-teal-500/20"
                      : "border-[#ddd6fe] text-purple-600 hover:bg-purple-100"
                  }`}
                >
                  <Github size={18} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ================= ACTIONS ================= */}
        <div className="flex gap-2">
          {/* 💬 MESSAGE (Public only) */}
          {readOnly && targetUserId && (
            <Button
              onClick={() =>
                (window.location.href =
                  `/company?tab=messages&chatWith=${targetUserId}`)
              }
              className={
                isDark
                  ? "bg-teal-600 hover:bg-teal-500 text-black"
                  : "bg-purple-600 hover:bg-purple-500 text-white"
              }
            >
              <Mail size={16} className="mr-2" />
              Message
            </Button>
          )}

          {/* ✏️ EDIT (Private only) */}
          {!readOnly && setIsEditing && (
            <>
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className={
                    isDark
                      ? "bg-teal-500 hover:bg-teal-400 text-black"
                      : "bg-purple-600 hover:bg-purple-500 text-white"
                  }
                >
                  <Edit2 size={16} className="mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={onCancel} variant="outline">
                    <X size={16} />
                  </Button>
                  <Button
                    onClick={onSave}
                    className="bg-emerald-500 hover:bg-emerald-400 text-black"
                  >
                    <Check size={16} />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ================= BIO ================= */}
      <div className="mt-6 max-w-3xl">
        {canEdit ? (
          <Input
            value={data.bio}
            onChange={(e) =>
              setEditedProfile?.({ ...data, bio: e.target.value })
            }
          />
        ) : (
          <p className={isDark ? "text-[#c3d4d8]" : "text-[#4c1d95]"}>
            {data.bio}
          </p>
        )}
      </div>

      {/* ================= META ================= */}
      <div className="flex flex-wrap gap-6 mt-6 text-sm">
        <div className="flex items-center gap-2 text-gray-400">
          <MapPin size={16} />
          <span>{data.location || "—"}</span>
        </div>

        <Meta
          icon={<Calendar size={16} />}
          label={`Joined ${data.joinedDate}`}
        />
      </div>
    </div>
  );
}

/* ================= Helpers ================= */

function Meta({ icon, label }: any) {
  return (
    <div className="flex items-center gap-2 text-gray-400">
      {icon}
      <span>{label || "—"}</span>
    </div>
  );
}



{/* <Header
  profile={profile}
  editedProfile={profile}
  targetUserId={profile.userId}
  isDark={isDark}
  readOnly
/> */}


{/* <Header
  profile={profile}
  editedProfile={editedProfile}
  setEditedProfile={setEditedProfile}
  isEditing={isEditing}
  setIsEditing={setIsEditing}
  isDark={isDark}
  onSave={handleSave}
  onCancel={handleCancel}
/> */}


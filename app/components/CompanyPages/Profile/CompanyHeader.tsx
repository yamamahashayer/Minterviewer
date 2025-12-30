"use client";

import {
  Building2,
  Pencil,
  Check,
  X,
  MapPin,
  BadgeCheck,
  Mail,
} from "lucide-react";

import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";

export default function CompanyHeader({
  company,
  edited,
  setEdited,
  isEditing,
  setIsEditing,
  isDark,
  onSave,
  onCancel,
  saving,
  isOwner,
}: any) {
  if (!company) return null;

  const box = isDark
    ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.03)] border-white/10"
    : "bg-white border-purple-200";

  const textMuted = isDark ? "text-white/60" : "text-purple-700";

  return (
    <div className={`rounded-2xl p-8 relative border ${box}`}>
      {/* ================= ACTIONS ================= */}
      <div className="absolute top-6 right-6 flex gap-2">
        {/* 💬 MESSAGE – placeholder */}
        {!isOwner && (
          <Button
            onClick={() => {
              alert("Messaging coming soon 💬");
            }}
            className={
              isDark
                ? "bg-teal-600 hover:bg-teal-500 text-white"
                : "bg-purple-600 hover:bg-purple-500 text-white"
            }
          >
            <Mail size={16} className="mr-2" />
            Message
          </Button>
        )}

        {/* ✏️ EDIT – owner only */}
        {isOwner && (
          <>
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-purple-600 text-white"
              >
                <Pencil size={16} className="mr-2" />
                Edit
              </Button>
            ) : (
              <>
                <Button
                  onClick={onSave}
                  disabled={saving}
                  className="bg-green-600 text-white"
                >
                  <Check size={16} className="mr-2" />
                  {saving ? "Saving..." : "Save"}
                </Button>

                <Button
                  onClick={onCancel}
                  className={isDark ? "bg-white/10" : "bg-gray-200"}
                >
                  <X size={16} />
                </Button>
              </>
            )}
          </>
        )}
      </div>

      {/* ================= CONTENT ================= */}
      <div className="flex gap-6">
        {/* LOGO */}
        <div className="relative">
          <div className="w-24 h-24 rounded-xl flex items-center justify-center bg-purple-500/20 text-4xl font-bold">
            {company.name?.charAt(0).toUpperCase() || "C"}
          </div>

          {company.isVerified && (
            <div className="absolute -bottom-3 -right-3 bg-green-500 text-white w-9 h-9 rounded-full flex items-center justify-center">
              <BadgeCheck size={18} />
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="flex-1">
          {!isEditing ? (
            <h2 className="text-2xl font-semibold">{company.name}</h2>
          ) : (
            <Input
              value={edited.name}
              onChange={(e) => setEdited({ ...edited, name: e.target.value })}
              className="max-w-sm"
            />
          )}

          <p className={`${textMuted} flex items-center gap-2 mt-1`}>
            <Building2 size={16} /> {company.industry}
          </p>

          <div className="flex items-center gap-2 mt-1">
            <MapPin size={16} className={textMuted} />
            {!isEditing ? (
              <span className={textMuted}>{company.location}</span>
            ) : (
              <Input
                value={edited.location || ""}
                onChange={(e) =>
                  setEdited({ ...edited, location: e.target.value })
                }
                className="max-w-sm"
              />
            )}
          </div>

          <Badge className="bg-green-600 text-white mt-2 w-fit">
            {company.isVerified ? "Verified" : "Pending"}
          </Badge>

          <div className="mt-4">
            {!isEditing ? (
              <p className={textMuted}>
                {company.description || "No bio provided."}
              </p>
            ) : (
              <Textarea
                value={edited.description || ""}
                onChange={(e) =>
                  setEdited({ ...edited, description: e.target.value })
                }
                rows={3}
                className="max-w-xl"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

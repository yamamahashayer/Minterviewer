"use client";

import {
  Building2,
  Pencil,
  Check,
  X,
  MapPin,
  Globe,
  Mail,
  BadgeCheck,
} from "lucide-react";

import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Badge } from "@/app/components/ui/badge";

export default function CompanyHeader({
  company,
  edited,
  setEdited,
  isEditing,
  setIsEditing,
  isDark,
  onSave,
  onCancel,
}) {
  if (!company) return null;

  const box = isDark
    ? "bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.03)] border-white/10 shadow-[0_0_40px_rgba(0,255,255,0.08)]"
    : "bg-white border-purple-200 shadow-[0_0_30px_rgba(168,85,247,0.12)]";

  const textMain = isDark ? "text-white" : "text-purple-900";
  const textMuted = isDark ? "text-white/60" : "text-purple-700";

  return (
    <div className={`rounded-2xl p-8 relative border backdrop-blur-xl mb-6 ${box}`}>
      
      {/* ========== TOP RIGHT ACTIONS ========== */}
      <div className="absolute top-6 right-6 flex gap-2">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 flex items-center gap-2 rounded-lg bg-purple-600 text-white shadow hover:bg-purple-700 transition"
          >
            <Pencil size={16} /> Edit
          </button>
        ) : (
          <>
            <button
              onClick={onSave}
              className="px-4 py-2 flex items-center gap-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
            >
              <Check size={16} /> Save
            </button>
            <button
              onClick={onCancel}
              className={`px-4 py-2 flex items-center gap-2 rounded-lg ${
                isDark ? "bg-white/10 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              <X size={16} /> Cancel
            </button>
          </>
        )}
      </div>

      {/* ========== MAIN HEADER CONTENT ========== */}
      <div className="flex items-start gap-6">
        
        {/* Company Logo / Avatar */}
        <div className="relative group">
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              id="companyLogo"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (ev) => {
                  setEdited({ ...edited, logo: ev.target?.result });
                };
                reader.readAsDataURL(file);
              }}
            />
          )}

          {/* Avatar */}
          <div
            className={`w-24 h-24 rounded-xl overflow-hidden flex items-center justify-center cursor-pointer ${
              isEditing ? "ring-2 ring-purple-400" : ""
            }`}
            onClick={() => {
              if (isEditing)
                document.getElementById("companyLogo")?.click();
            }}
          >
            {edited.logo ? (
              <img src={edited.logo} className="w-full h-full object-cover" />
            ) : (
              <div
                className={`w-full h-full flex items-center justify-center text-4xl font-bold rounded-xl 
                ${isDark ? "bg-purple-400/20 text-purple-300" : "bg-purple-200 text-purple-700"}`}
              >
                {company.name?.charAt(0).toUpperCase() || "C"}
              </div>
            )}
          </div>

          {/* Verified Badge */}
          {company.isVerified && (
            <div
              className="absolute -bottom-3 -right-3 bg-green-500 text-white w-10 h-10 rounded-full border-4 
              border-white flex items-center justify-center shadow-lg"
            >
              <BadgeCheck size={20} />
            </div>
          )}
        </div>

        {/* TEXT SECTION */}
        <div className="flex-1">
          
          {/* NAME */}
          {!isEditing ? (
            <h2 className={`${textMain} text-2xl font-semibold mb-1`}>
              {company.name}
            </h2>
          ) : (
            <Input
              value={edited.name}
              onChange={(e) => setEdited({ ...edited, name: e.target.value })}
              className="max-w-sm mb-2"
            />
          )}

          {/* Industry */}
          <p className={`${textMuted} mb-1 flex items-center gap-2`}>
            <Building2 size={16} />
            {company.industry || "Industry not set"}
          </p>

          {/* Country (NEW) */}
          <div className="flex items-center gap-2 mt-1">
            <MapPin size={16} className={textMuted} />

            {!isEditing ? (
              <span className={textMuted}>
                {company.location || "Location not set"}
              </span>
            ) : (
              <Input
                value={edited.location || ""}
                onChange={(e) => setEdited({ ...edited, location: e.target.value })}
                className="max-w-sm"
                placeholder="Enter country..."
              />
            )}
          </div>

          {/* Verified Status */}
          <Badge className="bg-green-600 text-white w-fit mt-2">
            {company.isVerified ? "Verified" : "Pending"}
          </Badge>

          {/* BIO */}
          <div className="mt-4">
            {!isEditing ? (
              <p className={textMuted}>
                {edited.description || "No bio provided."}
              </p>
            ) : (
              <Textarea
                value={edited.description || ""}
                onChange={(e) =>
                  setEdited({ ...edited, description: e.target.value })
                }
                className="max-w-xl mt-2"
                rows={3}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

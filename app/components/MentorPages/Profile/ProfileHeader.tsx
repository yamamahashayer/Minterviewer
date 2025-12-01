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
  onChange,
  onSave
}) {
  const user = profile || {};

  return (
    <div
      className="relative overflow-hidden rounded-2xl backdrop-blur-xl p-8 mb-8"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        boxShadow: "0 4px 20px rgba(147, 51, 234, 0.12)"
      }}
    >
      {/* Background Gradient */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-3xl rounded-full" />

      {/* ================= HEADER TOP BAR (Edit Button) ================= */}
      <div className="relative flex justify-end mb-4">
        {!isEditing && (
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
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 flex items-center gap-2 rounded-lg 
              bg-gray-300 text-gray-800 hover:bg-gray-400"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* ================= MAIN LAYOUT ================= */}
      <div className="relative flex flex-col md:flex-row gap-6 items-center md:items-start">

        {/* ================= AVATAR ================= */}
        <div className="relative">
          <Avatar className="w-28 h-28 border-4 border-purple-500/30">
            <AvatarImage src={user.profile_photo} />
            <AvatarFallback className="text-3xl">
              {user.full_name?.charAt(0) || "M"}
            </AvatarFallback>
          </Avatar>

          {/* Rank Icon */}
          <div
            className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 
            flex items-center justify-center border-4"
            style={{ borderColor: "var(--card)" }}
          >
            <Award className="text-white w-5 h-5" />
          </div>
        </div>

        {/* ================= MAIN INFO ================= */}
        <div className="flex-1 w-full">
          <div className="flex flex-col md:flex-row md:justify-between w-full">

            <div>
              {/* NAME */}
              {!isEditing && (
                <h2 className="text-[var(--foreground)] text-2xl font-semibold">
                  {user.full_name}
                </h2>
              )}

              {isEditing && (
                <input
                  value={user.full_name}
                  onChange={(e) => onChange("full_name", e.target.value)}
                  className="text-xl font-semibold bg-white/20 border rounded-xl px-3 py-2"
                />
              )}

               <p className="text-[var(--foreground-muted)] mt-1">
              {user.area_of_expertise?.length ? user.area_of_expertise.join(", ") : ""}
              {user.area_of_expertise?.length && user.focusAreas?.length ? " • " : ""}
              {user.focusAreas?.length ? user.focusAreas.join(", ") : ""}
            </p>


              {/* Experience + Country */}
              <div className="mt-2 flex items-center gap-2">
                <Badge className="bg-purple-500/20 text-purple-600 border border-purple-400/40">
                  {user.yearsOfExperience || 0} yrs exp
                </Badge>

                {user.Country && (
                  <Badge variant="outline" className="border-purple-300/40 text-purple-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {user.Country}
                  </Badge>
                )}
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-4 md:mt-0 bg-yellow-500/20 px-3 py-1 rounded-lg border border-yellow-500/30 h-fit">
              <Award className="w-4 h-4 text-yellow-400" />
              <span className="text-[var(--foreground)] font-medium">
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
            />

            <SimpleStat
              icon={<Users className="text-purple-400" />}
              title="Mentees"
              value={stats?.mentees || 0}
            />

            <SimpleStat
              icon={<DollarSign className="text-purple-400" />}
              title="Earned"
              value={`$${stats?.earned || 0}`}
            />

            <SimpleStat
              icon={<Clock className="text-purple-400" />}
              title="Response"
              value={stats?.responseTime || "<2 hrs"}
            />
          </div>

        </div>
      </div>
    </div>
  );
}

/* ======================= SIMPLE STAT ======================= */
function SimpleStat({ icon, title, value }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-6 h-6 flex items-center justify-center">{icon}</span>
      <div>
        <p className="text-[var(--foreground-muted)] text-xs">{title}</p>
        <p className="text-[var(--foreground)] font-semibold">{value}</p>
      </div>
    </div>
  );
}

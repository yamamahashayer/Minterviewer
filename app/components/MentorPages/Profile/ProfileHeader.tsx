"use client";

import {
  Award,
  Users,
  Calendar,
  DollarSign,
  Clock,
  MapPin
} from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";

type HeaderProps = {
  profile: any;
  stats: any;
};

export default function MentorPremiumHeader({ profile, stats }: HeaderProps) {
  const data = profile || {};

  return (
    <div
      className="relative overflow-hidden rounded-3xl p-10 mb-10 shadow-lg"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
      }}
    >
      {/* ======= Premium Gradient Blur ======= */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-purple-400/30 via-pink-400/20 to-transparent blur-3xl opacity-60" />
      <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-gradient-to-tr from-purple-300/20 to-pink-300/20 blur-2xl opacity-40" />

      <div className="relative flex flex-col md:flex-row items-start gap-8 z-10">

        {/* ======================= Avatar ======================= */}
        <div className="relative">
          <Avatar className="w-28 h-28 border-4 border-purple-500/40 shadow-md">
            <AvatarImage src={data.profile_photo} />
            <AvatarFallback className="text-3xl font-bold text-purple-700">
              {data.full_name?.charAt(0) || "M"}
            </AvatarFallback>
          </Avatar>

          {/* Rank */}
          <div
            className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 
            flex items-center justify-center border-4 shadow-md"
            style={{ borderColor: "var(--card)" }}
          >
            <Award className="text-white w-5 h-5" />
          </div>
        </div>

        {/* ======================= Main Information ======================= */}
        <div className="flex-1 w-full">

          {/* Name & Title */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">

            {/* Left */}
            <div>
              <h1 className="text-3xl font-semibold text-[var(--foreground)] leading-tight">
                {data.full_name}
              </h1>

              {/* Area of Expertise + Focus Area side-by-side */}
              <p className="text-[var(--foreground-muted)] mt-1 text-sm flex items-center gap-1">
                <span>{data.area_of_expertise || "Expert"}</span>

                {/* dot separator */}
                {(data.area_of_expertise && data.focusArea) && (
                  <span className="text-purple-500 mx-1">•</span>
                )}

                <span>{data.focusArea || "Mentor"}</span>
              </p>


              {/* Badges */}
              <div className="flex flex-wrap items-center gap-3 mt-3">

                <Badge className="bg-purple-500/20 text-purple-700 border border-purple-300/40">
                  {data.yearsOfExperience || 0} yrs exp
                </Badge>

                {data.Country && (
                  <Badge
                    variant="outline"
                    className="border-purple-300/50 text-purple-700 flex items-center gap-1"
                  >
                    <MapPin className="w-3 h-3" />
                    {data.Country}
                  </Badge>
                )}
              </div>
            </div>

            {/* Rating */}
            <div className="px-4 py-2 bg-yellow-500/20 rounded-lg border border-yellow-500/40 shadow-sm flex items-center gap-2 h-fit">
              <Award className="w-4 h-4 text-yellow-500" />
              <span className="font-semibold text-[var(--foreground)]">
                {stats?.rating || 0}
              </span>
            </div>

          </div>

          {/* ======================= Quick Stats ======================= */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">

            <StatItem
              icon={<Calendar className="text-purple-500" />}
              title="Sessions"
              value={stats?.sessionsCount || stats?.sessions || 0}
            />

            <StatItem
              icon={<Users className="text-purple-500" />}
              title="Mentees"
              value={stats?.menteesCount || stats?.mentees || 0}
            />

            <StatItem
              icon={<DollarSign className="text-purple-500" />}
              title="Earned"
              value={`$${stats?.earned || 0}`}
            />

            <StatItem
              icon={<Clock className="text-purple-500" />}
              title="Response"
              value={stats?.responseTime || "<2 hrs"}
            />

          </div>

        </div>

      </div>
    </div>
  );
}

/* ============================================= */
/*                   Stat Item                   */
/* ============================================= */
function StatItem({
  icon,
  title,
  value,
}: {
  icon: any;
  title: string;
  value: any;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-7 h-7 flex items-center justify-center">
        {icon}
      </span>
      <div>
        <p className="text-xs text-[var(--foreground-muted)]">{title}</p>
        <p className="text-[var(--foreground)] font-bold text-sm">{value}</p>
      </div>
    </div>
  );
}

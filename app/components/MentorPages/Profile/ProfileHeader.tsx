"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import { Star, Award, MapPin, Briefcase } from "lucide-react";

export default function ProfileHeader({ mentorInfo, stats, bio }: any) {
  return (
    <div
      className="relative overflow-hidden rounded-xl backdrop-blur-xl p-8 mb-6"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-teal-500/10 rounded-full blur-3xl" />

      <div className="relative flex flex-col md:flex-row gap-6">
        {/* Avatar */}
        <div className="relative">
          <Avatar className="w-32 h-32 border-4 border-cyan-500/30">
            <AvatarImage src={mentorInfo.avatar} />
            <AvatarFallback>{mentorInfo.name[0]}</AvatarFallback>
          </Avatar>
          <div
            className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center border-4"
            style={{ borderColor: "var(--card)" }}
          >
            <Award className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-[var(--foreground)] mb-1">{mentorInfo.name}</h2>
              <p className="text-[var(--foreground-muted)] mb-2">
                {mentorInfo.title}
              </p>

              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className="bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-500/50 text-cyan-300">
                  {mentorInfo.level}
                </Badge>

                <Badge variant="outline" style={{ color: "var(--foreground-muted)" }}>
                  <Briefcase className="w-3 h-3 mr-1" />
                  {mentorInfo.company}
                </Badge>

                <Badge variant="outline" style={{ color: "var(--foreground-muted)" }}>
                  <MapPin className="w-3 h-3 mr-1" />
                  {mentorInfo.location}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-3 py-1 rounded-lg border border-yellow-500/30">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="text-[var(--foreground)]">{stats.rating}</span>
              <span className="text-[var(--foreground-muted)] text-sm">
                ({stats.totalReviews})
              </span>
            </div>
          </div>

          <p className="text-[var(--foreground)] mb-4">{bio}</p>
        </div>
      </div>
    </div>
  );
}

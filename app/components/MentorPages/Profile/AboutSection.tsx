"use client";

import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";

export default function AboutSection({ mentorInfo, languages, industries }: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Contact */}
      <div
        className="relative overflow-hidden rounded-xl backdrop-blur-xl p-6"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        <h3 className="text-[var(--foreground)] mb-4">Contact Information</h3>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-cyan-400" />
            <div>
              <p className="text-[var(--foreground-muted)] text-xs">Email</p>
              <p className="text-[var(--foreground)]">{mentorInfo.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-[var(--foreground-muted)] text-xs">Phone</p>
              <p className="text-[var(--foreground)]">{mentorInfo.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-[var(--foreground-muted)] text-xs">Location</p>
              <p className="text-[var(--foreground)]">{mentorInfo.location}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-[var(--border)]">
          <h4 className="text-[var(--foreground)] text-sm mb-3">Social Links</h4>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Linkedin className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline">
              <Github className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline">
              <Globe className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Professional */}
      <div
        className="relative overflow-hidden rounded-xl backdrop-blur-xl p-6"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        <h3 className="text-[var(--foreground)] mb-4">Professional Details</h3>

        <div className="space-y-4">
          {/* Languages */}
          <div>
            <p className="text-[var(--foreground-muted)] text-xs mb-2">Languages</p>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang: any, i: number) => (
                <Badge key={i} variant="outline">
                  {lang}
                </Badge>
              ))}
            </div>
          </div>

          {/* Industries */}
          <div>
            <p className="text-[var(--foreground-muted)] text-xs mb-2">Industries</p>
            <div className="flex flex-wrap gap-2">
              {industries.map((ind: any, i: number) => (
                <Badge key={i} variant="outline">
                  {ind}
                </Badge>
              ))}
            </div>
          </div>

          {/* Joined Date */}
          <div>
            <p className="text-[var(--foreground-muted)] text-xs mb-2">Member Since</p>
            <p className="text-[var(--foreground)]">{mentorInfo.joinedDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

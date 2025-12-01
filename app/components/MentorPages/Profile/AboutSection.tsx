"use client";

import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Linkedin,
  Github,
  Briefcase,
  Languages,
  Tag,
  Award,
  UserCircle,
} from "lucide-react";

import { Badge } from "@/app/components/ui/badge";

type AboutSectionProps = {
  profile: any;
};

export default function AboutSection({ profile }: AboutSectionProps) {
  const data = profile || {};
  const iconClass = "w-5 h-5 text-purple-600";

  return (
    <div className="space-y-8">

      {/* ================== BIO ================== */}
      {(data.short_bio || data.headline) && (
        <Card>
          <SectionTitle
            title="Bio"
            icon={<UserCircle className={iconClass} />}
          />

          <div className="space-y-2 text-sm ml-7">
            {data.headline && (
              <p className="text-[var(--foreground)] font-medium leading-snug">
                {data.headline}
              </p>
            )}

            {data.short_bio ? (
              <p className="text-[var(--foreground-muted)] leading-relaxed">
                {data.short_bio}
              </p>
            ) : (
              <p className="text-[var(--foreground-muted)] italic">
                No bio added yet
              </p>
            )}
          </div>
        </Card>
      )}

      {/* ================== CONTACT + PROFESSIONAL SIDE BY SIDE ================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* LEFT — CONTACT INFORMATION */}
        <Card>
          <SectionTitle title="Contact Information" />

          <div className="space-y-4 text-sm">
            <InfoItem label="Email" value={data.email} icon={<Mail className={iconClass} />} />
            <InfoItem label="Phone" value={data.phoneNumber} icon={<Phone className={iconClass} />} />
            <InfoItem label="Location" value={data.Country} icon={<MapPin className={iconClass} />} />

            <InfoItem
              label="Joined"
              value={data.created_at ? new Date(data.created_at).toLocaleDateString() : "N/A"}
              icon={<Calendar className={iconClass} />}
            />
          </div>

          <Divider />

          <h4 className="text-sm mb-3 text-[var(--foreground)]">Social Links</h4>
          <div className="flex gap-3">
            <SocialIcon icon={<Linkedin className={iconClass} />} href={data.linkedin_url} />
            <SocialIcon icon={<Github className={iconClass} />} href={data.github} />
          </div>
        </Card>

        {/* RIGHT — PROFESSIONAL DETAILS */}
        <Card>
          <SectionTitle title="Professional Details" />

          <div className="space-y-4 text-sm">
            <InfoItem
              label="Area of Expertise"
              value={data.area_of_expertise}
              icon={<Tag className={iconClass} />}
            />

            <InfoItem
              label="Focus Area"
              value={data.focusArea}
              icon={<Tag className={iconClass} />}
            />

            <InfoItem
              label="Availability"
              value={data.availabilityType}
              icon={<Calendar className={iconClass} />}
            />

            <InfoItem
              label="Years of Experience"
              value={`${data.yearsOfExperience || 0} years`}
              icon={<Briefcase className={iconClass} />}
            />

            <DetailBlock
              title="Languages"
              icon={<Languages className={iconClass} />}
              items={data.languages}
            />

            <DetailBlock
              title="Session Types"
              icon={<Calendar className={iconClass} />}
              items={data.sessionTypes}
            />
          </div>
        </Card>

      </div>

      {/* ================== CERTIFICATIONS ================== */}
      {data.certifications?.length > 0 && (
        <Card>
          <SectionTitle title="Certifications" icon={<Award className={iconClass} />} />

          <div className="grid gap-3">
            {data.certifications.map((c: any, i: number) => (
              <div key={i} className="flex items-center gap-3 p-4 border rounded-xl bg-white/30">
                <Award className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.issuer} — {c.year}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ================== ACHIEVEMENTS ================== */}
      {data.achievements?.length > 0 && (
        <Card>
          <SectionTitle title="Achievements" icon={<Award className={iconClass} />} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.achievements.map((a: string, i: number) => (
              <div key={i} className="p-4 rounded-lg border bg-white/40">
                <p className="font-medium">{a}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

/* ==================== COMPONENTS ==================== */

type CardProps = { children: React.ReactNode };
function Card({ children }: CardProps) {
  return (
    <div
      className="p-6 rounded-xl"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
      }}
    >
      {children}
    </div>
  );
}

type SectionTitleProps = { title: string; icon?: React.ReactNode };
function SectionTitle({ title, icon }: SectionTitleProps) {
  return (
    <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)] flex items-center gap-2">
      {icon}
      {title}
    </h3>
  );
}

function Divider() {
  return <div className="mt-6 pt-6 border-t border-[var(--border)]" />;
}

type InfoItemProps = {
  label: string;
  value?: any;
  icon: React.ReactNode;
};

function InfoItem({ label, value, icon }: InfoItemProps) {
  if (!value) return null;

  return (
    <div className="flex items-start gap-3">
      {icon}
      <div>
        <p className="text-xs text-[var(--foreground-muted)]">{label}</p>
        <p className="font-medium text-[var(--foreground)]">{value}</p>
      </div>
    </div>
  );
}

type DetailBlockProps = {
  title: string;
  icon: React.ReactNode;
  items?: any[];
};

function DetailBlock({ title, icon, items = [] }: DetailBlockProps) {
  if (!items.length) return null;

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h4 className="font-medium text-[var(--foreground)]">{title}</h4>
      </div>

      <div className="flex flex-wrap gap-2 ml-7">
        {items.map((item, i) => (
          <Badge key={i} variant="outline">
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );
}

type SocialIconProps = {
  icon: React.ReactNode;
  href?: string;
};

function SocialIcon({ icon, href }: SocialIconProps) {
  return (
    <a
      href={href || "#"}
      target="_blank"
      className={`p-2 rounded-md border w-10 h-10 flex items-center justify-center ${
        href
          ? "border-purple-500/40 hover:bg-purple-500/10"
          : "opacity-30 border-[var(--border)] cursor-not-allowed"
      }`}
      onClick={(e) => !href && e.preventDefault()}
    >
      {icon}
    </a>
  );
}

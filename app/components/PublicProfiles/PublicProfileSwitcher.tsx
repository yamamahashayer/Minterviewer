"use client";

import { useEffect, useState } from "react";

import PublicMenteeProfile from "@/app/components/PublicProfiles/PublicMenteeProfile";
import PublicMentorProfile from "@/app/components/PublicProfiles/PublicMentorProfile";
import PublicCompanyProfile from "@/app/components/PublicProfiles/PublicCompanyProfile";

type Theme = "dark" | "light";

type Props = {
  id: string;
  theme?: Theme;
  onBack?: () => void;
};

export default function PublicProfileSwitcher({
  id,
  theme = "dark",
  onBack,
}: Props) {
  const isDark = theme === "dark";

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    fetch(`/api/public/profile/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Profile not found");
        return res.json();
      })
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => {
        setData(null);
        setLoading(false);
      });
  }, [id]);

  /* ================= UI STATES ================= */

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark
            ? "bg-[#0a0f1e] text-slate-400"
            : "bg-[#f5f3ff] text-gray-500"
        }`}
      >
        Loading profile…
      </div>
    );
  }

  if (!data?.type) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark
            ? "bg-[#0a0f1e] text-slate-400"
            : "bg-[#f5f3ff] text-gray-500"
        }`}
      >
        Profile not found
      </div>
    );
  }

  /* ================= SWITCH ================= */

  if (data.type === "mentee") {
    return (
      <PublicMenteeProfile
        menteeId={data.menteeId}
        theme={theme}
        onBack={onBack}
      />
    );
  }

  if (data.type === "mentor") {
    return (
      <PublicMentorProfile
        mentorId={data.mentorId}
        theme={theme}
        onBack={onBack}
      />
    );
  }

  if (data.type === "company") {
    return (
      <PublicCompanyProfile
        companyId={data.companyId}
        theme={theme}
        onBack={onBack}
      />
    );
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        isDark
          ? "bg-[#0a0f1e] text-slate-400"
          : "bg-[#f5f3ff] text-gray-500"
      }`}
    >
      Unknown profile type
    </div>
  );
}

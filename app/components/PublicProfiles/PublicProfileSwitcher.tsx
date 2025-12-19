"use client";

import { useEffect, useState } from "react";
import PublicMenteeProfile from "@/app/components/PublicProfiles/PublicMenteeProfile";
import PublicMentorProfile from "@/app/components/PublicProfiles/PublicMentorProfile";
import PublicCompanyProfile from "@/app/components/PublicProfiles/PublicCompanyProfile";

type Theme = "dark" | "light";

type Props = {
  id: string;
  theme?: Theme;   // 👈 اختياري
  onBack?: () => void;
};

export default function PublicProfileSwitcher({
  id,
  theme = "dark", // 👈 افتراضي
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

  /* ================= STATES ================= */

  if (loading) {
    return (
      <div
        className={`p-8 text-center ${
          isDark ? "text-slate-400" : "text-gray-500"
        }`}
      >
        Loading profile…
      </div>
    );
  }

  if (!data?.type) {
    return (
      <div
        className={`p-8 text-center ${
          isDark ? "text-slate-400" : "text-gray-500"
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
      className={`p-8 text-center ${
        isDark ? "text-slate-400" : "text-gray-500"
      }`}
    >
      Unknown profile type
    </div>
  );
}

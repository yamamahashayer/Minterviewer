"use client";

import Header from "../MenteePages/Profile/Header";
import SkillsSection from "../MenteePages/Profile/SkillsSection";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function PublicMenteeProfile({
  menteeId,
  onBack,
  theme = "dark",
}: {
  menteeId: string;
  onBack?: () => void;
  theme?: "dark" | "light";
}) {
  const isDark = theme === "dark";
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!menteeId) return;

    fetch(`/api/mentees/${menteeId}`)
      .then((r) => r.json())
      .then(setData);
  }, [menteeId]);

  if (!data) return <div className="p-6">Loading…</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* 🔙 BACK */}
{onBack && (
  <div className="mb-4">
    <button
      onClick={onBack}
      className={`
        flex items-center gap-2 text-sm font-medium
        transition-colors
        ${
          isDark
            ? "text-teal-300 hover:text-teal-200"
            : "text-purple-700 hover:text-purple-900"
        }
      `}
    >
      <span className="text-lg">←</span>
      <span>Back to candidates</span>
    </button>
  </div>
)}


      <Header
        profile={data.profile}
        editedProfile={data.profile}
        isEditing={false}
        setIsEditing={() => {}}
        isDark={isDark}
        onSave={() => {}}
        onCancel={() => {}}
        readOnly
      />

      <SkillsSection profile={data.profile} isDark={isDark} />
    </div>
  );
}

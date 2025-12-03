"use client";

import BackgroundSection from "./BackgroundSection";

export default function MentorBackgroundSection({
  mentorId,
  theme = "light",
}: {
  mentorId: string | null;
  theme?: "dark" | "light";
}) {
  return (
    <BackgroundSection
      ownerId={mentorId}
      ownerModel="Mentor"
      theme={theme}
    />
  );
}

"use client";

import BackgroundSection from "./BackgroundSection";

export default function MenteeBackgroundSection({
  menteeId,
  theme = "light",
}: {
  menteeId: string | null;
  theme?: "dark" | "light";
}) {
  return (
    <BackgroundSection
      ownerId={menteeId}
      ownerModel="Mentee"
      theme={theme}
    />
  );
}

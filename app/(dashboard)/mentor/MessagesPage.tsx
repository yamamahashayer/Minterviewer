"use client";

import MessagesPage from "@/app/components/Messages/Page";

export default function MentorMessages({ theme }: { theme?: "dark" | "light" }) {
  return <MessagesPage theme={theme || "light"} />;
}

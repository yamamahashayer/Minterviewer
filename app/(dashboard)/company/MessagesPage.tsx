"use client";

import MessagesPage from "@/app/components/Messages/Page";

export default function MenteeMessages({ theme }: { theme?: "dark" | "light" }) {
  return <MessagesPage theme={theme || "light"} />;
}

import { Suspense } from "react";
import MessagesPage from "@/app/components/Messages/Page";

export default function MenteeMessages({ theme }: { theme?: "dark" | "light" }) {
  return (
    <Suspense fallback={<div className="p-8">Loading messages...</div>}>
      <MessagesPage theme={theme || "light"} />
    </Suspense>
  );
}

"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

// Pages
import OverviewPage from "@/app/(dashboard)/company/OverviewPage";
import ProfilePage from "@/app/(dashboard)/company/ProfilePage";
import JobsPage from "@/app/(dashboard)/company/JobsPage";
import CandidatesPage from "@/app/(dashboard)/company/CandidatesPage";
import MessagesPage from "@/app/(dashboard)/company/MessagesPage";
import SettingsPage from "@/app/(dashboard)/company/SettingsPage";
import CompanyNotifications from "@/app/(dashboard)/company/NotificationsPage";

type Theme = "dark" | "light";

export default function CompanyPage() {
  const params = useSearchParams();
  const tab = (params.get("tab") || "overview").toLowerCase();

  const getTheme = (): Theme =>
    (typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark"))
      ? "dark"
      : "light";

  const [theme, setTheme] = React.useState<Theme>(() => getTheme());

  React.useEffect(() => {
    const el = document.documentElement;
    const obs = new MutationObserver(() => setTheme(getTheme()));
    obs.observe(el, { attributes: true, attributeFilter: ["class"] });

    return () => obs.disconnect();
  }, []);

  const render = () => {
    switch (tab) {
      case "overview":
        return <OverviewPage theme={theme} />;
      case "profile":
        return <ProfilePage theme={theme} />;
      case "jobs":
        return <JobsPage theme={theme} />;
      case "candidates":
        return <CandidatesPage theme={theme} />;
      case "messages":
        return <MessagesPage theme={theme} />;
      case "notifications":
        return <CompanyNotifications theme={theme} />;
      case "settings":
        return <SettingsPage theme={theme} />;
      default:
        return <OverviewPage theme={theme} />;
    }
  };

  return <div>{render()}</div>;
}

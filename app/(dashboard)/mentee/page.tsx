<<<<<<< HEAD
"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

import OverviewPage from "@/app/(dashboard)/mentee/OverviewPage";
import ProfilePage from "@/app/(dashboard)/mentee/ProfilePage";
import InterviewPracticePage from "@/app/(dashboard)/mentee/InterviewPracticePage";
import CVReviewPage from "@/app/(dashboard)/mentee/CVReviewPage";
import MentorsPage from "@/app/(dashboard)/mentee/MentorsPage";
import PerformancePage from "@/app/(dashboard)/mentee/PerformancePage";
import AchievementsPage from "@/app/(dashboard)/mentee/AchievementsPage";
import SchedulePage from "@/app/(dashboard)/mentee/SchedulePage";
import MessagesPage from "@/app/(dashboard)/mentee/MessagesPage";
import NotificationsPage from "@/app/(dashboard)/mentee/NotificationsPage";
import GoalsPage from "@/app/(dashboard)/mentee/GoalsPage";
import ReportsPage from "@/app/(dashboard)/mentee/ReportsPage";
import SettingsPage from "@/app/(dashboard)/mentee/SettingsPage";
import HelpSupportPage from "@/app/(dashboard)/mentee/HelpSupportPage";

type Theme = "dark" | "light";

export default function MenteePage() {
  const params = useSearchParams();
  const tab = (params.get("tab") || "overview").toLowerCase();

  const getTheme = (): Theme =>
    (typeof document !== "undefined" && document.documentElement.classList.contains("dark"))
      ? "dark"
      : "light";

  const [theme, setTheme] = React.useState<Theme>(() => getTheme());

  React.useEffect(() => {
    const el = document.documentElement;
    const obs = new MutationObserver(() => setTheme(getTheme()));
    obs.observe(el, { attributes: true, attributeFilter: ["class"] });

    setTheme(getTheme());
    return () => obs.disconnect();
  }, []);

  const render = () => {
    switch (tab) {
      case "overview":            return <OverviewPage onNavigate={() => {}} theme={theme} />;
      case "profile":             return <ProfilePage theme={theme} />;
      case "interview-practice":  return <InterviewPracticePage onNavigate={() => {}} theme={theme} />;
      case "cv-review":           return <CVReviewPage theme={theme} />;
      case "mentors":             return <MentorsPage theme={theme} />;
      case "performance":         return <PerformancePage theme={theme} />;
      case "achievements":        return <AchievementsPage theme={theme} />;
      case "schedule":            return <SchedulePage theme={theme} />;
      case "messages":            return <MessagesPage theme={theme} />;
      case "notifications":       return <NotificationsPage theme={theme} />;
      case "goals":               return <GoalsPage theme={theme} />;
      case "reports":             return <ReportsPage theme={theme} />;
      case "settings":            return <SettingsPage theme={theme} />;
      case "help":                return <HelpSupportPage theme={theme} />;
      default:                    return <OverviewPage onNavigate={() => {}} theme={theme} />;
    }
  };

  return <div className="px-4 sm:px-8 py-6">{render()}</div>;
=======
// app/(dashboard)/mentee/page.tsx
export default function MenteeDashboard() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Mentee Dashboard</h1>
      <p className="text-gray-600">Welcome to your dashboard 🎉</p>
    </div>
  );
>>>>>>> 53bf86a13e150764588e70409a6d59e502d862e5
}

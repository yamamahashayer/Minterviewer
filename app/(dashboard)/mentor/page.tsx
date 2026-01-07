"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

import ProfileOverview from "@/app/(dashboard)/mentor/ProfileOverview";
import MyProfilePage from "@/app/(dashboard)/mentor/MyProfilePage";
import { UpcomingSessions } from "@/app/(dashboard)/mentor/UpcomingSessions";
import { MenteesProgress } from "@/app/(dashboard)/mentor/MenteesProgress";
import { FeedbackManager } from "@/app/(dashboard)/mentor/FeedbackManager";
import { PerformanceStats } from "@/app/(dashboard)/mentor/PerformanceStats";
import { QuickActions } from "@/app/(dashboard)/mentor/QuickActions";
import { MyMenteesContent } from "@/app/(dashboard)/mentor/MyMenteesContent";
import { SessionsPage } from "@/app/(dashboard)/mentor/SessionsPage";
import { FeedbacksPage } from "@/app/(dashboard)/mentor/FeedbacksPage";
import MentorMessages from "@/app/(dashboard)/mentor/MessagesPage";
import SettingsPage from "@/app/(dashboard)/mentor/SettingsPage";
import { EarningsPage } from "@/app/(dashboard)/mentor/EarningsPage";
import BookingManagementPage from "@/app/(dashboard)/mentor/BookingManagementPage";
import MentorNotifications from "@/app/(dashboard)/mentor/NotificationsPage";
import { MentorAnalyticsPage } from "@/app/(dashboard)/mentor/MentorAnalyticsPage";
import MentorOverviewPage from "@/app/(dashboard)/mentor/MentorOverviewPage";

type PageType =
  | "overview"
  | "profile"
  | "mentees"
  | "sessions"
  | "feedbacks"
  | "messages"
  | "earnings"
  | "analytics"
  | "booking-management"
  | "notifications"
  | "settings";

type Theme = "dark" | "light";


export default function MentorPage() {
  const params = useSearchParams();
  const tab = (params.get("tab") || "overview").toLowerCase() as PageType;

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
      case "overview":
        return <MentorOverviewPage />;
      case "profile":
        return <MyProfilePage />;
      case "mentees":
        return <MyMenteesContent />;
      case "sessions":
        return <SessionsPage />;
      case "feedbacks":
        return <FeedbacksPage />;
      case "messages":
        return <MentorMessages theme={theme} />;
      case "earnings":
        return <EarningsPage />;
      case "analytics":
        return <MentorAnalyticsPage />;
      case "booking-management":
        return <BookingManagementPage />;
      case "notifications":
        return <MentorNotifications theme={theme} />;
      case "settings":
        return <SettingsPage theme={theme} />;
      default:
        return <ProfileOverview />;
    }
  };

  return <>{render()}</>;
}

"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { useTheme } from "@/Context/ThemeContext";

import { ProfileOverview } from "@/app/(dashboard)/mentor/ProfileOverview";
import { MyProfilePage } from "@/app/(dashboard)/mentor/MyProfilePage";
import { UpcomingSessions } from "@/app/(dashboard)/mentor/UpcomingSessions";
import { MenteesProgress } from "@/app/(dashboard)/mentor/MenteesProgress";
import { FeedbackManager } from "@/app/(dashboard)/mentor/FeedbackManager";
import { PerformanceStats } from "@/app/(dashboard)/mentor/PerformanceStats";
import { QuickActions } from "@/app/(dashboard)/mentor/QuickActions";
import { HighlightBanner } from "@/app/(dashboard)/mentor/HighlightBanner";
import { MyMenteesContent } from "@/app/(dashboard)/mentor/MyMenteesContent";
import { SessionsPage } from "@/app/(dashboard)/mentor/SessionsPage";
import { FeedbacksPage } from "@/app/(dashboard)/mentor/FeedbacksPage";
import { MessagesPage } from "@/app/(dashboard)/mentor/MessagesPage";
import { SettingsPage } from "@/app/(dashboard)/mentor/SettingsPage";
import { EarningsPage } from "@/app/(dashboard)/mentor/EarningsPage";
import { AvailabilityPage } from "@/app/(dashboard)/mentor/AvailabilityPage";
import { CVReviewPage } from "@/app/(dashboard)/mentor/CVReviewPage";
import { HelpSupportPage } from "@/app/(dashboard)/mentor/HelpSupportPage";
import { NotificationsPage } from "@/app/(dashboard)/mentor/NotificationsPage";

import { MentorSidebar } from "@/app/(dashboard)/mentor/MentorSidebar";
import { NotificationBell } from "@/app/(dashboard)/mentor/NotificationBell";
import { Moon, Sun } from "lucide-react";

type PageType =
  | "overview"
  | "profile"
  | "mentees"
  | "sessions"
  | "feedbacks"
  | "messages"
  | "earnings"
  | "availability"
  | "cv-review"
  | "notifications"
  | "help"
  | "settings";

export default function MentorPage() {
  const params = useSearchParams();
  const tab = (params.get("tab") || "overview").toLowerCase() as PageType;

  const { isDark, toggle } = useTheme();

  const render = () => {
    switch (tab) {
      case "overview":
        return (
          <div className="p-8 max-w-7xl mx-auto">
            <ProfileOverview />
            <div className="mt-8">
              <HighlightBanner />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              <div className="lg:col-span-2">
                <UpcomingSessions />
              </div>
              <QuickActions />
            </div>
            <div className="mt-6">
              <MenteesProgress />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <FeedbackManager />
              <PerformanceStats />
            </div>
          </div>
        );
      case "profile": return <MyProfilePage />;
      case "mentees": return <MyMenteesContent />;
      case "sessions": return <SessionsPage />;
      case "feedbacks": return <FeedbacksPage />;
      case "messages": return <MessagesPage />;
      case "earnings": return <EarningsPage />;
      case "availability": return <AvailabilityPage />;
      case "cv-review": return <CVReviewPage />;
      case "notifications": return <NotificationsPage />;
      case "help": return <HelpSupportPage />;
      case "settings": return <SettingsPage />;
      default: return <ProfileOverview />;
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <MentorSidebar currentPage={tab} />

      <div className="flex-1 overflow-auto">
        <div className="sticky top-0 z-30 backdrop-blur-xl border-b px-8 py-4 flex justify-end items-center gap-4 bg-background-elevated border-border">
          <button
            onClick={toggle}
            className="p-2 rounded-lg hover:bg-muted transition"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <NotificationBell />
        </div>

        {render()}
      </div>
    </div>
  );
}

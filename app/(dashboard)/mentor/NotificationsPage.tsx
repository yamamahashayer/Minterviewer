"use client";

import NotificationsPage from "@/app/components/Notifications/Page";

export default function MentorNotifications({ theme = "dark" }) {
    return <NotificationsPage theme={theme || "light"} />;
  
}
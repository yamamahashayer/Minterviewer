"use client";

import NotificationsPage from "@/app/components/Notifications/Page";

export default function MenteeNotifications({ theme = "dark" }) {
    return <NotificationsPage theme={theme || "light"} />;
  
}
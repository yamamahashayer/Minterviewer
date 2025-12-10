"use client";

import NotificationsPage from "@/app/components/Notifications/Page";

export default function CompanyNotifications({ theme = "dark" }) {
    return <NotificationsPage theme={theme || "light"} />;
  
}
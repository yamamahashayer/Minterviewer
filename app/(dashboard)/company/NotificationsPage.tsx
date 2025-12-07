"use client";

export default function NotificationsPage({ theme }: { theme: "dark" | "light" }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold">Notifications</h1>
      <p className="text-gray-500 mt-2">View system updates and alerts.</p>

      <div className="mt-8 p-6 rounded-xl bg-white dark:bg-[#101727] border dark:border-white/10 shadow">
        <p>No notifications yet.</p>
      </div>
    </div>
  );
}

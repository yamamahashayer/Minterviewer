"use client";

import React from "react";
import CompanySidebar from "./Sidebar";
import { Bell, CheckCircle2, Menu, Moon, Sun, ChevronLeft } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";

type Notif = {
  id: number;
  title: string;
  message: string;
  time?: string;
  unread?: boolean;
};

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  // ========================= THEME =========================
  const [theme, setTheme] = React.useState<"dark" | "light">(
    () =>
      (typeof window !== "undefined" &&
        (localStorage.getItem("theme") as "dark" | "light")) ||
      "dark"
  );

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  React.useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // ========================= SIDEBAR =========================
  const [isSidebarOpen, setIsSidebarOpen] = React.useState<boolean>(
    () =>
      (typeof window !== "undefined"
        ? localStorage.getItem("company-sidebar") !== "closed"
        : true)
  );

  React.useEffect(() => {
    localStorage.setItem(
      "company-sidebar",
      isSidebarOpen ? "open" : "closed"
    );
  }, [isSidebarOpen]);

  // ========================= NOTIFICATIONS =========================
  const [notifications, setNotifications] = React.useState<Notif[]>([
    { id: 1, title: "New Applicant", message: "A candidate applied to your job", time: "5m ago", unread: true },
    { id: 2, title: "Job Approved", message: "Your job posting was approved", time: "1h ago", unread: true },
    { id: 3, title: "System Update", message: "Dashboard updated successfully", time: "3h ago", unread: false },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div
      className={`${
        theme === "dark"
          ? "bg-gradient-to-b from-[#0e162c] via-[#111827] to-[#0b1223]"
          : "bg-[#f5f3ff]"
      } min-h-screen`}
    >
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full z-40 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <CompanySidebar
          theme={theme}
          isOpen={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
          notificationsCount={unreadCount}
        />
      </div>

      {/* MAIN CONTENT */}
      <div
        className={`relative min-h-screen transition-all duration-300 ${
          isSidebarOpen ? "ml-0 lg:ml-[280px]" : "ml-0 lg:ml-[80px]"
        }`}
      >
        {/* TOP BAR */}
        <div
          className={`sticky top-0 z-30 backdrop-blur-xl border-b px-4 sm:px-8 py-4 ${
            theme === "dark"
              ? "bg-[rgba(16,21,33,0.85)] border-teal-400/20 shadow-lg"
              : "bg-[rgba(255,255,255,0.9)] border-purple-300 shadow-lg"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            {/* SIDEBAR TOGGLE */}
            <button
              onClick={() => setIsSidebarOpen((v) => !v)}
              className={`p-2 sm:p-3 rounded-xl transition-all ${
                theme === "dark"
                  ? "hover:bg-white/10 border border-white/20"
                  : "hover:bg-purple-100 border border-purple-300"
              }`}
            >
              {isSidebarOpen ? (
                <ChevronLeft
                  className={`w-5 h-5 ${
                    theme === "dark" ? "text-teal-300" : "text-purple-600"
                  }`}
                />
              ) : (
                <Menu
                  className={`w-5 h-5 ${
                    theme === "dark" ? "text-teal-300" : "text-purple-600"
                  }`}
                />
              )}
            </button>

            {/* RIGHT BUTTONS */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* THEME TOGGLE */}
              <button
                onClick={toggleTheme}
                className={`p-2 sm:p-3 rounded-xl transition-all ${
                  theme === "dark"
                    ? "hover:bg-white/10 border border-white/20"
                    : "hover:bg-purple-100 border border-purple-300"
                }`}
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-purple-600" />
                )}
              </button>

              {/* NOTIFICATIONS */}
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className={`p-2 sm:p-3 rounded-xl relative ${
                      theme === "dark"
                        ? "hover:bg-white/10 border border-white/20"
                        : "hover:bg-purple-100 border border-purple-300"
                    }`}
                  >
                    <Bell
                      className={`w-5 h-5 ${
                        theme === "dark" ? "text-teal-300" : "text-purple-700"
                      }`}
                    />
                    {unreadCount > 0 && (
                      <span
                        className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px]
                          font-bold ${
                            theme === "dark"
                              ? "bg-teal-500 text-white"
                              : "bg-purple-500 text-white"
                          }`}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </PopoverTrigger>

                <PopoverContent
                  className={`w-[320px] p-0 shadow-2xl ${
                    theme === "dark"
                      ? "bg-[#0f172a] text-white"
                      : "bg-white text-[#2e1065]"
                  }`}
                  align="end"
                >
                  <div className="px-4 py-3 border-b border-white/10">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-semibold">Notifications</h3>

                      <button
                        onClick={() =>
                          setNotifications((ns) =>
                            ns.map((n) => ({ ...n, unread: false }))
                          )
                        }
                        className="text-xs flex items-center gap-1"
                      >
                        <CheckCircle2 size={14} /> Mark all read
                      </button>
                    </div>
                  </div>

                  <div className="max-h-[350px] overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="px-4 py-3 border-b border-white/10 hover:bg-white/5"
                      >
                        <div className="text-xs">
                          <div className="font-semibold mb-0.5">{n.title}</div>
                          <div>{n.message}</div>
                          <div className="mt-1 opacity-70">{n.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* PAGE CONTENT */}
        {children}
      </div>
    </div>
  );
}

"use client";

import React from "react";
import CompanySidebar from "./Sidebar";
import { Menu, Moon, Sun, ChevronLeft } from "lucide-react";

import NotificationBell from "@/app/components/Notifications/NotificationBell";

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  // ========================= THEME =========================
  const [theme, setTheme] = React.useState<"dark" | "light">(
    () =>
      (typeof window !== "undefined" &&
        (localStorage.getItem("theme") as "dark" | "light")) ||
      "dark"
  );

  const isDark = theme === "dark";
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

  return (
    <div
      className={`${
        isDark
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
          // NotificationBell الآن سيتولى unreadCount
          notificationsCount={undefined}
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
            isDark
              ? "bg-[rgba(16,21,33,0.85)] border-teal-400/20 shadow-lg"
              : "bg-[rgba(255,255,255,0.9)] border-purple-300 shadow-lg"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            {/* SIDEBAR TOGGLE */}
            <button
              onClick={() => setIsSidebarOpen((v) => !v)}
              className={`p-2 sm:p-3 rounded-xl transition-all ${
                isDark
                  ? "hover:bg-white/10 border border-white/20"
                  : "hover:bg-purple-100 border border-purple-300"
              }`}
            >
              {isSidebarOpen ? (
                <ChevronLeft
                  className={`w-5 h-5 ${
                    isDark ? "text-teal-300" : "text-purple-600"
                  }`}
                />
              ) : (
                <Menu
                  className={`w-5 h-5 ${
                    isDark ? "text-teal-300" : "text-purple-600"
                  }`}
                />
              )}
            </button>

            {/* RIGHT TOOLS */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* THEME TOGGLE */}
              <button
                onClick={toggleTheme}
                className={`p-2 sm:p-3 rounded-xl transition-all ${
                  isDark
                    ? "hover:bg-white/10 border border-white/20"
                    : "hover:bg-purple-100 border border-purple-300"
                }`}
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-purple-600" />
                )}
              </button>

              {/* NOTIFICATION BELL (REALTIME + READY) */}
              <NotificationBell
                theme={theme}
                onViewAll={() => {
                  window.location.href = "/company?tab=notifications";
                }}
              />
            </div>
          </div>
        </div>

        {/* PAGE CONTENT */}
        {children}
      </div>
    </div>
  );
}

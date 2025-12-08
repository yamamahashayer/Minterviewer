"use client";

import React from "react";
import MentorSidebar from "./MentorSidebar";
import { Menu, Moon, Sun, ChevronLeft } from "lucide-react";

import NotificationBell from "@/app/components/Notifications/NotificationBell";

export default function MentorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ========================= THEME =========================
  const [theme, setTheme] = React.useState<"dark" | "light">(
    () =>
      (typeof window !== "undefined" &&
        (localStorage.getItem("mentor-theme") as "dark" | "light")) ||
      "dark"
  );

  const isDark = theme === "dark";

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  React.useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
    localStorage.setItem("mentor-theme", theme);
  }, [theme]);

  // ========================= SIDEBAR =========================
  const [isSidebarOpen, setIsSidebarOpen] = React.useState<boolean>(
    () =>
      (typeof window !== "undefined"
        ? localStorage.getItem("mentor-sidebar") !== "closed"
        : true)
  );

  React.useEffect(() => {
    localStorage.setItem(
      "mentor-sidebar",
      isSidebarOpen ? "open" : "closed"
    );
  }, [isSidebarOpen]);

  return (
    <div
      className={`${
        isDark
          ? "bg-gradient-to-b from-[#0b0f19] via-[#0a0f1e] to-black"
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
        <MentorSidebar
          theme={theme}
          isOpen={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
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
              ? "bg-[rgba(5,9,19,0.9)] border-teal-400/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
              : "bg-[rgba(255,255,255,0.9)] border-purple-300 shadow-[0_4px_20px_rgba(168,85,247,0.15)]"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            {/* SIDEBAR TOGGLE */}
            <button
              onClick={() => setIsSidebarOpen((v) => !v)}
              className={`p-2 sm:p-3 rounded-xl transition-all ${
                isDark
                  ? "hover:bg-teal-300/10 border border-teal-400/30"
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

            {/* RIGHT BUTTONS */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* THEME SWITCH */}
              <button
                onClick={toggleTheme}
                className={`p-2 sm:p-3 rounded-xl transition-all ${
                  isDark
                    ? "hover:bg-teal-300/10 border border-teal-400/30"
                    : "hover:bg-purple-100 border border-purple-300"
                }`}
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-purple-600" />
                )}
              </button>

              {/* REAL-TIME NOTIFICATION BELL */}
              <NotificationBell
                theme={theme}
                onViewAll={() => {
                  window.location.href = "/mentor?tab=notifications";
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

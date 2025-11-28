"use client";

import React from "react";
import Sidebar from "./Sidebar";
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

export default function MenteeLayout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<"dark" | "light">(
    () => (typeof window !== "undefined" && (localStorage.getItem("theme") as "dark" | "light")) || "dark"
  );

  const [isSidebarOpen, setIsSidebarOpen] = React.useState<boolean>(
    () => (typeof window !== "undefined" ? localStorage.getItem("mentee-sidebar") !== "closed" : true)
  );

  const [notifications, setNotifications] = React.useState<Notif[]>([
    { id: 1, title: "Upcoming Session", message: "Technical interview starts in 30 min", time: "2m ago", unread: true },
    { id: 2, title: "New Message", message: "CV feedback arrived", time: "15m ago", unread: true },
    { id: 3, title: "Payment Received", message: "$120 for last session", time: "3h ago", unread: false },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  React.useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  React.useEffect(() => {
    localStorage.setItem("mentee-sidebar", isSidebarOpen ? "open" : "closed");
  }, [isSidebarOpen]);

  return (
    <div
      className={`${
        theme === "dark"
          ? "bg-gradient-to-b from-[#111827] via-[#1f2937] to-[#0f172a]"
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
        <Sidebar
          theme={theme}
          isOpen={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
          notificationsCount={unreadCount}
        />
      </div>

      {/* MAIN */}
      <div
        className={`relative min-h-screen transition-all duration-300 ${
          isSidebarOpen ? "ml-0 lg:ml-[280px]" : "ml-0 lg:ml-[80px]"
        }`}
      >
        {/* TOPBAR */}
        <div
          className={`sticky top-0 z-30 backdrop-blur-xl border-b px-4 sm:px-8 py-4 ${
            theme === "dark"
              ? "bg-[rgba(16,21,33,0.85)] border-purple-500/20 shadow-lg"
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
                  className={`w-5 h-5 ${theme === "dark" ? "text-purple-300" : "text-purple-600"}`}
                />
              ) : (
                <Menu
                  className={`w-5 h-5 ${theme === "dark" ? "text-purple-300" : "text-purple-600"}`}
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
                        theme === "dark" ? "text-purple-300" : "text-purple-600"
                      }`}
                    />

                    {unreadCount > 0 && (
                      <span
                        className={`
                          absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] 
                          font-bold 
                          ${theme === "dark" 
                            ? "bg-purple-500 text-white" 
                            : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"}
                        `}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </PopoverTrigger>

                <PopoverContent
                  className={`w-[320px] sm:w-[380px] p-0 shadow-2xl ${
                    theme === "dark"
                      ? "bg-gradient-to-b from-[#1e1b4b] to-[#312e81]"
                      : "bg-gradient-to-b from-[#f5f3ff] to-[#ede9fe]"
                  }`}
                  align="end"
                >
                  <div
                    className={`px-4 py-3 border-b ${
                      theme === "dark" ? "border-purple-500/30" : "border-purple-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h3
                        className={`text-sm ${
                          theme === "dark" ? "text-white" : "text-purple-700"
                        }`}
                      >
                        Notifications
                      </h3>

                      <button
                        onClick={() =>
                          setNotifications((ns) =>
                            ns.map((n) => ({ ...n, unread: false }))
                          )
                        }
                        className={`text-xs flex items-center gap-1 ${
                          theme === "dark" ? "text-purple-300" : "text-purple-700"
                        }`}
                      >
                        <CheckCircle2 size={14} /> Mark all read
                      </button>
                    </div>

                    <p
                      className={`text-xs ${
                        theme === "dark" ? "text-purple-300" : "text-purple-500"
                      }`}
                    >
                      {unreadCount} unread
                    </p>
                  </div>

                  <div className="max-h-[350px] overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`px-4 py-3 border-b ${
                          theme === "dark"
                            ? "border-purple-500/20 hover:bg-purple-500/10"
                            : "border-purple-200 hover:bg-purple-50"
                        }`}
                      >
                        <div
                          className={`text-xs ${
                            theme === "dark" ? "text-purple-200" : "text-purple-700"
                          }`}
                        >
                          <div className="font-semibold mb-0.5">{n.title}</div>
                          <div>{n.message}</div>
                          <div
                            className={`mt-1 ${
                              theme === "dark" ? "text-purple-400" : "text-purple-500"
                            }`}
                          >
                            {n.time}
                          </div>
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

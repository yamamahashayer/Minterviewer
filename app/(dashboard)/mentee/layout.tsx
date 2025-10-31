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
  icon?: React.ComponentType<{ className?: string }>;
};

export default function MenteeLayout({ children }: { children: React.ReactNode }) {
  // ============== GLOBAL SHARED UI STATE ==============
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

  // apply & persist theme
  React.useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // persist sidebar
  React.useEffect(() => {
    localStorage.setItem("mentee-sidebar", isSidebarOpen ? "open" : "closed");
  }, [isSidebarOpen]);

  const unreadCount = notifications.filter(n => n.unread).length;
  const toggleTheme = () => setTheme(t => (t === "dark" ? "light" : "dark"));

  return (
    <div className={`${theme === "dark" ? "bg-gradient-to-b from-[#0a0f1e] to-black" : "bg-[#f5f3ff]"} min-h-screen`}>
      {/* Mobile overlay */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      {/* Sidebar (shared) */}
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
        {/* Topbar (shared) */}
        <div
          className={`sticky top-0 z-30 backdrop-blur-xl border-b px-4 sm:px-8 py-4 ${
            theme === "dark"
              ? "bg-[rgba(10,15,30,0.9)] border-[rgba(94,234,212,0.2)] shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
              : "bg-[rgba(255,255,255,0.9)] border-[#ddd6fe] shadow-[0_4px_20px_rgba(168,85,247,0.15)]"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            {/* Sidebar toggle */}
            <button
              onClick={() => setIsSidebarOpen(v => !v)}
              className={`p-2 sm:p-3 rounded-xl transition-all ${
                theme === "dark"
                  ? "hover:bg-[rgba(94,234,212,0.15)] border border-[rgba(94,234,212,0.3)]"
                  : "hover:bg-purple-100 border-2 border-purple-300"
              }`}
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? (
                <ChevronLeft className={`w-5 h-5 ${theme === "dark" ? "text-teal-300" : "text-[#7c3aed]"}`} />
              ) : (
                <Menu className={`w-5 h-5 ${theme === "dark" ? "text-teal-300" : "text-[#7c3aed]"}`} />
              )}
            </button>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 sm:p-3 rounded-xl transition-all ${
                  theme === "dark"
                    ? "hover:bg-[rgba(94,234,212,0.15)] border border-[rgba(94,234,212,0.3)]"
                    : "hover:bg-purple-100 border-2 border-purple-300"
                }`}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-[#7c3aed]" />}
              </button>

              {/* Notifications */}
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className={`p-2 sm:p-3 rounded-xl relative ${
                      theme === "dark"
                        ? "hover:bg-[rgba(94,234,212,0.15)] border border-[rgba(94,234,212,0.3)]"
                        : "hover:bg-purple-100 border-2 border-purple-300"
                    }`}
                    aria-label="View notifications"
                  >
                    <Bell className={`w-5 h-5 ${theme === "dark" ? "text-teal-300" : "text-[#7c3aed]"}`} />
                    {unreadCount > 0 && (
                      <span
                        className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          theme === "dark" ? "bg-teal-500 text-white" : "bg-gradient-to-r from-[#7c3aed] to-[#ec4899] text-white"
                        }`}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className={`w-[320px] sm:w-[380px] p-0 border-0 shadow-2xl ${
                    theme === "dark" ? "bg-gradient-to-b from-[#1e1b4b] to-[#312e81]" : "bg-gradient-to-b from-[#f5f3ff] to-[#ede9fe]"
                  }`}
                  align="end"
                >
                  <div className={`px-4 py-3 border-b ${theme === "dark" ? "border-purple-500/30" : "border-purple-300"}`}>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`text-sm ${theme === "dark" ? "text-white" : "text-[#2e1065]"}`}>Notifications</h3>
                      <button
                        onClick={() => setNotifications(ns => ns.map(n => ({ ...n, unread: false })))}
                        className={`text-xs flex items-center gap-1 ${
                          theme === "dark" ? "text-purple-300" : "text-purple-700"
                        }`}
                      >
                        <CheckCircle2 size={14} /> Mark all read
                      </button>
                    </div>
                    <p className={`text-xs ${theme === "dark" ? "text-purple-300" : "text-purple-600"}`}>{unreadCount} unread</p>
                  </div>
                  <div className="max-h-[350px] overflow-y-auto">
                    {notifications.map(n => (
                      <div
                        key={n.id}
                        className={`px-4 py-3 border-b ${
                          theme === "dark" ? "border-purple-500/20 hover:bg-purple-500/10" : "border-purple-200 hover:bg-purple-50"
                        }`}
                      >
                        <div className={`text-xs ${theme === "dark" ? "text-purple-200" : "text-purple-700"}`}>
                          <div className="font-semibold mb-0.5">{n.title}</div>
                          <div>{n.message}</div>
                          <div className={`mt-1 ${theme === "dark" ? "text-purple-400" : "text-purple-500"}`}>{n.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* CHILDREN (pages) */}
        {children}
      </div>
    </div>
  );
}

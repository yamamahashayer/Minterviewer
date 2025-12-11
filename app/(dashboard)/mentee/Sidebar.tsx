"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Home, User, Target, Calendar, MessageSquare, Settings, FileText, Bell,
  Users, TrendingUp, Award, Search, LogOut
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";

export default function Sidebar({
  theme,
  isOpen,
  onCloseMobile,
  notificationsCount = 0,
}: {
  theme: "dark" | "light";
  isOpen: boolean;
  onCloseMobile: () => void;
  notificationsCount?: number;
}) {
  const params = useSearchParams();
  const pathname = usePathname();
  const activeTab = params.get("tab") || "overview";
  const isDark = theme === "dark";

  const items = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "browse-sessions", label: "Find Mentor", icon: Search },
    { id: "profile", label: "My Profile", icon: User },
    { id: "interview-practice", label: "Interview Practice", icon: Target },
    { id: "cv-review", label: "CV Review", icon: FileText },
    { id: "mentors", label: "Mentors", icon: Users },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "performance", label: "Performance", icon: TrendingUp },
    { id: "achievements", label: "Achievements", icon: Award },
    { id: "messages", label: "Messages", icon: MessageSquare, badge: 3 },
    { id: "notifications", label: "Notifications", icon: Bell, badge: notificationsCount },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside
      className={`h-full transition-all duration-300 flex flex-col ${isOpen ? "w-[280px]" : "w-[80px]"
        } ${isDark
          ? "bg-gradient-to-b from-[#0f172b] to-[#0a0f1e] border-r border-[rgba(94,234,212,0.1)]"
          : "bg-white border-r border-[#ddd6fe] shadow-lg"
        }`}
      style={{ overflowY: "auto", overflowX: "visible", position: "relative" }}
    >
      {/* Header */}
      <div
        className={`border-b ${isDark
            ? "border-[rgba(94,234,212,0.1)] bg-[#0b1020]"
            : "border-[#ddd6fe] bg-white"
          } flex-shrink-0`}
      >
        <img
          src="/Covering.png"
          alt="Minterviewer Cover"
          className="w-full h-24 object-contain"
        />
      </div>

      {/* Search (شكل فقط) */}
      {isOpen && (
        <div className="p-4">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-[#6a7282]" : "text-[#7c3aed]"}`} size={16} />
            <input
              placeholder="Search..."
              className={`w-full ${isDark
                  ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.1)] text-white placeholder:text-[#6a7282] focus:border-[rgba(94,234,212,0.3)]"
                  : "bg-[#f5f3ff] border-[#ddd6fe] text-[#2e1065] placeholder:text-[#7c3aed] focus:border-[#7c3aed]"
                } border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none transition-colors`}
            />
          </div>
        </div>
      )}

      {/* NAV */}
      <TooltipProvider delayDuration={120} skipDelayDuration={120}>
        <nav className={`p-4 space-y-1 ${!isOpen ? "px-2" : ""}`}>
          {items.map((item) => {
            const Icon = item.icon;
            const href = `${pathname}?tab=${item.id}`;
            const active = activeTab === item.id;

            // السايدبار المفتوح = رابط طبيعي
            if (isOpen) {
              return (
                <Link
                  key={item.id}
                  href={href}
                  onClick={() => {
                    if (typeof window !== "undefined" && window.innerWidth < 1024) onCloseMobile();
                  }}
                  aria-current={active ? "page" : undefined}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all outline-none
                    ${active
                      ? (isDark
                        ? "bg-[rgba(94,234,212,0.12)] text-teal-300 ring-1 ring-teal-400/40 shadow-[0_0_20px_rgba(94,234,212,0.15)]"
                        : "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 ring-1 ring-purple-300 shadow-lg")
                      : (isDark
                        ? "text-[#a8b0bf] hover:bg-white/5 hover:text-white"
                        : "text-[#7c3aed] hover:bg-[#ede9fe] hover:text-[#5b21b6]")}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className={`${isDark ? "bg-teal-500 text-white" : "bg-purple-500 text-white"} text-xs px-2 py-0.5 rounded-full`}>
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            }

            // السايدبار المصغّر = Tooltip زجاجي + سهم + أنيميشن
            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <Link
                    href={href}
                    onClick={() => {
                      if (typeof window !== "undefined" && window.innerWidth < 1024) onCloseMobile();
                    }}
                    aria-current={active ? "page" : undefined}
                    className={`relative w-full flex items-center justify-center px-3 py-3 rounded-xl transition-all outline-none
                      ${active
                        ? (isDark
                          ? "bg-[rgba(94,234,212,0.12)] text-teal-300 ring-1 ring-teal-400/40"
                          : "bg-purple-100 text-purple-700 ring-1 ring-purple-300")
                        : (isDark
                          ? "text-[#a8b0bf] hover:bg-white/5 hover:text-white"
                          : "text-[#7c3aed] hover:bg-[#ede9fe] hover:text-[#5b21b6]")}
                    `}
                  >
                    <Icon size={20} />
                    {item.badge ? (
                      <span className="absolute right-2 top-2 text-[10px] leading-none px-1.5 py-0.5 rounded-full bg-purple-500 text-white">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                </TooltipTrigger>

                <TooltipContent
                  side="right"
                  align="center"
                  sideOffset={12}
                  className={`
                      rounded-xl px-3 py-2 text-xs font-medium whitespace-nowrap
                      backdrop-blur-xl border shadow-2xl
                      data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-left-1
                      data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-left-1
                      ${isDark
                      ? "bg-[#0b1223]/90 text-teal-100 border-teal-400/20 shadow-[0_8px_25px_rgba(0,255,200,0.25)]"
                      : "bg-white/95 text-[#2e1065] border-purple-300 shadow-[0_8px_25px_rgba(168,85,247,0.25)]"}
                    `}
                >
                  <span>{item.label}</span>
                </TooltipContent>


              </Tooltip>
            );
          })}
        </nav>
      </TooltipProvider>

      {/* Logout */}
      <div className={`p-4 pb-6 mt-auto flex-shrink-0 ${!isOpen ? "px-2" : ""}`}>
        {isOpen ? (
          <button
            className="w-full bg-[rgba(220,38,38,0.1)] hover:bg-[rgba(220,38,38,0.2)] text-red-400 rounded-lg p-3 text-sm transition-all flex items-center gap-2 border border-[rgba(220,38,38,0.2)]"
            onClick={() => alert("Implement real logout here")}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        ) : (
          <TooltipProvider delayDuration={120} skipDelayDuration={120}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="relative w-full bg-[rgba(220,38,38,0.1)] hover:bg-[rgba(220,38,38,0.2)] text-red-400 rounded-lg p-3 text-sm transition-all flex items-center justify-center border border-[rgba(220,38,38,0.2)]"
                  onClick={() => alert("Implement real logout here")}
                >
                  <LogOut size={20} />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                align="center"
                sideOffset={12}
                className={`
                  relative select-none pointer-events-none rounded-2xl px-3.5 py-2.5 text-xs font-medium
                  backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.35)]
                  border
                  ${isDark
                    ? "bg-[#0b1223]/85 text-red-200 border-red-400/40"
                    : "bg-white/95 text-red-600 border-red-300"}
                `}
              >
                <span>Logout</span>
                <span
                  className={`
                    absolute left-0 -ml-2 top-1/2 -translate-y-1/2 w-3 h-3 rotate-45
                    ${isDark
                      ? "bg-[#0b1223]/85 border-l border-t border-red-400/40"
                      : "bg-white/95 border-l border-t border-red-300"}
                  `}
                />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </aside>
  );
}

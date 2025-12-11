"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import {
  Home,
  User,
  FileText,
  Users,
  MessageSquare,
  Bell,
  Settings,
  Search,
  LogOut,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";

export default function CompanySidebar({
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

  // ========================= SIDEBAR ITEMS =========================
  const items = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "profile", label: "Company Profile", icon: User },
    { id: "jobs", label: "Jobs", icon: FileText },
    { id: "candidates", label: "Candidates", icon: Users },
    { id: "messages", label: "Messages", icon: MessageSquare, badge: 0 },
    { id: "notifications", label: "Notifications", icon: Bell, badge: notificationsCount },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside
      className={`
        h-full transition-all duration-300 flex flex-col
        ${isOpen ? "w-[280px]" : "w-[80px]"}
        ${
          isDark
            ? "bg-gradient-to-b from-[#0f172b] to-[#0a0f1e] border-r border-[rgba(94,234,212,0.1)]"
            : "bg-white border-r border-[#ddd6fe] shadow-xl"
        }
      `}
      style={{ overflowY: "auto", overflowX: "visible" }}
    >
      {/* LOGO HEADER */}
      <div
        className={`border-b ${
          isDark
            ? "border-[rgba(94,234,212,0.1)] bg-[#0b1020]"
            : "border-[#ddd6fe] bg-white"
        } flex-shrink-0`}
      >
        <img
          src="/Covering.png"
          alt="Minterviewer"
          className="w-full h-24 object-contain"
        />
      </div>

      {/* SEARCH (يظهر فقط عند فتح السايدبار) */}
      {isOpen && (
        <div className="p-4">
          <div className="relative">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                isDark ? "text-[#6a7282]" : "text-[#7c3aed]"
              }`}
              size={16}
            />
            <input
              placeholder="Search..."
              className={`
                w-full border rounded-lg pl-10 pr-4 py-2 text-sm transition-colors
                ${
                  isDark
                    ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.1)] text-white placeholder:text-[#6a7282]"
                    : "bg-[#f5f3ff] border-[#ddd6fe] text-[#2e1065] placeholder:text-[#7c3aed]"
                }
              `}
            />
          </div>
        </div>
      )}

      {/* NAVIGATION */}
      <TooltipProvider delayDuration={120} skipDelayDuration={120}>
        <nav className={`p-4 space-y-1 ${!isOpen ? "px-2" : ""}`}>
          {items.map((item) => {
            const Icon = item.icon;
            const href = `${pathname}?tab=${item.id}`;
            const active = activeTab === item.id;

            // FULL SIDEBAR (WITH LABEL)
            if (isOpen) {
              return (
                <Link
                  key={item.id}
                  href={href}
                  onClick={() => {
                    if (window.innerWidth < 1024) onCloseMobile();
                  }}
                  className={`
                    w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all
                    ${
                      active
                        ? isDark
                          ? "bg-[rgba(94,234,212,0.12)] text-teal-300 ring-1 ring-teal-400/40 shadow-[0_0_20px_rgba(94,234,212,0.15)]"
                          : "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 ring-1 ring-purple-300 shadow-lg"
                        : isDark
                        ? "text-[#a8b0bf] hover:bg-white/5 hover:text-white"
                        : "text-[#7c3aed] hover:bg-[#ede9fe] hover:text-[#5b21b6]"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    <span className="text-sm">{item.label}</span>
                  </div>

                  {item.badge ? (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        isDark ? "bg-teal-500 text-white" : "bg-purple-500 text-white"
                      }`}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            }

            // MINI SIDEBAR (ICON ONLY + TOOLTIP)
            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <Link
                    href={href}
                    onClick={() => {
                      if (window.innerWidth < 1024) onCloseMobile();
                    }}
                    className={`
                      relative w-full flex items-center justify-center px-3 py-3 rounded-xl transition-all
                      ${
                        active
                          ? isDark
                            ? "bg-[rgba(94,234,212,0.12)] text-teal-300 ring-1 ring-teal-400/40"
                            : "bg-purple-100 text-purple-700 ring-1 ring-purple-300"
                          : isDark
                          ? "text-[#a8b0bf] hover:bg-white/5 hover:text-white"
                          : "text-[#7c3aed] hover:bg-[#ede9fe] hover:text-[#5b21b6]"
                      }
                    `}
                  >
                    <Icon size={20} />

                    {item.badge ? (
                      <span className="absolute right-2 top-2 text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500 text-white">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                </TooltipTrigger>

                <TooltipContent
                  side="right"
                  align="center"
                  className={`
                    rounded-xl px-3 py-2 text-xs font-medium
                    backdrop-blur-xl border shadow-xl
                    ${
                      isDark
                        ? "bg-[#0b1223]/90 text-teal-100 border-teal-400/20"
                        : "bg-white/95 text-[#2e1065] border-purple-300"
                    }
                  `}
                >
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
      </TooltipProvider>

      {/* LOGOUT */}
      <div className={`p-4 mt-auto ${!isOpen ? "px-2" : ""}`}>
        {isOpen ? (
          <button
            onClick={() => alert("Implement logout")}
            className="
              w-full p-3 text-sm rounded-lg border transition-all
              bg-[rgba(220,38,38,0.1)] text-red-400 border-red-400/30
              hover:bg-[rgba(220,38,38,0.2)]
            "
          >
            <LogOut size={16} className="inline-block mr-2" />
            Logout
          </button>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => alert("Implement logout")}
                  className="
                    w-full p-3 rounded-lg border 
                    bg-[rgba(220,38,38,0.1)] text-red-400 border-red-400/30
                    hover:bg-[rgba(220,38,38,0.2)]
                  "
                >
                  <LogOut size={20} />
                </button>
              </TooltipTrigger>

              <TooltipContent
                side="right"
                className="
                  rounded-xl px-3 py-2 text-xs font-medium
                  shadow-xl backdrop-blur-xl
                  bg-white/95 text-red-600 border border-red-300
                "
              >
                Logout
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </aside>
  );
}

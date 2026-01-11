"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Users,
  Calendar,
  CalendarCheck,
  Star,
  MessageSquare,
  DollarSign,
  Clock,
  FileText,
  Bell,
  HelpCircle,
  Settings,
  LogOut,
  Search,
  BarChart3,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";

export default function MentorSidebar({
  theme,
  isOpen,
  onCloseMobile,
}: {
  theme: "dark" | "light";
  isOpen: boolean;
  onCloseMobile: () => void;
}) {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const activeTab = params.get("tab") || "overview";
  const isDark = theme === "dark";

  const items = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "profile", label: "My Profile", icon: User },
    { id: "mentees", label: "My Mentees", icon: Users },
    { id: "sessions", label: "Sessions", icon: Calendar },
    { id: "booking-management", label: "Booking Management", icon: CalendarCheck },
    { id: "feedbacks", label: "Feedbacks", icon: Star },
    { id: "earnings", label: "Earnings", icon: DollarSign },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside
      className={`h-full transition-all duration-300 flex flex-col ${isOpen ? "w-[280px]" : "w-[80px]"
        } ${isDark
          ? "bg-gradient-to-b from-[#0f172b] to-[#0a0f1e] border-r border-[rgba(94,234,212,0.1)]"
          : "bg-white border-r border-[#ddd6fe] shadow-lg"
        }`}
      style={{ overflowY: "auto", overflowX: "visible" }}
    >
      {/* Header image */}
      <div
        className={`border-b ${isDark
          ? "border-[rgba(94,234,212,0.1)] bg-[#0b1020]"
          : "border-[#ddd6fe] bg-white"
          }`}
      >
        {isOpen ? (
          <img
            src={isDark ? "/Covering.png" : "/CoveringLight.png"}
            alt="Minterviewer"
            className="w-full h-24 object-contain"
          />
        ) : (
          <div className="h-24 flex items-center justify-center">
            <img
              src={isDark ? "/MentorHubLogo.png" : "/LogoLight.png"}
              alt="Minterviewer"
              className="w-10 h-10 object-contain"
            />
          </div>
        )}
      </div>

      {/* Search box (full sidebar only) */}
      {isOpen && (
        <div className="p-4">
          <div className="relative">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-[#6a7282]" : "text-[#7c3aed]"
                }`}
              size={16}
            />
            <input
              placeholder="Search..."
              className={`w-full ${isDark
                ? "bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.1)] text-white placeholder:text-[#6a7282]"
                : "bg-[#f5f3ff] border-[#ddd6fe] text-[#2e1065] placeholder:text-[#7c3aed]"
                } border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none`}
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <TooltipProvider delayDuration={120}>
        <nav className={`p-4 space-y-1 ${!isOpen ? "px-2" : ""}`}>
          {items.map((item) => {
            const Icon = item.icon;
            const href = `${pathname}?tab=${item.id}`;
            const active = activeTab === item.id;

            // FULL SIDEBAR
            if (isOpen) {
              return (
                <Link
                  key={item.id}
                  href={href}
                  onClick={() => {
                    if (window.innerWidth < 1024) onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all
                    ${active
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
                </Link>
              );
            }

            // COLLAPSED SIDEBAR
            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <Link
                    href={href}
                    className={`relative w-full flex items-center justify-center px-3 py-3 rounded-xl transition-all
                      ${active
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
                  </Link>
                </TooltipTrigger>

                <TooltipContent
                  side="right"
                  sideOffset={12}
                  align="center"
                  className={`rounded-xl px-3 py-2 text-xs font-medium backdrop-blur-xl border shadow-2xl
                    ${isDark
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

      {/* Logout */}
      <div className={`p-4 pb-6 mt-auto ${!isOpen ? "px-2" : ""}`}>
        {isOpen ? (
          <button
            className="w-full bg-[rgba(220,38,38,0.1)] hover:bg-[rgba(220,38,38,0.2)]
              text-red-400 rounded-lg p-3 text-sm transition-all flex items-center gap-2"
            onClick={async () => {
              sessionStorage.clear();
              router.push("/login");
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="w-full flex justify-center bg-[rgba(220,38,38,0.1)]
                  hover:bg-[rgba(220,38,38,0.2)] text-red-400 rounded-lg p-3"
                onClick={async () => {
                  sessionStorage.clear();
                  router.push("/login");
                }}
              >
                <LogOut size={20} />
              </button>
            </TooltipTrigger>

            <TooltipContent
              side="right"
              sideOffset={12}
              className={`rounded-xl px-3 py-2 text-xs font-medium backdrop-blur-xl shadow-xl
                ${isDark ? "bg-[#0b1223]/85 text-red-200" : "bg-white/95 text-red-600"}
              `}
            >
              Logout
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </aside>
  );
}

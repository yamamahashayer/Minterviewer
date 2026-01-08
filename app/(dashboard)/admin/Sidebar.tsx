"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Home, Users, LogOut, LayoutDashboard, Building2
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
}: {
    theme: "dark" | "light";
    isOpen: boolean;
    onCloseMobile: () => void;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const isDark = theme === "dark";

    const items = [
        { id: "overview", label: "Overview", icon: LayoutDashboard, href: "/admin" },
        { id: "companies", label: "Companies", icon: Building2, href: "/admin/companies" },
        { id: "users", label: "Users Management", icon: Users, href: "/admin/users" },
    ];

    return (
        <aside
            className={`h-full transition-all duration-300 flex flex-col ${isOpen ? "w-[280px]" : "w-[80px]"
                } ${isDark
                    ? "bg-gradient-to-b from-[#0f172b] to-[#0a0f1e] border-r border-[rgba(239,68,68,0.1)]"
                    : "bg-white border-r border-[#fecaca] shadow-lg"
                }`}
            style={{ overflowY: "auto", overflowX: "visible", position: "relative" }}
        >
            {/* Header */}
            <div
                className={`border-b ${isDark
                    ? "border-[rgba(239,68,68,0.1)] bg-[#0b1020]"
                    : "border-[#fecaca] bg-white"
                    } flex-shrink-0 flex items-center justify-center p-4`}
            >
                {isOpen ? (
                    <h1 className={`text-xl font-bold ${isDark ? "text-red-400" : "text-red-600"}`}>Admin Panel</h1>
                ) : (
                    <h1 className={`text-xl font-bold ${isDark ? "text-red-400" : "text-red-600"}`}>A</h1>
                )}
            </div>

            {/* NAV */}
            <TooltipProvider delayDuration={120} skipDelayDuration={120}>
                <nav className={`p-4 space-y-1 ${!isOpen ? "px-2" : ""}`}>
                    {items.map((item) => {
                        const Icon = item.icon;
                        const active = pathname === item.href;

                        // Open Sidebar
                        if (isOpen) {
                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    onClick={() => {
                                        if (typeof window !== "undefined" && window.innerWidth < 1024) onCloseMobile();
                                    }}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all outline-none
                    ${active
                                            ? (isDark
                                                ? "bg-[rgba(34,197,94,0.12)] text-green-300 ring-1 ring-green-400/40 shadow-[0_0_20px_rgba(34,197,94,0.15)]"
                                                : "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 ring-1 ring-green-300 shadow-lg")
                                            : (isDark
                                                ? "text-[#a8b0bf] hover:bg-white/5 hover:text-white"
                                                : "text-[#7c3aed] hover:bg-[#ede9fe] hover:text-[#5b21b6]")}
                  `}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon size={18} />
                                        <span className="text-sm">{item.label}</span>
                                    </div>
                                </Link>
                            );
                        }

                        // Closed Sidebar (Icons only)
                        return (
                            <Tooltip key={item.id}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={item.href}
                                        onClick={() => {
                                            if (typeof window !== "undefined" && window.innerWidth < 1024) onCloseMobile();
                                        }}
                                        className={`relative w-full flex items-center justify-center px-3 py-3 rounded-xl transition-all outline-none
                      ${active
                                                ? (isDark
                                                    ? "bg-[rgba(34,197,94,0.12)] text-green-300 ring-1 ring-green-400/40"
                                                    : "bg-green-100 text-green-700 ring-1 ring-green-300")
                                                : (isDark
                                                    ? "text-[#a8b0bf] hover:bg-white/5 hover:text-white"
                                                    : "text-[#7c3aed] hover:bg-[#ede9fe] hover:text-[#5b21b6]")}
                    `}
                                    >
                                        <Icon size={20} />
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    {item.label}
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </nav>
            </TooltipProvider>

            {/* Logout */}
            <div className={`p-4 pb-6 mt-auto flex-shrink-0 ${!isOpen ? "px-2" : ""}`}>
                <button
                    className="w-full bg-[rgba(220,38,38,0.1)] hover:bg-[rgba(220,38,38,0.2)] text-red-400 rounded-lg p-3 text-sm transition-all flex items-center gap-2 border border-[rgba(220,38,38,0.2)] justify-center"
                    onClick={async () => {
                        sessionStorage.clear();
                        router.push("/login");
                    }}
                >
                    <LogOut size={16} />
                    {isOpen && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
}

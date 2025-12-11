"use client";

import React, { useState, useEffect } from "react";
import { ThemeProvider } from "@/Context/ThemeContext";
import { Toaster } from "react-hot-toast";
import Nav from "./publicPages/Navbar/Navbar";
import Footer from "./publicPages/Footer/Footer";
import Loader from "./Loader";
import { usePathname } from "next/navigation";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, [pathname]);

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isMenteeDashboard = pathname.startsWith("/mentee");
  const isMentorDashboard = pathname.startsWith("/mentor");

  // ⭐ NEW: hide layout for company dashboard
  const isCompanyDashboard = pathname.startsWith("/company");

  // ⭐ final combined condition
  const hideLayout =
    isAuthPage || isMenteeDashboard || isMentorDashboard || isCompanyDashboard;

  return (
    <ThemeProvider>
      {loading ? (
        <Loader />
      ) : (
        <>
          {!hideLayout && <Nav />}

          <main className="min-h-screen">{children}</main>

          {!hideLayout && <Footer />}

          <Toaster />
        </>
      )}
    </ThemeProvider>
  );
}

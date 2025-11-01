"use client";

import React, { useState, useEffect } from "react";
import { ThemeProvider } from "@/Context/ThemeContext";
import { Toaster } from "react-hot-toast";
import Nav from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
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

  return (
    <ThemeProvider>
      {loading ? (
        <Loader />
      ) : (
        <>
          {!isAuthPage && !isMenteeDashboard && <Nav />}

          <main className="min-h-screen">{children}</main>

          {!isAuthPage && !isMenteeDashboard && <Footer />}

          <Toaster />
        </>
      )}
    </ThemeProvider>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Nav from './Navbar/Navbar';
import Footer from './Footer/Footer';
import Loader from './Loader';
import { usePathname } from 'next/navigation';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [pathname]);

  const isAuthPage =
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/reset-password') ||
    pathname.startsWith('/forgot-password');

  const inDashboard =
    pathname.startsWith('/mentee') ||
    pathname.startsWith('/mentor') ||
    pathname.startsWith('/company');

  const showSiteChrome = !isAuthPage && !inDashboard;

  return loading ? (
    <Loader />
  ) : (
    <>
      {showSiteChrome && <Nav />}
      <main className="flex-grow">{children}</main>
      {showSiteChrome && <Footer />}
      <Toaster />
    </>
  );
}

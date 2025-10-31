'use client';

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@/Context/ThemeContext';
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

  // صفحات المصادقة
  const isAuthPage =
    pathname.startsWith('/login') || pathname.startsWith('/signup');

  // صفحات الداشبورد (اخفِ الـ Navbar/Footer فيها)
  // يدعم /dashboard/* وكذلك /mentee لو كنتِ مستخدمة Route Group (dashboard)
  const isDashboardPage =
    /^\/dashboard(\/|$)/.test(pathname) || /^\/mentee(\/|$)/.test(pathname);

  const hideChrome = isAuthPage || isDashboardPage;

  return (
    <ThemeProvider>
      {loading ? (
        <Loader />
      ) : (
        <>
          {hideChrome ? (
            <main className="flex-grow">{children}</main>
          ) : (
            <>
              <Nav />
              <main className="flex-grow">{children}</main>
              <Footer />
            </>
          )}
          <Toaster />
        </>
      )}
    </ThemeProvider>
  );
}

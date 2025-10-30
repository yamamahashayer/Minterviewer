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
    // Reset loading state on path change
    setLoading(true);

    // Simulate a loading time (reduced to 600ms for faster transitions)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => {
      clearTimeout(timer);
    };
  }, [pathname]);

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');

  return (
    <ThemeProvider>
      {loading ? (
        <Loader />
      ) : (
        <>
          {isAuthPage ? (
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

// app/(public)/layout.tsx
'use client';

import Navbar from '../components/publicPages/Navbar/Navbar';
import Footer from '../components/publicPages/Footer/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}

import { Geist } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/Context/ThemeContext";
import { Toaster } from "react-hot-toast";
import Nav from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
const geist = Geist({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={geist.className}>
        <ThemeProvider>
          <Nav />
          <main className="flex-grow">{children}</main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
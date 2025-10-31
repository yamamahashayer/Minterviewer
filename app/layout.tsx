import { Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/Context/ThemeContext";
import LayoutClient from "./components/LayoutClient"; // 👈 رجعناه هنا

const geist = Geist({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "Minterviewer",
  description: "Your personal interview coach",
  icons: { icon: "/MentorHubLogo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={geist.className}>
        <ThemeProvider>
          <LayoutClient>{children}</LayoutClient>
        </ThemeProvider>
      </body>
    </html>
  );
}

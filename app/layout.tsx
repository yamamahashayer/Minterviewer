import { Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/Context/ThemeContext";
import LayoutClient from "./components/LayoutClient";
import Script from "next/script";

const geist = Geist({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "Minterviewer",
  description: "Your personal interview coach",
  icons: { icon: "/public/MentorHubLogo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={geist.className}>
        <ThemeProvider>
          <LayoutClient>{children}</LayoutClient>
          <Script
            src="https://sitespeak.ai/chatbots/1fa5241f-dc18-4f0d-bf9f-504d1cd531d0.js"
            strategy="lazyOnload"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}

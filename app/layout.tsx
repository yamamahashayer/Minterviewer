import { Geist } from "next/font/google";
import "./globals.css";
import LayoutClient from "./components/LayoutClient";

export const metadata = {
  title: 'Minterviewer',
  description: 'Your personal interview coach',
  icons: {
    icon: '/MentorHubLogo.png',
  },
};

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
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
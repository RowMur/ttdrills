import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/next";
import { SessionProvider } from "@/components/SessionProvider";
import { StartupSeeder } from "@/components/StartupSeeder";
import { PostHogProvider } from "@/components/PostHogProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TTDrills",
  description:
    "A collection of table tennis drills with interactive diagrams and video demonstrations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Analytics />
      <body className={`${inter.variable} antialiased`}>
        <PostHogProvider>
          <SessionProvider>
            <StartupSeeder />
            <Navbar />
            {children}
          </SessionProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}

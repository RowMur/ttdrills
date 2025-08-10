import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/next";
import { SessionProvider } from "@/components/SessionProvider";
import { StartupSeeder } from "@/components/StartupSeeder";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Table Tennis Drills",
  description: "A collection of table tennis drills",
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
        <SessionProvider>
          <StartupSeeder />
          <Navbar />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}

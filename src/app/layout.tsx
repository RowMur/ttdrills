import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";
import { SessionProvider } from "@/components/SessionProvider";
import { StartupSeeder } from "@/components/StartupSeeder";
import { PostHogProvider } from "@/components/PostHogProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TTDrills - Track Your Table Tennis Training Progress",
    template: "%s - TTDrills",
  },
  description:
    "Log your table tennis training sessions, track your progress, and discover drills to improve your game. The ultimate training journal for table tennis players.",
  keywords: [
    "table tennis training journal",
    "ping pong practice log",
    "table tennis progress tracking",
    "training sessions",
    "table tennis drills",
    "ping pong training",
    "table tennis practice",
    "table tennis coaching",
  ],
  authors: [{ name: "TTDrills Team" }],
  creator: "TTDrills",
  publisher: "TTDrills",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://ttdrills.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ttdrills.com",
    title: "TTDrills - Track Your Table Tennis Training Progress",
    description:
      "Log your table tennis training sessions, track your progress, and discover drills to improve your game.",
    siteName: "TTDrills",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "TTDrills Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TTDrills - Track Your Table Tennis Training Progress",
    description:
      "Log your table tennis training sessions, track your progress, and discover drills to improve your game.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Replace with actual verification code
  },
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
            <main className="min-h-screen">{children}</main>
            <Footer />
          </SessionProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}

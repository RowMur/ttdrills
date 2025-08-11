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
  title: {
    default: "TTDrills - Table Tennis Drills with Interactive Diagrams",
    template: "%s - TTDrills",
  },
  description:
    "Discover and practice table tennis drills with interactive diagrams, video demonstrations, and step-by-step instructions. Perfect for players of all levels.",
  keywords: [
    "table tennis drills",
    "ping pong training",
    "table tennis practice",
    "interactive drills",
    "table tennis exercises",
    "ping pong drills",
    "table tennis coaching",
    "table tennis training",
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
    title: "TTDrills - Table Tennis Drills with Interactive Diagrams",
    description:
      "Discover and practice table tennis drills with interactive diagrams, video demonstrations, and step-by-step instructions.",
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
    title: "TTDrills - Table Tennis Drills with Interactive Diagrams",
    description:
      "Discover and practice table tennis drills with interactive diagrams, video demonstrations, and step-by-step instructions.",
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
            {children}
          </SessionProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create New Drill",
  description:
    "Create your own table tennis drill with interactive diagrams, step-by-step instructions, and video demonstrations. Build custom training routines for any skill level.",
  keywords: [
    "create table tennis drill",
    "custom ping pong training",
    "table tennis drill builder",
    "interactive drill creation",
    "table tennis drill maker",
    "ping pong exercise creator",
  ],
  openGraph: {
    title: "Create New Drill - TTDrills",
    description:
      "Create your own table tennis drill with interactive diagrams and step-by-step instructions.",
    type: "website",
    url: "https://ttdrills.com/create",
  },
  twitter: {
    card: "summary_large_image",
    title: "Create New Drill - TTDrills",
    description:
      "Create your own table tennis drill with interactive diagrams and step-by-step instructions.",
  },
};

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

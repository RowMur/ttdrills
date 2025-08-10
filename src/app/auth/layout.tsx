import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - TTDrills",
  description:
    "Sign in to TTDrills to create, manage, and share your own table tennis drills. Join the community of table tennis players and coaches.",
  keywords:
    "sign in, login, table tennis drills, TTDrills account, create drills",
  openGraph: {
    title: "Sign In - TTDrills",
    description:
      "Sign in to create, manage, and share your own table tennis drills.",
    type: "website",
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

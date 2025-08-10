import { Main } from "@/components/Main";
import { SearchResults } from "@/components/SearchResults";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TTDrills - Table Tennis Drills with Interactive Diagrams",
  description:
    "Discover and practice table tennis drills with interactive diagrams, video demonstrations, and step-by-step instructions. Perfect for players of all levels.",
  keywords:
    "table tennis drills, ping pong training, table tennis practice, interactive drills, table tennis exercises",
  openGraph: {
    title: "TTDrills - Table Tennis Drills with Interactive Diagrams",
    description:
      "Discover and practice table tennis drills with interactive diagrams, video demonstrations, and step-by-step instructions.",
    type: "website",
    url: "https://ttdrills.com",
  },
};

export default function Home() {
  return (
    <Main>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchResults />
      </Suspense>
    </Main>
  );
}

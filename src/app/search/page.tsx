import { Main } from "@/components/Main";
import { SearchResults } from "@/components/SearchResults";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Drills",
  description:
    "Search and discover table tennis drills with interactive diagrams and video demonstrations. Find drills by skill level, technique, or difficulty.",
  keywords: [
    "search table tennis drills",
    "find ping pong exercises",
    "table tennis drill search",
    "ping pong training search",
    "table tennis practice drills",
  ],
  openGraph: {
    title: "Search Table Tennis Drills - TTDrills",
    description:
      "Search and discover table tennis drills with interactive diagrams and video demonstrations.",
    type: "website",
    url: "https://ttdrills.com/search",
  },
  twitter: {
    card: "summary",
    title: "Search Table Tennis Drills - TTDrills",
    description:
      "Search and discover table tennis drills with interactive diagrams and video demonstrations.",
  },
};

export default function SearchPage() {
  return (
    <Main>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchResults />
      </Suspense>
    </Main>
  );
}

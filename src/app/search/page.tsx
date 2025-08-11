import { Main } from "@/components/Main";
import { SearchResults } from "@/components/SearchResults";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Drills - TTDrills",
  description:
    "Search and discover table tennis drills with interactive diagrams and video demonstrations.",
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

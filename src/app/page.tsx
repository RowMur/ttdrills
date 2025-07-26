import { Searchbox } from "@/components/Searchbox";
import { SearchResults } from "@/components/SearchResults";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4">
        Table Tennis Drills
      </h1>
      <Suspense fallback={<div>Loading...</div>}>
        <Searchbox />
        <SearchResults />
      </Suspense>
    </main>
  );
}

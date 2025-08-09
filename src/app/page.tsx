import { Main } from "@/components/Main";
import { SearchResults } from "@/components/SearchResults";
import { Suspense } from "react";

export default function Home() {
  return (
    <Main>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchResults />
      </Suspense>
    </Main>
  );
}

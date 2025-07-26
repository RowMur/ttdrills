import { Main } from "@/components/Main";
import { Searchbox } from "@/components/Searchbox";
import { SearchResults } from "@/components/SearchResults";
import { Suspense } from "react";

export default function Home() {
  return (
    <Main>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="mb-8 mx-auto w-fit">
          <Searchbox />
        </div>
        <SearchResults />
      </Suspense>
    </Main>
  );
}

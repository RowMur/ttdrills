"use client";

import { SEARCH_KEY } from "@/constants";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { getRandomDrill } from "@/utils/drillSearch";
import { Dice6, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export const Searchbox = () => {
  const searchTerm = useSearchTerm();
  const router = useRouter();

  const [searchInput, setSearchInput] = useState(searchTerm);

  const handleSearch = useCallback(
    (query: string) => {
      if (query) {
        router.push(`/?${SEARCH_KEY}=${encodeURIComponent(query)}`);
      } else {
        router.push("/");
      }
    },
    [router]
  );

  const handleRandomDrill = useCallback(() => {
    const randomDrill = getRandomDrill(searchInput);
    if (randomDrill) {
      router.push(`/drills/${randomDrill.slug}`);
    } else {
      // If no matching drills found, redirect to search results page to show the "no results" message
      if (searchInput.trim()) {
        router.push(`/?${SEARCH_KEY}=${encodeURIComponent(searchInput)}`);
      } else {
        // If empty search, pick any random drill
        const anyRandomDrill = getRandomDrill("");
        if (anyRandomDrill) {
          router.push(`/drills/${anyRandomDrill.slug}`);
        }
      }
    }
  }, [searchInput, router]);

  return (
    <div className="flex gap-2 w-72">
      <input
        type="text"
        placeholder="Search drills..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch(searchInput);
          }
        }}
        className="border border-gray-300 rounded-md p-2 grow"
      />
      <button
        onClick={() => handleSearch(searchInput)}
        className="bg-red text-white rounded-md hover:bg-green hover:cursor-pointer px-3 transition-colors"
        title="Search drills"
      >
        <Search size={16} />
      </button>
      <button
        onClick={handleRandomDrill}
        className="bg-blue-600 text-white rounded-md hover:bg-blue-700 hover:cursor-pointer px-3 transition-colors"
        title="Get a random drill based on your search"
      >
        <Dice6 size={16} />
      </button>
    </div>
  );
};

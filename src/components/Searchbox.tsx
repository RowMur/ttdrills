"use client";

import { SEARCH_KEY } from "@/constants";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export const Searchbox = () => {
  const searchTerm = useSearchTerm();
  const router = useRouter();

  const [searchInput, setSearchInput] = useState(searchTerm);

  const handleSearch = useCallback(
    (query: string) => {
      if (query) {
        router.push(`?${SEARCH_KEY}=${encodeURIComponent(query)}`);
      } else {
        router.push("/");
      }
    },
    [router]
  );

  return (
    <div className="flex gap-2 mb-8 mx-auto w-60 md:w-72">
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
      >
        <Search size={16} />
      </button>
    </div>
  );
};

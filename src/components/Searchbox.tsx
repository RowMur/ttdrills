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
        router.push(`/search?${SEARCH_KEY}=${encodeURIComponent(query)}`);
      } else {
        router.push("/search");
      }
    },
    [router]
  );

  return (
    <div className="flex gap-2">
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
        className="border border-border bg-surface-light text-text rounded-md p-2 grow focus:border-primary focus:outline-none min-w-0"
        name="search"
      />
      <button
        onClick={() => handleSearch(searchInput)}
        className="bg-primary text-white rounded-md hover:bg-primary-dark px-3 transition-colors hover:cursor-pointer flex-shrink-0"
        title="Search drills"
      >
        <Search size={16} />
      </button>
    </div>
  );
};

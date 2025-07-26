"use client";

import { DrillCard } from "@/components/DrillCard";
import { DRILLS } from "@/data";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

const SEARCH_KEY = "q";

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.get(SEARCH_KEY) || "";

  const [searchInput, setSearchInput] = useState(searchQuery);

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

  const filteredDrills = DRILLS.filter((drill) =>
    drill.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4">
        Table Tennis Drills
      </h1>
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
          onClick={() => handleSearch(searchQuery)}
          className="bg-red text-white rounded-md hover:bg-green hover:cursor-pointer px-3 transition-colors"
        >
          <Search size={16} />
        </button>
      </div>
      <div className="text-center mb-4">
        {filteredDrills.length === 0 ? (
          <p>No drills found.</p>
        ) : (
          <p>Found {filteredDrills.length} drills.</p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-fit mx-auto">
        {filteredDrills.map((drill) => (
          <DrillCard key={drill.name} drill={drill} />
        ))}
      </div>
    </main>
  );
}

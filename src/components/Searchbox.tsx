"use client";

import { SEARCH_KEY } from "@/constants";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { getRandomDrill } from "@/utils/drillSearch";
import { Search, Dice6 } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useCallback, useState } from "react";

export const Searchbox = ({ compact = false }: { compact?: boolean }) => {
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
      if (searchInput.trim()) {
        router.push(`/?${SEARCH_KEY}=${encodeURIComponent(searchInput)}`);
      } else {
        const anyRandomDrill = getRandomDrill("");
        if (anyRandomDrill) {
          router.push(`/drills/${anyRandomDrill.slug}`);
        }
      }
    }
  }, [searchInput, router]);

  if (compact) {
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
          className="border border-border bg-surface-light text-text rounded-md p-2 grow focus:border-primary focus:outline-none"
        />
        <button
          onClick={() => handleSearch(searchInput)}
          className="bg-primary text-white rounded-md hover:bg-primary-dark hover:cursor-pointer px-3 transition-colors"
          title="Search drills"
        >
          <Search size={16} />
        </button>
        <button
          onClick={handleRandomDrill}
          className="bg-success text-white rounded-md hover:bg-success-dark hover:cursor-pointer px-3 transition-colors"
          title="Get a random drill based on your search"
        >
          <Dice6 size={16} />
        </button>
      </div>
    );
  }

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
        className="border border-border bg-surface-light text-text rounded-md p-2 grow focus:border-primary focus:outline-none"
      />
      <button
        onClick={() => handleSearch(searchInput)}
        className="bg-primary text-white rounded-md hover:bg-primary-dark hover:cursor-pointer px-3 transition-colors"
        title="Search drills"
      >
        <Search size={16} />
      </button>
      <button
        onClick={handleRandomDrill}
        className="bg-success text-white rounded-md hover:bg-success-dark hover:cursor-pointer px-3 transition-colors"
        title="Get a random drill based on your search"
      >
        <Dice6 size={16} />
      </button>
    </div>
  );
};

export const SearchboxWithPageCheckWrapper = () => {
  const pathname = usePathname();
  const isHome = pathname === "/";
  return isHome ? null : <Searchbox compact />;
};

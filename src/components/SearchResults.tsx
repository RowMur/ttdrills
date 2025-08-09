"use client";

import { DrillCard } from "@/components/DrillCard";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { filterDrills, getRandomDrill } from "@/utils/drillSearch";
import { Dice6 } from "lucide-react";
import { useRouter } from "next/navigation";

export const SearchResults = () => {
  const searchTerm = useSearchTerm();
  const router = useRouter();

  const filteredDrills = filterDrills(searchTerm);

  const handleRandomDrill = () => {
    const randomDrill = getRandomDrill(searchTerm);
    if (randomDrill) {
      router.push(`/drills/${randomDrill.slug}`);
    } else {
      // This shouldn't happen since the button only shows when there are results,
      // but as a fallback, pick any random drill
      const anyRandomDrill = getRandomDrill("");
      if (anyRandomDrill) {
        router.push(`/drills/${anyRandomDrill.slug}`);
      }
    }
  };

  return (
    <>
      <div className="text-center mb-6">
        {filteredDrills.length === 0 ? (
          <div>
            <p className="mb-4">No drills found for "{searchTerm}".</p>
            <p className="text-sm text-gray-600 mb-4">
              Try searching for terms like: forehand, backhand, topspin,
              backspin, serve, attack, defense
            </p>
          </div>
        ) : (
          <div>
            <p className="mb-4">
              Found {filteredDrills.length} drills
              {searchTerm ? ` for "${searchTerm}"` : ""}.
            </p>
            {searchTerm && (
              <button
                onClick={handleRandomDrill}
                className="bg-green-600 text-white rounded-md hover:bg-green-700 hover:cursor-pointer px-4 py-2 transition-colors flex items-center justify-center gap-2 mx-auto mb-4"
                title="Get a random drill from these results"
              >
                <Dice6 size={16} />
                <span className="font-medium">Try a Random One!</span>
              </button>
            )}
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-fit mx-auto">
        {filteredDrills.map((drill) => (
          <DrillCard key={drill.name} drill={drill} />
        ))}
      </div>
    </>
  );
};

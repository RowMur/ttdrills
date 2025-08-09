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
      <div className="mb-6">
        {filteredDrills.length === 0 ? (
          <div className="text-center ">
            <p className="mb-4 text-text">
              No drills found for &quot;{searchTerm}&quot;.
            </p>
            <p className="text-sm text-text-subtle mb-4">
              Try searching for:{" "}
              <strong className="text-text-muted">strokes</strong> (forehand,
              backhand), <strong className="text-text-muted">spins</strong>{" "}
              (topspin, backspin),
              <strong className="text-text-muted">skills</strong> (attack,
              defense, footwork),{" "}
              <strong className="text-text-muted">difficulty</strong> (beginner,
              intermediate, advanced), or{" "}
              <strong className="text-text-muted">equipment</strong> (multiball,
              robot)
            </p>
          </div>
        ) : (
          <div className="flex wrap flex-col sm:flex-row items-center justify-between">
            <p className="text-text">
              Found {filteredDrills.length} drill
              {filteredDrills.length === 1 ? "" : "s"}
              {searchTerm ? ` for "${searchTerm}"` : ""}.
            </p>

            <button
              onClick={handleRandomDrill}
              className="bg-success text-white rounded-md hover:bg-success-dark hover:cursor-pointer px-4 py-2 transition-colors flex items-center justify-center gap-2"
              title="Get a random drill from these results"
            >
              <Dice6 size={16} />
              <span className="font-medium text-nowrap">Try a Random One!</span>
            </button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 min-[560px]:grid-cols-2 min-[800px]:grid-cols-3 gap-4 w-fit mx-auto">
        {filteredDrills.map((drill) => (
          <DrillCard key={drill.name} drill={drill} />
        ))}
      </div>
    </>
  );
};

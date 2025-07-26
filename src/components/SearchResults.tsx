"use client";

import { DrillCard } from "@/components/DrillCard";
import { DRILLS } from "@/data";
import { useSearchTerm } from "@/hooks/useSearchTerm";

export const SearchResults = () => {
  const searchTerm = useSearchTerm();

  const filteredDrills = DRILLS.filter((drill) =>
    drill.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="text-center mb-4">
        {filteredDrills.length === 0 ? (
          <p>No drills found.</p>
        ) : (
          <p>Found {filteredDrills.length} drills.</p>
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

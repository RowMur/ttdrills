"use client";

import { DrillCard } from "@/components/DrillCard";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { Dice6 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Drill } from "@/types";

export const SearchResults = () => {
  const searchTerm = useSearchTerm();
  const router = useRouter();
  const [drills, setDrills] = useState<Drill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch drills from API
  useEffect(() => {
    const fetchDrills = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (searchTerm) {
          params.append('search', searchTerm);
        }
        
        const response = await fetch(`/api/drills?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch drills');
        }
        
        const data = await response.json();
        setDrills(data.drills || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch drills');
      } finally {
        setLoading(false);
      }
    };

    fetchDrills();
  }, [searchTerm]);

  const handleRandomDrill = () => {
    if (drills.length > 0) {
      const randomIndex = Math.floor(Math.random() * drills.length);
      const randomDrill = drills[randomIndex];
      router.push(`/drills/${randomDrill.slug}`);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-text">Loading drills...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-text text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        {drills.length === 0 ? (
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
              Found {drills.length} drill
              {drills.length === 1 ? "" : "s"}
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
      <div
        className="grid grid-cols-1 gap-6"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        }}
      >
        {drills.map((drill: Drill) => (
          <DrillCard key={drill.id} drill={drill} />
        ))}
      </div>
    </>
  );
};

"use client";

import { DrillCard } from "@/components/DrillCard";
import { Pagination } from "@/components/Pagination";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { trackSearch, trackRandomDrill } from "@/lib/analytics";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDrills, setTotalDrills] = useState(0);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Fetch drills from API
  useEffect(() => {
    const fetchDrills = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (searchTerm) {
          params.append("search", searchTerm);
        }
        params.append("page", currentPage.toString());
        params.append("limit", "12");

        const response = await fetch(`/api/drills?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch drills");
        }

        const data = await response.json();
        setDrills(data.drills || []);
        setTotalPages(data.pagination?.pages || 1);
        setTotalDrills(data.pagination?.total || 0);

        // Track search
        if (searchTerm) {
          trackSearch(searchTerm, data.drills?.length || 0);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch drills");
      } finally {
        setLoading(false);
      }
    };

    fetchDrills();
  }, [searchTerm, currentPage]);

  const handleRandomDrill = () => {
    if (drills.length > 0) {
      const randomIndex = Math.floor(Math.random() * drills.length);
      const randomDrill = drills[randomIndex];

      // Track random drill selection
      trackRandomDrill(randomDrill.name, randomDrill.slug);

      router.push(`/drills/${randomDrill.slug}`);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
          <div className="flex wrap flex-col gap-2 sm:flex-row items-center justify-between">
            <p className="text-text text-center sm:text-left">
              Found {totalDrills} drill
              {totalDrills === 1 ? "" : "s"}
              {searchTerm ? ` for "${searchTerm}"` : ""}.
              {!searchTerm &&
                " Results are sorted by quality and completeness."}
              {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
};

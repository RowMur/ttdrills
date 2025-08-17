"use client";

import { useState, useEffect } from "react";
import { Drill } from "@/types";
import { searchDrillsWithScoring } from "@/utils/drillSearch";

interface DrillSearchProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  placeholder?: string;
  onDrillSelect: (drill: Drill) => void;
  maxResults?: number;
}

export function DrillSearch({
  value,
  onChange,
  onFocus,
  placeholder = "Search for drills...",
  onDrillSelect,
  maxResults = 5,
}: DrillSearchProps) {
  const [results, setResults] = useState<Drill[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (value.trim()) {
      const searchResults = searchDrillsWithScoring(value);
      setResults(
        searchResults.slice(0, maxResults).map((result) => result.drill)
      );
    } else {
      setResults([]);
    }
  }, [value, maxResults]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setShowResults(true);
  };

  const handleDrillSelect = (drill: Drill) => {
    onDrillSelect(drill);
    setShowResults(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => {
          setShowResults(true);
          onFocus?.();
        }}
        onBlur={() => {
          // Delay hiding results to allow clicking on them
          setTimeout(() => setShowResults(false), 200);
        }}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {showResults && results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-surface border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {results.map((drill) => (
            <button
              key={drill.slug}
              onClick={() => handleDrillSelect(drill)}
              className="w-full text-left px-4 py-2 hover:bg-surface-light focus:bg-surface-light focus:outline-none"
            >
              <div className="font-medium text-text">{drill.name}</div>
              <div className="text-sm text-text-muted truncate">
                {drill.description}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

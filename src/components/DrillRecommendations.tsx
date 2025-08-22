"use client";

import { useState, useEffect } from "react";
import { Drill } from "@/types";
import { Button } from "./Button";
import { Plus, Lightbulb, Clock } from "lucide-react";

interface DrillRecommendation extends Drill {
  score: number;
  reason: string;
}

interface DrillRecommendationsProps {
  onDrillSelect: (drill: Drill) => void;
  selectedDrills: Drill[];
}

export function DrillRecommendations({
  onDrillSelect,
  selectedDrills,
}: DrillRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<DrillRecommendation[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/drills/recommendations");

      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError("Could not load recommendations");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDrill = (drill: Drill) => {
    onDrillSelect(drill);
  };

  const isDrillSelected = (drill: Drill) => {
    return selectedDrills.some((selected) => selected.id === drill.id);
  };

  if (loading) {
    return (
      <div className="mb-4 p-4 bg-surface rounded-lg border border-border">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-5 h-5 text-primary" />
          <h3 className="font-medium text-text">
            Personalized Recommendations
          </h3>
        </div>
        <div className="text-sm text-text-muted">
          Analyzing your training history...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-4 p-4 bg-surface rounded-lg border border-warning">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-5 h-5 text-warning" />
          <h3 className="font-medium text-text">Recommendations</h3>
        </div>
        <div className="text-sm text-text-muted mb-3">
          {error}. Showing popular drills instead.
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={fetchRecommendations}
          className="text-warning border-warning hover:bg-surface-light"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-5 h-5 text-blue-600" />
        <h3 className="font-medium text-blue-900">Recommended for You</h3>
        <Clock className="w-4 h-4 text-blue-500" />
        <span className="text-xs text-blue-600">
          Based on your last 30 days
        </span>
      </div>

      <p className="text-sm text-blue-700 mb-4">
        These drills are personalized based on your training history, notes, and
        performance.
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        {recommendations.slice(0, 4).map((drill) => (
          <div
            key={drill.id}
            className={`p-3 rounded-lg border transition-colors ${
              isDrillSelected(drill)
                ? "bg-blue-100 border-blue-300"
                : "bg-white border-blue-200 hover:border-blue-300 hover:bg-blue-50"
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h4 className="font-medium text-blue-900 text-sm mb-1">
                  {drill.name}
                </h4>
                <p className="text-xs text-blue-600 mb-2 line-clamp-2">
                  {drill.description}
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      drill.difficulty === "beginner"
                        ? "bg-green-100 text-green-700"
                        : drill.difficulty === "intermediate"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {drill.difficulty}
                  </span>
                  {drill.categories?.[0] && (
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                      {drill.categories[0]}
                    </span>
                  )}
                </div>
                <p className="text-xs text-blue-600 italic">{drill.reason}</p>
              </div>
              {!isDrillSelected(drill) && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddDrill(drill)}
                  className="ml-2 flex-shrink-0 text-blue-700 border-blue-300 hover:bg-blue-100"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {recommendations.length > 4 && (
        <div className="mt-3 text-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              /* TODO: Show more recommendations */
            }}
            className="text-blue-700 border-blue-300 hover:bg-blue-100"
          >
            View More Recommendations
          </Button>
        </div>
      )}
    </div>
  );
}

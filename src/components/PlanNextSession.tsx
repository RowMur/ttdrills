"use client";

import { useState, useEffect } from "react";
import { Drill } from "@/types";
import { Button } from "./Button";
import { Plus, Lightbulb, Clock, Calendar, Target } from "lucide-react";

interface DrillRecommendation extends Drill {
  score: number;
  reason: string;
  aiInsights?: {
    priority: "high" | "medium" | "low";
    expectedOutcome: string;
    personalization: string;
  };
}

interface PlanNextSessionProps {
  onCreateSession?: (selectedDrills: Drill[]) => void;
}

export function PlanNextSession({ onCreateSession }: PlanNextSessionProps) {
  const [recommendations, setRecommendations] = useState<DrillRecommendation[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDrills, setSelectedDrills] = useState<Drill[]>([]);

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
    if (!selectedDrills.some((selected) => selected.id === drill.id)) {
      setSelectedDrills([...selectedDrills, drill]);
    }
  };

  const handleRemoveDrill = (drillId: string) => {
    setSelectedDrills(selectedDrills.filter((drill) => drill.id !== drillId));
  };

  const isDrillSelected = (drill: Drill) => {
    return selectedDrills.some((selected) => selected.id === drill.id);
  };

  if (loading) {
    return (
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-text">
            Plan Your Next Session
          </h2>
        </div>
        <div className="flex items-center gap-2 text-text-muted">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          <span>Analyzing your training history...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-surface rounded-lg border border-warning p-6">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-6 h-6 text-warning" />
          <h2 className="text-xl font-semibold text-text">
            Plan Your Next Session
          </h2>
        </div>
        <div className="text-text-muted mb-4">
          {error}. You can still browse all available drills.
        </div>
        <Button
          variant="outline"
          onClick={fetchRecommendations}
          className="text-warning border-warning hover:bg-surface-light"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Target className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-text">
            Plan Your Next Session
          </h2>
          <Clock className="w-4 h-4 text-primary-light" />
          <span className="text-sm text-text-muted">
            AI-powered recommendations
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-full">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-xs text-primary font-medium">AI</span>
          </div>
        </div>
        {selectedDrills.length > 0 && (
          <Button
            onClick={() => onCreateSession?.(selectedDrills)}
            className="bg-primary text-white hover:bg-primary-dark"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Log Session ({selectedDrills.length} drills)
          </Button>
        )}
      </div>

      <p className="text-text-muted mb-6">
        These drills are personalized based on your training history,
        performance, and areas for improvement. Select the ones you want to
        practice in your next session.
      </p>

      {selectedDrills.length > 0 && (
        <div className="mb-6 p-4 bg-surface-light rounded-lg border border-border">
          <h3 className="font-medium text-text mb-3">
            Selected for Next Session:
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedDrills.map((drill) => (
              <div
                key={drill.id}
                className="flex items-center gap-2 px-3 py-1 bg-primary/20 text-primary rounded-full text-sm"
              >
                <span>{drill.name}</span>
                <button
                  onClick={() => handleRemoveDrill(drill.id!)}
                  className="text-primary hover:text-primary-dark"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recommendations.slice(0, 6).map((drill) => (
          <div
            key={drill.id}
            className={`p-4 rounded-lg border transition-all duration-200 ${
              isDrillSelected(drill)
                ? "bg-surface-light border-primary shadow-md"
                : "bg-surface border-border hover:border-primary/50 hover:shadow-sm"
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h4 className="font-medium text-text mb-1">{drill.name}</h4>
                <p className="text-sm text-text-muted mb-3 line-clamp-2">
                  {drill.description}
                </p>

                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-medium ${
                      drill.difficulty === "beginner"
                        ? "bg-success/20 text-success"
                        : drill.difficulty === "intermediate"
                        ? "bg-warning/20 text-warning"
                        : "bg-danger/20 text-danger"
                    }`}
                  >
                    {drill.difficulty}
                  </span>
                  {drill.categories?.[0] && (
                    <span className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary font-medium">
                      {drill.categories[0]}
                    </span>
                  )}
                </div>

                <div className="flex items-start gap-2 mb-3">
                  <Lightbulb className="w-3 h-3 text-primary-light mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-text-muted italic leading-tight mb-1">
                      {drill.reason}
                    </p>
                    {drill.aiInsights && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              drill.aiInsights.priority === "high"
                                ? "bg-danger"
                                : drill.aiInsights.priority === "medium"
                                ? "bg-warning"
                                : "bg-success"
                            }`}
                          />
                          <span className="text-xs text-text-subtle capitalize">
                            {drill.aiInsights.priority} priority
                          </span>
                        </div>
                        <p className="text-xs text-text-subtle">
                          {drill.aiInsights.expectedOutcome}
                        </p>
                        <p className="text-xs text-primary-light">
                          {drill.aiInsights.personalization}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {!isDrillSelected(drill) ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddDrill(drill)}
                  className="flex-1 text-primary border-primary/50 hover:bg-surface-light"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add to Session
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveDrill(drill.id!)}
                  className="flex-1 text-primary border-primary bg-surface-light"
                >
                  ✓ Added
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`/drills/${drill.slug}`, "_blank")}
                className="text-text-muted border-border hover:bg-surface-light"
              >
                View
              </Button>
            </div>
          </div>
        ))}
      </div>

      {recommendations.length > 6 && (
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            className="text-primary border-primary/50 hover:bg-surface-light"
          >
            View More Recommendations
          </Button>
        </div>
      )}

      {selectedDrills.length === 0 && (
        <div className="mt-6 text-center">
          <p className="text-text-muted mb-4">
            Select drills above to plan your next training session, or browse
            all available drills.
          </p>
          <Button
            variant="outline"
            onClick={() => window.open("/search", "_blank")}
            className="text-primary border-primary/50 hover:bg-surface-light"
          >
            Browse All Drills
          </Button>
        </div>
      )}
    </div>
  );
}

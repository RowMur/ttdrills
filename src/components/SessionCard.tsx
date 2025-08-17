"use client";

import { useState } from "react";
import { Session } from "@/types";
import { Button } from "./Button";

interface SessionCardProps {
  session: Session;
  onDelete: (sessionId: string) => void;
}

export function SessionCard({ session, onDelete }: SessionCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Debug logging
  console.log("Session data:", session);
  console.log("Session drills:", session.sessionDrills);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this session?")) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/sessions/${session.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onDelete(session.id!);
      } else {
        alert("Failed to delete session");
      }
    } catch (error) {
      console.error("Error deleting session:", error);
      alert("Failed to delete session");
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTotalDuration = () => {
    if (session.durationMinutes) {
      return session.durationMinutes;
    }

    return (
      session.sessionDrills?.reduce((total, sd) => {
        return total + (sd.durationMinutes || 0);
      }, 0) || 0
    );
  };

  const getAverageRating = () => {
    if (!session.sessionDrills || session.sessionDrills.length === 0) {
      return null;
    }

    const ratings = session.sessionDrills
      .map((sd) => sd.rating)
      .filter((r) => r !== undefined && r !== null) as number[];

    if (ratings.length === 0) return null;

    const average =
      ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
    return Math.round(average * 10) / 10; // Round to 1 decimal place
  };

  const totalDuration = getTotalDuration();
  const averageRating = getAverageRating();

  return (
    <div className="bg-surface rounded-lg shadow-md border border-border overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-text mb-1">
              {session.name}
            </h3>
            <p className="text-sm text-text-muted">
              {formatDate(session.date)}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-sm text-text-muted mb-4">
          {totalDuration > 0 && (
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {totalDuration} min
            </div>
          )}

          {session.sessionDrills && session.sessionDrills.length > 0 && (
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              {session.sessionDrills.length} drill
              {session.sessionDrills.length !== 1 ? "s" : ""}
              {session.sessionDrills.some((sd) => sd.drill?.name) && (
                <span className="ml-2 text-xs">
                  ({session.sessionDrills.filter((sd) => sd.drill?.name).length}{" "}
                  with names)
                </span>
              )}
            </div>
          )}

          {averageRating && (
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-1 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {averageRating}/5
            </div>
          )}
        </div>

        {session.notes && (
          <p className="text-sm text-text-muted mb-4">{session.notes}</p>
        )}

        {session.sessionDrills && session.sessionDrills.length > 0 && (
          <div className="border-t border-border pt-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-text">
                Drills in this session ({session.sessionDrills.length}):
              </h4>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? "Hide Details" : "Show Details"}
              </Button>
            </div>

            {showDetails && (
              <div className="space-y-3">
                {session.sessionDrills.map((sessionDrill, index) => (
                  <div key={index} className="bg-surface-light rounded-md p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-text">
                        {sessionDrill.drill?.name || `Drill ${index + 1}`}
                      </h5>
                      <div className="flex items-center space-x-2 text-sm text-text-muted">
                        {sessionDrill.durationMinutes && (
                          <span>{sessionDrill.durationMinutes} min</span>
                        )}
                        {sessionDrill.repetitions &&
                          sessionDrill.repetitions > 1 && (
                            <span>{sessionDrill.repetitions}x</span>
                          )}
                        {sessionDrill.rating && (
                          <div className="flex items-center">
                            <span className="text-yellow-500">★</span>
                            <span>{sessionDrill.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {sessionDrill.drill?.description && (
                      <p className="text-sm text-text-muted mb-2">
                        {sessionDrill.drill.description}
                      </p>
                    )}

                    {sessionDrill.notes && (
                      <p className="text-sm text-text-muted italic">
                        &ldquo;{sessionDrill.notes}&rdquo;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

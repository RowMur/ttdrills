"use client";

import { useState } from "react";
import { Session } from "@/types";
import { Button } from "./Button";
import { useToast } from "@/components/Toast";
import { Modal } from "./Modal";
import { AlertTriangle } from "lucide-react";
import { trackSessionDeletion } from "@/lib/analytics";

interface SessionCardProps {
  session: Session;
  onDelete: (sessionId: string) => void;
}

export function SessionCard({ session, onDelete }: SessionCardProps) {
  const { showToast } = useToast();
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/sessions/${session.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Track session deletion
        trackSessionDeletion(
          session.name,
          session.id!,
          session.sessionDrills?.length || 0
        );

        showToast("Session deleted successfully!", "success");
        onDelete(session.id!);
      } else {
        showToast("Failed to delete session", "error");
      }
    } catch (error) {
      console.error("Error deleting session:", error);
      showToast("Failed to delete session", "error");
    } finally {
      setDeleting(false);
      setShowDeleteConfirmation(false);
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
    <>
      <div className="bg-surface rounded-lg shadow-md border border-border overflow-hidden">
        <div className="p-4">
          <div className="flex justify-between items-start mb-3">
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
                onClick={() => setShowDeleteConfirmation(true)}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="flex items-center space-x-6 text-sm text-text-muted mb-3">
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

          {/* Enhanced Drill Details Preview */}
          {session.sessionDrills && session.sessionDrills.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-text">
                  Drills in this session ({session.sessionDrills.length}):
                </h4>
              </div>
              <div className="space-y-3">
                {session.sessionDrills.map((sessionDrill, index) => (
                  <div
                    key={index}
                    className="bg-surface-light rounded-md p-3 border border-border"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {sessionDrill.drill?.slug ? (
                          <a
                            href={`/drills/${sessionDrill.drill.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20 font-medium hover:bg-primary/20 transition-colors cursor-pointer"
                          >
                            {sessionDrill.drill.name || `Drill ${index + 1}`}
                          </a>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20 font-medium">
                            {sessionDrill.drill?.name || `Drill ${index + 1}`}
                          </span>
                        )}
                        {sessionDrill.durationMinutes && (
                          <span className="text-sm text-text-muted bg-surface px-2 py-1 rounded">
                            {sessionDrill.durationMinutes} min
                          </span>
                        )}
                        {sessionDrill.rating && (
                          <div className="flex items-center text-yellow-500 bg-surface px-2 py-1 rounded">
                            <span className="text-xs">★</span>
                            <span className="text-xs ml-1 font-medium">
                              {sessionDrill.rating}/5
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {sessionDrill.drill?.description && (
                      <p
                        className="text-sm text-text-muted mb-2 overflow-hidden"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {sessionDrill.drill.description}
                      </p>
                    )}

                    {sessionDrill.drill?.id && !sessionDrill.drill?.slug && (
                      <div className="mt-2">
                        <a
                          href={`/drills/${sessionDrill.drill.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-2 py-1 text-xs bg-surface border border-border rounded hover:bg-surface-light transition-colors text-text-muted hover:text-text"
                        >
                          View Drill Details →
                        </a>
                      </div>
                    )}

                    {sessionDrill.notes && (
                      <div className="bg-primary/5 border-l-2 border-primary pl-3 py-1">
                        <p className="text-sm text-text italic">
                          &ldquo;{sessionDrill.notes}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {session.notes && (
            <p className="text-sm text-text-muted mb-4">{session.notes}</p>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        title="Delete Session"
        showCloseButton={!deleting}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-text-muted mb-6">
              Are you sure you want to delete &quot;{session.name}&quot;? This
              action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-danger text-white hover:bg-danger-dark px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete Session"}
              </Button>
              <Button
                onClick={() => setShowDeleteConfirmation(false)}
                disabled={deleting}
                className="bg-surface text-text border border-border hover:bg-surface-light px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

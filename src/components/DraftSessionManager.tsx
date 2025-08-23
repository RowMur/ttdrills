"use client";

import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Session } from "@/types";
import { Button } from "./Button";
import { useToast } from "@/components/Toast";
import { Modal } from "./Modal";
import { useAutoResizeTextarea } from "@/hooks/useAutoResizeTextarea";
import { Edit, Save, Trash2, Clock } from "lucide-react";

interface DraftSessionManagerProps {
  onDraftComplete?: () => void;
  onDraftDeleted?: () => void;
}

export const DraftSessionManager = forwardRef<
  { refresh: () => void },
  DraftSessionManagerProps
>(({ onDraftComplete, onDraftDeleted }, ref) => {
  DraftSessionManager.displayName = "DraftSessionManager";
  const { showToast } = useToast();
  const [draftSession, setDraftSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [notes, setNotes] = useState("");
  const [durationMinutes, setDurationMinutes] = useState<number | undefined>();
  const { textareaRef, adjustHeight } = useAutoResizeTextarea();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    fetchDraftSession();
  }, []);

  useImperativeHandle(ref, () => ({
    refresh: fetchDraftSession,
  }));

  const fetchDraftSession = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/sessions/draft");

      if (response.ok) {
        const data = await response.json();
        if (data.draftSession) {
          setDraftSession(data.draftSession);
          setNotes(data.draftSession.notes || "");
          setDurationMinutes(data.draftSession.durationMinutes);
        }
      }
    } catch (error) {
      console.error("Error fetching draft session:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateDraftSession = async () => {
    try {
      setSaving(true);
      const response = await fetch("/api/sessions/draft", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notes,
          durationMinutes,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setDraftSession(data.draftSession);
        setIsEditing(false);
        showToast("Draft session updated!", "success");
      } else {
        const error = await response.json();
        showToast(`Failed to update draft: ${error.error}`, "error");
      }
    } catch (error) {
      console.error("Error updating draft session:", error);
      showToast("Failed to update draft session", "error");
    } finally {
      setSaving(false);
    }
  };

  const completeDraftSession = async () => {
    try {
      setSaving(true);
      const response = await fetch("/api/sessions/draft", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notes,
          durationMinutes,
        }),
      });

      if (response.ok) {
        showToast("Draft session completed!", "success");

        // Clear the draft session from UI
        setDraftSession(null);

        // Notify parent to refresh sessions list
        onDraftComplete?.();

        // Scroll to top of sessions list after a short delay to allow for refresh
        setTimeout(() => {
          const sessionsContainer = document.querySelector(
            "[data-sessions-container]"
          );
          if (sessionsContainer) {
            sessionsContainer.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 100);
      } else {
        const error = await response.json();
        showToast(`Failed to complete draft: ${error.error}`, "error");
      }
    } catch (error) {
      console.error("Error completing draft session:", error);
      showToast("Failed to complete draft session", "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteDraftSession = async () => {
    try {
      setSaving(true);
      const response = await fetch("/api/sessions/draft", {
        method: "DELETE",
      });

      if (response.ok) {
        showToast("Draft session deleted", "success");
        setDraftSession(null);
        onDraftDeleted?.();
      } else {
        const error = await response.json();
        showToast(`Failed to delete draft: ${error.error}`, "error");
      }
    } catch (error) {
      console.error("Error deleting draft session:", error);
      showToast("Failed to delete draft session", "error");
    } finally {
      setSaving(false);
      setShowDeleteConfirmation(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-surface rounded-lg border border-border p-4">
        <div className="flex items-center gap-2 text-text-muted">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          <span>Loading draft session...</span>
        </div>
      </div>
    );
  }

  if (!draftSession) {
    return null;
  }

  return (
    <div className="bg-warning/10 border-2 border-warning rounded-xl p-6 mb-8 shadow-sm">
      <div className="flex flex-row items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="p-2 bg-warning/20 rounded-lg flex-shrink-0">
            <Clock className="w-6 h-6 text-warning" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-bold text-text">
              Continue Draft Session
            </h3>
            <p className="text-sm text-text-muted">
              You have an ongoing session to complete
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowDeleteConfirmation(true)}
            disabled={saving}
            className="text-danger border-danger hover:bg-danger/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="mb-3">
        <h4 className="font-medium text-text mb-1 flex flex-row gap-2 items-center">
          <span>{draftSession.name}</span>
          <span className="px-3 py-1 text-sm rounded-full bg-warning/20 text-warning font-medium flex-shrink-0">
            {draftSession.isCompetitive ? "Competitive" : "Practice"}
          </span>
        </h4>
        <div className="flex items-center space-x-6 text-sm text-text-muted">
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {formatDate(draftSession.date)}
          </div>
          {draftSession.durationMinutes && draftSession.durationMinutes > 0 && (
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
              {draftSession.durationMinutes} min
            </div>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={durationMinutes || ""}
              onChange={(e) =>
                setDurationMinutes(
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-text"
              placeholder="e.g., 120"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Notes
            </label>
            <textarea
              ref={textareaRef}
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                adjustHeight();
              }}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-text resize-none overflow-hidden"
              placeholder="Add your observations, match results, or areas to focus on..."
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setNotes(draftSession.notes || "");
                setDurationMinutes(draftSession.durationMinutes);
              }}
              className="text-text-muted border-border hover:bg-surface-light grow sm:grow-0"
            >
              Cancel
            </Button>
            <Button
              onClick={updateDraftSession}
              disabled={saving}
              className="bg-warning text-white hover:bg-warning-dark text-nowrap grow sm:grow-0"
            >
              <Save className="w-4 h-4 mr-1" />
              {saving ? "Saving..." : "Save Draft"}
            </Button>
            <Button
              onClick={completeDraftSession}
              disabled={saving}
              className="bg-success text-white hover:bg-success-dark text-nowrap grow sm:grow-0"
            >
              Complete Session
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {draftSession.notes && (
            <div className="bg-surface rounded-md p-3 border border-border">
              <p className="text-sm text-text whitespace-pre-wrap">
                {draftSession.notes}
              </p>
            </div>
          )}
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-warning text-white hover:bg-warning-dark grow sm:grow-0"
            >
              <Edit className="w-4 h-4 mr-2" />
              Continue Logging
            </Button>
            <Button
              onClick={completeDraftSession}
              disabled={saving}
              className="bg-success text-white hover:bg-success-dark grow sm:grow-0"
            >
              Complete Session
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        title="Delete Draft Session"
        showCloseButton={true}
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-danger/20 rounded-lg flex-shrink-0">
              <Trash2 className="w-5 h-5 text-danger" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text mb-2">
                Delete Draft Session?
              </h3>
              <p className="text-text-muted">
                Are you sure you want to delete your draft session? This action
                cannot be undone and all your progress will be lost.
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirmation(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={deleteDraftSession}
              disabled={saving}
            >
              {saving ? "Deleting..." : "Delete Draft"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
});

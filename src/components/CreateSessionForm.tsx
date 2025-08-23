"use client";

import { useState } from "react";
import {
  Drill,
  CreateSessionRequest,
  CreateSessionDrillRequest,
} from "@/types";
import { Button } from "./Button";
import { DrillSelectionModal } from "./DrillSelectionModal";
import {
  trackSessionCreation,
  trackPracticeSession,
  trackDrillRating,
} from "@/lib/analytics";

import { Plus } from "lucide-react";
import { useToast } from "@/components/Toast";

interface CreateSessionFormProps {
  onSessionCreated: () => void;
  preSelectedDrills?: Drill[];
}

export function CreateSessionForm({
  onSessionCreated,
  preSelectedDrills = [],
}: CreateSessionFormProps) {
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [durationMinutes, setDurationMinutes] = useState<number | undefined>();
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isCompetitive, setIsCompetitive] = useState(false);
  const [selectedDrills, setSelectedDrills] = useState<
    Array<Drill & { sessionData: CreateSessionDrillRequest }>
  >(() => {
    // Initialize with pre-selected drills if provided
    return preSelectedDrills.map((drill) => ({
      ...drill,
      sessionData: {
        drillId: drill.id!,
        durationMinutes: undefined,
        notes: "",
        rating: undefined,
        repetitions: 1,
      },
    }));
  });
  const [showDrillModal, setShowDrillModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddDrill = (drill: Drill) => {
    if (!drill.id) {
      console.error("Drill has no ID:", drill);
      showToast("Cannot add drill - missing ID", "error");
      return;
    }

    const sessionData: CreateSessionDrillRequest = {
      drillId: drill.id,
      durationMinutes: undefined,
      notes: "",
      rating: undefined,
      repetitions: 1,
    };

    setSelectedDrills([...selectedDrills, { ...drill, sessionData }]);
  };

  const handleRemoveDrill = (index: number) => {
    setSelectedDrills(selectedDrills.filter((_, i) => i !== index));
  };

  const handleUpdateDrillData = (
    index: number,
    field: keyof CreateSessionDrillRequest,
    value: CreateSessionDrillRequest[keyof CreateSessionDrillRequest]
  ) => {
    const updatedDrills = [...selectedDrills];
    updatedDrills[index] = {
      ...updatedDrills[index],
      sessionData: {
        ...updatedDrills[index].sessionData,
        [field]: value,
      },
    };
    setSelectedDrills(updatedDrills);

    // Track drill rating when user rates a drill
    if (field === "rating" && value && typeof value === "number") {
      const drill = updatedDrills[index];
      trackDrillRating(
        drill.name,
        drill.slug,
        value,
        name.trim() || "Unnamed Session"
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast("Please provide a session name", "error");
      return;
    }

    setLoading(true);

    try {
      const sessionData: CreateSessionRequest = {
        name: name.trim(),
        notes: notes.trim() || undefined,
        durationMinutes,
        date: new Date(date),
        isCompetitive,
        isDraft: false, // Default to false, will be set by action buttons
        sessionDrills: isCompetitive
          ? []
          : selectedDrills.map((d) => d.sessionData),
      };

      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sessionData),
      });

      if (response.ok) {
        // Track session creation
        const hasDrills = selectedDrills.length > 0;
        const hasNotes = notes.trim().length > 0;

        if (hasDrills) {
          trackSessionCreation(
            name.trim(),
            true,
            selectedDrills.length,
            hasNotes,
            durationMinutes,
            isCompetitive ? "competitive" : "practice"
          );
        } else if (isCompetitive) {
          // Track competitive sessions separately
          trackPracticeSession(name.trim(), hasNotes, durationMinutes);
        } else {
          trackPracticeSession(name.trim(), hasNotes, durationMinutes);
        }

        showToast("Session logged successfully!", "success");
        onSessionCreated();
      } else {
        const error = await response.json();
        showToast(`Failed to create session: ${error.error}`, "error");
      }
    } catch (error) {
      console.error("Error creating session:", error);
      showToast("Failed to create session. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Session Name *
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Morning Practice, Match vs John, Solo Training"
          required
        />
      </div>

      <div>
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Date
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isCompetitive"
            checked={isCompetitive}
            onChange={(e) => {
              setIsCompetitive(e.target.checked);
              // Clear selected drills if switching to competitive
              if (e.target.checked) {
                setSelectedDrills([]);
              }
            }}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="isCompetitive"
            className="ml-2 block text-sm text-gray-900"
          >
            This was a competitive match or tournament
          </label>
        </div>
        {isCompetitive && (
          <p className="mt-2 text-sm text-orange-600">
            💡 Competitive sessions focus on match analysis and don&apos;t
            include specific drill practice. For long tournaments, you can save
            as draft and continue logging throughout the day.
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="duration"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Total Duration (minutes)
        </label>
        <input
          type="number"
          id="duration"
          value={durationMinutes || ""}
          onChange={(e) =>
            setDurationMinutes(
              e.target.value ? parseInt(e.target.value) : undefined
            )
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., 60"
          min="1"
        />
      </div>

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Notes
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="How did the session go? Any observations, match results, or areas to focus on next time..."
        />
      </div>

      {!isCompetitive && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Drills Practiced (Optional)
          </label>

          <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-3">
              {selectedDrills.length === 0
                ? "No drills selected. You can log practice sessions without specific drills."
                : `${selectedDrills.length} drill${
                    selectedDrills.length !== 1 ? "s" : ""
                  } selected.`}
            </p>

            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDrillModal(true)}
              className="w-full flex items-center justify-center gap-2 py-3"
            >
              <Plus className="w-4 h-4" />
              {selectedDrills.length === 0
                ? "Add Drills to Session"
                : "Add More Drills"}
            </Button>
          </div>

          {selectedDrills.length > 0 && (
            <div className="space-y-4">
              {selectedDrills.map((drill, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between gap-2 items-start mb-1">
                    <div>
                      <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mb-1">
                        <h4 className="font-medium text-gray-900">
                          {drill.name}
                        </h4>
                        <a
                          href={`/drills/${drill.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary text-nowrap hover:text-primary-dark text-sm underline"
                        >
                          View details →
                        </a>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoveDrill(index)}
                      className="mb-2"
                    >
                      Remove
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {drill.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        How long did you practice this? (min)
                      </label>
                      <input
                        type="number"
                        value={drill.sessionData.durationMinutes || ""}
                        onChange={(e) =>
                          handleUpdateDrillData(
                            index,
                            "durationMinutes",
                            e.target.value
                              ? parseInt(e.target.value)
                              : undefined
                          )
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="e.g., 15"
                        min="1"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        How did it go?
                      </label>
                      <select
                        value={drill.sessionData.rating || ""}
                        onChange={(e) =>
                          handleUpdateDrillData(
                            index,
                            "rating",
                            e.target.value
                              ? parseInt(e.target.value)
                              : undefined
                          )
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">No rating</option>
                        <option value="1">1 - Poor</option>
                        <option value="2">2 - Fair</option>
                        <option value="3">3 - Good</option>
                        <option value="4">4 - Very Good</option>
                        <option value="5">5 - Excellent</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Any thoughts on this drill?
                      </label>
                      <textarea
                        value={drill.sessionData.notes || ""}
                        onChange={(e) =>
                          handleUpdateDrillData(index, "notes", e.target.value)
                        }
                        rows={2}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="What went well? What needs work? Any observations..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end gap-3 flex-wrap">
        <Button
          type="button"
          variant="secondary"
          onClick={() => onSessionCreated()}
          disabled={loading}
          className="text-nowrap grow"
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={async () => {
            if (!name.trim()) {
              showToast("Please provide a session name", "error");
              return;
            }
            setLoading(true);
            try {
              const sessionData: CreateSessionRequest = {
                name: name.trim(),
                notes: notes.trim() || undefined,
                durationMinutes,
                date: new Date(date),
                isCompetitive,
                isDraft: true,
                sessionDrills: isCompetitive
                  ? []
                  : selectedDrills.map((d) => d.sessionData),
              };
              const response = await fetch("/api/sessions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(sessionData),
              });
              if (response.ok) {
                showToast(
                  "Draft session saved! You can continue logging later.",
                  "success"
                );
                onSessionCreated();
              } else {
                const error = await response.json();
                showToast(`Failed to save draft: ${error.error}`, "error");
              }
            } catch (error) {
              console.error("Error saving draft session:", error);
              showToast("Failed to save draft session", "error");
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          className="border-warning text-warning hover:bg-warning/10 grow sm:grow-0"
        >
          {loading ? "Saving..." : "Save as Draft"}
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          className="grow sm:grow-0"
        >
          {loading ? "Logging..." : "Log Session"}
        </Button>
      </div>

      <DrillSelectionModal
        isOpen={showDrillModal}
        onClose={() => setShowDrillModal(false)}
        onDrillSelect={handleAddDrill}
        selectedDrills={selectedDrills}
      />
    </form>
  );
}

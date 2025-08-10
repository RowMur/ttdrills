"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LimitedDrillFormMetadata } from "@/components/LimitedDrillFormMetadata";
import { Button } from "@/components/Button";
import { DrillDiagram } from "@/components/DrillDiagram/DrillDiagram";
import { ControlButton } from "@/components/ControlButton";
import { useDrillState } from "@/hooks/useDrillState";
import { Drill } from "@/types";
import { Main } from "@/components/Main";
import { trackDrillEdit } from "@/lib/analytics";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

type Props = {
  drill: Drill;
};

export const EditDrillForm = ({ drill }: Props) => {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [drillData, setDrillData] = useState({
    description: drill.description,
    objectives: drill.objectives,
    tips: drill.tips,
    duration: drill.duration || "",
    videoUrl: drill.videoUrl || "",
    videoStart: drill.videoStart?.toString() || "",
  });

  // Keep original values for non-editable fields
  const originalDrill = {
    name: drill.name,
    difficulty: drill.difficulty,
    categories: drill.categories,
    graph: drill.graph,
  };

  // Preview drill for the diagram (using original graph)
  const previewDrill = {
    ...drill,
    ...drillData,
    ...originalDrill, // Include original non-editable fields
    videoStart: drillData.videoStart
      ? parseInt(drillData.videoStart)
      : undefined,
  };

  const drillState = useDrillState({ drill: previewDrill });

  const handleMetadataChange = (
    field: string,
    value: string | string[] | number | undefined
  ) => {
    setDrillData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Note: Ball sequence is not editable in limited editing mode

  // Note: Slug generation not needed in limited editing mode

  const handleSaveDrill = async () => {
    if (!drillData.description.trim()) {
      alert("Please fill in the description field");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/drills/${drill.slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: originalDrill.name, // Keep original name
          slug: drill.slug, // Keep original slug
          description: drillData.description,
          objectives: drillData.objectives.filter((obj) => obj.trim() !== ""),
          difficulty: originalDrill.difficulty, // Keep original difficulty
          categories: originalDrill.categories, // Keep original categories
          tips: drillData.tips.filter((tip) => tip.trim() !== ""),
          duration: drillData.duration || undefined,
          videoUrl: drillData.videoUrl || undefined,
          videoStart: drillData.videoStart
            ? parseInt(drillData.videoStart)
            : undefined,
          graph: originalDrill.graph, // Keep original graph
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update drill");
      }

      const updatedDrill = await response.json();

      // Track drill edit
      trackDrillEdit(drill.name, drill.slug);
      console.log("Updated Drill:", updatedDrill);

      // Redirect to the updated drill details page
      router.push(`/drills/${updatedDrill.slug}`);
    } catch (error) {
      console.error("Error updating drill:", error);
      alert(
        `Error updating drill: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsSaving(false);
    }
  };

  const isFormValid = () => {
    return drillData.description.trim() !== "";
  };

  return (
    <Main>
      <div className="space-y-8">
        {/* Top Row - Drill Metadata Form (Full Width) */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-text">
            Editable Information
          </h2>
          <LimitedDrillFormMetadata
            data={drillData}
            onChange={handleMetadataChange}
          />
        </div>

        {/* Bottom Row - Preview and Save */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Save Button and Info */}
          <div className="space-y-6">
            {/* Non-Editable Information Display */}
            <div className="bg-surface border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-text">
                Drill Structure (Not Editable)
              </h2>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="font-medium text-text">Name:</span>
                  <div className="text-text-subtle mt-1">
                    {originalDrill.name}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-text">Difficulty:</span>
                  <div className="text-text-subtle mt-1">
                    {originalDrill.difficulty}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-text">Categories:</span>
                  <div className="text-text-subtle mt-1">
                    {originalDrill.categories.join(", ")}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-text">Ball Sequence:</span>
                  <div className="text-text-subtle mt-1">
                    {Object.keys(originalDrill.graph.nodes).length} shots
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="text-center">
              <Button
                onClick={handleSaveDrill}
                disabled={!isFormValid() || isSaving}
                className={`px-8 py-3 rounded-lg font-semibold ${
                  isFormValid() && !isSaving
                    ? "bg-success text-white hover:bg-success-dark"
                    : "bg-surface-light text-text-subtle cursor-not-allowed"
                }`}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
              {!isFormValid() && (
                <p className="text-text-subtle text-sm mt-2">
                  Please fill in the description field
                </p>
              )}
            </div>
          </div>

          {/* Right Column - Desktop Preview (lg+ screens only) */}
          <div className="hidden lg:block lg:sticky lg:top-8 lg:h-fit">
            <div className="bg-surface border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-text">
                Live Preview
              </h2>

              <div className="space-y-4">
                {/* Interactive Controls */}
                <div className="flex justify-between items-center">
                  <ControlButton onClick={drillState.reset}>
                    <RotateCcw className="w-4 h-4" />
                  </ControlButton>
                  <div className="flex gap-2">
                    <ControlButton
                      onClick={drillState.goBack}
                      disabled={!drillState.canGoBack}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </ControlButton>
                    <ControlButton
                      onClick={drillState.goForward}
                      disabled={!drillState.canGoForward}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </ControlButton>
                  </div>
                </div>

                {/* Interactive Diagram */}
                <div className="bg-surface-light rounded-lg p-4">
                  {drillState.selectingNextNode && (
                    <div className="text-center mb-3">
                      <p className="text-sm font-medium text-primary">
                        Click on a ball to choose your path
                      </p>
                    </div>
                  )}
                  <div className="flex justify-center">
                    <DrillDiagram
                      drill={previewDrill}
                      nodeId={drillState.nodeId}
                      height={300}
                      width={200}
                      selectingNextNode={drillState.selectingNextNode}
                      availableNextNodes={drillState.availableNextNodes}
                      goToNextNodeOption={drillState.goToNextNodeOption}
                    />
                  </div>
                </div>

                {/* Current Step Info */}
                <div className="bg-surface-light rounded-lg p-4">
                  <div className="text-sm space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-text text-lg">
                        Step {drillState.path.length}
                      </span>
                      <span className="text-xs text-text-subtle">
                        Path: {drillState.path.length} shot
                        {drillState.path.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {originalDrill.graph.nodes[drillState.nodeId] && (
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="font-medium text-text">Shot:</span>
                          <div className="text-text-subtle">
                            {drillState.nodeId}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-text">Player:</span>
                          <div className="text-text-subtle">
                            {originalDrill.graph.nodes[drillState.nodeId]?.ball
                              .isOpponent
                              ? "Opponent"
                              : "Player"}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-text">Stroke:</span>
                          <div className="text-text-subtle">
                            {
                              originalDrill.graph.nodes[drillState.nodeId]?.ball
                                .stroke
                            }
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-text">Spin:</span>
                          <div className="text-text-subtle">
                            {
                              originalDrill.graph.nodes[drillState.nodeId]?.ball
                                .spin
                            }
                          </div>
                        </div>
                        <div className="col-span-2">
                          <span className="font-medium text-text">
                            Placement:
                          </span>
                          <div className="text-text-subtle">
                            {(() => {
                              const node =
                                originalDrill.graph.nodes[drillState.nodeId];
                              if (node) {
                                return `${node.ball.placement.direction} ${node.ball.placement.depth}`;
                              }
                              return "final shot";
                            })()}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
};

"use client";

import { useState, useMemo } from "react";
import { DrillFormMetadata } from "@/components/DrillFormMetadata";
import { DrillFormSequence } from "@/components/DrillFormSequence";
import { Button } from "@/components/Button";
import { DrillDiagram } from "@/components/DrillDiagram/DrillDiagram";
import { ControlButton } from "@/components/ControlButton";
import { useDrillState } from "@/hooks/useDrillState";
import { Drill, DifficultyLevel, DrillCategory, StepGraph } from "@/types";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Play,
  Eye,
  X,
} from "lucide-react";
import { Main } from "@/components/Main";

export default function CreateDrillPage() {
  const [drillData, setDrillData] = useState({
    name: "",
    description: "",
    objectives: [""],
    difficulty: "beginner" as DifficultyLevel,
    categories: [] as DrillCategory[],
    tips: [""],
    duration: "",
  });

  const [ballSequence, setBallSequence] = useState<StepGraph>({
    entryPoint: "serve",
    nodes: {
      serve: {
        id: "serve",
        prev: [],
        next: [],
        ball: {
          stroke: "forehand",
          spin: "top",
          placement: { depth: "long", direction: "forehand" },
          isOpponent: false,
        },
      },
    },
  });

  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const handleMetadataChange = (
    field: string,
    value: string | string[] | DifficultyLevel | DrillCategory[]
  ) => {
    setDrillData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSequenceChange = (sequence: StepGraph) => {
    setBallSequence(sequence);
  };

  // Create a preview drill object for the diagram
  const previewDrill: Drill | null = useMemo(() => {
    if (
      !ballSequence.entryPoint ||
      Object.keys(ballSequence.nodes).length === 0 ||
      !ballSequence.nodes[ballSequence.entryPoint]
    ) {
      return null;
    }

    return {
      name: drillData.name || "Preview Drill",
      slug: "preview",
      description: drillData.description || "Preview",
      objectives: drillData.objectives.filter((obj) => obj.trim() !== ""),
      difficulty: drillData.difficulty,
      categories: drillData.categories,
      tips: drillData.tips.filter((tip) => tip.trim() !== ""),
      graph: ballSequence,
    };
  }, [drillData, ballSequence]);

  // Create a default drill for useDrillState (hooks can't be called conditionally)
  const defaultDrill: Drill = useMemo(
    () => ({
      name: "Default",
      slug: "default",
      description: "",
      objectives: [],
      difficulty: "beginner" as DifficultyLevel,
      categories: [],
      tips: [],
      graph: {
        entryPoint: "default",
        nodes: {
          default: {
            id: "default",
            prev: [],
            next: [],
            ball: {
              stroke: "forehand",
              spin: "top",
              placement: { depth: "long", direction: "forehand" },
              isOpponent: false,
            },
          },
        },
      },
    }),
    []
  );

  // Use drill state for interactive stepping (always call hook)
  const drillState = useDrillState({ drill: previewDrill || defaultDrill });

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleCreateDrill = () => {
    // Filter out empty objectives and tips
    const cleanObjectives = drillData.objectives.filter(
      (obj) => obj.trim() !== ""
    );
    const cleanTips = drillData.tips.filter((tip) => tip.trim() !== "");

    const drill: Drill = {
      name: drillData.name,
      slug: generateSlug(drillData.name),
      description: drillData.description,
      objectives: cleanObjectives,
      difficulty: drillData.difficulty,
      categories: drillData.categories,
      tips: cleanTips,
      ...(drillData.duration && { duration: drillData.duration }),
      graph: ballSequence,
    };

    console.log("Generated Drill Object:");
    console.log(JSON.stringify(drill, null, 2));

    alert(
      "Drill object has been logged to console! Check the browser developer tools."
    );
  };

  const isFormValid = () => {
    return (
      drillData.name.trim() !== "" &&
      drillData.description.trim() !== "" &&
      ballSequence.entryPoint !== "" &&
      Object.keys(ballSequence.nodes).length > 0
    );
  };

  return (
    <Main>
      <div className="container">
        <h1 className="text-3xl font-bold text-center mb-8 text-text">
          Create New Drill
        </h1>

        <div className="space-y-8">
          {/* Top Row - Drill Metadata Form (Full Width) */}
          <div className="bg-surface border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-text">
              Drill Information
            </h2>
            <DrillFormMetadata
              data={drillData}
              onChange={handleMetadataChange}
            />
          </div>

          {/* Bottom Row - Sequence Builder and Preview */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Left Column - Ball Sequence Builder */}
            <div className="space-y-6">
              <div className="bg-surface border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-text">
                  Ball Sequence
                </h2>
                <DrillFormSequence
                  sequence={ballSequence}
                  onChange={handleSequenceChange}
                />
              </div>

              {/* Create Button */}
              <div className="text-center">
                <Button
                  onClick={handleCreateDrill}
                  disabled={!isFormValid()}
                  className={`px-8 py-3 rounded-lg font-semibold ${
                    isFormValid()
                      ? "bg-success text-white hover:bg-success-dark"
                      : "bg-surface-light text-text-subtle cursor-not-allowed"
                  }`}
                >
                  Create Drill (Console Log)
                </Button>
                {!isFormValid() && (
                  <p className="text-text-subtle text-sm mt-2">
                    Please fill in all required fields and create at least one
                    ball sequence
                  </p>
                )}
              </div>
            </div>

            {/* Right Column - Desktop Preview (xl+ screens only) */}
            <div className="hidden xl:block xl:sticky xl:top-8 xl:h-fit">
              <div className="bg-surface border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-text">
                  Live Preview
                </h2>

                {previewDrill ? (
                  <div className="space-y-4">
                    {/* Interactive Controls */}
                    <div className="flex justify-between items-center">
                      <ControlButton
                        onClick={drillState.reset}
                        title="Reset to start"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </ControlButton>
                      <div className="flex gap-2">
                        <ControlButton
                          onClick={drillState.goBack}
                          disabled={!drillState.canGoBack}
                          title="Previous step"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </ControlButton>
                        <ControlButton
                          onClick={drillState.goForward}
                          disabled={!drillState.canGoForward}
                          title={
                            drillState.availableNextNodes.length > 1
                              ? "Click diagram to choose path"
                              : "Next step"
                          }
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
                    <div className="bg-surface-light rounded-lg p-3">
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-text">
                            Step {drillState.path.length}
                          </span>
                          <span className="text-xs text-text-subtle">
                            Path: {drillState.path.length} shot
                            {drillState.path.length !== 1 ? "s" : ""}
                          </span>
                        </div>

                        {ballSequence.nodes[drillState.nodeId] && (
                          <div className="grid grid-cols-2 gap-2 text-xs text-text-subtle">
                            <div>
                              <strong>Shot:</strong> {drillState.nodeId}
                            </div>
                            <div>
                              <strong>Player:</strong>{" "}
                              {ballSequence.nodes[drillState.nodeId]?.ball
                                .isOpponent
                                ? "Opponent"
                                : "Player"}
                            </div>
                            <div>
                              <strong>Stroke:</strong>{" "}
                              {
                                ballSequence.nodes[drillState.nodeId]?.ball
                                  .stroke
                              }
                            </div>
                            <div>
                              <strong>Spin:</strong>{" "}
                              {ballSequence.nodes[drillState.nodeId]?.ball.spin}
                            </div>
                            <div className="col-span-2">
                              <strong>Placement:</strong>{" "}
                              {
                                ballSequence.nodes[drillState.nodeId]?.ball
                                  .placement.direction
                              }{" "}
                              {
                                ballSequence.nodes[drillState.nodeId]?.ball
                                  .placement.depth
                              }
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Next Options */}
                      {drillState.availableNextNodes.length > 1 && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <div className="text-xs text-text-subtle mb-1">
                            <strong>Next options:</strong>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {drillState.availableNextNodes.map((node, i) => (
                              <span key={node.id} className="text-xs">
                                <span className="bg-primary/20 text-primary px-2 py-1 rounded">
                                  {node.ball.placement.depth}{" "}
                                  {node.ball.placement.direction}
                                </span>
                                {i <
                                  drillState.availableNextNodes.length - 1 && (
                                  <span className="text-text-muted mx-1">
                                    or
                                  </span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-text-subtle">
                    <div className="space-y-2">
                      <Play className="w-8 h-8 mx-auto text-text-muted" />
                      <p>Start building your drill sequence</p>
                      <p className="text-xs">
                        Create shots to see the interactive preview with
                        stepping controls
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Preview Button (mobile/tablet only) */}
        {previewDrill && (
          <button
            onClick={() => setShowPreviewModal(true)}
            className="xl:hidden fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary-dark transition-colors z-40"
            aria-label="Preview drill"
          >
            <Eye className="w-6 h-6" />
          </button>
        )}

        {/* Preview Modal (mobile/tablet only) */}
        {showPreviewModal && previewDrill && (
          <div
            className="xl:hidden fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            onClick={() => setShowPreviewModal(false)}
          >
            <div
              className="bg-surface border border-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-200 ease-out"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-xl font-semibold text-text">
                  Drill Preview
                </h2>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="p-2 hover:bg-surface-light rounded-lg transition-colors"
                  aria-label="Close preview"
                >
                  <X className="w-5 h-5 text-text" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Interactive Diagram */}
                  <div className="flex flex-col items-center space-y-4">
                    {/* Interactive Controls */}
                    <div className="flex justify-between items-center w-full max-w-sm">
                      <ControlButton
                        onClick={drillState.reset}
                        title="Reset to start"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </ControlButton>
                      <div className="flex gap-2">
                        <ControlButton
                          onClick={drillState.goBack}
                          disabled={!drillState.canGoBack}
                          title="Previous step"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </ControlButton>
                        <ControlButton
                          onClick={drillState.goForward}
                          disabled={!drillState.canGoForward}
                          title={
                            drillState.availableNextNodes.length > 1
                              ? "Click diagram to choose path"
                              : "Next step"
                          }
                        >
                          <ChevronRight className="w-4 h-4" />
                        </ControlButton>
                      </div>
                    </div>

                    {/* Diagram */}
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
                          height={360}
                          width={200}
                          selectingNextNode={drillState.selectingNextNode}
                          availableNextNodes={drillState.availableNextNodes}
                          goToNextNodeOption={drillState.goToNextNodeOption}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step Information */}
                  <div className="space-y-4">
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

                        {ballSequence.nodes[drillState.nodeId] && (
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="font-medium text-text">
                                Shot:
                              </span>
                              <div className="text-text-subtle">
                                {drillState.nodeId}
                              </div>
                            </div>
                            <div>
                              <span className="font-medium text-text">
                                Player:
                              </span>
                              <div className="text-text-subtle">
                                {ballSequence.nodes[drillState.nodeId]?.ball
                                  .isOpponent
                                  ? "Opponent"
                                  : "Player"}
                              </div>
                            </div>
                            <div>
                              <span className="font-medium text-text">
                                Stroke:
                              </span>
                              <div className="text-text-subtle">
                                {
                                  ballSequence.nodes[drillState.nodeId]?.ball
                                    .stroke
                                }
                              </div>
                            </div>
                            <div>
                              <span className="font-medium text-text">
                                Spin:
                              </span>
                              <div className="text-text-subtle">
                                {
                                  ballSequence.nodes[drillState.nodeId]?.ball
                                    .spin
                                }
                              </div>
                            </div>
                            <div className="col-span-2">
                              <span className="font-medium text-text">
                                Placement:
                              </span>
                              <div className="text-text-subtle">
                                {
                                  ballSequence.nodes[drillState.nodeId]?.ball
                                    .placement.direction
                                }{" "}
                                {
                                  ballSequence.nodes[drillState.nodeId]?.ball
                                    .placement.depth
                                }
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Next Options */}
                    {drillState.availableNextNodes.length > 1 && (
                      <div className="bg-surface-light rounded-lg p-4">
                        <div className="text-sm">
                          <div className="font-medium text-text mb-2">
                            Next options:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {drillState.availableNextNodes.map((node, i) => (
                              <span key={node.id} className="text-sm">
                                <span className="bg-primary/20 text-primary px-3 py-1 rounded-full">
                                  {node.ball.placement.depth}{" "}
                                  {node.ball.placement.direction}
                                </span>
                                {i <
                                  drillState.availableNextNodes.length - 1 && (
                                  <span className="text-text-muted mx-2">
                                    or
                                  </span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Instructions */}
                    <div className="bg-surface-light rounded-lg p-4">
                      <div className="text-sm text-text-subtle">
                        <p className="font-medium text-text mb-1">
                          How to use:
                        </p>
                        <ul className="space-y-1 text-xs">
                          <li>• Use arrow buttons to step through the drill</li>
                          <li>
                            • Click the diagram when multiple options appear
                          </li>
                          <li>• Reset button returns to the beginning</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Main>
  );
}

"use client";

import { ControlButton } from "@/components/ControlButton";
import { DrillDiagram } from "@/components/DrillDiagram/DrillDiagram";
import { difficultyDisplay, categoryDisplay } from "@/data";
import { useDrillState } from "@/hooks/useDrillState";
import { Drill } from "@/types";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Clock,
  Target,
  Lightbulb,
  Play,
} from "lucide-react";
import Link from "next/link";

const DIAGRAM_HEIGHT = 320;
const DIAGRAM_WIDTH = 180;

type Props = {
  drill: Drill;
};

export const DrillCard = ({ drill }: Props) => {
  const {
    nodeId,
    availableNextNodes,
    selectingNextNode,
    reset,
    canGoBack,
    goBack,
    canGoForward,
    goForward,
    goToNextNodeOption,
  } = useDrillState({ drill });

  return (
    <div className="shadow-lg p-6 rounded-lg bg-surface border border-border w-full flex flex-col hover:border-primary-light transition-colors">
      {/* Header with title and metadata */}
      <div className="flex-shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="font-semibold text-lg text-text">
            <Link
              href={`/drills/${drill.slug}`}
              className="hover:text-primary-light transition-colors"
            >
              {drill.name}
            </Link>
          </h2>
          {drill.videoUrl && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-danger text-white text-xs font-medium">
              <Play className="w-3 h-3" />
              <span>Video</span>
            </div>
          )}
        </div>

        {/* Difficulty and categories */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <div
            className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${
              drill.difficulty === "beginner"
                ? "bg-success text-white border-success"
                : drill.difficulty === "intermediate"
                ? "bg-warning text-white border-warning"
                : "bg-danger text-white border-danger"
            }`}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
            <span>{difficultyDisplay[drill.difficulty]}</span>
          </div>
          {drill.categories.slice(0, 2).map((category) => (
            <span
              key={category}
              className="text-xs bg-primary text-white px-2 py-1 rounded-full font-medium border border-primary"
            >
              {categoryDisplay[category]}
            </span>
          ))}
          {drill.categories.length > 2 && (
            <span className="text-xs bg-surface-light text-text-muted px-2 py-1 rounded-full font-medium border border-border">
              +{drill.categories.length - 2} more
            </span>
          )}
        </div>

        {/* Duration */}
        {drill.duration && (
          <div className="flex items-center gap-2 text-sm text-text-muted mb-2">
            <Clock className="w-4 h-4" />
            <span>{drill.duration}</span>
          </div>
        )}

        {/* Description */}
        {drill.description && (
          <p className="text-sm text-text-muted mb-3 line-clamp-2">
            {drill.description}
          </p>
        )}
      </div>

      {/* Drill diagram - fixed position */}
      <div className="flex-shrink-0 mx-auto mb-4">
        <DrillDiagram
          drill={drill}
          nodeId={nodeId}
          selectingNextNode={selectingNextNode}
          availableNextNodes={availableNextNodes}
          goToNextNodeOption={goToNextNodeOption}
          height={DIAGRAM_HEIGHT}
          width={DIAGRAM_WIDTH}
        />
      </div>

      {/* Controls */}
      <div className="flex-shrink-0 flex justify-between gap-2 mb-4">
        <ControlButton onClick={reset}>
          <RotateCcw />
        </ControlButton>
        <div className="flex justify-center">
          <ControlButton onClick={goBack} disabled={!canGoBack}>
            <ChevronLeft />
          </ControlButton>
          <ControlButton onClick={goForward} disabled={!canGoForward}>
            <ChevronRight />
          </ControlButton>
        </div>
      </div>

      {/* Additional metadata - grows to fill remaining space */}
      <div className="flex-grow space-y-2 text-sm overflow-hidden">
        {/* Objectives */}
        {drill.objectives &&
          drill.objectives.length > 0 &&
          drill.objectives[0] && (
            <div className="flex items-start gap-2 min-h-0">
              <Target className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="font-medium text-text">Objective:</span>
                <p className="text-text-muted line-clamp-2 break-words">
                  {drill.objectives[0]}
                </p>
              </div>
            </div>
          )}

        {/* Tips */}
        {drill.tips && drill.tips.length > 0 && drill.tips[0] && (
          <div className="flex items-start gap-2 min-h-0">
            <Lightbulb className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="font-medium text-text">Tip:</span>
              <p className="text-text-muted line-clamp-2 break-words">
                {drill.tips[0]}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

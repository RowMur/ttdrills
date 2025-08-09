"use client";

import { ControlButton } from "@/components/ControlButton";
import { DrillDiagram } from "@/components/DrillDiagram/DrillDiagram";
import { difficultyDisplay, categoryDisplay } from "@/data";
import { useDrillState } from "@/hooks/useDrillState";
import { Drill } from "@/types";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import Link from "next/link";

const DIAGRAM_HEIGHT = 360;
const DIAGRAM_WIDTH = 200;

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
    <div className="shadow-lg p-4 rounded-lg bg-grey w-[232px] flex flex-col">
      <div className="mb-2 flex flex-col grow">
        <h2 className="font-semibold text-wrap grow">
          <Link href={`/drills/${drill.slug}`} className="hover:underline">
            {drill.name}
          </Link>
        </h2>

        {/* Difficulty and primary category */}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <div
            className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${
              drill.difficulty === "beginner"
                ? "bg-green text-white border-green"
                : drill.difficulty === "intermediate"
                ? "bg-light-grey text-white border-light-grey"
                : "bg-red text-white border-red"
            }`}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
            <span>{difficultyDisplay[drill.difficulty]}</span>
          </div>
          {drill.categories[0] && (
            <span className="text-xs bg-table-blue text-white px-2 py-1 rounded-full font-medium border border-table-blue">
              {categoryDisplay[drill.categories[0]]}
            </span>
          )}
        </div>
      </div>

      <div className="mx-auto">
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
      <div className="flex justify-between gap-2 mt-4">
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
    </div>
  );
};

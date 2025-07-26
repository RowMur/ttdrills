"use client";

import { ControlButton } from "@/components/ControlButton";
import { DrillDiagram } from "@/components/DrillDiagram/DrillDiagram";
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
    goToNode,
  } = useDrillState({ drill });

  return (
    <div className="shadow-lg p-4 rounded-lg bg-grey w-[232px] flex flex-col">
      <h2 className="font-semibold mb-2 text-wrap grow">
        <Link href={`/drills/${drill.slug}`} className="hover:underline">
          {drill.name}
        </Link>
      </h2>
      <DrillDiagram
        drill={drill}
        nodeId={nodeId}
        selectingNextNode={selectingNextNode}
        availableNextNodes={availableNextNodes}
        goToNode={goToNode}
        height={DIAGRAM_HEIGHT}
        width={DIAGRAM_WIDTH}
      />
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

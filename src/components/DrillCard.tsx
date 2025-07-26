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
      <div className={`relative w-fit mx-auto`}>
        <DrillDiagram
          drill={drill}
          nodeId={nodeId}
          height={DIAGRAM_HEIGHT}
          width={DIAGRAM_WIDTH}
        />
        {selectingNextNode && (
          <div className="absolute left-0 top-0 size-full bg-slate opacity-80 grid place-items-center">
            {availableNextNodes.map((nextNode) => (
              <ControlButton
                key={nextNode.id}
                onClick={() => {
                  goToNode(nextNode.id);
                }}
              >
                {nextNode.ball.placement.direction}{" "}
                {nextNode.ball.placement.depth}
              </ControlButton>
            ))}
          </div>
        )}
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

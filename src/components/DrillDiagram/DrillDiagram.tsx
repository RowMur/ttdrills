"use client";

import { ControlButton } from "@/components/ControlButton";
import { DrillView } from "@/components/DrillDiagram/DrillView";
import { Drill, Node } from "@/types";

type Props = {
  drill: Drill;
  nodeId: string;
  selectingNextNode: boolean;
  availableNextNodes: Node[];
  goToNextNodeOption: (nodeId: string) => void;
  height: number;
  width: number;
};

export const DrillDiagram = ({
  drill,
  nodeId,
  selectingNextNode,
  availableNextNodes,
  goToNextNodeOption,
  height,
  width,
}: Props) => {
  return (
    <div className={`relative w-fit`}>
      <DrillView drill={drill} nodeId={nodeId} height={height} width={width} />
      {selectingNextNode && (
        <div className="absolute left-0 top-0 size-full bg-slate opacity-80 grid place-items-center">
          {availableNextNodes.map((nextNode) => {
            return (
              <ControlButton
                key={nextNode.id}
                onClick={() => {
                  goToNextNodeOption(nextNode.id);
                }}
              >
                {nextNode.id}
              </ControlButton>
            );
          })}
        </div>
      )}
    </div>
  );
};

import { ControlButton } from "@/components/ControlButton";
import { DrillDiagram } from "@/components/DrillDiagram/DrillDiagram";
import { Drill } from "@/types";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useState } from "react";

type Props = {
  drill: Drill;
};

export const DrillCard = ({ drill }: Props) => {
  const [nodeId, setNodeId] = useState(drill.graph.entryPoint);

  let hasNext = true;
  const nextNodeId = drill.graph.nodes[nodeId].next?.[0];
  if (nextNodeId === undefined) {
    hasNext = false;
  } else {
    const nextNode = drill.graph.nodes[nextNodeId];
    if (nextNode.next === null) {
      // If the next node has no next nodes, stay on the current node as last node is just for placement
      hasNext = false;
    }
  }

  const prevNodeId = drill.graph.nodes[nodeId].prev?.[0];

  return (
    <div className="shadow-lg p-4 rounded-lg bg-grey">
      <h2 className="font-semibold mb-2 text-wrap">{drill.name}</h2>
      {/* TODO: Find some way to dynamically check if it's continuous */}
      {/* <div className="flex flex-wrap gap-2 mb-4">
        <Tag text={drill.loopBehavior} />
      </div> */}
      <DrillDiagram drill={drill} nodeId={nodeId} />
      <div className="flex justify-between gap-2 mt-4">
        <ControlButton onClick={() => setNodeId(drill.graph.entryPoint)}>
          <RotateCcw />
        </ControlButton>
        <div className="flex justify-center">
          <ControlButton
            onClick={prevNodeId ? () => setNodeId(prevNodeId) : undefined}
            disabled={!prevNodeId}
          >
            <ChevronLeft />
          </ControlButton>
          <ControlButton
            onClick={nextNodeId ? () => setNodeId(nextNodeId) : undefined}
            disabled={!hasNext}
          >
            <ChevronRight />
          </ControlButton>
        </div>
      </div>
    </div>
  );
};

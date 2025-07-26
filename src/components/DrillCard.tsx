"use client";

import { ControlButton } from "@/components/ControlButton";
import { DrillDiagram } from "@/components/DrillDiagram/DrillDiagram";
import { Drill, Node } from "@/types";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useState } from "react";

const DIAGRAM_HEIGHT = 360;
const DIAGRAM_WIDTH = 200;

type Props = {
  drill: Drill;
};

export const DrillCard = ({ drill }: Props) => {
  const [nodeId, setNodeId] = useState(drill.graph.entryPoint);
  const [selectingNextNode, setSelectingNextNode] = useState(false);

  let hasNext = true;
  const nextNodeIds = drill.graph.nodes[nodeId].next;
  const availableNextNodes: Node[] | undefined = [];
  if (!nextNodeIds) {
    hasNext = false;
  } else {
    for (const nextNodeId of nextNodeIds) {
      const nextNode = drill.graph.nodes[nextNodeId];
      if (nextNode?.next && nextNode.next !== null) {
        availableNextNodes.push(nextNode);
      }
    }
    if (availableNextNodes.length <= 0) {
      // If the next node has no next nodes, stay on the current node as last node is just for placement
      hasNext = false;
    }
  }

  const prevNodeId = drill.graph.nodes[nodeId].prev?.[0];

  return (
    <div className="shadow-lg p-4 rounded-lg bg-grey w-[232px] flex flex-col">
      <h2 className="font-semibold mb-2 text-wrap grow">{drill.name}</h2>
      {/* TODO: Find some way to dynamically check if it's continuous */}
      {/* <div className="flex flex-wrap gap-2 mb-4">
        <Tag text={drill.loopBehavior} />
      </div> */}
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
                  setNodeId(nextNode.id);
                  setSelectingNextNode(false);
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
        <ControlButton
          onClick={() => {
            setSelectingNextNode(false);
            setNodeId(drill.graph.entryPoint);
          }}
        >
          <RotateCcw />
        </ControlButton>
        <div className="flex justify-center">
          <ControlButton
            onClick={
              prevNodeId
                ? () => {
                    setNodeId(prevNodeId);
                    setSelectingNextNode(false);
                  }
                : undefined
            }
            disabled={!prevNodeId}
          >
            <ChevronLeft />
          </ControlButton>
          <ControlButton
            onClick={
              availableNextNodes?.length === 1
                ? () => {
                    setSelectingNextNode(false);
                    setNodeId(availableNextNodes[0].id);
                  }
                : () => setSelectingNextNode(true)
            }
            disabled={!hasNext}
          >
            <ChevronRight />
          </ControlButton>
        </div>
      </div>
    </div>
  );
};

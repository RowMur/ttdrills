"use client";

import { NodeTD } from "@/app/drills/[drill]/_components/NodeTD";
import { ControlButton } from "@/components/ControlButton";
import { DrillDiagram } from "@/components/DrillDiagram/DrillDiagram";
import { useDrillState } from "@/hooks/useDrillState";
import { Drill, Node } from "@/types";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useMemo } from "react";

const DIAGRAM_HEIGHT = 360;
const DIAGRAM_WIDTH = 200;

type Props = {
  drill: Drill;
};

export const DiagramSection = ({ drill }: Props) => {
  const {
    nodeId,
    availableNextNodes,
    selectingNextNode,
    goToNode,
    reset,
    goBack,
    canGoBack,
    goForward,
    canGoForward,
  } = useDrillState({ drill });

  const steps = useMemo(() => getSteps(drill), [drill]);

  return (
    <div className="my-4 flex items-stretch gap-4 flex-col sm:flex-row">
      <div className="mx-auto">
        <DrillDiagram
          drill={drill}
          nodeId={nodeId}
          height={DIAGRAM_HEIGHT}
          width={DIAGRAM_WIDTH}
          selectingNextNode={selectingNextNode}
          availableNextNodes={availableNextNodes}
          goToNode={goToNode}
        />
      </div>
      <div className="grow bg-grey rounded flex flex-col p-4 gap-4">
        <div className="flex justify-between items-end gap-2">
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
        <div className="grow">
          <table className="w-full">
            <tbody>
              {steps.map(([playerNode, opponentNode], index) => (
                <tr key={playerNode?.id + "-" + opponentNode?.id}>
                  <td>{index + 1}.</td>
                  <NodeTD
                    node={playerNode}
                    isActive={playerNode?.id === nodeId}
                  />
                  <NodeTD
                    node={opponentNode}
                    isActive={opponentNode?.id === nodeId}
                  />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

type Step = [Node | null, Node | null];

const getSteps = (drill: Drill) => {
  const firstNode = drill.graph.nodes[drill.graph.entryPoint];
  if (!firstNode) return [];

  const steps: Step[] = [];
  let currentStep: Step = [null, null];
  let currentNode: Node | null = firstNode;
  while (currentNode) {
    if (!currentNode) {
      break;
    }

    if (currentStep[0] && currentStep[1]) {
      steps.push(currentStep);
      currentStep = [null, null];
    }

    if (currentNode.ball.isOpponent) {
      currentStep[1] = currentNode;
    } else {
      currentStep[0] = currentNode;
    }

    const nextNodeId: string | undefined = currentNode.next?.[0];
    if (nextNodeId === drill.graph.entryPoint) {
      break;
    }
    currentNode = nextNodeId ? drill.graph.nodes[nextNodeId] : null;
  }

  if (currentStep[0] || currentStep[1]) {
    steps.push(currentStep);
  }

  return steps;
};

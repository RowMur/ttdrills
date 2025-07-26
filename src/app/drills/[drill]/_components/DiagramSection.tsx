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
    path,
    availableNextNodes,
    selectingNextNode,
    reset,
    goBack,
    canGoBack,
    goForward,
    canGoForward,
    goToNextNodeOption,
  } = useDrillState({ drill });

  const paths = useMemo(() => getDrillPaths(drill), [drill]);
  console.log("Path:", path);
  const currentValidPaths = [];
  for (const pathOption of paths) {
    for (let i = 0; i < path.length; i++) {
      if (pathOption[i] !== path[i]) {
        break;
      }
      if (i === path.length - 1) {
        currentValidPaths.push(pathOption);
      }
    }
  }

  const longestCommonPath = getLongestCommonPath(currentValidPaths);
  const longestCommonPathNodes = longestCommonPath.map(
    (nodeId) => drill.graph.nodes[nodeId]
  );

  const finalInLongestPath =
    longestCommonPathNodes[longestCommonPathNodes.length - 1];
  const potentialNextNodes = finalInLongestPath.next?.map(
    (nodeId) => drill.graph.nodes[nodeId]
  );

  const steps = groupIntoSteps(longestCommonPathNodes);

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
          goToNextNodeOption={goToNextNodeOption}
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
          {potentialNextNodes && potentialNextNodes?.length > 1 && (
            <div className="justify-center flex mt-4 gap-2">
              {potentialNextNodes.map((node, i) => (
                <>
                  <span className="text-xs text-slate-500" key={node.id}>
                    {node.ball.placement.depth} {node.ball.placement.direction}
                  </span>
                  <span className="text-xs text-slate-500">
                    {i < potentialNextNodes.length - 1 ? "or" : ""}
                  </span>
                </>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

type Step = [Node | null, Node | null];

const getDrillPaths = (drill: Drill) => {
  const paths: string[][] = [];

  const traverse = (nodeId: string, path: string[], exitId: string) => {
    const node = drill.graph.nodes[nodeId];
    if (!node) return;

    if (nodeId === exitId && path.length > 0) {
      paths.push(path);
      return;
    }
    path.push(nodeId);

    if (node.next && node.next.length > 0) {
      for (const nextNodeId of node.next) {
        traverse(nextNodeId, [...path], exitId);
      }
    } else {
      paths.push(path);
    }
  };

  traverse(drill.graph.entryPoint, [], drill.graph.entryPoint);
  return paths;
};

const groupIntoSteps = (nodes: Node[]) => {
  const steps: Step[] = [];
  let currentStep: Step = [null, null];

  for (const node of nodes) {
    if (node.ball.isOpponent) {
      currentStep[1] = node;
    } else {
      currentStep[0] = node;
    }

    if (currentStep[1]) {
      steps.push(currentStep);
      currentStep = [null, null];
    }
  }

  if (currentStep[0] || currentStep[1]) {
    steps.push(currentStep);
  }

  return steps;
};

const getLongestCommonPath = (paths: string[][]) => {
  if (paths.length === 0) return [];

  const minLength = Math.min(...paths.map((p) => p.length));
  const longestPath: string[] = [];

  for (let i = 0; i < minLength; i++) {
    const currentNode = paths[0][i];
    if (paths.every((p) => p[i] === currentNode)) {
      longestPath.push(currentNode);
    } else {
      break;
    }
  }

  return longestPath;
};

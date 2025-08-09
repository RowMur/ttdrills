import { Drill, Node } from "@/types";
import { isPlaceholderPositioningNode } from "@/utils/isPlaceholderPositioningNode";
import { useCallback, useMemo, useState } from "react";

type Input = {
  drill: Drill;
};

export const useDrillState = (input: Input) => {
  const { drill } = input;

  const [path, setPath] = useState([drill.graph.entryPoint]);
  const nodeId = path[path.length - 1];
  const [selectingNextNode, setSelectingNextNode] = useState(false);

  const availableNextNodes: Node[] = useMemo(() => {
    console.log("nodeId", nodeId);
    console.log("drill.graph.nodes", drill.graph.nodes);
    const nextNodeIds = drill.graph.nodes[nodeId].next;
    if (!nextNodeIds || nextNodeIds.length === 0) {
      return [];
    }

    const availableNextNodes: Node[] | undefined = [];
    for (const nextNodeId of nextNodeIds) {
      const nextNode = drill.graph.nodes[nextNodeId];
      if (!isPlaceholderPositioningNode(nextNode)) {
        availableNextNodes.push(nextNode);
      }
    }

    return availableNextNodes;
  }, [drill.graph.nodes, nodeId]);

  const reset = useCallback(() => {
    setPath([drill.graph.entryPoint]);
    setSelectingNextNode(false);
  }, [drill.graph.entryPoint]);

  const canGoBack = path.length > 1;
  const goBack = useCallback(() => {
    if (canGoBack) {
      setPath((prev) => [...prev.slice(0, -1)]);
      setSelectingNextNode(false);
    }
  }, [canGoBack]);

  const canGoForward = availableNextNodes.length > 0;
  const goForward = useCallback(() => {
    if (!canGoForward) return;

    if (availableNextNodes?.length === 1) {
      setSelectingNextNode(false);
      const nextNodeId = availableNextNodes[0].id;
      if (nextNodeId === drill.graph.entryPoint) {
        reset();
        return;
      }
      setPath((prev) => [...prev, availableNextNodes[0].id]);
    } else {
      setSelectingNextNode(true);
    }
  }, [availableNextNodes, canGoForward, reset, drill.graph.entryPoint]);

  const goToNextNodeOption = useCallback(
    (nodeId: string) => {
      if (availableNextNodes.find((n) => n.id === nodeId)) {
        setSelectingNextNode(false);
        if (nodeId === drill.graph.entryPoint) {
          reset();
          return;
        }
        setPath((prev) => [...prev, nodeId]);
      } else {
        console.warn(`Node ID ${nodeId} is not in available next nodes.`);
      }
    },
    [availableNextNodes, drill.graph.entryPoint, reset]
  );

  return {
    nodeId,
    path,
    reset,
    canGoBack,
    goBack,
    canGoForward,
    goForward,
    availableNextNodes,
    selectingNextNode,
    goToNextNodeOption,
  };
};

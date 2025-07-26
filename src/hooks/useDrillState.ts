import { Drill, Node } from "@/types";
import { useCallback, useMemo, useState } from "react";

type Input = {
  drill: Drill;
};

export const useDrillState = (input: Input) => {
  const { drill } = input;

  const [nodeId, setNodeId] = useState(drill.graph.entryPoint);
  const [selectingNextNode, setSelectingNextNode] = useState(false);

  const availableNextNodes: Node[] = useMemo(() => {
    const nextNodeIds = drill.graph.nodes[nodeId].next;
    if (!nextNodeIds || nextNodeIds.length === 0) {
      return [];
    }

    const availableNextNodes: Node[] | undefined = [];
    for (const nextNodeId of nextNodeIds) {
      const nextNode = drill.graph.nodes[nextNodeId];
      if (nextNode?.next && nextNode.next !== null) {
        availableNextNodes.push(nextNode);
      }
    }

    return availableNextNodes;
  }, [drill.graph.nodes, nodeId]);

  const prevNodeId = drill.graph.nodes[nodeId].prev?.[0];

  const reset = useCallback(() => {
    setNodeId(drill.graph.entryPoint);
    setSelectingNextNode(false);
  }, [drill.graph.entryPoint]);

  const canGoBack = !!prevNodeId;
  const goBack = useCallback(() => {
    if (canGoBack) {
      setNodeId(prevNodeId);
      setSelectingNextNode(false);
    }
  }, [prevNodeId, canGoBack]);

  const canGoForward = availableNextNodes.length > 0;
  const goForward = useCallback(() => {
    if (!canGoForward) return;

    if (availableNextNodes?.length === 1) {
      setSelectingNextNode(false);
      setNodeId(availableNextNodes[0].id);
    } else {
      setSelectingNextNode(true);
    }
  }, [availableNextNodes, canGoForward]);

  const goToNode = useCallback((nodeId: string) => {
    setNodeId(nodeId);
    setSelectingNextNode(false);
  }, []);

  return {
    nodeId,
    reset,
    canGoBack,
    goBack,
    canGoForward,
    goForward,
    availableNextNodes,
    selectingNextNode,
    goToNode,
  };
};

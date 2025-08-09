"use client";

import { useState, useEffect } from "react";
import { StepGraph, Node, ShotType, Spin, Placement } from "@/types";
import { shotTypeDisplay, spinDisplay } from "@/data";
import { Plus, X, ArrowRight } from "lucide-react";

type Props = {
  sequence: StepGraph;
  onChange: (sequence: StepGraph) => void;
};

type NodeFormData = {
  id: string;
  stroke: ShotType;
  spin: Spin;
  depth: Placement["depth"];
  direction: Placement["direction"];
  isOpponent: boolean;
  prev: string[];
  next: string[];
};

export const DrillFormSequence = ({ onChange }: Props) => {
  const [nodes, setNodes] = useState<NodeFormData[]>(() => {
    // Start with one default shot
    const initialNode: NodeFormData = {
      id: "shot1",
      stroke: "forehand",
      spin: "top",
      depth: "long",
      direction: "forehand",
      isOpponent: false,
      prev: [],
      next: [],
    };
    return [initialNode];
  });
  const [entryPoint, setEntryPoint] = useState("shot1");

  // Initialize the sequence with the default shot
  useEffect(() => {
    updateSequence(nodes, entryPoint);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  const recalculatePlayerAssignments = (nodeList: NodeFormData[]) => {
    const updatedNodes = [...nodeList];

    // Find the entry point (should be shot1)
    const entryNode = updatedNodes.find((node) => node.id === entryPoint);
    if (!entryNode) return updatedNodes;

    // Start with entry point as player
    entryNode.isOpponent = false;

    // Use BFS to assign players based on sequence depth
    const visited = new Set<string>();
    const queue: Array<{ node: NodeFormData; depth: number }> = [
      { node: entryNode, depth: 0 },
    ];
    visited.add(entryNode.id);

    while (queue.length > 0) {
      const { node, depth } = queue.shift()!;

      // Assign player based on depth: even depth = player, odd depth = opponent
      node.isOpponent = depth % 2 === 1;

      // Add next nodes to queue
      node.next.forEach((nextId) => {
        const nextNode = updatedNodes.find((n) => n.id === nextId);
        if (nextNode && !visited.has(nextId)) {
          visited.add(nextId);
          queue.push({ node: nextNode, depth: depth + 1 });
        }
      });
    }

    return updatedNodes;
  };

  const addNextShot = (currentIndex: number) => {
    const newId = `shot${nodes.length + 1}`;
    const currentNode = nodes[currentIndex];

    const newNode: NodeFormData = {
      id: newId,
      stroke: "forehand",
      spin: "top",
      depth: "long",
      direction: "forehand",
      isOpponent: !currentNode.isOpponent, // Automatically alternate between player and opponent
      prev: [currentNode.id],
      next: [],
    };

    // Update the current node to connect to the new node
    const updatedNodes = [...nodes];
    updatedNodes[currentIndex] = {
      ...currentNode,
      next: [...currentNode.next, newId],
    };

    const finalNodes = recalculatePlayerAssignments([...updatedNodes, newNode]);
    setNodes(finalNodes);
    updateSequence(finalNodes, entryPoint);
  };

  const removeNode = (index: number) => {
    // Don't allow removing the last shot
    if (nodes.length <= 1) {
      return;
    }

    const nodeToRemove = nodes[index];
    const updatedNodes = nodes.filter((_, i) => i !== index);

    // Update connections
    updatedNodes.forEach((node) => {
      node.prev = node.prev.filter((id) => id !== nodeToRemove.id);
      node.next = node.next.filter((id) => id !== nodeToRemove.id);
    });

    // Recalculate player assignments to maintain alternating pattern
    const finalNodes = recalculatePlayerAssignments(updatedNodes);
    setNodes(finalNodes);

    if (entryPoint === nodeToRemove.id) {
      setEntryPoint(updatedNodes.length > 0 ? updatedNodes[0].id : "");
    }

    updateSequence(
      finalNodes,
      entryPoint === nodeToRemove.id
        ? finalNodes.length > 0
          ? finalNodes[0].id
          : ""
        : entryPoint
    );
  };

  const updateNode = (
    index: number,
    field: keyof NodeFormData,
    value:
      | string
      | string[]
      | boolean
      | ShotType
      | Spin
      | Placement["depth"]
      | Placement["direction"]
  ) => {
    const updatedNodes = [...nodes];
    updatedNodes[index] = { ...updatedNodes[index], [field]: value };
    setNodes(updatedNodes);
    updateSequence(updatedNodes, entryPoint);
  };

  const updateSequence = (nodeList: NodeFormData[], entry: string) => {
    const graphNodes: Record<string, Node> = {};

    nodeList.forEach((nodeData) => {
      graphNodes[nodeData.id] = {
        id: nodeData.id,
        prev:
          nodeData.prev.length > 0
            ? nodeData.prev
            : nodeData.id === entry
            ? null
            : [],
        next: nodeData.next.length > 0 ? nodeData.next : [],
        ball: {
          stroke: nodeData.stroke,
          spin: nodeData.spin,
          placement: {
            depth: nodeData.depth,
            direction: nodeData.direction,
          },
          isOpponent: nodeData.isOpponent,
        },
      };
    });

    onChange({
      entryPoint: entry,
      nodes: graphNodes,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-text-muted text-sm">
          Create the sequence of shots in your drill. Use &quot;Add Next
          Shot&quot; to extend the sequence.
        </p>
      </div>

      <div className="space-y-4">
        {nodes.map((node, index) => (
          <div
            key={node.id}
            className="bg-surface-light rounded-lg p-4 border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-text">
                  Shot {index + 1}: {node.id}
                  {node.id === entryPoint && (
                    <span className="ml-2 px-2 py-1 bg-success text-white text-xs rounded">
                      START
                    </span>
                  )}
                </h3>
                <span
                  className={`px-2 py-1 text-xs rounded border ${
                    node.isOpponent
                      ? "bg-warning text-white border-warning"
                      : "bg-primary text-white border-primary"
                  }`}
                >
                  {node.isOpponent ? "Opponent" : "Player"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeNode(index)}
                disabled={nodes.length <= 1}
                className={`p-2 rounded-lg ${
                  nodes.length <= 1
                    ? "bg-text-subtle text-text-muted cursor-not-allowed"
                    : "bg-danger text-white hover:bg-danger-dark"
                }`}
                title={
                  nodes.length <= 1
                    ? "Cannot remove the last shot"
                    : "Remove shot"
                }
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-4 mb-4">
              {/* Stroke */}
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Stroke
                </label>
                <select
                  value={node.stroke}
                  onChange={(e) =>
                    updateNode(index, "stroke", e.target.value as ShotType)
                  }
                  className="w-full p-2 rounded-lg bg-surface text-text border border-border focus:border-primary focus:outline-none"
                >
                  {(Object.keys(shotTypeDisplay) as ShotType[]).map(
                    (stroke) => (
                      <option key={stroke} value={stroke}>
                        {shotTypeDisplay[stroke]}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Spin */}
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Spin
                </label>
                <select
                  value={node.spin}
                  onChange={(e) =>
                    updateNode(index, "spin", e.target.value as Spin)
                  }
                  className="w-full p-2 rounded-lg bg-surface text-text border border-border focus:border-primary focus:outline-none"
                >
                  {(Object.keys(spinDisplay) as Spin[]).map((spin) => (
                    <option key={spin} value={spin}>
                      {spinDisplay[spin]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Direction */}
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  From
                </label>
                <select
                  value={node.direction}
                  onChange={(e) =>
                    updateNode(
                      index,
                      "direction",
                      e.target.value as Placement["direction"]
                    )
                  }
                  className="w-full p-2 rounded-lg bg-surface text-text border border-border focus:border-primary focus:outline-none"
                >
                  <option value="backhand">Backhand</option>
                  <option value="middle">Middle</option>
                  <option value="forehand">Forehand</option>
                </select>
              </div>

              {/* Depth */}
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Depth (from)
                </label>
                <select
                  value={node.depth}
                  onChange={(e) =>
                    updateNode(
                      index,
                      "depth",
                      e.target.value as Placement["depth"]
                    )
                  }
                  className="w-full p-2 rounded-lg bg-surface text-text border border-border focus:border-primary focus:outline-none"
                >
                  <option value="short">Short</option>
                  <option value="halflong">Half-Long</option>
                  <option value="long">Long</option>
                </select>
              </div>
            </div>

            {/* Add Next Shot Button */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-text-subtle">
                {node.next.length > 0 ? (
                  <>
                    <ArrowRight className="w-4 h-4" />
                    <span>Connects to: {node.next.join(", ")}</span>
                  </>
                ) : (
                  <span>No next shot</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => addNextShot(index)}
                className="flex items-center gap-2 px-3 py-1 rounded-lg bg-success text-white hover:bg-success-dark text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Next Shot
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

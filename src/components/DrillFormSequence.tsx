"use client";

import { useState } from "react";
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
  const [nodes, setNodes] = useState<NodeFormData[]>([]);
  const [entryPoint, setEntryPoint] = useState("");

  const addNode = () => {
    const newId = `node${nodes.length + 1}`;
    const newNode: NodeFormData = {
      id: newId,
      stroke: "forehand",
      spin: "top",
      depth: "long",
      direction: "forehand",
      isOpponent: false,
      prev: [],
      next: [],
    };

    setNodes([...nodes, newNode]);

    if (nodes.length === 0) {
      setEntryPoint(newId);
    }
  };

  const removeNode = (index: number) => {
    const nodeToRemove = nodes[index];
    const updatedNodes = nodes.filter((_, i) => i !== index);

    // Update connections
    updatedNodes.forEach((node) => {
      node.prev = node.prev.filter((id) => id !== nodeToRemove.id);
      node.next = node.next.filter((id) => id !== nodeToRemove.id);
    });

    setNodes(updatedNodes);

    if (entryPoint === nodeToRemove.id) {
      setEntryPoint(updatedNodes.length > 0 ? updatedNodes[0].id : "");
    }

    updateSequence(
      updatedNodes,
      entryPoint === nodeToRemove.id
        ? updatedNodes.length > 0
          ? updatedNodes[0].id
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

  const addConnection = (fromIndex: number, toNodeId: string) => {
    const updatedNodes = [...nodes];
    const fromNode = updatedNodes[fromIndex];

    if (!fromNode.next.includes(toNodeId)) {
      fromNode.next.push(toNodeId);

      // Add reverse connection
      const toNodeIndex = updatedNodes.findIndex((n) => n.id === toNodeId);
      if (
        toNodeIndex !== -1 &&
        !updatedNodes[toNodeIndex].prev.includes(fromNode.id)
      ) {
        updatedNodes[toNodeIndex].prev.push(fromNode.id);
      }
    }

    setNodes(updatedNodes);
    updateSequence(updatedNodes, entryPoint);
  };

  const removeConnection = (fromIndex: number, toNodeId: string) => {
    const updatedNodes = [...nodes];
    const fromNode = updatedNodes[fromIndex];

    fromNode.next = fromNode.next.filter((id) => id !== toNodeId);

    // Remove reverse connection
    const toNodeIndex = updatedNodes.findIndex((n) => n.id === toNodeId);
    if (toNodeIndex !== -1) {
      updatedNodes[toNodeIndex].prev = updatedNodes[toNodeIndex].prev.filter(
        (id) => id !== fromNode.id
      );
    }

    setNodes(updatedNodes);
    updateSequence(updatedNodes, entryPoint);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-text-muted text-sm">
          Create the sequence of shots in your drill. Each node represents a
          ball hit by either the player or opponent.
        </p>
        <button
          type="button"
          onClick={addNode}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-success text-white hover:bg-success-dark"
        >
          <Plus className="w-4 h-4" />
          Add Shot
        </button>
      </div>

      {nodes.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-text mb-2">
            Starting Shot
          </label>
          <select
            value={entryPoint}
            onChange={(e) => {
              setEntryPoint(e.target.value);
              updateSequence(nodes, e.target.value);
            }}
            className="p-2 rounded-lg bg-surface-light text-text border border-border focus:border-primary focus:outline-none"
          >
            {nodes.map((node) => (
              <option key={node.id} value={node.id}>
                {node.id} - {shotTypeDisplay[node.stroke]} (
                {node.isOpponent ? "Opponent" : "Player"})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="space-y-4">
        {nodes.map((node, index) => (
          <div
            key={node.id}
            className="bg-surface-light rounded-lg p-4 border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text">
                Shot {index + 1}: {node.id}
                {node.id === entryPoint && (
                  <span className="ml-2 px-2 py-1 bg-success text-white text-xs rounded">
                    START
                  </span>
                )}
              </h3>
              <button
                type="button"
                onClick={() => removeNode(index)}
                className="p-2 rounded-lg bg-danger text-white hover:bg-danger-dark"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {/* Player/Opponent */}
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Player
                </label>
                <select
                  value={node.isOpponent ? "opponent" : "player"}
                  onChange={(e) =>
                    updateNode(
                      index,
                      "isOpponent",
                      e.target.value === "opponent"
                    )
                  }
                  className="w-full p-2 rounded-lg bg-surface text-text border border-border focus:border-primary focus:outline-none"
                >
                  <option value="player">Player</option>
                  <option value="opponent">Opponent</option>
                </select>
              </div>

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
                  Direction
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Depth */}
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Depth
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

              {/* Connections */}
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Next Shots
                </label>
                <div className="flex flex-wrap gap-2">
                  {nodes
                    .filter((n) => n.id !== node.id)
                    .map((targetNode) => (
                      <button
                        key={targetNode.id}
                        type="button"
                        onClick={() =>
                          node.next.includes(targetNode.id)
                            ? removeConnection(index, targetNode.id)
                            : addConnection(index, targetNode.id)
                        }
                        className={`px-2 py-1 text-xs rounded border ${
                          node.next.includes(targetNode.id)
                            ? "bg-primary border-primary text-white"
                            : "bg-transparent border-border text-text hover:border-text"
                        }`}
                      >
                        {targetNode.id}
                      </button>
                    ))}
                </div>
              </div>
            </div>

            {/* Visual connections */}
            {node.next.length > 0 && (
              <div className="mt-3 pt-3 border-t border-grey">
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <ArrowRight className="w-4 h-4" />
                  <span>Connects to: {node.next.join(", ")}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {nodes.length === 0 && (
        <div className="text-center py-8 text-text-subtle">
          <p>
            No shots created yet. Click &quot;Add Shot&quot; to start building
            your drill sequence.
          </p>
        </div>
      )}
    </div>
  );
};

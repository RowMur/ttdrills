"use client";

import { useState, useEffect } from "react";
import { StepGraph, Node, ShotType, Spin, Placement } from "@/types";
import { shotTypeDisplay, spinDisplay } from "@/data";
import { Plus, X, ArrowRight, AlertTriangle } from "lucide-react";

type Props = {
  sequence: StepGraph;
  onChange: (sequence: StepGraph) => void;
};

type NodeFormData = {
  id: string;
  name: string;
  stroke: ShotType;
  spin: Spin;
  depth: Placement["depth"];
  direction: Placement["direction"];
  isOpponent: boolean;
  prev: string[];
  next: string[];
  isPlaceholder?: boolean; // For empty shots that auto-remove
};

export const DrillFormSequence = ({ sequence, onChange }: Props) => {
  const entryPoint = sequence.entryPoint;
  const setEntryPoint = (entryPoint: string) => {
    onChange({
      ...sequence,
      entryPoint,
    });
  };
  const [nodes, setNodes] = useState<NodeFormData[]>(() => {
    // Initialize from the passed sequence or create default
    if (entryPoint && Object.keys(sequence.nodes).length > 0) {
      return Object.values(sequence.nodes).map((node) => ({
        id: node.id,
        name: node.id, // Use ID as name initially
        stroke: node.ball.stroke,
        spin: node.ball.spin,
        depth: node.ball.placement.depth,
        direction: node.ball.placement.direction,
        isOpponent: node.ball.isOpponent,
        prev: node.prev || [],
        next: node.next || [],
      }));
    }

    // Fallback to default if no sequence provided
    const initialNode: NodeFormData = {
      id: "serve",
      name: "Serve",
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

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    nodeId: string;
    cascadeNodes: string[];
  } | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);

  // Initialize the sequence with the default shot
  useEffect(() => {
    updateSequence(nodes, entryPoint);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Generate unique ID from name
  const generateUniqueId = (name: string): string => {
    if (!name.trim()) return "";

    // Convert to lowercase, replace spaces with hyphens, remove special chars
    const baseId = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    // Check if ID already exists
    const existingIds = nodes.map((n) => n.id);
    if (!existingIds.includes(baseId)) {
      return baseId;
    }

    // If exists, append number
    let counter = 1;
    while (existingIds.includes(`${baseId}-${counter}`)) {
      counter++;
    }
    return `${baseId}-${counter}`;
  }; // Only run on mount

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
    const currentNode = nodes[currentIndex];

    // Generate temporary ID for placeholder
    const tempId = `temp-${Date.now()}`;

    const newNode: NodeFormData = {
      id: tempId,
      name: "",
      stroke: "forehand",
      spin: "top",
      depth: "long",
      direction: "forehand",
      isOpponent: !currentNode.isOpponent, // Automatically alternate between player and opponent
      prev: [currentNode.id],
      next: [],
      isPlaceholder: true,
    };

    // Update the current node to connect to the new node
    const updatedNodes = [...nodes];
    updatedNodes[currentIndex] = {
      ...currentNode,
      next: [...currentNode.next, tempId],
    };

    const finalNodes = recalculatePlayerAssignments([...updatedNodes, newNode]);
    setNodes(finalNodes);
    updateSequence(finalNodes, entryPoint);

    // Start editing the new placeholder
    setEditingNodeId(tempId);
  };

  const isValidBackwardConnection = (
    toNodeId: string,
    fromNodeId: string
  ): boolean => {
    // Allow connections back to the entry point (start of drill) from any node
    // This enables looping drill patterns
    if (fromNodeId === entryPoint) {
      return true;
    }

    // Prevent direct cycles by checking if fromNodeId is reachable from toNodeId
    // WITHOUT going through the entry point
    const visited = new Set<string>();
    const queue = [toNodeId];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (visited.has(currentId)) continue;

      // If we reach the fromNode while traversing forward from toNode,
      // then adding this connection would create a direct cycle
      if (currentId === fromNodeId) {
        return false;
      }

      visited.add(currentId);
      const currentNode = nodes.find((n) => n.id === currentId);
      if (currentNode) {
        // Only follow paths that don't go through the entry point
        // This allows connections that would create loops through the entry point
        const nextNodes = currentNode.next.filter(
          (nextId) => nextId !== entryPoint
        );
        queue.push(...nextNodes);
      }
    }

    return true; // No cycle detected, connection is valid
  };

  const canRemovePreviousConnection = (
    nodeId: string,
    prevNodeId: string
  ): boolean => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return false;

    // Don't allow removal if this is the only connection to this node (would make it unreachable)
    if (node.prev.length <= 1 && node.id !== entryPoint) {
      return false;
    }

    // Check if removing this connection would make any nodes unreachable
    const testNodes = nodes.map((n) => ({ ...n }));
    const testNode = testNodes.find((n) => n.id === nodeId);
    const testPrevNode = testNodes.find((n) => n.id === prevNodeId);

    if (testNode && testPrevNode) {
      // Remove the connection
      testNode.prev = testNode.prev.filter((id) => id !== prevNodeId);
      testPrevNode.next = testPrevNode.next.filter((id) => id !== nodeId);

      // Check if all nodes are still reachable from entry point
      return isGraphConnected(testNodes, entryPoint);
    }

    return false;
  };

  const isGraphConnected = (
    nodeList: NodeFormData[],
    entryPointId: string
  ): boolean => {
    const visited = new Set<string>();
    const queue = [entryPointId];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (visited.has(currentId)) continue;

      visited.add(currentId);
      const currentNode = nodeList.find((n) => n.id === currentId);
      if (currentNode) {
        queue.push(...currentNode.next);
      }
    }

    // All nodes should be reachable from entry point
    return visited.size === nodeList.length;
  };

  const findCascadeNodes = (nodeId: string): string[] => {
    // Find all nodes that would become unreachable if this node is deleted
    const cascadeNodes: string[] = [];
    const visited = new Set<string>();
    const queue = [nodeId];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (visited.has(currentId)) continue;

      visited.add(currentId);
      cascadeNodes.push(currentId);

      const currentNode = nodes.find((n) => n.id === currentId);
      if (currentNode) {
        // Add all next nodes that would become unreachable
        for (const nextId of currentNode.next) {
          // Never cascade delete the entry point (start shot)
          if (nextId === entryPoint) {
            continue;
          }

          const nextNode = nodes.find((n) => n.id === nextId);
          if (nextNode) {
            // If this next node has no other previous connections besides the current node,
            // it would become unreachable
            const otherPrevConnections = nextNode.prev.filter(
              (id) => id !== currentId
            );
            if (otherPrevConnections.length === 0) {
              queue.push(nextId);
            }
          }
        }
      }
    }

    return cascadeNodes;
  };

  const addPreviousConnection = (toNodeId: string, fromNodeId: string) => {
    const updatedNodes = [...nodes];
    const toNode = updatedNodes.find((n) => n.id === toNodeId);
    const fromNode = updatedNodes.find((n) => n.id === fromNodeId);

    if (toNode && fromNode && !toNode.prev.includes(fromNodeId)) {
      toNode.prev.push(fromNodeId);
      if (!fromNode.next.includes(toNodeId)) {
        fromNode.next.push(toNodeId);
      }

      const finalNodes = recalculatePlayerAssignments(updatedNodes);
      setNodes(finalNodes);
      updateSequence(finalNodes, entryPoint);
    }
  };

  const removePreviousConnection = (nodeId: string, prevNodeId: string) => {
    const updatedNodes = [...nodes];
    const node = updatedNodes.find((n) => n.id === nodeId);
    const prevNode = updatedNodes.find((n) => n.id === prevNodeId);

    if (node && prevNode) {
      node.prev = node.prev.filter((id) => id !== prevNodeId);
      prevNode.next = prevNode.next.filter((id) => id !== nodeId);

      const finalNodes = recalculatePlayerAssignments(updatedNodes);
      setNodes(finalNodes);
      updateSequence(finalNodes, entryPoint);
    }
  };

  const removeNode = (index: number) => {
    // Don't allow removing the last shot or the starting shot
    if (nodes.length <= 1) {
      return;
    }

    const nodeToRemove = nodes[index];
    // Don't allow removing the entry point (starting shot)
    if (nodeToRemove.id === entryPoint) {
      return;
    }
    const cascadeNodes = findCascadeNodes(nodeToRemove.id);

    // If there are cascade nodes (nodes that would become unreachable), show confirmation
    if (cascadeNodes.length > 1) {
      // More than just the node being deleted
      setDeleteConfirmation({
        nodeId: nodeToRemove.id,
        cascadeNodes: cascadeNodes,
      });
      return;
    }

    // If no cascade nodes, proceed with simple deletion
    performNodeDeletion([nodeToRemove.id]);
  };

  const performNodeDeletion = (nodeIdsToDelete: string[]) => {
    let updatedNodes = [...nodes];

    // Remove all nodes in the cascade
    updatedNodes = updatedNodes.filter(
      (node) => !nodeIdsToDelete.includes(node.id)
    );

    // Update connections - remove references to deleted nodes
    updatedNodes.forEach((node) => {
      node.prev = node.prev.filter((id) => !nodeIdsToDelete.includes(id));
      node.next = node.next.filter((id) => !nodeIdsToDelete.includes(id));
    });

    // Recalculate player assignments to maintain alternating pattern
    const finalNodes = recalculatePlayerAssignments(updatedNodes);
    setNodes(finalNodes);

    // Update entry point if needed
    let newEntryPoint = entryPoint;
    if (nodeIdsToDelete.includes(entryPoint)) {
      newEntryPoint = finalNodes.length > 0 ? finalNodes[0].id : "";
      setEntryPoint(newEntryPoint);
    }

    updateSequence(finalNodes, newEntryPoint);
  };

  const confirmDelete = () => {
    if (deleteConfirmation) {
      performNodeDeletion(deleteConfirmation.cascadeNodes);
      setDeleteConfirmation(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };

  const generatePlaceholderName = () => {
    const existingNames = nodes.map((n) => n.name.toLowerCase());
    let counter = 1;
    let placeholderName = `Shot ${counter}`;

    while (existingNames.includes(placeholderName.toLowerCase())) {
      counter++;
      placeholderName = `Shot ${counter}`;
    }

    return placeholderName;
  };

  const finalizeShotName = (nodeId: string, name: string) => {
    const nodeIndex = nodes.findIndex((n) => n.id === nodeId);
    if (nodeIndex === -1) return setEditingNodeId(null);

    const updatedNodes = [...nodes];
    const node = updatedNodes[nodeIndex];
    if (node.name === name && name) return setEditingNodeId(null);

    // Use provided name or generate placeholder
    const finalName = name.trim() || generatePlaceholderName();

    // Generate new ID from name
    const newId = generateUniqueId(finalName);
    if (!newId) return setEditingNodeId(null);

    // Update the node
    updatedNodes[nodeIndex] = {
      ...node,
      id: newId,
      name: finalName,
      isPlaceholder: false,
    };

    // Update all references to the old ID
    if (node.id !== newId) {
      console.log("finalizeShotName", node.id, newId);
      updatedNodes.forEach((n) => {
        if (n.prev.includes(node.id)) {
          n.prev = n.prev.map((id) => (id === node.id ? newId : id));
        }
        if (n.next.includes(node.id)) {
          n.next = n.next.map((id) => (id === node.id ? newId : id));
        }
      });

      setNodes(updatedNodes);
      updateSequence(updatedNodes, entryPoint);
    } else {
      setNodes(updatedNodes);
      updateSequence(updatedNodes, entryPoint);
    }

    setEditingNodeId(null);
  };

  const addNextConnection = (fromIndex: number, toNodeId: string) => {
    const updatedNodes = [...nodes];
    const fromNode = updatedNodes[fromIndex];
    const toNode = updatedNodes.find((n) => n.id === toNodeId);

    if (fromNode && toNode && !fromNode.next.includes(toNodeId)) {
      fromNode.next.push(toNodeId);
      if (!toNode.prev.includes(fromNode.id)) {
        toNode.prev.push(fromNode.id);
      }

      const finalNodes = recalculatePlayerAssignments(updatedNodes);
      setNodes(finalNodes);
      updateSequence(finalNodes, entryPoint);
    }
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
    const currentNode = updatedNodes[index];

    // Handle name changes - regenerate ID
    if (field === "name" && typeof value === "string") {
      if (!value.trim()) {
        return; // Don't allow empty names
      }

      const oldId = currentNode.id;
      const newId = generateUniqueId(value);

      if (newId && newId !== oldId) {
        // Update the node with new ID and name
        updatedNodes[index] = { ...currentNode, id: newId, name: value.trim() };

        // Update all references to the old ID
        updatedNodes.forEach((node) => {
          if (node.prev.includes(oldId)) {
            node.prev = node.prev.map((id) => (id === oldId ? newId : id));
          }
          if (node.next.includes(oldId)) {
            node.next = node.next.map((id) => (id === oldId ? newId : id));
          }
        });

        setNodes(updatedNodes);
        updateSequence(updatedNodes, newId);
        return;
      } else {
        // Just update the name if ID doesn't change
        updatedNodes[index] = { ...currentNode, name: value.trim() };
      }
    } else {
      // Handle other field updates
      updatedNodes[index] = { ...updatedNodes[index], [field]: value };
    }

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
        {nodes.map((node, index) => {
          const prevNodesToDisplay = node.prev.filter(
            (prevId) => nodes.find((n) => n.id === prevId)?.name
          );
          const nextNodesToDisplay = node.next.filter(
            (nextId) => nodes.find((n) => n.id === nextId)?.name
          );
          return (
            <div
              key={node.id}
              className="bg-surface-light rounded-lg p-4 border border-border"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {editingNodeId === node.id ? (
                      <input
                        type="text"
                        defaultValue={node.name}
                        autoFocus
                        className="font-semibold text-text bg-transparent border-b-2 border-primary focus:outline-none"
                        onBlur={(e) =>
                          finalizeShotName(node.id, e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            finalizeShotName(node.id, e.currentTarget.value);
                          }
                          if (e.key === "Escape") {
                            if (node.isPlaceholder) {
                              // For placeholders, finalize with empty name (will get placeholder name)
                              finalizeShotName(node.id, "");
                            } else {
                              setEditingNodeId(null);
                            }
                          }
                        }}
                        placeholder="Enter shot name..."
                      />
                    ) : (
                      <h3
                        className={`font-semibold cursor-pointer hover:text-primary transition-colors ${
                          node.isPlaceholder
                            ? "text-text-muted italic"
                            : "text-text"
                        }`}
                        onClick={() => setEditingNodeId(node.id)}
                      >
                        {node.name || "Click to name shot"}
                      </h3>
                    )}
                    {node.id === entryPoint && (
                      <span className="px-2 py-1 bg-success text-white text-xs rounded">
                        START
                      </span>
                    )}
                  </div>
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
                {node.id !== entryPoint && (
                  <button
                    type="button"
                    onClick={() => removeNode(index)}
                    disabled={nodes.length <= 1 || node.id === entryPoint}
                    className={`p-2 rounded-lg ${
                      nodes.length <= 1 || node.id === entryPoint
                        ? "bg-text-subtle text-text-muted cursor-not-allowed"
                        : "bg-danger text-white hover:bg-danger-dark"
                    }`}
                    title={
                      node.id === entryPoint
                        ? "Cannot delete the starting shot"
                        : nodes.length <= 1
                        ? "Cannot remove the last shot"
                        : "Remove shot"
                    }
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
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

              {/* Connections Section */}
              <div className="pt-3 border-t border-border space-y-3">
                {/* Previous and Next shots display */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Previous shots */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-text">
                      <span className="text-text-muted">←</span>
                      Previous shots:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {prevNodesToDisplay.length > 0 ? (
                        prevNodesToDisplay.map((prevId) => {
                          const prevNode = nodes.find((n) => n.id === prevId);
                          const canRemove = canRemovePreviousConnection(
                            node.id,
                            prevId
                          );
                          return (
                            <div
                              key={prevId}
                              className={`flex items-center gap-1 px-2 py-1 text-xs rounded border ${
                                prevNode?.isOpponent
                                  ? "bg-warning/10 text-warning border-warning/30"
                                  : "bg-primary/10 text-primary border-primary/30"
                              }`}
                            >
                              <span>
                                {prevNode?.name || prevId} (
                                {prevNode?.isOpponent ? "Opp" : "You"})
                              </span>
                              {canRemove && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    removePreviousConnection(node.id, prevId)
                                  }
                                  className="ml-1 text-danger hover:text-danger-dark"
                                  title="Remove this connection"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <span className="text-xs text-text-subtle italic">
                          {node.id === entryPoint ? "Starting shot" : "None"}
                        </span>
                      )}
                    </div>

                    {/* Connect to existing (backwards only) */}
                    {node.id !== entryPoint &&
                      nodes.filter(
                        (n) =>
                          n.id !== node.id &&
                          !node.prev.includes(n.id) &&
                          n.isOpponent !== node.isOpponent && // Different player
                          isValidBackwardConnection(node.id, n.id)
                      ).length > 0 && (
                        <div className="pt-1">
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                addPreviousConnection(node.id, e.target.value);
                                e.target.value = ""; // Reset selection
                              }
                            }}
                            className="text-xs px-2 py-1 rounded bg-surface text-text border border-border focus:border-primary focus:outline-none"
                            defaultValue=""
                          >
                            <option value="" disabled>
                              Add previous shot...
                            </option>
                            {nodes
                              .filter(
                                (n) =>
                                  n.id !== node.id &&
                                  !node.prev.includes(n.id) &&
                                  n.isOpponent !== node.isOpponent && // Different player
                                  isValidBackwardConnection(node.id, n.id)
                              )
                              .map((targetNode) => (
                                <option
                                  key={targetNode.id}
                                  value={targetNode.id}
                                >
                                  {targetNode.name} (
                                  {targetNode.isOpponent ? "Opp" : "You"})
                                </option>
                              ))}
                          </select>
                        </div>
                      )}
                  </div>

                  {/* Next shots */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-text">
                      <span className="text-text-muted">→</span>
                      Next shots:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {nextNodesToDisplay.length > 0 ? (
                        nextNodesToDisplay.map((nextId) => {
                          const nextNode = nodes.find((n) => n.id === nextId);
                          return (
                            <span
                              key={nextId}
                              className={`px-2 py-1 text-xs rounded border ${
                                nextNode?.isOpponent
                                  ? "bg-warning/10 text-warning border-warning/30"
                                  : "bg-primary/10 text-primary border-primary/30"
                              }`}
                            >
                              {nextNode?.name || nextId} (
                              {nextNode?.isOpponent ? "Opp" : "You"})
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-xs text-text-subtle italic">
                          End of sequence
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => addNextShot(index)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-success text-white hover:bg-success-dark text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Create Next Shot
                  </button>

                  {/* Loop back to start button */}
                  {!node.next.includes(entryPoint) &&
                    node.id !== entryPoint &&
                    nodes.find((n) => n.id === entryPoint)?.isOpponent !==
                      node.isOpponent && (
                      <button
                        type="button"
                        onClick={() =>
                          addNextConnection(
                            nodes.findIndex((n) => n.id === node.id),
                            entryPoint
                          )
                        }
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark text-sm"
                      >
                        <ArrowRight className="w-4 h-4" />
                        Loop to{" "}
                        {nodes.find((n) => n.id === entryPoint)?.name ||
                          "Start"}
                      </button>
                    )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface border border-border rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-warning" />
              <h3 className="text-lg font-semibold text-text">Delete Shot</h3>
            </div>

            <div className="mb-4">
              <p className="text-text-subtle mb-3">
                Deleting{" "}
                <span className="font-semibold text-text">
                  {deleteConfirmation.nodeId}
                </span>{" "}
                will also delete the following connected shots:
              </p>

              <div className="bg-surface-light rounded p-3 mb-4">
                <div className="flex flex-wrap gap-2">
                  {deleteConfirmation.cascadeNodes.map((nodeId) => {
                    const node = nodes.find((n) => n.id === nodeId);
                    return (
                      <span
                        key={nodeId}
                        className={`px-2 py-1 text-xs rounded border ${
                          node?.isOpponent
                            ? "bg-warning/10 text-warning border-warning/30"
                            : "bg-primary/10 text-primary border-primary/30"
                        }`}
                      >
                        {nodeId} ({node?.isOpponent ? "Opp" : "You"})
                      </span>
                    );
                  })}
                </div>
              </div>

              <p className="text-text-subtle text-sm">
                This action cannot be undone. Are you sure you want to continue?
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={cancelDelete}
                className="px-4 py-2 rounded bg-surface-light text-text border border-border hover:bg-surface"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-danger text-white hover:bg-danger-dark"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

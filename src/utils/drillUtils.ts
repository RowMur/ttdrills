import { StepGraph, Node, Placement } from "@/types";

/**
 * Gets the effective "from" placement for a shot by deriving it from the previous shot's "placement".
 * This is always calculated at runtime - no stored fromPlacement needed.
 */
export function getEffectiveFromPlacement(
  node: Node,
  graph: StepGraph
): Placement | undefined {
  // Derive from the previous shot's "placement"
  const prevNodes = node.prev || [];
  if (prevNodes.length > 0) {
    const prevNode = graph.nodes[prevNodes[0]];
    if (prevNode) {
      return prevNode.ball.placement;
    }
  }

  return undefined;
}

/**
 * Gets the effective "placement" for a shot (where it's going).
 */
export function getEffectivePlacement(node: Node): Placement {
  return node.ball.placement;
}

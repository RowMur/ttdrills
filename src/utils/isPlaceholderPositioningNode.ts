import type { Node } from "@/types";

export const isPlaceholderPositioningNode = (node: Node): boolean => {
  return node.next === null || node.next.length === 0;
};

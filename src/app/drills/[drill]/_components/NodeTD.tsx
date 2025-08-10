import { shotTypeDisplay, spinDisplay } from "@/data";
import { Node, StepGraph } from "@/types";
import {
  getEffectivePlacement,
  getEffectiveFromPlacement,
} from "@/utils/drillUtils";

type Props = {
  node: Node | null;
  isActive: boolean;
  graph?: StepGraph; // Optional for backward compatibility
};

export const NodeTD = ({ node, isActive, graph }: Props) => {
  if (!node) {
    return <td className="p-2 text-text-subtle">-</td>;
  }

  return (
    <td className="p-2">
      {node && (
        <div
          className={`flex flex-col gap-1 w-fit px-2 rounded ${
            isActive ? "bg-surface-light" : ""
          }`}
        >
          <span className="text-sm font-bold text-text">
            {shotTypeDisplay[node.ball.stroke]} {spinDisplay[node.ball.spin]}
          </span>
          <span className="text-xs text-text-subtle">
            {(() => {
              const toPlacement = getEffectivePlacement(node);
              const fromPlacement = graph
                ? getEffectiveFromPlacement(node, graph)
                : null;

              if (fromPlacement) {
                return `from ${fromPlacement.depth} ${fromPlacement.direction} → to ${toPlacement.depth} ${toPlacement.direction}`;
              } else {
                return `to ${toPlacement.depth} ${toPlacement.direction}`;
              }
            })()}
          </span>
        </div>
      )}
    </td>
  );
};

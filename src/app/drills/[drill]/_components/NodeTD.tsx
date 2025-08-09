import { shotTypeDisplay, spinDisplay } from "@/data";
import { Node } from "@/types";

type Props = {
  node: Node | null;
  isActive: boolean;
};

export const NodeTD = ({ node, isActive }: Props) => {
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
            from {node.ball.placement.depth} {node.ball.placement.direction}
          </span>
        </div>
      )}
    </td>
  );
};

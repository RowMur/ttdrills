import { shotTypeDisplay, spinDisplay } from "@/data";
import { Node } from "@/types";

type Props = {
  node: Node | null;
  isActive: boolean;
};

export const NodeTD = ({ node, isActive }: Props) => {
  if (!node) {
    return <td className="p-2">-</td>;
  }

  return (
    <td className="p-2">
      {node && (
        <div
          className={`flex flex-col gap-1 w-fit px-2 rounded ${
            isActive ? "bg-light-grey" : ""
          }`}
        >
          <span className="text-sm font-bold">
            {shotTypeDisplay[node.ball.stroke]} {spinDisplay[node.ball.spin]}
          </span>
          <span className="text-xs text-slate-500">
            from {node.ball.placement.depth} {node.ball.placement.direction}
          </span>
        </div>
      )}
    </td>
  );
};

import { HighlightedSection } from "@/components/DrillDiagram/HighlightedSection";
import { Table } from "@/components/DrillDiagram/Table";
import { shotTypeShorthand } from "@/data";
import { Drill } from "@/types";
import { getCoords } from "@/utils/coords";
import {
  getEffectivePlacement,
  getEffectiveFromPlacement,
} from "@/utils/drillUtils";

type Props = {
  drill: Drill;
  nodeId: string;
  height: number;
  width: number;
};

export const DrillView = ({ drill, nodeId, height, width }: Props) => {
  const out = drill.graph.nodes[nodeId];
  const incomingOptions = out.next
    ? out.next.map((i) => drill.graph.nodes[i])
    : null;

  if (!out || !incomingOptions) {
    return null;
  }

  // Get where the current shot is coming from and going to
  const fromPlacement = getEffectiveFromPlacement(out, drill.graph);
  const toPlacement = getEffectivePlacement(out);

  // Start position: where the current shot is coming from (same side as the player)
  const [startX, startY] = getCoords(
    height,
    width,
    fromPlacement || { depth: "long", direction: "backhand" },
    out.ball.isOpponent
  );

  // End position: where the current shot is going to (opposite side)
  const [endX, endY] = getCoords(
    height,
    width,
    toPlacement,
    !out.ball.isOpponent // Opposite side
  );

  return (
    <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg">
      <Table height={height} width={width} />
      {/* Highlight where the current shot is going to (opposite side) */}
      <HighlightedSection
        tableHeight={height}
        tableWidth={width}
        placement={toPlacement}
        isOpponent={!out.ball.isOpponent} // Opposite side
        spin={out.ball.spin}
      />
      <text
        x={startX}
        y={out.ball.isOpponent ? startY - 10 : startY + 20}
        textAnchor="middle"
        fontSize="14"
        fill="white"
      >
        {shotTypeShorthand[out.ball.stroke]}
      </text>
      {/* Draw the shot trajectory from where it comes from to where it goes */}
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        className="stroke-2 stroke-white"
        strokeDasharray="none"
      />
    </svg>
  );
};

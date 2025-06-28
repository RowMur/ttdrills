import { HighlightedSection } from "@/components/DrillDiagram/HighlightedSection";
import { Table } from "@/components/DrillDiagram/Table";
import { shotTypeShorthand } from "@/data";
import { Drill } from "@/types";
import { getCoords } from "@/utils/coords";
// import { getRepetitionDisplay } from "@/utils/getRepetitionDisplay";

type Props = {
  drill: Drill;
  nodeId: string;
  height: number;
  width: number;
};

export const DrillDiagram = ({ drill, nodeId, height, width }: Props) => {
  const out = drill.graph.nodes[nodeId];
  const incomingOptions = out.next
    ? out.next.map((i) => drill.graph.nodes[i])
    : null;

  if (!out || !incomingOptions) {
    return null;
  }

  const [startX, startY] = getCoords(
    height,
    width,
    out.ball.placement,
    out.ball.isOpponent
  );
  const endCoords = incomingOptions.map((i) =>
    getCoords(
      height,
      width,
      i?.ball.placement || {
        depth: "long",
        direction: out.ball.placement.direction,
      },
      i?.ball.isOpponent || false
    )
  );

  return (
    <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg">
      <Table height={height} width={width} />
      {incomingOptions.map((incoming) => (
        <HighlightedSection
          key={incoming.id}
          tableHeight={height}
          tableWidth={width}
          ball={
            incoming?.ball || {
              isOpponent: !out.ball.isOpponent,
              placement: {
                depth: "long",
                direction: out.ball.placement.direction,
              },
              stroke: out.ball.stroke,
              spin: out.ball.spin,
            }
          }
        />
      ))}
      <text
        x={startX}
        y={out.ball.isOpponent ? startY - 10 : startY + 20}
        textAnchor="middle"
        fontSize="14"
        fill="white"
      >
        {/* {ball.repetition && (
                  <>{getRepetitionDisplay(shot.repetition)} </>
                )} */}
        {shotTypeShorthand[out.ball.stroke]}
      </text>
      {incomingOptions.map((incoming, index) => {
        const [endX, endY] = endCoords[index];
        return (
          <line
            key={incoming.id}
            x1={startX}
            y1={startY}
            x2={endX}
            y2={endY}
            className="stroke-2 stroke-white"
            strokeDasharray={incomingOptions.length > 1 ? "4,2" : "none"}
          />
        );
      })}
    </svg>
  );
};

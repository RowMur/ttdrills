import { HighlightedSection } from "@/components/DrillDiagram/HighlightedSection";
import { Table } from "@/components/DrillDiagram/Table";
import { shotTypeShorthand } from "@/data";
import { Drill } from "@/types";
import { getCoords } from "@/utils/coords";
// import { getRepetitionDisplay } from "@/utils/getRepetitionDisplay";

const WIDTH = 200;
const HEIGHT = 360;

const backAndForthSplit = 4;

type Props = {
  drill: Drill;
  nodeId: string;
};

export const DrillDiagram = ({ drill, nodeId }: Props) => {
  const out = drill.graph.nodes[nodeId];
  const incoming = out.next ? drill.graph.nodes[out.next[0]] : null;
  const nextExchangeBall = incoming?.next
    ? drill.graph.nodes[incoming.next[0]]
    : null;

  if (!out || !incoming) {
    return null;
  }

  const [startX, startY] = getCoords(
    HEIGHT,
    WIDTH,
    out.ball.placement,
    out.ball.isOpponent
  );
  const [endX, endY] = getCoords(
    HEIGHT,
    WIDTH,
    incoming?.ball.placement || {
      depth: "long",
      direction: out.ball.placement.direction,
    },
    incoming?.ball.isOpponent || false
  );
  const [nextX, nextY] = getCoords(
    HEIGHT,
    WIDTH,
    nextExchangeBall?.ball.placement || {
      depth: "long",
      direction:
        incoming?.ball.placement.direction || out.ball.placement.direction,
    },
    nextExchangeBall?.ball.isOpponent || false
  );

  const isBackAndForth = startX === nextX && startY === nextY;

  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto"
    >
      <Table height={HEIGHT} width={WIDTH} />
      <HighlightedSection
        tableHeight={HEIGHT}
        tableWidth={WIDTH}
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
      {/* {nextExchangeBall && (
        <HighlightedSection
          tableHeight={HEIGHT}
          tableWidth={WIDTH}
          ball={nextExchangeBall.ball}
        />
      )} */}
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
      {/* {incoming && (
        <text
          x={endX}
          y={incoming.ball.isOpponent ? endY - 10 : endY + 20}
          textAnchor="middle"
          fontSize="14"
          fill="white"
        >
          {shotTypeShorthand[incoming.ball.stroke]}
        </text>
      )} */}
      <line
        x1={
          isBackAndForth
            ? incoming?.ball.isOpponent
              ? startX - backAndForthSplit
              : startX + backAndForthSplit
            : startX
        }
        y1={startY}
        x2={
          isBackAndForth
            ? incoming?.ball.isOpponent
              ? endX - backAndForthSplit
              : endX + backAndForthSplit
            : endX
        }
        y2={endY}
        className="stroke-2 stroke-white"
      />
      {nextExchangeBall && (
        <line
          x1={
            isBackAndForth
              ? nextExchangeBall?.ball.isOpponent
                ? endX - backAndForthSplit
                : endX + backAndForthSplit
              : endX
          }
          y1={endY}
          x2={
            isBackAndForth
              ? nextExchangeBall?.ball.isOpponent
                ? nextX - backAndForthSplit
                : nextX + backAndForthSplit
              : nextX
          }
          y2={nextY}
          className="stroke-white stroke-2"
          strokeDasharray="5,5"
        />
      )}
    </svg>
  );
};

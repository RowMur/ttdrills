import { HighlightedSection } from "@/components/DrillDiagram/HighlightedSection";
import { Table } from "@/components/DrillDiagram/Table";
import { shotTypeShorthand } from "@/data";
import { Drill, Exchange } from "@/types";
import { getCoords } from "@/utils/coords";
// import { getRepetitionDisplay } from "@/utils/getRepetitionDisplay";

const WIDTH = 200;
const HEIGHT = 360;

const backAndForthSplit = 4;

type Props = {
  drill: Drill;
  exchanges: Exchange[];
  activeExchangeIndex: number;
};

export const DrillDiagram = ({
  drill,
  exchanges,
  activeExchangeIndex,
}: Props) => {
  const activeExchange = exchanges[activeExchangeIndex];
  const [out, incoming] = activeExchange;
  const nextExchangeIndex =
    drill.loopBehavior === "continuous"
      ? (activeExchangeIndex + 1) % exchanges.length
      : activeExchangeIndex + 1;
  const nextExchange = exchanges[nextExchangeIndex];
  const nextExchangeBall = nextExchange?.[0];

  if (!out) {
    return null;
  }

  const [startX, startY] = getCoords(HEIGHT, WIDTH, out.placement, false);
  const [endX, endY] = getCoords(
    HEIGHT,
    WIDTH,
    incoming?.placement || {
      depth: "long",
      direction: out.placement.direction,
    },
    true
  );
  const [nextX, nextY] = getCoords(
    HEIGHT,
    WIDTH,
    nextExchangeBall?.placement || {
      depth: "long",
      direction: incoming?.placement.direction || out.placement.direction,
    },
    false
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
      {incoming && (
        <HighlightedSection
          tableHeight={HEIGHT}
          tableWidth={WIDTH}
          ball={incoming}
          isOpponent
        />
      )}
      {nextExchangeBall && (
        <HighlightedSection
          tableHeight={HEIGHT}
          tableWidth={WIDTH}
          ball={nextExchangeBall}
        />
      )}
      <text
        x={startX}
        y={startY + 20}
        textAnchor="middle"
        fontSize="14"
        fill="white"
      >
        {/* {ball.repetition && (
                  <>{getRepetitionDisplay(shot.repetition)} </>
                )} */}
        {shotTypeShorthand[out.stroke]}
      </text>
      {incoming && (
        <text
          x={endX}
          y={endY - 10}
          textAnchor="middle"
          fontSize="14"
          fill="white"
        >
          {/* {ball.repetition && (
                  <>{getRepetitionDisplay(shot.repetition)} </>
                  )} */}
          {shotTypeShorthand[incoming.stroke]}
        </text>
      )}
      <line
        x1={isBackAndForth ? startX - backAndForthSplit : startX}
        y1={startY}
        x2={isBackAndForth ? endX - backAndForthSplit : endX}
        y2={endY}
        className={`stroke-2 stroke-white ${
          true ? "" : false ? "opacity-25" : "opacity-0"
        }`}
        strokeDasharray={true ? "none" : "5,5"}
      />
      {nextExchangeBall && (
        <line
          x1={isBackAndForth ? endX + backAndForthSplit : endX}
          y1={endY}
          x2={isBackAndForth ? nextX + backAndForthSplit : nextX}
          y2={nextY}
          className={`stroke-white stroke-2 ${
            true ? "" : false ? "opacity-25" : "opacity-0"
          }`}
          strokeDasharray={true ? "none" : "5,5"}
        />
      )}
    </svg>
  );
};

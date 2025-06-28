import { shotTypeShorthand } from "@/data";
import { Drill, Exchange, Placement } from "@/types";
// import { getRepetitionDisplay } from "@/utils/getRepetitionDisplay";

const WIDTH = 200;
const HEIGHT = 360;
const sectionWidth = WIDTH / 3;
const sectionHeight = HEIGHT / 6;

const backAndForthSplit = 4;

type Props = {
  drill: Drill;
  exchanges: Exchange[];
  activeExchangeIndex: number;
};

export const RenderedDrill = ({
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

  const [startX, startY] = getCoords(out.placement, false);
  const [endX, endY, endTopLeftX, endTopLeftY] = getCoords(
    incoming?.placement || {
      depth: "long",
      direction: out.placement.direction,
    },
    true
  );
  const [nextX, nextY, nextTopLeftX, nextTopleftY] = getCoords(
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
      <rect
        width="100%"
        height="100%"
        className="fill-[#1f3a93] stroke-2 stroke-white"
      />
      <line x1="100" y1="0" x2="100" y2="360" stroke="white" strokeWidth="1" />
      <rect
        x={endTopLeftX}
        y={endTopLeftY}
        width={sectionWidth}
        height={sectionHeight}
        className={
          !incoming || incoming.spin === "top"
            ? "fill-red"
            : incoming.spin === "back"
            ? "fill-green"
            : "fill-slate"
        }
      />
      {nextExchangeBall && (
        <rect
          x={nextTopLeftX}
          y={nextTopleftY}
          width={sectionWidth}
          height={sectionHeight}
          className={
            !nextExchangeBall || nextExchangeBall.spin === "top"
              ? "fill-red"
              : nextExchangeBall.spin === "back"
              ? "fill-green"
              : "fill-slate"
          }
        />
      )}
      <line x1="0" y1="177" x2="200" y2="177" stroke="white" strokeWidth="1" />
      <line
        x1="0"
        y1="178"
        x2="200"
        y2="178"
        stroke="black"
        strokeWidth="1"
        strokeDasharray="1,1"
      />
      <line
        x1="0"
        y1="179"
        x2="200"
        y2="179"
        stroke="black"
        strokeWidth="1"
        strokeDasharray="1,1"
        strokeDashoffset={1}
      />
      <line
        x1="0"
        y1="180"
        x2="200"
        y2="180"
        stroke="black"
        strokeWidth="1"
        strokeDasharray="1,1"
      />
      <line
        x1="0"
        y1="181"
        x2="200"
        y2="181"
        stroke="black"
        strokeWidth="1"
        strokeDasharray="1,1"
        strokeDashoffset={1}
      />
      <line
        x1="0"
        y1="182"
        x2="200"
        y2="182"
        stroke="black"
        strokeWidth="1"
        strokeDasharray="1,1"
      />
      <line
        x1="0"
        y1="183"
        x2="200"
        y2="183"
        stroke="black"
        strokeWidth="1"
        strokeDasharray="1,1"
        strokeDashoffset={1}
      />
      <line
        x1="0"
        y1="184"
        x2="200"
        y2="184"
        stroke="black"
        strokeWidth="1"
        strokeDasharray="1,1"
      />
      <line
        x1="0"
        y1="185"
        x2="200"
        y2="185"
        stroke="black"
        strokeWidth="1"
        strokeDasharray="1,1"
        strokeDashoffset={1}
      />
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
      {/* <circle
        cx={endX}
        cy={endY}
        r="12"
        fill={
          out.spin === "top" ? "red" : out.spin === "back" ? "blue" : "white"
        }
      />
      <circle cx={endX} cy={endY} r="8" fill="white" />
      <circle
        cx={nextX}
        cy={nextY}
        r="12"
        fill={
          incoming.spin === "top"
            ? "red"
            : incoming.spin === "back"
            ? "blue"
            : "white"
        }
      />
      <circle cx={nextX} cy={nextY} r="8" fill="white" /> */}
    </svg>
  );
};

const getCoords = (placement: Placement, isOpponent: boolean) => {
  let x =
    placement.direction === "forehand"
      ? (5 * sectionWidth) / 2
      : placement.direction === "middle"
      ? (3 * sectionWidth) / 2
      : sectionWidth / 2;

  let y =
    HEIGHT -
    (placement.depth === "long"
      ? sectionHeight / 2
      : placement.depth === "halflong"
      ? (3 * sectionHeight) / 2
      : (5 * sectionHeight) / 2);
  if (isOpponent) {
    x = WIDTH - x;
    y = HEIGHT - y;
  }
  const topLeftX = x - sectionWidth / 2;
  const topLeftY = y - sectionHeight / 2;
  return [x, y, topLeftX, topLeftY];
};

import { shotTypeShorthand } from "@/data";
import { Drill, Exchange, Placement } from "@/types";
// import { getRepetitionDisplay } from "@/utils/getRepetitionDisplay";

const WIDTH = 200;
const HEIGHT = 360;
const sectionWidth = WIDTH / 3;
const sectionHeight = HEIGHT / 6;

type Props = {
  drill: Drill;
  exchanges: Exchange[];
  activeExchangeIndex: number;
};

export const RenderedDrill = ({
  // drill,
  exchanges,
  activeExchangeIndex,
}: Props) => {
  const activeExchange = exchanges[activeExchangeIndex];
  const [out, incoming] = activeExchange;
  const nextExchangeBall =
    exchanges[(activeExchangeIndex + 1) % exchanges.length][0];

  const [startX, startY] = getCoords(out.placement, false);
  const [endX, endY, endTopLeftX, endTopLeftY] = getCoords(
    incoming.placement,
    true
  );
  const [nextX, nextY, nextTopLeftX, nextTopleftY] = getCoords(
    nextExchangeBall.placement,
    false
  );
  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto"
    >
      <rect width="100%" height="100%" className="fill-white" />
      <rect
        x={endTopLeftX}
        y={endTopLeftY}
        width={sectionWidth}
        height={sectionHeight}
        className={
          incoming.spin === "top"
            ? "fill-red"
            : incoming.spin === "back"
            ? "fill-blue"
            : "fill-slate"
        }
      />
      <rect
        x={nextTopLeftX}
        y={nextTopleftY}
        width={sectionWidth}
        height={sectionHeight}
        className={
          incoming.spin === "top"
            ? "fill-red"
            : incoming.spin === "back"
            ? "fill-blue"
            : "fill-slate"
        }
      />
      <line
        x1="0"
        y1="180"
        x2="200"
        y2="180"
        stroke="black"
        strokeWidth="2"
        strokeDasharray="4,4"
      />
      <line
        x1="0"
        y1="178"
        x2="200"
        y2="178"
        stroke="gray"
        strokeWidth="1"
        strokeDasharray="2,2"
      />
      <line
        x1="0"
        y1="182"
        x2="200"
        y2="182"
        stroke="gray"
        strokeWidth="1"
        strokeDasharray="2,2"
      />
      <text
        x={startX}
        y={startY + 20}
        textAnchor="middle"
        fontSize="14"
        fill="black"
      >
        {/* {ball.repetition && (
                  <>{getRepetitionDisplay(shot.repetition)} </>
                )} */}
        {shotTypeShorthand[out.stroke]}
      </text>
      <text
        x={endX}
        y={endY - 10}
        textAnchor="middle"
        fontSize="14"
        fill="black"
      >
        {/* {ball.repetition && (
                  <>{getRepetitionDisplay(shot.repetition)} </>
                )} */}
        {shotTypeShorthand[incoming.stroke]}
      </text>
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        className={`stroke-slate stroke-2 ${
          true ? "" : false ? "opacity-25" : "opacity-0"
        }`}
        strokeDasharray={true ? "none" : "5,5"}
      />
      <line
        x1={endX}
        y1={endY}
        x2={nextX}
        y2={nextY}
        className={`stroke-slate stroke-2 ${
          true ? "" : false ? "opacity-25" : "opacity-0"
        }`}
        strokeDasharray={true ? "none" : "5,5"}
      />
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

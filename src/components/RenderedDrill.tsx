import { shotTypeShorthand } from "@/data";
import { Drill, Placement } from "@/types";
import { getRepetitionDisplay } from "@/utils/getRepetitionDisplay";
import { modulo } from "@/utils/modulo";
import { Fragment } from "react";

const WIDTH = 200;
const HEIGHT = 360;

type Props = {
  drill: Drill;
  activeShotIndex: number;
};

export const RenderedDrill = ({ drill, activeShotIndex }: Props) => {
  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto"
    >
      <rect width="100%" height="100%" className="fill-white" />
      {drill.shots.map((shot, shotIndex) => {
        const [startX, startY] = getCoords(shot.from, false);
        const [endX, endY] = getCoords(
          {
            depth: "long",
            direction: "backhand",
          },
          true
        );
        const isActive = shotIndex === activeShotIndex;
        const isNextShot =
          shotIndex === modulo(activeShotIndex + 1, drill.shots.length);
        return (
          <Fragment key={shotIndex}>
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
            {isActive && (
              <text
                x={startX}
                y={startY + 14}
                textAnchor="middle"
                fontSize="14"
                fill="black"
              >
                {shot.repetition && (
                  <>{getRepetitionDisplay(shot.repetition)} </>
                )}
                {shotTypeShorthand[shot.type]}
              </text>
            )}
            <line
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              className={`stroke-slate stroke-2 ${
                isActive ? "" : isNextShot ? "opacity-25" : "opacity-0"
              }`}
              strokeDasharray={isActive ? "none" : "5,5"}
            />
            <circle
              cx={endX}
              cy={endY}
              r="12"
              fill={
                shot.spin === "top"
                  ? "red"
                  : shot.spin === "back"
                  ? "blue"
                  : "white"
              }
            />
            <circle cx={endX} cy={endY} r="8" fill="white" />
          </Fragment>
        );
      })}
    </svg>
  );
};

const getCoords = (
  placement: Placement,
  isOpponent: boolean
): [number, number] => {
  let x =
    placement.direction === "forehand"
      ? 150
      : placement.direction === "middle"
      ? 100
      : 50;
  let y =
    placement.depth === "long"
      ? 315
      : placement.depth === "halflong"
      ? 270
      : 225;
  if (isOpponent) {
    x = WIDTH - x;
    y = HEIGHT - y;
  }
  return [x, y];
};

import { shotTypeShorthand } from "@/data";
import { Drill } from "@/types";
import { getRepetitionDisplay } from "@/utils/getRepetitionDisplay";
import { modulo } from "@/utils/modulo";
import { Fragment } from "react";

type Props = {
  drill: Drill;
  activeShotIndex: number;
};

export const RenderedDrill = ({ drill, activeShotIndex }: Props) => {
  return (
    <svg
      width={200}
      height={360}
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto"
    >
      <rect width="100%" height="100%" className="fill-white" />
      {drill.shots.map((shot, shotIndex) => {
        const yPosition = 45;
        const xPosition = 150;

        const startX =
          shot.from.direction === "backhand"
            ? 50
            : shot.from.direction === "forehand"
            ? 150
            : 100;
        const startY = 315;
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
              x2={xPosition}
              y2={yPosition}
              className={`stroke-slate stroke-2 ${
                isActive ? "" : isNextShot ? "opacity-25" : "opacity-0"
              }`}
              strokeDasharray={isActive ? "none" : "5,5"}
            />
            <circle
              cx={xPosition}
              cy={yPosition}
              r="12"
              fill={
                shot.spin === "top"
                  ? "red"
                  : shot.spin === "back"
                  ? "blue"
                  : "white"
              }
            />
            <circle cx={xPosition} cy={yPosition} r="8" fill="white" />
          </Fragment>
        );
      })}
    </svg>
  );
};

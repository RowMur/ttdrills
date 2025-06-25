import { shotTypeShorthand } from "@/data";
import { Drill } from "@/types";
import { getRepetitionDisplay } from "@/utils/getRepetitionDisplay";
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
      <rect width="100%" height="100%" fill="#f0f0f0" />
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
        return (
          <Fragment key={shotIndex}>
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
                shotIndex === activeShotIndex ? "" : "opacity-10"
              }`}
              strokeDasharray={shotIndex === activeShotIndex ? "none" : "5,5"}
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

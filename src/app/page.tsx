"use client";

import { DRILLS } from "@/data";
import { Fragment, useState } from "react";

export default function Home() {
  const [activeShotIndex, setActiveShotIndex] = useState(0);
  const drill = DRILLS[0];
  return (
    <>
      <h2 className="text-center">{drill.name}</h2>
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
          return (
            <Fragment key={shotIndex}>
              <line
                x1={startX}
                y1={startY}
                x2={xPosition}
                y2={yPosition}
                className={`stroke-black stroke-2 ${
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
      <div className="flex justify-center">
        <button
          disabled={activeShotIndex === 0}
          onClick={() =>
            setActiveShotIndex((prev) => (prev - 1) % drill.shots.length)
          }
        >
          Prev
        </button>
        <span className="mx-4">
          {activeShotIndex + 1} / {drill.shots.length}
        </span>
        <button
          disabled={activeShotIndex === drill.shots.length - 1}
          onClick={() =>
            setActiveShotIndex((prev) => (prev + 1) % drill.shots.length)
          }
        >
          Next
        </button>
      </div>
    </>
  );
}

import { RenderedDrill } from "@/components/RenderedDrill";
import { Drill } from "@/types";
import { modulo } from "@/utils/modulo";
import { useState } from "react";

type Props = {
  drill: Drill;
};

export const DrillCard = ({ drill }: Props) => {
  const [activeShotIndex, setActiveShotIndex] = useState(0);
  return (
    <div className="shadow-lg p-4 rounded-lg w-fit bg-grey">
      <h2 className="text-center">{drill.name}</h2>
      <RenderedDrill drill={drill} activeShotIndex={activeShotIndex} />
      <div className="flex justify-center">
        <button
          onClick={() =>
            setActiveShotIndex((prev) => modulo(prev - 1, drill.shots.length))
          }
        >
          Prev
        </button>
        <span className="mx-4">
          {activeShotIndex + 1} / {drill.shots.length}
        </span>
        <button
          onClick={() =>
            setActiveShotIndex((prev) => modulo(prev + 1, drill.shots.length))
          }
        >
          Next
        </button>
      </div>
    </div>
  );
};

import { RenderedDrill } from "@/components/RenderedDrill";
import { Tag } from "@/components/Tag";
import { Drill } from "@/types";
import { modulo } from "@/utils/modulo";
import { useState } from "react";

type Props = {
  drill: Drill;
};

export const DrillCard = ({ drill }: Props) => {
  const [activeBallIndex, setActiveBallIndex] = useState(0);
  return (
    <div className="shadow-lg p-4 rounded-lg bg-grey">
      <h2 className="font-semibold mb-2 text-wrap">{drill.name}</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        <Tag text={drill.loopBehavior} />
      </div>
      <RenderedDrill drill={drill} activeBallIndex={activeBallIndex} />
      <div className="flex justify-center">
        <button
          onClick={() =>
            setActiveBallIndex((prev) => modulo(prev - 1, drill.balls.length))
          }
        >
          Prev
        </button>
        <span className="mx-4">
          {activeBallIndex + 1} / {drill.balls.length}
        </span>
        <button
          onClick={() =>
            setActiveBallIndex((prev) => modulo(prev + 1, drill.balls.length))
          }
        >
          Next
        </button>
      </div>
    </div>
  );
};

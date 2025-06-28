import { RenderedDrill } from "@/components/RenderedDrill";
import { Tag } from "@/components/Tag";
import { Drill, Exchange } from "@/types";
import { modulo } from "@/utils/modulo";
import { useState } from "react";

type Props = {
  drill: Drill;
};

export const DrillCard = ({ drill }: Props) => {
  const exchanges: Exchange[] = [];
  for (let i = 0; i < drill.balls.length; i += 2) {
    const slice = drill.balls.slice(i, i + 2);
    exchanges.push([slice[0], slice[1]]);
  }
  const [activeExchangeIndex, setActiveExchangeIndex] = useState(0);
  return (
    <div className="shadow-lg p-4 rounded-lg bg-grey">
      <h2 className="font-semibold mb-2 text-wrap">{drill.name}</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        <Tag text={drill.loopBehavior} />
      </div>
      <RenderedDrill
        drill={drill}
        exchanges={exchanges}
        activeExchangeIndex={activeExchangeIndex}
      />
      <div className="flex justify-center">
        <button
          onClick={() =>
            setActiveExchangeIndex((prev) => modulo(prev - 1, exchanges.length))
          }
        >
          Prev
        </button>
        <span className="mx-4">
          {activeExchangeIndex + 1} / {exchanges.length}
        </span>
        <button
          onClick={() =>
            setActiveExchangeIndex((prev) => modulo(prev + 1, exchanges.length))
          }
        >
          Next
        </button>
      </div>
    </div>
  );
};

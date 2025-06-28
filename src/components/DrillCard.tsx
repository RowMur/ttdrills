import { DrillDiagram } from "@/components/DrillDiagram/DrillDiagram";
import { Drill } from "@/types";
import { useState } from "react";

type Props = {
  drill: Drill;
};

export const DrillCard = ({ drill }: Props) => {
  const [nodeId, setNodeId] = useState(drill.graph.entryPoint);
  return (
    <div className="shadow-lg p-4 rounded-lg bg-grey">
      <h2 className="font-semibold mb-2 text-wrap">{drill.name}</h2>
      {/* TODO: Find some way to dynamically check if it's continuous */}
      {/* <div className="flex flex-wrap gap-2 mb-4">
        <Tag text={drill.loopBehavior} />
      </div> */}
      <DrillDiagram drill={drill} nodeId={nodeId} />
      <div className="flex justify-center">
        <button
          onClick={() =>
            setNodeId((prev) => drill.graph.nodes[prev].prev?.[0] || prev)
          }
        >
          Prev
        </button>
        <button
          onClick={() =>
            setNodeId((prev) => {
              const nextNodeId = drill.graph.nodes[prev].next?.[0];
              if (nextNodeId === undefined) {
                return prev;
              }

              const nextNode = drill.graph.nodes[nextNodeId];
              if (nextNode.next === null) {
                // If the next node has no next nodes, stay on the current node as last node is just for placement
                return prev;
              }

              return nextNodeId;
            })
          }
        >
          Next
        </button>
      </div>
    </div>
  );
};

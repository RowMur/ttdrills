type Spin = "top" | "back" | "no";

type Depth = "short" | "halflong" | "long";

type Direction = "forehand" | "backhand" | "middle";

export type Placement = {
  depth: Depth;
  direction: Direction;
};

export type ShotType = "forehand" | "backhand" | "serve";

// export type Repetition =
//   | number
//   | {
//       min: number;
//       max: number;
//     };

export type Ball = {
  stroke: ShotType;
  spin: Spin;
  placement: Placement;
  isOpponent: boolean;
  // repetition?: Repetition;
};

type Node = {
  id: string;
  prev: string[] | null;
  next: string[] | null;
  ball: Ball;
};

type StepGraph = {
  entryPoint: string;
  nodes: Record<string, Node>;
};

export type Drill = {
  name: string;
  graph: StepGraph;
};

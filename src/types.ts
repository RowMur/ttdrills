export type Spin = "top" | "back" | "no" | "block";

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
  placement: Placement; // Where the shot is going (user specifies)
  // fromPlacement?: Placement; // Where the shot is coming from (derived from previous shot)
  isOpponent: boolean;
  // repetition?: Repetition;
};

export type Node = {
  id: string;
  prev: string[] | null;
  next: string[] | null;
  ball: Ball;
};

export type StepGraph = {
  entryPoint: string;
  nodes: Record<string, Node>;
};

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export type DrillCategory =
  | "footwork"
  | "attack"
  | "defense"
  | "serve-receive"
  | "multiball"
  | "match-play"
  | "technique"
  | "consistency";

export type Drill = {
  name: string;
  slug: string;
  description: string;
  objectives: string[];
  difficulty: DifficultyLevel;
  categories: DrillCategory[];
  tips: string[];
  duration?: string; // e.g., "5-10 minutes"
  graph: StepGraph;
};

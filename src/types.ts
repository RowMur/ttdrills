type Spin = "top" | "back" | "no";

type Depth = "short" | "halflong" | "long";

type Direction = "forehand" | "backhand" | "middle";

export type Placement = {
  depth: Depth;
  direction: Direction;
};

export type ShotType = "forehand" | "backhand";

// export type Repetition =
//   | number
//   | {
//       min: number;
//       max: number;
//     };

type Ball = {
  stroke: ShotType;
  spin: Spin;
  placement: Placement;
  // repetition?: Repetition;
};

export type Exchange = [Ball | undefined, Ball | undefined];

type LoopBehavior = "continuous" | "free";

export type Drill = {
  name: string;
  balls: Ball[];
  loopBehavior: LoopBehavior;
};

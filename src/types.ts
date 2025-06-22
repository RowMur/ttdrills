type Spin = "top" | "back" | "no";

type Depth = "short" | "halflong" | "long";

type Direction = "forehand" | "backhand" | "middle";

type Placement = {
  depth: Depth;
  direction: Direction;
};

type Shot = {
  spin: Spin;
  from: Placement;
};

export type Drill = {
  name: string;
  shots: Shot[];
};

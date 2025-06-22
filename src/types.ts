type Spin = "top" | "back" | "no";

type Depth = "short" | "halflong" | "long";

type Direction = "forehand" | "backhand" | "middle";

type Placement = {
  depth: Depth;
  direction: Direction;
};

export type ShotType = "forehand" | "backhand";

type Shot = {
  type: ShotType;
  spin: Spin;
  from: Placement;
};

export type Drill = {
  name: string;
  shots: Shot[];
};

type Spin = "top" | "back" | "no";

type Depth = "short" | "halflong" | "long";

type Direction = "forehand" | "backhand" | "middle";

type Placement = {
  depth: Depth;
  direction: Direction;
};

export type ShotType = "forehand" | "backhand";

export type Repetition =
  | number
  | {
      min: number;
      max: number;
    };

type Shot = {
  type: ShotType;
  spin: Spin;
  from: Placement;
  repetition?: Repetition;
};

export type Drill = {
  name: string;
  shots: Shot[];
};

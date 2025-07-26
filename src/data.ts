import { Drill, ShotType, Spin } from "@/types";

export const shotTypeShorthand: Record<ShotType, string> = {
  forehand: "FH",
  backhand: "BH",
  serve: "S",
};

export const shotTypeDisplay: Record<ShotType, string> = {
  forehand: "FH",
  backhand: "BH",
  serve: "Serve",
};

export const spinDisplay: Record<Spin, string> = {
  top: "Topspin",
  back: "Backspin",
  block: "Block",
  no: "Float",
};

export const DRILLS: Drill[] = [
  {
    name: "2 Backhands, 2 Forehands",
    slug: "2-backhands-2-forehands",
    graph: {
      entryPoint: "backhand1",
      nodes: {
        backhand1: {
          id: "backhand1",
          prev: ["block4"],
          next: ["block1"],
          ball: {
            spin: "top",
            stroke: "backhand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: false,
          },
        },
        block1: {
          id: "block1",
          prev: ["backhand1"],
          next: ["backhand2"],
          ball: {
            spin: "block",
            stroke: "backhand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: true,
          },
        },
        backhand2: {
          id: "backhand2",
          prev: ["block1"],
          next: ["block2"],
          ball: {
            spin: "top",
            stroke: "backhand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: false,
          },
        },
        block2: {
          id: "block2",
          prev: ["backhand2"],
          next: ["forehand1"],
          ball: {
            spin: "block",
            stroke: "backhand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: true,
          },
        },
        forehand1: {
          id: "forehand1",
          prev: ["block2"],
          next: ["block3"],
          ball: {
            spin: "top",
            stroke: "forehand",
            placement: { depth: "long", direction: "forehand" },
            isOpponent: false,
          },
        },
        block3: {
          id: "block3",
          prev: ["forehand1"],
          next: ["forehand2"],
          ball: {
            spin: "block",
            stroke: "backhand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: true,
          },
        },
        forehand2: {
          id: "forehand2",
          prev: ["block3"],
          next: ["block4"],
          ball: {
            spin: "top",
            stroke: "forehand",
            placement: { depth: "long", direction: "forehand" },
            isOpponent: false,
          },
        },
        block4: {
          id: "block4",
          prev: ["forehand2"],
          next: ["backhand1"],
          ball: {
            spin: "block",
            stroke: "backhand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: true,
          },
        },
      },
    },
  },
  {
    name: "Falkenberg",
    slug: "falkenberg",
    graph: {
      entryPoint: "backhand1",
      nodes: {
        backhand1: {
          id: "backhand1",
          prev: ["block3"],
          next: ["block1"],
          ball: {
            spin: "top",
            stroke: "backhand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: false,
          },
        },
        block1: {
          id: "block1",
          prev: ["backhand1"],
          next: ["forehand1"],
          ball: {
            spin: "block",
            stroke: "backhand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: true,
          },
        },
        forehand1: {
          id: "forehand1",
          prev: ["block1"],
          next: ["block2"],
          ball: {
            spin: "top",
            stroke: "forehand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: false,
          },
        },
        block2: {
          id: "block2",
          prev: ["forehand1"],
          next: ["forehand2"],
          ball: {
            spin: "block",
            stroke: "backhand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: true,
          },
        },
        forehand2: {
          id: "forehand2",
          prev: ["block2"],
          next: ["block3"],
          ball: {
            spin: "top",
            stroke: "forehand",
            placement: { depth: "long", direction: "forehand" },
            isOpponent: false,
          },
        },
        block3: {
          id: "block3",
          prev: ["forehand2"],
          next: ["backhand1"],
          ball: {
            spin: "block",
            stroke: "backhand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: true,
          },
        },
      },
    },
  },
  {
    name: "1 Backhand, 1 Forehand",
    slug: "1-backhand-1-forehand",
    graph: {
      entryPoint: "backhand1",
      nodes: {
        backhand1: {
          id: "backhand1",
          prev: ["block2"],
          next: ["block1"],
          ball: {
            spin: "top",
            stroke: "backhand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: false,
          },
        },
        block1: {
          id: "block1",
          prev: ["backhand1"],
          next: ["forehand1"],
          ball: {
            spin: "block",
            stroke: "backhand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: true,
          },
        },
        forehand1: {
          id: "forehand1",
          prev: ["block1"],
          next: ["block2"],
          ball: {
            spin: "top",
            stroke: "forehand",
            placement: { depth: "long", direction: "forehand" },
            isOpponent: false,
          },
        },
        block2: {
          id: "block2",
          prev: ["forehand1"],
          next: ["backhand1"],
          ball: {
            spin: "block",
            stroke: "backhand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: true,
          },
        },
      },
    },
  },
  {
    name: "Backhand, Middle, Backhand, Wide",
    slug: "backhand-middle-backhand-wide",
    graph: {
      entryPoint: "backhand1",
      nodes: {
        backhand1: {
          id: "backhand1",
          prev: ["block4"],
          next: ["block1"],
          ball: {
            spin: "top",
            stroke: "backhand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: false,
          },
        },
        block1: {
          id: "block1",
          prev: ["backhand1"],
          next: ["middle1"],
          ball: {
            spin: "block",
            stroke: "backhand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: true,
          },
        },
        middle1: {
          id: "middle1",
          prev: ["block1"],
          next: ["block2"],
          ball: {
            spin: "top",
            stroke: "forehand",
            placement: { depth: "long", direction: "middle" },
            isOpponent: false,
          },
        },
        block2: {
          id: "block2",
          prev: ["middle1"],
          next: ["backhand2"],
          ball: {
            spin: "block",
            stroke: "backhand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: true,
          },
        },
        backhand2: {
          id: "backhand2",
          prev: ["block2"],
          next: ["block3"],
          ball: {
            spin: "top",
            stroke: "backhand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: false,
          },
        },
        block3: {
          id: "block3",
          prev: ["backhand2"],
          next: ["wide1"],
          ball: {
            spin: "block",
            stroke: "backhand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: true,
          },
        },
        wide1: {
          id: "wide1",
          prev: ["block3"],
          next: ["block4"],
          ball: {
            spin: "top",
            stroke: "forehand",
            placement: { depth: "long", direction: "forehand" },
            isOpponent: false,
          },
        },
        block4: {
          id: "block4",
          prev: ["wide1"],
          next: ["backhand1"],
          ball: {
            spin: "block",
            stroke: "backhand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: true,
          },
        },
      },
    },
  },
  {
    name: "1/2 Backhand, 1 Forehand",
    slug: "1-2-backhand-1-forehand",
    graph: {
      entryPoint: "backhand1",
      nodes: {
        backhand1: {
          id: "backhand1",
          prev: ["block3"],
          next: ["block1"],
          ball: {
            spin: "top",
            stroke: "backhand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: false,
          },
        },
        block1: {
          id: "block1",
          prev: ["backhand1"],
          next: ["backhand2", "forehand1"],
          ball: {
            spin: "block",
            stroke: "backhand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: true,
          },
        },
        backhand2: {
          id: "backhand2",
          prev: ["block1"],
          next: ["block2"],
          ball: {
            spin: "top",
            stroke: "backhand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: false,
          },
        },
        block2: {
          id: "block2",
          prev: ["backhand2"],
          next: ["forehand1"],
          ball: {
            spin: "block",
            stroke: "backhand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: true,
          },
        },
        forehand1: {
          id: "forehand1",
          prev: ["block1", "block2"],
          next: ["block3"],
          ball: {
            spin: "top",
            stroke: "forehand",
            placement: { depth: "long", direction: "forehand" },
            isOpponent: false,
          },
        },
        block3: {
          id: "block3",
          prev: ["forehand1"],
          next: ["backhand1"],
          ball: {
            spin: "block",
            stroke: "backhand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: true,
          },
        },
      },
    },
  },
  {
    name: "1/2 Backhand, 1/2 Forehand",
    slug: "1-2-backhand-1-2-forehand",
    graph: {
      entryPoint: "backhand1",
      nodes: {
        backhand1: {
          id: "backhand1",
          prev: ["block3", "block4"],
          next: ["block1"],
          ball: {
            spin: "top",
            stroke: "backhand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: false,
          },
        },
        block1: {
          id: "block1",
          prev: ["backhand1"],
          next: ["backhand2", "forehand1"],
          ball: {
            spin: "block",
            stroke: "backhand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: true,
          },
        },
        backhand2: {
          id: "backhand2",
          prev: ["block1"],
          next: ["block2"],
          ball: {
            spin: "top",
            stroke: "backhand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: false,
          },
        },
        block2: {
          id: "block2",
          prev: ["backhand2"],
          next: ["forehand1"],
          ball: {
            spin: "block",
            stroke: "backhand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: true,
          },
        },
        forehand1: {
          id: "forehand1",
          prev: ["block1", "block2"],
          next: ["block3"],
          ball: {
            spin: "top",
            stroke: "forehand",
            placement: { depth: "long", direction: "forehand" },
            isOpponent: false,
          },
        },
        block3: {
          id: "block3",
          prev: ["forehand1"],
          next: ["forehand2", "backhand1"],
          ball: {
            spin: "block",
            stroke: "backhand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: true,
          },
        },
        forehand2: {
          id: "forehand2",
          prev: ["block3"],
          next: ["block4"],
          ball: {
            spin: "top",
            stroke: "forehand",
            placement: { depth: "long", direction: "forehand" },
            isOpponent: false,
          },
        },
        block4: {
          id: "block4",
          prev: ["forehand2"],
          next: ["backhand1"],
          ball: {
            spin: "block",
            stroke: "backhand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: true,
          },
        },
      },
    },
  },
  {
    name: "Flick and Down the Line",
    slug: "flick-and-down-the-line",
    graph: {
      entryPoint: "serve",
      nodes: {
        serve: {
          id: "serve",
          prev: null,
          next: ["touch"],
          ball: {
            spin: "back",
            stroke: "serve",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: false,
          },
        },
        touch: {
          id: "touch",
          prev: ["serve"],
          next: ["flick"],
          ball: {
            spin: "back",
            stroke: "backhand",
            placement: { depth: "short", direction: "backhand" },
            isOpponent: true,
          },
        },
        flick: {
          id: "flick",
          prev: ["touch"],
          next: ["block"],
          ball: {
            spin: "top",
            stroke: "backhand",
            placement: { depth: "short", direction: "middle" },
            isOpponent: false,
          },
        },
        block: {
          id: "block",
          prev: ["flick"],
          next: ["line"],
          ball: {
            spin: "block",
            stroke: "backhand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: true,
          },
        },
        line: {
          id: "line",
          prev: ["block"],
          next: ["counter"],
          ball: {
            spin: "top",
            stroke: "backhand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: false,
          },
        },
        counter: {
          id: "counter",
          prev: ["line"],
          next: null,
          ball: {
            spin: "top",
            stroke: "forehand",
            placement: { depth: "long", direction: "forehand" },
            isOpponent: true,
          },
        },
      },
    },
  },
  {
    name: "3rd Ball Forehand Pivot",
    slug: "3rd-ball-forehand-pivot",
    graph: {
      entryPoint: "serve",
      nodes: {
        serve: {
          id: "serve",
          prev: null,
          next: ["return"],
          ball: {
            spin: "top",
            stroke: "serve",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: false,
          },
        },
        return: {
          id: "return",
          prev: ["serve"],
          next: ["forehand-pivot"],
          ball: {
            spin: "top",
            stroke: "backhand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: true,
          },
        },
        "forehand-pivot": {
          id: "forehand-pivot",
          prev: ["return"],
          next: ["counter"],
          ball: {
            spin: "top",
            stroke: "forehand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: false,
          },
        },
        counter: {
          id: "counter",
          prev: ["forehand-pivot"],
          next: null,
          ball: {
            spin: "top",
            stroke: "forehand",
            placement: { depth: "long", direction: "forehand" },
            isOpponent: true,
          },
        },
      },
    },
  },
];

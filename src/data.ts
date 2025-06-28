import { Drill, ShotType } from "@/types";

export const shotTypeShorthand: Record<ShotType, string> = {
  forehand: "FH",
  backhand: "BH",
  serve: "S",
};

export const DRILLS: Drill[] = [
  {
    name: "2 Backhands, 2 Forehands",
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
            spin: "top",
            stroke: "backhand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: true,
          },
        },
        backhand2: {
          id: "backhand1",
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
            spin: "top",
            stroke: "backhand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: true,
          },
        },
        forehand1: {
          id: "forehand1 ",
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
            spin: "top",
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
            spin: "top",
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
            spin: "top",
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
            spin: "top",
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
            spin: "top",
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
    graph: {
      entryPoint: "backhand1",
      nodes: {
        backhand1: {
          id: "backhand1",
          prev: null,
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
            spin: "top",
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
            spin: "top",
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
    graph: {
      entryPoint: "backhand1",
      nodes: {
        backhand1: {
          id: "backhand1",
          prev: null,
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
            spin: "top",
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
            spin: "top",
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
            spin: "top",
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
            spin: "top",
            stroke: "backhand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: true,
          },
        },
      },
    },
  },
  // // {
  // //   name: "1/2 Backhand, 1 Forehand",
  // //   shots: [
  // //     {
  // //       spin: "top",
  // //       type: "backhand",
  // //       from: { depth: "long", direction: "backhand" },
  // //       to: { depth: "long", direction: "backhand" },
  // //       repetition: { min: 1, max: 2 },
  // //     },
  // //     {
  // //       spin: "top",
  // //       type: "forehand",
  // //       from: { depth: "long", direction: "forehand" },
  // //       to: { depth: "long", direction: "backhand" },
  // //     },
  // //   ],
  // //   loopBehavior: "continuous",
  // // },
  // // {
  // //   name: "1/2 Backhand, 1/2 Forehand",
  // //   shots: [
  // //     {
  // //       spin: "top",
  // //       type: "backhand",
  // //       from: { depth: "long", direction: "backhand" },
  // //       to: { depth: "long", direction: "backhand" },
  // //       repetition: { min: 1, max: 2 },
  // //     },
  // //     {
  // //       spin: "top",
  // //       type: "forehand",
  // //       from: { depth: "long", direction: "forehand" },
  // //       to: { depth: "long", direction: "backhand" },
  // //       repetition: { min: 1, max: 2 },
  // //     },
  // //   ],
  // //   loopBehavior: "continuous",
  // // },
  {
    name: "Flick and Down the Line",
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
            spin: "back",
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
            spin: "top",
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
    graph: {
      entryPoint: "serve",
      nodes: {
        serve: {
          id: "serve",
          prev: null,
          next: ["return"],
          ball: {
            spin: "back",
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
            spin: "no",
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

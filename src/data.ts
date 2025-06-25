import { Drill, ShotType } from "@/types";

export const shotTypeShorthand: Record<ShotType, string> = {
  forehand: "FH",
  backhand: "BH",
};

export const DRILLS: Drill[] = [
  {
    name: "2 Backhands, 2 Forehands",
    shots: [
      {
        spin: "top",
        type: "backhand",
        from: { depth: "long", direction: "backhand" },
        repetition: 2,
      },
      {
        spin: "top",
        type: "forehand",
        from: { depth: "long", direction: "forehand" },
        repetition: 2,
      },
    ],
    loopBehavior: "continuous",
  },
  {
    name: "Falkenberg",
    shots: [
      {
        spin: "top",
        type: "backhand",
        from: { depth: "long", direction: "backhand" },
      },
      {
        spin: "top",
        type: "forehand",
        from: { depth: "long", direction: "backhand" },
      },
      {
        spin: "top",
        type: "forehand",
        from: { depth: "long", direction: "forehand" },
      },
    ],
    loopBehavior: "continuous",
  },
  {
    name: "1 Backhand, 1 Forehand",
    shots: [
      {
        spin: "top",
        type: "backhand",
        from: { depth: "long", direction: "backhand" },
      },
      {
        spin: "top",
        type: "forehand",
        from: { depth: "long", direction: "forehand" },
      },
    ],
    loopBehavior: "continuous",
  },
  {
    name: "Backhand, Middle, Backhand, Wide",
    shots: [
      {
        spin: "top",
        type: "backhand",
        from: { depth: "long", direction: "backhand" },
      },
      {
        spin: "top",
        type: "forehand",
        from: { depth: "long", direction: "middle" },
      },
      {
        spin: "top",
        type: "backhand",
        from: { depth: "long", direction: "backhand" },
      },
      {
        spin: "top",
        type: "forehand",
        from: { depth: "long", direction: "forehand" },
      },
    ],
    loopBehavior: "continuous",
  },
  {
    name: "1/2 Backhand, 1 Forehand",
    shots: [
      {
        spin: "top",
        type: "backhand",
        from: { depth: "long", direction: "backhand" },
        repetition: { min: 1, max: 2 },
      },
      {
        spin: "top",
        type: "forehand",
        from: { depth: "long", direction: "forehand" },
      },
    ],
    loopBehavior: "continuous",
  },
  {
    name: "1/2 Backhand, 1/2 Forehand",
    shots: [
      {
        spin: "top",
        type: "backhand",
        from: { depth: "long", direction: "backhand" },
        repetition: { min: 1, max: 2 },
      },
      {
        spin: "top",
        type: "forehand",
        from: { depth: "long", direction: "forehand" },
        repetition: { min: 1, max: 2 },
      },
    ],
    loopBehavior: "continuous",
  },
];

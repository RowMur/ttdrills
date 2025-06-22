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
      {
        spin: "top",
        type: "forehand",
        from: { depth: "long", direction: "forehand" },
      },
    ],
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
  },
];

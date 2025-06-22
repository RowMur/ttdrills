import { Drill } from "@/types";

export const DRILLS: Drill[] = [
  {
    name: "2 Backhands, 2 Forehands",
    shots: [
      { spin: "top", from: { depth: "long", direction: "backhand" } },
      { spin: "top", from: { depth: "long", direction: "backhand" } },
      { spin: "top", from: { depth: "long", direction: "forehand" } },
      { spin: "top", from: { depth: "long", direction: "forehand" } },
    ],
  },
];

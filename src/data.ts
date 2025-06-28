import { Drill, ShotType } from "@/types";

export const shotTypeShorthand: Record<ShotType, string> = {
  forehand: "FH",
  backhand: "BH",
};

export const DRILLS: Drill[] = [
  {
    name: "2 Backhands, 2 Forehands",
    balls: [
      {
        spin: "top",
        stroke: "backhand",
        placement: { depth: "long", direction: "backhand" },
      },
      {
        spin: "top",
        stroke: "backhand",
        placement: { depth: "long", direction: "backhand" },
      },
      {
        spin: "top",
        stroke: "backhand",
        placement: { depth: "long", direction: "backhand" },
      },
      {
        spin: "top",
        stroke: "backhand",
        placement: { depth: "long", direction: "backhand" },
      },
      {
        spin: "top",
        stroke: "forehand",
        placement: { depth: "long", direction: "forehand" },
      },
      {
        spin: "top",
        stroke: "backhand",
        placement: { depth: "long", direction: "backhand" },
      },
      {
        spin: "top",
        stroke: "forehand",
        placement: { depth: "long", direction: "forehand" },
      },
      {
        spin: "top",
        stroke: "backhand",
        placement: { depth: "long", direction: "backhand" },
      },
    ],
    loopBehavior: "continuous",
  },
  {
    name: "Falkenberg",
    balls: [
      {
        spin: "top",
        stroke: "backhand",
        placement: { depth: "long", direction: "backhand" },
      },
      {
        spin: "top",
        stroke: "backhand",
        placement: { depth: "long", direction: "backhand" },
      },
      {
        spin: "top",
        stroke: "forehand",
        placement: { depth: "long", direction: "backhand" },
      },
      {
        spin: "top",
        stroke: "backhand",
        placement: { depth: "long", direction: "backhand" },
      },
      {
        spin: "top",
        stroke: "forehand",
        placement: { depth: "long", direction: "forehand" },
      },
      {
        spin: "top",
        stroke: "backhand",
        placement: { depth: "long", direction: "backhand" },
      },
    ],
    loopBehavior: "continuous",
  },
  {
    name: "1 Backhand, 1 Forehand",
    balls: [
      {
        spin: "top",
        stroke: "backhand",
        placement: { depth: "long", direction: "backhand" },
      },
      {
        spin: "top",
        stroke: "backhand",
        placement: { depth: "long", direction: "backhand" },
      },
      {
        spin: "top",
        stroke: "forehand",
        placement: { depth: "long", direction: "forehand" },
      },
      {
        spin: "top",
        stroke: "backhand",
        placement: { depth: "long", direction: "backhand" },
      },
    ],
    loopBehavior: "continuous",
  },
  {
    name: "Backhand, Middle, Backhand, Wide",
    balls: [
      {
        spin: "top",
        stroke: "backhand",
        placement: { depth: "long", direction: "backhand" },
      },
      {
        spin: "top",
        stroke: "backhand",
        placement: { depth: "long", direction: "backhand" },
      },
      {
        spin: "top",
        stroke: "forehand",
        placement: { depth: "long", direction: "middle" },
      },
      {
        spin: "top",
        stroke: "backhand",
        placement: { depth: "long", direction: "backhand" },
      },
      {
        spin: "top",
        stroke: "backhand",
        placement: { depth: "long", direction: "backhand" },
      },
      {
        spin: "top",
        stroke: "backhand",
        placement: { depth: "long", direction: "backhand" },
      },
      {
        spin: "top",
        stroke: "forehand",
        placement: { depth: "long", direction: "forehand" },
      },
      {
        spin: "top",
        stroke: "backhand",
        placement: { depth: "long", direction: "backhand" },
      },
    ],
    loopBehavior: "continuous",
  },
  // {
  //   name: "1/2 Backhand, 1 Forehand",
  //   shots: [
  //     {
  //       spin: "top",
  //       type: "backhand",
  //       from: { depth: "long", direction: "backhand" },
  //       to: { depth: "long", direction: "backhand" },
  //       repetition: { min: 1, max: 2 },
  //     },
  //     {
  //       spin: "top",
  //       type: "forehand",
  //       from: { depth: "long", direction: "forehand" },
  //       to: { depth: "long", direction: "backhand" },
  //     },
  //   ],
  //   loopBehavior: "continuous",
  // },
  // {
  //   name: "1/2 Backhand, 1/2 Forehand",
  //   shots: [
  //     {
  //       spin: "top",
  //       type: "backhand",
  //       from: { depth: "long", direction: "backhand" },
  //       to: { depth: "long", direction: "backhand" },
  //       repetition: { min: 1, max: 2 },
  //     },
  //     {
  //       spin: "top",
  //       type: "forehand",
  //       from: { depth: "long", direction: "forehand" },
  //       to: { depth: "long", direction: "backhand" },
  //       repetition: { min: 1, max: 2 },
  //     },
  //   ],
  //   loopBehavior: "continuous",
  // },
  {
    name: "Flick and Down the Line",
    balls: [
      {
        spin: "back",
        stroke: "backhand",
        placement: { depth: "long", direction: "backhand" },
      },
      {
        spin: "back",
        stroke: "backhand",
        placement: { depth: "short", direction: "backhand" },
      },
      {
        spin: "back",
        stroke: "backhand",
        placement: { depth: "short", direction: "middle" },
      },
      {
        spin: "top",
        stroke: "backhand",
        placement: { depth: "long", direction: "backhand" },
      },
      {
        spin: "top",
        stroke: "backhand",
        placement: { depth: "long", direction: "backhand" },
      },
      {
        spin: "top",
        stroke: "forehand",
        placement: { depth: "long", direction: "forehand" },
      },
    ],
    loopBehavior: "free",
  },
];

import { Drill } from "@/types";

export const COMPREHENSIVE_DRILLS: Drill[] = [
  {
    name: "2 Backhands, 2 Forehands",
    slug: "2-backhands-2-forehands",
    videoUrl: "https://www.youtube.com/watch?v=P5GNNVxyhWc",
    videoStart: 22,
    creatorId: "00000000-0000-0000-0000-000000000000",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    description:
      "A classic consistency drill alternating between backhand and forehand strokes to develop rhythm and footwork.",
    objectives: [
      "Improve backhand to forehand transition",
      "Develop consistent stroke rhythm",
      "Practice basic footwork patterns",
      "Build rally endurance",
    ],
    difficulty: "beginner",
    categories: ["technique", "consistency", "footwork"],
    tips: [
      "Focus on smooth transitions between strokes",
      "Keep your feet moving throughout the drill",
      "Maintain consistent contact point for both strokes",
      "Start slow and gradually increase speed",
    ],
    duration: "5-10 minutes",
    graph: {
      entryPoint: "backhand-1",
      nodes: {
        "backhand-1": {
          id: "backhand-1",
          prev: ["block-3"],
          next: ["block"],
          ball: {
            stroke: "backhand",
            spin: "top",
            placement: {
              depth: "long",
              direction: "backhand",
            },
            isOpponent: false,
          },
        },
        block: {
          id: "block",
          prev: ["backhand-1"],
          next: ["backhand"],
          ball: {
            stroke: "backhand",
            spin: "block",
            placement: {
              depth: "long",
              direction: "backhand",
            },
            isOpponent: true,
          },
        },
        backhand: {
          id: "backhand",
          prev: ["block"],
          next: ["block-1"],
          ball: {
            stroke: "backhand",
            spin: "top",
            placement: {
              depth: "long",
              direction: "backhand",
            },
            isOpponent: false,
          },
        },
        "block-1": {
          id: "block-1",
          prev: ["backhand"],
          next: ["forehand"],
          ball: {
            stroke: "backhand",
            spin: "block",
            placement: {
              depth: "long",
              direction: "forehand",
            },
            isOpponent: true,
          },
        },
        forehand: {
          id: "forehand",
          prev: ["block-1"],
          next: ["block-2"],
          ball: {
            stroke: "forehand",
            spin: "top",
            placement: {
              depth: "long",
              direction: "backhand",
            },
            isOpponent: false,
          },
        },
        "block-2": {
          id: "block-2",
          prev: ["forehand"],
          next: ["forehand-1"],
          ball: {
            stroke: "backhand",
            spin: "block",
            placement: {
              depth: "long",
              direction: "forehand",
            },
            isOpponent: true,
          },
        },
        "forehand-1": {
          id: "forehand-1",
          prev: ["block-2"],
          next: ["block-3"],
          ball: {
            stroke: "forehand",
            spin: "top",
            placement: {
              depth: "long",
              direction: "backhand",
            },
            isOpponent: false,
          },
        },
        "block-3": {
          id: "block-3",
          prev: ["forehand-1"],
          next: ["backhand-1"],
          ball: {
            stroke: "backhand",
            spin: "block",
            placement: {
              depth: "long",
              direction: "backhand",
            },
            isOpponent: true,
          },
        },
      },
    },
  },

  {
    creatorId: "00000000-0000-0000-0000-000000000000",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    name: "Falkenberg Drill",
    slug: "falkenberg",
    videoUrl: "https://www.youtube.com/watch?v=Ebl0ZRBfJt0",
    videoStart: 35,
    description:
      "Named after the Swedish training center, this drill focuses on backhand-forehand combinations with crosscourt patterns.",
    objectives: [
      "Master backhand to forehand crosscourt patterns",
      "Develop consistent placement accuracy",
      "Improve stroke timing and rhythm",
      "Build endurance for longer rallies",
    ],
    difficulty: "intermediate",
    categories: ["consistency", "technique", "attack"],
    tips: [
      "Focus on crosscourt angles for better placement",
      "Use proper hip rotation for power generation",
      "Keep the ball low over the net for better control",
      "Practice with varying speeds to challenge yourself",
    ],
    duration: "8-12 minutes",
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
            placement: { depth: "long", direction: "forehand" },
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
            placement: { depth: "long", direction: "backhand" },
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
    creatorId: "00000000-0000-0000-0000-000000000000",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    name: "1 Backhand, 1 Forehand",
    slug: "1-backhand-1-forehand",
    videoUrl: "https://www.youtube.com/watch?v=EnrbMBqabGE", // Example video URL
    videoStart: 12,
    description:
      "Simple alternating pattern between backhand and forehand strokes for basic consistency.",
    objectives: [
      "Learn basic stroke alternation",
      "Develop fundamental timing",
      "Practice simple footwork patterns",
      "Build basic rally skills",
    ],
    difficulty: "beginner",
    categories: ["consistency", "technique"],
    tips: [
      "Focus on contact point consistency",
      "Keep strokes simple and controlled",
      "Move smoothly between positions",
      "Maintain steady rhythm",
    ],
    duration: "5-8 minutes",
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
            placement: { depth: "long", direction: "forehand" },
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
    creatorId: "00000000-0000-0000-0000-000000000000",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    name: "Backhand, Middle, Backhand, Wide",
    slug: "backhand-middle-backhand-wide",
    videoUrl: "https://www.youtube.com/watch?v=LajBrVdLehM",
    description:
      "A challenging footwork drill that combines placement variety with consistent backhand and forehand execution.",
    objectives: [
      "Develop court coverage and positioning",
      "Master placement control under movement",
      "Improve transition between different shot directions",
      "Build stamina for extended rallies",
    ],
    difficulty: "intermediate",
    categories: ["footwork", "consistency", "technique"],
    tips: [
      "Stay light on your feet throughout the sequence",
      "Focus on consistent contact point despite movement",
      "Use proper recovery steps between shots",
      "Keep your paddle ready position consistent",
    ],
    duration: "8-12 minutes",
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
            placement: { depth: "long", direction: "middle" },
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
            placement: { depth: "long", direction: "backhand" },
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
            placement: { depth: "long", direction: "forehand" },
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
            placement: { depth: "long", direction: "backhand" },
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
    creatorId: "00000000-0000-0000-0000-000000000000",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    name: "1/2 Backhand, 1 Forehand",
    slug: "1-2-backhand-1-forehand",
    description:
      "A decision-making drill that teaches players to vary their backhand patterns before transitioning to forehand.",
    objectives: [
      "Develop tactical decision-making skills",
      "Learn to vary backhand patterns",
      "Improve adaptability in rally situations",
      "Master timing for backhand-to-forehand transitions",
    ],
    difficulty: "intermediate",
    categories: ["technique", "consistency", "match-play"],
    tips: [
      "Read the situation to decide between 1 or 2 backhands",
      "Keep your options open until the last moment",
      "Practice both pattern variations equally",
      "Focus on smooth transitions regardless of pattern",
    ],
    duration: "10-12 minutes",
    graph: {
      entryPoint: "backhand",
      nodes: {
        backhand: {
          id: "backhand",
          prev: ["block-back-to-backhand"],
          next: ["block-to-backhand", "block-to-forehand"],
          ball: {
            stroke: "backhand",
            spin: "top",
            placement: {
              depth: "long",
              direction: "backhand",
            },
            isOpponent: false,
          },
        },
        "block-to-backhand": {
          id: "block-to-backhand",
          prev: ["backhand"],
          next: ["backhand-1"],
          ball: {
            stroke: "backhand",
            spin: "block",
            placement: {
              depth: "long",
              direction: "backhand",
            },
            isOpponent: true,
          },
        },
        "backhand-1": {
          id: "backhand-1",
          prev: ["block-to-backhand"],
          next: ["block-to-forehand"],
          ball: {
            stroke: "backhand",
            spin: "top",
            placement: {
              depth: "long",
              direction: "backhand",
            },
            isOpponent: false,
          },
        },
        "block-to-forehand": {
          id: "block-to-forehand",
          prev: ["backhand", "backhand-1"],
          next: ["forehand"],
          ball: {
            stroke: "backhand",
            spin: "block",
            placement: {
              depth: "long",
              direction: "forehand",
            },
            isOpponent: true,
          },
        },
        forehand: {
          id: "forehand",
          prev: ["block-to-forehand"],
          next: ["block-back-to-backhand"],
          ball: {
            stroke: "forehand",
            spin: "top",
            placement: {
              depth: "long",
              direction: "backhand",
            },
            isOpponent: false,
          },
        },
        "block-back-to-backhand": {
          id: "block-back-to-backhand",
          prev: ["forehand"],
          next: ["backhand"],
          ball: {
            stroke: "backhand",
            spin: "block",
            placement: {
              depth: "long",
              direction: "backhand",
            },
            isOpponent: true,
          },
        },
      },
    },
  },

  {
    creatorId: "00000000-0000-0000-0000-000000000000",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    name: "1/2 Backhand, 1/2 Forehand",
    slug: "1-2-backhand-1-2-forehand",
    videoUrl: "https://www.youtube.com/watch?v=XsZp8nTjZ2c",
    videoStart: 60,
    description:
      "An advanced pattern drill with multiple decision points that develops tactical flexibility and adaptability.",
    objectives: [
      "Master complex decision-making patterns",
      "Develop advanced tactical awareness",
      "Improve pattern recognition skills",
      "Build confidence in varied rally situations",
    ],
    difficulty: "advanced",
    categories: ["technique", "match-play", "consistency"],
    tips: [
      "Stay mentally engaged throughout the pattern",
      "Practice all possible combinations equally",
      "Focus on smooth execution regardless of choices",
      "Use this drill to simulate match unpredictability",
    ],
    duration: "12-15 minutes",
    graph: {
      entryPoint: "backhand",
      nodes: {
        backhand: {
          id: "backhand",
          prev: ["block-back-to-backhand"],
          next: ["block-to-backhand", "block-to-forehand"],
          ball: {
            stroke: "backhand",
            spin: "top",
            placement: {
              depth: "long",
              direction: "backhand",
            },
            isOpponent: false,
          },
        },
        "block-to-backhand": {
          id: "block-to-backhand",
          prev: ["backhand"],
          next: ["backhand-2"],
          ball: {
            stroke: "backhand",
            spin: "block",
            placement: {
              depth: "long",
              direction: "backhand",
            },
            isOpponent: true,
          },
        },
        "backhand-2": {
          id: "backhand-2",
          prev: ["block-to-backhand"],
          next: ["block-to-forehand"],
          ball: {
            stroke: "backhand",
            spin: "top",
            placement: {
              depth: "long",
              direction: "backhand",
            },
            isOpponent: false,
          },
        },
        "block-to-forehand": {
          id: "block-to-forehand",
          prev: ["backhand", "backhand-2"],
          next: ["forehand"],
          ball: {
            stroke: "backhand",
            spin: "block",
            placement: {
              depth: "long",
              direction: "forehand",
            },
            isOpponent: true,
          },
        },
        forehand: {
          id: "forehand",
          prev: ["block-to-forehand"],
          next: ["block-back-to-backhand", "block-back-to-forehand"],
          ball: {
            stroke: "forehand",
            spin: "top",
            placement: {
              depth: "long",
              direction: "backhand",
            },
            isOpponent: false,
          },
        },
        "block-back-to-backhand": {
          id: "block-back-to-backhand",
          prev: ["forehand", "forehand-2"],
          next: ["backhand"],
          ball: {
            stroke: "backhand",
            spin: "block",
            placement: {
              depth: "long",
              direction: "backhand",
            },
            isOpponent: true,
          },
        },
        "block-back-to-forehand": {
          id: "block-back-to-forehand",
          prev: ["forehand"],
          next: ["forehand-2"],
          ball: {
            stroke: "backhand",
            spin: "block",
            placement: {
              depth: "long",
              direction: "forehand",
            },
            isOpponent: true,
          },
        },
        "forehand-2": {
          id: "forehand-2",
          prev: ["block-back-to-forehand"],
          next: ["block-back-to-backhand"],
          ball: {
            stroke: "forehand",
            spin: "top",
            placement: {
              depth: "long",
              direction: "backhand",
            },
            isOpponent: false,
          },
        },
      },
    },
  },

  {
    creatorId: "00000000-0000-0000-0000-000000000000",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    name: "Flick and Down the Line",
    slug: "flick-and-down-the-line",
    description:
      "Advanced serve-receive drill combining aggressive flick with down-the-line finishing shot.",
    objectives: [
      "Master aggressive serve return techniques",
      "Develop down-the-line finishing ability",
      "Practice serve-receive attack patterns",
      "Improve placement accuracy under pressure",
    ],
    difficulty: "advanced",
    categories: ["serve-receive", "attack", "technique"],
    tips: [
      "Commit fully to the flick attack",
      "Use surprise element with down-the-line shots",
      "Practice against different serve types",
      "Focus on early ball contact",
    ],
    duration: "8-10 minutes",
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
            placement: { depth: "short", direction: "backhand" },
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
            placement: { depth: "short", direction: "middle" },
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
            placement: { depth: "long", direction: "backhand" },
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
          next: null,
          ball: {
            spin: "top",
            stroke: "backhand",
            placement: { depth: "long", direction: "forehand" },
            isOpponent: false,
          },
        },
      },
    },
  },

  {
    creatorId: "00000000-0000-0000-0000-000000000000",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    name: "3rd Ball Forehand Pivot",
    slug: "3rd-ball-forehand-pivot",
    description:
      "Master the crucial 3rd ball attack using forehand pivot technique after serving.",
    objectives: [
      "Develop 3rd ball attack patterns",
      "Master forehand pivot footwork",
      "Learn to create attacking opportunities from serves",
      "Improve serve-attack combinations",
    ],
    difficulty: "intermediate",
    categories: ["serve-receive", "attack", "footwork"],
    tips: [
      "Serve with intention to attack 3rd ball",
      "Practice pivot footwork until it's automatic",
      "Vary your attack placement",
      "Stay balanced during the pivot movement",
    ],
    duration: "10-12 minutes",
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
          next: null,
          ball: {
            spin: "top",
            stroke: "forehand",
            placement: { depth: "long", direction: "forehand" },
            isOpponent: false,
          },
        },
      },
    },
  },
  {
    slug: "five-forehands",
    name: "Five Forehands",
    description:
      "The drill is five forehands; forehand from middle, forehand from backhand side, forehand from middle, forehand from backhand side, and forehand from wide forehand. This is all going into a backhand block, except for the fifth forehand which goes across the table to the blockers forehand. Then the rally goes into free play.",
    categories: ["technique", "consistency", "footwork"],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    difficulty: "intermediate",
    objectives: [],
    tips: [],
    creatorId: "00000000-0000-0000-0000-000000000000",
    videoUrl: "https://www.youtube.com/watch?v=3EnAQWQ7CMk",
    videoStart: 50,
    graph: {
      nodes: {
        block: {
          id: "block",
          ball: {
            spin: "block",
            stroke: "backhand",
            placement: { depth: "long", direction: "middle" },
            isOpponent: true,
          },
          next: ["middle"],
          prev: ["serve-1"],
        },
        middle: {
          id: "middle",
          ball: {
            spin: "top",
            stroke: "forehand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: false,
          },
          next: ["block-to-backhand"],
          prev: ["block"],
        },
        "serve-1": {
          id: "serve-1",
          ball: {
            spin: "top",
            stroke: "serve",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: false,
          },
          next: ["block"],
          prev: null,
        },
        forehand: {
          id: "forehand",
          ball: {
            spin: "top",
            stroke: "forehand",
            placement: { depth: "long", direction: "forehand" },
            isOpponent: false,
          },
          next: [],
          prev: ["block-to-forehand"],
        },
        "middle-again": {
          id: "middle-again",
          ball: {
            spin: "top",
            stroke: "forehand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: false,
          },
          next: ["block-back-to-backhand"],
          prev: ["block-back-to-middle"],
        },
        "from-backhand": {
          id: "from-backhand",
          ball: {
            spin: "top",
            stroke: "forehand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: false,
          },
          next: ["block-back-to-middle"],
          prev: ["block-to-backhand"],
        },
        "block-to-backhand": {
          id: "block-to-backhand",
          ball: {
            spin: "block",
            stroke: "backhand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: true,
          },
          next: ["from-backhand"],
          prev: ["middle"],
        },
        "block-to-forehand": {
          id: "block-to-forehand",
          ball: {
            spin: "block",
            stroke: "backhand",
            placement: { depth: "long", direction: "forehand" },
            isOpponent: true,
          },
          next: ["forehand"],
          prev: ["from-backhand-again"],
        },
        "from-backhand-again": {
          id: "from-backhand-again",
          ball: {
            spin: "top",
            stroke: "forehand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: false,
          },
          next: ["block-to-forehand"],
          prev: ["block-back-to-backhand"],
        },
        "block-back-to-middle": {
          id: "block-back-to-middle",
          ball: {
            spin: "block",
            stroke: "backhand",
            placement: { depth: "long", direction: "middle" },
            isOpponent: true,
          },
          next: ["middle-again"],
          prev: ["from-backhand"],
        },
        "block-back-to-backhand": {
          id: "block-back-to-backhand",
          ball: {
            spin: "block",
            stroke: "backhand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: true,
          },
          next: ["from-backhand-again"],
          prev: ["middle-again"],
        },
      },
      entryPoint: "serve-1",
    },
  },
  {
    name: "Irregular Middle Control",
    slug: "irregular-middle-control",
    creatorId: "00000000-0000-0000-0000-000000000000",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    description:
      "Passive blocker in middle alternates between blocking to middle and either one of forehand or backhand.",
    objectives: [],
    difficulty: "intermediate",
    categories: ["footwork", "match-play"],
    tips: [],
    graph: {
      nodes: {
        serve: {
          id: "serve",
          ball: {
            spin: "top",
            stroke: "forehand",
            placement: {
              depth: "long",
              direction: "middle",
            },
            isOpponent: false,
          },
          next: ["block-to-backhand", "block-to-forehand"],
          prev: ["block-to-middle"],
        },
        backhand: {
          id: "backhand",
          ball: {
            spin: "top",
            stroke: "backhand",
            placement: {
              depth: "long",
              direction: "middle",
            },
            isOpponent: false,
          },
          next: ["block-to-middle"],
          prev: ["block-to-backhand"],
        },
        forehand: {
          id: "forehand",
          ball: {
            spin: "top",
            stroke: "forehand",
            placement: {
              depth: "long",
              direction: "middle",
            },
            isOpponent: false,
          },
          next: ["block-to-middle"],
          prev: ["block-to-forehand"],
        },
        "block-to-middle": {
          id: "block-to-middle",
          ball: {
            spin: "block",
            stroke: "backhand",
            placement: {
              depth: "long",
              direction: "middle",
            },
            isOpponent: true,
          },
          next: ["serve"],
          prev: ["backhand", "forehand"],
        },
        "block-to-backhand": {
          id: "block-to-backhand",
          ball: {
            spin: "block",
            stroke: "backhand",
            placement: {
              depth: "long",
              direction: "backhand",
            },
            isOpponent: true,
          },
          next: ["backhand"],
          prev: ["serve"],
        },
        "block-to-forehand": {
          id: "block-to-forehand",
          ball: {
            spin: "block",
            stroke: "backhand",
            placement: {
              depth: "long",
              direction: "forehand",
            },
            isOpponent: true,
          },
          next: ["forehand"],
          prev: ["serve"],
        },
      },
      entryPoint: "serve",
    },
  },
  {
    name: "Backhand Open Up",
    slug: "backhand-open-up",
    creatorId: "00000000-0000-0000-0000-000000000000",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    description:
      "A common 3rd ball attack routine. You serve half-long backspin to your opponent’s elbow, really trying to hit their their crossover point to force a weak return. You then topspin to anywhere on the table to try and win the point on the 3rd ball.",
    objectives: [],
    difficulty: "beginner",
    categories: ["attack", "match-play", "serve-receive"],
    tips: [],
    graph: {
      nodes: {
        push: {
          id: "push",
          ball: {
            spin: "back",
            stroke: "forehand",
            placement: {
              depth: "long",
              direction: "backhand",
            },
            isOpponent: true,
          },
          next: ["open-up"],
          prev: ["serve-1"],
        },
        "open-up": {
          id: "open-up",
          ball: {
            spin: "top",
            stroke: "backhand",
            placement: {
              depth: "long",
              direction: "backhand",
            },
            isOpponent: false,
          },
          next: [],
          prev: ["push"],
        },
        "serve-1": {
          id: "serve-1",
          ball: {
            spin: "back",
            stroke: "serve",
            placement: {
              depth: "halflong",
              direction: "middle",
            },
            isOpponent: false,
          },
          next: ["push"],
          prev: null,
        },
      },
      entryPoint: "serve-1",
    },
  },
  {
    name: "Fast push and counter",
    slug: "fast-push-and-counter",
    creatorId: "00000000-0000-0000-0000-000000000000",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    description:
      "In this drill you will practice playing an aggressive push to try and force a weak attack from your opponent and then following up with a fast topspin for the 4th ball. Many players struggle to attack heavy backspin pushes, so it’s a very useful tactic to use. This is also a useful drill to practice switching between a push stroke and a topspin stroke.",
    objectives: [],
    difficulty: "intermediate",
    categories: ["attack", "match-play", "serve-receive"],
    tips: [],
    graph: {
      nodes: {
        touch: {
          id: "touch",
          ball: {
            spin: "back",
            stroke: "backhand",
            placement: {
              depth: "short",
              direction: "middle",
            },
            isOpponent: true,
          },
          next: ["fast-push"],
          prev: ["serve-1"],
        },
        counter: {
          id: "counter",
          ball: {
            spin: "top",
            stroke: "backhand",
            placement: {
              depth: "long",
              direction: "backhand",
            },
            isOpponent: false,
          },
          next: [],
          prev: ["open-up"],
        },
        "open-up": {
          id: "open-up",
          ball: {
            spin: "top",
            stroke: "backhand",
            placement: {
              depth: "long",
              direction: "backhand",
            },
            isOpponent: true,
          },
          next: ["counter"],
          prev: ["fast-push"],
        },
        "serve-1": {
          id: "serve-1",
          ball: {
            spin: "back",
            stroke: "serve",
            placement: {
              depth: "short",
              direction: "middle",
            },
            isOpponent: false,
          },
          next: ["touch"],
          prev: null,
        },
        "fast-push": {
          id: "fast-push",
          ball: {
            spin: "back",
            stroke: "backhand",
            placement: {
              depth: "long",
              direction: "backhand",
            },
            isOpponent: false,
          },
          next: ["open-up"],
          prev: ["touch"],
        },
      },
      entryPoint: "serve-1",
    },
  },
  {
    name: "Two forehand topspins",
    slug: "two-forehand-topspins",
    creatorId: "00000000-0000-0000-0000-000000000000",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    description:
      "In this drill you will practice switching between attacking a backspin return and then attacking a topspin return, both with your forehand. This is a very common combination in table tennis and requires an important change of bat angle between the two topspins. You also get to practice playing attacking topspins crosscourt and down the line.",
    objectives: [],
    difficulty: "intermediate",
    categories: ["footwork", "attack", "match-play", "serve-receive"],
    tips: [],
    graph: {
      nodes: {
        kill: {
          id: "kill",
          ball: {
            spin: "top",
            stroke: "forehand",
            placement: {
              depth: "long",
              direction: "forehand",
            },
            isOpponent: false,
          },
          next: [],
          prev: ["block"],
        },
        push: {
          id: "push",
          ball: {
            spin: "back",
            stroke: "forehand",
            placement: {
              depth: "long",
              direction: "backhand",
            },
            isOpponent: true,
          },
          next: ["open-up"],
          prev: ["serve-1"],
        },
        block: {
          id: "block",
          ball: {
            spin: "block",
            stroke: "backhand",
            placement: {
              depth: "long",
              direction: "backhand",
            },
            isOpponent: true,
          },
          next: ["kill"],
          prev: ["open-up"],
        },
        "open-up": {
          id: "open-up",
          ball: {
            spin: "top",
            stroke: "forehand",
            placement: {
              depth: "long",
              direction: "backhand",
            },
            isOpponent: false,
          },
          next: ["block"],
          prev: ["push"],
        },
        "serve-1": {
          id: "serve-1",
          ball: {
            spin: "back",
            stroke: "serve",
            placement: {
              depth: "halflong",
              direction: "middle",
            },
            isOpponent: false,
          },
          next: ["push"],
          prev: null,
        },
      },
      entryPoint: "serve-1",
    },
  },
  {
    name: "Backhand and forehand topspins",
    slug: "backhand-and-forehand-topspins",
    creatorId: "00000000-0000-0000-0000-000000000000",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    description:
      "In this drill you will practise attacking a topspin return of serve and switching between backhand and forehand attacks. This is a fast five ball training drill, as the pace is added on the serve and maintained or increased with the return of serve. This is a good drill if you want to improve playing quick topspin rallies.",
    objectives: [],
    difficulty: "intermediate",
    categories: ["attack", "serve-receive", "match-play"],
    tips: [],
    graph: {
      nodes: {
        return: {
          id: "return",
          ball: {
            spin: "top",
            stroke: "backhand",
            placement: {
              depth: "long",
              direction: "backhand",
            },
            isOpponent: true,
          },
          next: ["backhand-attack"],
          prev: ["long-serve"],
        },
        "long-serve": {
          id: "long-serve",
          ball: {
            spin: "top",
            stroke: "serve",
            placement: {
              depth: "long",
              direction: "backhand",
            },
            isOpponent: false,
          },
          next: ["return"],
          prev: null,
        },
        "backhand-attack": {
          id: "backhand-attack",
          ball: {
            spin: "top",
            stroke: "backhand",
            placement: {
              depth: "long",
              direction: "backhand",
            },
            isOpponent: false,
          },
          next: ["block-to-forehand"],
          prev: ["return"],
        },
        "forehand-attack": {
          id: "forehand-attack",
          ball: {
            spin: "top",
            stroke: "forehand",
            placement: {
              depth: "long",
              direction: "forehand",
            },
            isOpponent: false,
          },
          next: [],
          prev: ["block-to-forehand"],
        },
        "block-to-forehand": {
          id: "block-to-forehand",
          ball: {
            spin: "block",
            stroke: "backhand",
            placement: {
              depth: "long",
              direction: "forehand",
            },
            isOpponent: true,
          },
          next: ["forehand-attack"],
          prev: ["backhand-attack"],
        },
      },
      entryPoint: "long-serve",
    },
  },
  {
    name: "Full Table Topspin to Backhand",
    slug: "full-table-topspin-to-backhand",
    creatorId: "00000000-0000-0000-0000-000000000000",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    description:
      "The active player plays topspin into passive player's backhand. Passive player blocks anywhere on the table.",
    objectives: [],
    difficulty: "intermediate",
    categories: ["attack", "serve-receive", "match-play"],
    tips: [
      "Focus on keeping the bat high for quick forehand to backhand transitions",
    ],
    graph: {
      nodes: {
        serve: {
          id: "serve",
          ball: {
            spin: "top",
            stroke: "forehand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: false,
          },
          next: ["block-to-forehand", "block-to-middle", "block-to-backhand"],
          prev: ["block-to-forehand", "block-to-middle", "block-to-backhand"],
        },
        "block-to-middle": {
          id: "block-to-middle",
          ball: {
            spin: "block",
            stroke: "backhand",
            placement: { depth: "long", direction: "middle" },
            isOpponent: true,
          },
          next: ["serve"],
          prev: ["serve"],
        },
        "block-to-backhand": {
          id: "block-to-backhand",
          ball: {
            spin: "block",
            stroke: "backhand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: true,
          },
          next: ["serve"],
          prev: ["serve"],
        },
        "block-to-forehand": {
          id: "block-to-forehand",
          ball: {
            spin: "block",
            stroke: "backhand",
            placement: { depth: "long", direction: "forehand" },
            isOpponent: true,
          },
          next: ["serve"],
          prev: ["serve"],
        },
      },
      entryPoint: "serve",
    },
  },
  {
    name: "Push, Loop, Counter",
    slug: "push-loop-counter",
    creatorId: "00000000-0000-0000-0000-000000000000",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    description:
      "Passive player serves and the active player pushes the first ball, loops the next and finally counters the final ball. Can easily be modified to focus on forehand or backhand.",
    categories: ["serve-receive", "attack", "match-play"],
    objectives: [],
    difficulty: "intermediate",
    tips: [],
    graph: {
      nodes: {
        loop: {
          id: "loop",
          ball: {
            spin: "top",
            stroke: "backhand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: false,
          },
          next: ["control"],
          prev: ["counter-push"],
        },
        push: {
          id: "push",
          ball: {
            spin: "back",
            stroke: "backhand",
            placement: { depth: "halflong", direction: "backhand" },
            isOpponent: false,
          },
          next: ["counter-push"],
          prev: ["serve-1"],
        },
        control: {
          id: "control",
          ball: {
            spin: "block",
            stroke: "backhand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: true,
          },
          next: ["counter"],
          prev: ["loop"],
        },
        counter: {
          id: "counter",
          ball: {
            spin: "top",
            stroke: "backhand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: false,
          },
          next: [],
          prev: ["control"],
        },
        "serve-1": {
          id: "serve-1",
          ball: {
            spin: "back",
            stroke: "serve",
            placement: { depth: "halflong", direction: "middle" },
            isOpponent: true,
          },
          next: ["push"],
          prev: null,
        },
        "counter-push": {
          id: "counter-push",
          ball: {
            spin: "back",
            stroke: "backhand",
            placement: { depth: "long", direction: "backhand" },
            isOpponent: true,
          },
          next: ["loop"],
          prev: ["push"],
        },
      },
      entryPoint: "serve-1",
    },
  },
  {
    name: "Push and Loop",
    slug: "push-and-loop",
    creatorId: "00000000-0000-0000-0000-000000000000",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    description:
      "Push to push backhand rally. Passive player can push to forehand at any time, active player loops and then goes into free play.",
    objectives: [],
    difficulty: "beginner",
    categories: ["serve-receive", "attack", "match-play"],
    tips: [
      "As the active player, actively watch the passive player for when they push to forehand.",
    ],
    graph: {
      nodes: {
        loop: {
          id: "loop",
          ball: {
            spin: "top",
            stroke: "forehand",
            placement: {
              depth: "long",
              direction: "forehand",
            },
            isOpponent: false,
          },
          next: [],
          prev: ["push-to-forehand"],
        },
        push: {
          id: "push",
          ball: {
            spin: "back",
            stroke: "backhand",
            placement: {
              depth: "halflong",
              direction: "backhand",
            },
            isOpponent: false,
          },
          next: ["push-back", "push-to-forehand"],
          prev: ["push-back"],
        },
        "push-back": {
          id: "push-back",
          ball: {
            spin: "back",
            stroke: "backhand",
            placement: {
              depth: "halflong",
              direction: "backhand",
            },
            isOpponent: true,
          },
          next: ["push"],
          prev: ["push"],
        },
        "push-to-forehand": {
          id: "push-to-forehand",
          ball: {
            spin: "back",
            stroke: "backhand",
            placement: {
              depth: "long",
              direction: "forehand",
            },
            isOpponent: true,
          },
          next: ["loop"],
          prev: ["push"],
        },
      },
      entryPoint: "push",
    },
  },
  {
    name: "3 Point Forehand",
    slug: "3-point-forehand",
    creatorId: "00000000-0000-0000-0000-000000000000",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    description:
      "Active player plays forehand from forehand, middle and backhand continuously.",
    objectives: [],
    difficulty: "advanced",
    categories: ["attack", "consistency", "technique"],
    tips: [
      "Focus on forehand placement and consistency",
      "Use proper footwork and balance",
      "Practice with varying speeds to challenge yourself",
    ],
    graph: {
      nodes: {
        "block-to-middle": {
          id: "block-to-middle",
          ball: {
            spin: "block",
            stroke: "backhand",
            placement: {
              depth: "long",
              direction: "middle",
            },
            isOpponent: true,
          },
          next: ["forehand-from-middle"],
          prev: ["forehand-from-forehand"],
        },
        "block-to-backhand": {
          id: "block-to-backhand",
          ball: {
            spin: "block",
            stroke: "backhand",
            placement: {
              depth: "long",
              direction: "backhand",
            },
            isOpponent: true,
          },
          next: ["forehand-from-backhand"],
          prev: ["forehand-from-middle"],
        },
        "block-to-forehand": {
          id: "block-to-forehand",
          ball: {
            spin: "block",
            stroke: "backhand",
            placement: {
              depth: "long",
              direction: "forehand",
            },
            isOpponent: true,
          },
          next: ["forehand-from-forehand"],
          prev: ["forehand-from-backhand"],
        },
        "forehand-from-middle": {
          id: "forehand-from-middle",
          ball: {
            spin: "top",
            stroke: "forehand",
            placement: {
              depth: "long",
              direction: "backhand",
            },
            isOpponent: false,
          },
          next: ["block-to-backhand"],
          prev: ["block-to-middle"],
        },
        "forehand-from-backhand": {
          id: "forehand-from-backhand",
          ball: {
            spin: "top",
            stroke: "forehand",
            placement: {
              depth: "long",
              direction: "backhand",
            },
            isOpponent: false,
          },
          next: ["block-to-forehand"],
          prev: ["block-to-backhand"],
        },
        "forehand-from-forehand": {
          id: "forehand-from-forehand",
          ball: {
            spin: "top",
            stroke: "forehand",
            placement: {
              depth: "long",
              direction: "backhand",
            },
            isOpponent: false,
          },
          next: ["block-to-middle"],
          prev: ["block-to-forehand"],
        },
      },
      entryPoint: "forehand-from-forehand",
    },
  },
  {
    name: "Touch, Push or Flick",
    slug: "touch-push-or-flick",
    creatorId: "00000000-0000-0000-0000-000000000000",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    description:
      "One player serves short backspin, the other player can touch it short or push or flick it into the server's crossover point. The point then goes free.",
    objectives: [],
    difficulty: "intermediate",
    categories: ["serve-receive", "attack", "match-play"],
    tips: [],
    graph: {
      nodes: {
        push: {
          id: "push",
          ball: {
            spin: "back",
            stroke: "forehand",
            placement: {
              depth: "long",
              direction: "middle",
            },
            isOpponent: true,
          },
          next: [],
          prev: ["serve"],
        },
        flick: {
          id: "flick",
          ball: {
            spin: "top",
            stroke: "backhand",
            placement: {
              depth: "long",
              direction: "middle",
            },
            isOpponent: true,
          },
          next: [],
          prev: ["serve"],
        },
        serve: {
          id: "serve",
          ball: {
            spin: "back",
            stroke: "serve",
            placement: {
              depth: "short",
              direction: "middle",
            },
            isOpponent: false,
          },
          next: ["touch", "push", "flick"],
          prev: null,
        },
        touch: {
          id: "touch",
          ball: {
            spin: "back",
            stroke: "forehand",
            placement: {
              depth: "short",
              direction: "middle",
            },
            isOpponent: true,
          },
          next: [],
          prev: ["serve"],
        },
      },
      entryPoint: "serve",
    },
  },
  {
    name: "Serve and loop down the line",
    slug: "serve-and-loop-down-the-line",
    creatorId: "00000000-0000-0000-0000-000000000000",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    description:
      "Serve short backspin to forehand, opponent pushes long to forehand, play a loop down the line to the opponent's backhand.",
    objectives: ["Play a loop down the line to the opponent's backhand."],
    difficulty: "beginner",
    categories: ["serve-receive", "attack", "match-play"],
    tips: [
      "Don't wait too long to loop. Playing this shot quickly will catch the opponent out recovering from the short forehand.",
    ],
    graph: {
      nodes: {
        loop: {
          id: "loop",
          ball: {
            spin: "top",
            stroke: "forehand",
            placement: {
              depth: "long",
              direction: "backhand",
            },
            isOpponent: false,
          },
          next: [],
          prev: ["push"],
        },
        push: {
          id: "push",
          ball: {
            spin: "back",
            stroke: "forehand",
            placement: {
              depth: "long",
              direction: "forehand",
            },
            isOpponent: true,
          },
          next: ["loop"],
          prev: ["serve-1"],
        },
        "serve-1": {
          id: "serve-1",
          ball: {
            spin: "back",
            stroke: "serve",
            placement: {
              depth: "short",
              direction: "forehand",
            },
            isOpponent: false,
          },
          next: ["push"],
          prev: null,
        },
      },
      entryPoint: "serve-1",
    },
  },
];

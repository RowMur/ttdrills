import { Drill } from "@/types";

export const COMPREHENSIVE_DRILLS: Drill[] = [
  {
    name: "2 Backhands, 2 Forehands",
    slug: "2-backhands-2-forehands",
    description:
      "A classic consistency drill alternating between backhand and forehand strokes to develop rhythm and footwork.",
    objectives: [
      "Improve backhand to forehand transition",
      "Develop consistent stroke rhythm",
      "Practice basic footwork patterns",
      "Build rally endurance",
    ],
    difficulty: "beginner",
    categories: ["consistency", "technique", "footwork"],
    tips: [
      "Focus on smooth transitions between strokes",
      "Keep your feet moving throughout the drill",
      "Maintain consistent contact point for both strokes",
      "Start slow and gradually increase speed",
    ],
    duration: "5-10 minutes",
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
    name: "Falkenberg Drill",
    slug: "falkenberg",
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
  {
    name: "Straights and Xs",
    slug: "straights-and-xs",
    description: "abcd",
    objectives: ["Learn"],
    difficulty: "beginner",
    categories: ["footwork"],
    tips: ["Tip"],
    graph: {
      entryPoint: "node1",
      nodes: {
        node1: {
          id: "node1",
          prev: ["node4"],
          next: ["node2"],
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
        node2: {
          id: "node2",
          prev: ["node1"],
          next: ["node3"],
          ball: {
            stroke: "backhand",
            spin: "top",
            placement: {
              depth: "long",
              direction: "backhand",
            },
            isOpponent: true,
          },
        },
        node3: {
          id: "node3",
          prev: ["node2"],
          next: ["node4"],
          ball: {
            stroke: "forehand",
            spin: "top",
            placement: {
              depth: "long",
              direction: "forehand",
            },
            isOpponent: false,
          },
        },
        node4: {
          id: "node4",
          prev: ["node3"],
          next: ["node1"],
          ball: {
            stroke: "forehand",
            spin: "top",
            placement: {
              depth: "long",
              direction: "forehand",
            },
            isOpponent: true,
          },
        },
      },
    },
  },
];

import { ShotType, Spin, DifficultyLevel, DrillCategory } from "@/types";

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

export const difficultyDisplay: Record<DifficultyLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export const categoryDisplay: Record<DrillCategory, string> = {
  footwork: "Footwork",
  attack: "Attack",
  defense: "Defense",
  "serve-receive": "Serve & Receive",
  multiball: "Multiball",
  "match-play": "Match Play",
  technique: "Technique",
  consistency: "Consistency",
};

// Import comprehensive drill data
export { COMPREHENSIVE_DRILLS as DRILLS } from "./comprehensiveDrills";

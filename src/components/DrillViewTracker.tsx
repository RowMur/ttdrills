"use client";

import { useEffect } from "react";
import { trackDrillView } from "@/lib/analytics";
import { Drill } from "@/types";

interface DrillViewTrackerProps {
  drill: Drill;
}

export const DrillViewTracker = ({ drill }: DrillViewTrackerProps) => {
  useEffect(() => {
    trackDrillView(drill.name, drill.slug, drill.difficulty, drill.categories);
  }, [drill.name, drill.slug, drill.difficulty, drill.categories]);

  return null; // This component doesn't render anything
};

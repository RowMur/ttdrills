import { Repetition } from "@/types";

export const getRepetitionDisplay = (repetition: Repetition): string => {
  if (typeof repetition === "number") {
    return repetition.toString() + "x";
  }

  if (repetition.min === repetition.max) {
    return repetition.min.toString() + "x";
  }

  return `${repetition.min}-${repetition.max}x`;
};

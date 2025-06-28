import { Placement } from "@/types";

export const getSectionDimensions = (height: number, width: number) => {
  return {
    sectionWidth: width / 3,
    sectionHeight: height / 6,
  };
};

export const getCoords = (
  tableHeight: number,
  tableWidth: number,
  placement: Placement,
  isOpponent: boolean
): [number, number, number, number] => {
  const { sectionWidth, sectionHeight } = getSectionDimensions(
    tableHeight,
    tableWidth
  );
  let x =
    placement.direction === "forehand"
      ? (5 * sectionWidth) / 2
      : placement.direction === "middle"
      ? (3 * sectionWidth) / 2
      : sectionWidth / 2;

  let y =
    tableHeight -
    (placement.depth === "long"
      ? sectionHeight / 2
      : placement.depth === "halflong"
      ? (3 * sectionHeight) / 2
      : (5 * sectionHeight) / 2);
  if (isOpponent) {
    x = tableWidth - x;
    y = tableHeight - y;
  }
  const topLeftX = x - sectionWidth / 2;
  const topLeftY = y - sectionHeight / 2;
  return [x, y, topLeftX, topLeftY];
};

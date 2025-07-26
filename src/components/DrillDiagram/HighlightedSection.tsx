import { Placement, Spin } from "@/types";
import { getSectionDimensions, getCoords } from "@/utils/coords";

type Props = {
  tableHeight: number;
  tableWidth: number;
  spin: Spin;
  placement: Placement;
  isOpponent: boolean;
};

export const HighlightedSection = (props: Props) => {
  const { sectionWidth, sectionHeight } = getSectionDimensions(
    props.tableHeight,
    props.tableWidth
  );

  const [, , endTopLeftX, endTopLeftY] = getCoords(
    props.tableHeight,
    props.tableWidth,
    props.placement,
    props.isOpponent
  );

  return (
    <rect
      x={endTopLeftX}
      y={endTopLeftY}
      width={sectionWidth}
      height={sectionHeight}
      className={
        props.spin === "top"
          ? "fill-red"
          : props.spin === "back"
          ? "fill-green"
          : "fill-light-grey"
      }
    />
  );
};

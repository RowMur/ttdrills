import { Ball } from "@/types";
import { getSectionDimensions, getCoords } from "@/utils/coords";

type Props = {
  tableHeight: number;
  tableWidth: number;
  ball: Ball;
  isOpponent?: boolean;
};

export const HighlightedSection = (props: Props) => {
  const { sectionWidth, sectionHeight } = getSectionDimensions(
    props.tableHeight,
    props.tableWidth
  );

  const [, , endTopLeftX, endTopLeftY] = getCoords(
    props.tableHeight,
    props.tableWidth,
    props.ball.placement,
    props.isOpponent || false
  );

  return (
    <rect
      x={endTopLeftX}
      y={endTopLeftY}
      width={sectionWidth}
      height={sectionHeight}
      className={
        props.ball.spin === "top"
          ? "fill-red"
          : props.ball.spin === "back"
          ? "fill-green"
          : "fill-slate"
      }
    />
  );
};

const NET_HEIGHT = 9;

type Props = {
  height: number;
  width: number;
};

export const Table = ({ height, width }: Props) => {
  return (
    <>
      <rect
        width="100%"
        height="100%"
        className="fill-table-blue stroke-2 stroke-white"
      />
      <line
        x1={width / 2}
        y1="0"
        x2={width / 2}
        y2={height}
        stroke="white"
        strokeWidth="1"
      />
      <line
        x1="0"
        y1={height / 2 - NET_HEIGHT}
        x2={width}
        y2={height / 2 - NET_HEIGHT}
        stroke="white"
        strokeWidth="1"
      />
      {Array.from({ length: NET_HEIGHT - 1 }).map((_, i) => (
        <line
          key={i}
          // Don't go over the border
          x1="1"
          x2={width - 1}
          y1={height / 2 - NET_HEIGHT + i + 1}
          y2={height / 2 - NET_HEIGHT + i + 1}
          stroke="black"
          strokeWidth="1"
          strokeDasharray="1,1"
          strokeDashoffset={i % 2 === 0 ? 1 : 0}
        />
      ))}
    </>
  );
};

type Props = {
  text: string;
};

export const Tag = (props: Props) => {
  return (
    <div className="bg-green rounded px-1 py-0.5 text-xs">{props.text}</div>
  );
};

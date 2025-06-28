import { PropsWithChildren } from "react";

type Props = {
  onClick?: () => void;
  disabled?: boolean;
};

export const ControlButton = ({
  children,
  ...rest
}: PropsWithChildren<Props>) => {
  return (
    <button
      className="text-white disabled:text-light-grey hover:not-disabled:text-light-grey hover:not-disabled:cursor-pointer disabled:cursor-not-allowed"
      {...rest}
    >
      {children}
    </button>
  );
};

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
      className="text-text disabled:text-text-subtle hover:not-disabled:text-primary hover:not-disabled:cursor-pointer disabled:cursor-not-allowed"
      {...rest}
    >
      {children}
    </button>
  );
};

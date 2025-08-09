import { PropsWithChildren, ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export const ControlButton = ({
  children,
  className,
  ...rest
}: PropsWithChildren<Props>) => {
  return (
    <button
      className={`text-text disabled:text-text-subtle hover:not-disabled:text-primary hover:not-disabled:cursor-pointer disabled:cursor-not-allowed ${
        className || ""
      }`}
      {...rest}
    >
      {children}
    </button>
  );
};

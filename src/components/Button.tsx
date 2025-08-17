import { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "success" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variantStyles = {
  primary: "bg-primary text-white hover:bg-primary-dark focus:ring-primary",
  secondary:
    "bg-surface-light text-text hover:bg-surface-dark focus:ring-border",
  success: "bg-success text-white hover:bg-success-dark focus:ring-success",
  danger: "bg-danger text-white hover:bg-danger-dark focus:ring-danger",
  outline:
    "bg-transparent border border-border text-text hover:bg-surface-light focus:ring-border",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export const Button = ({
  children,
  onClick,
  disabled = false,
  className = "",
  type = "button",
  variant = "primary",
  size = "md",
}: Props) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonStyles}
    >
      {children}
    </button>
  );
};

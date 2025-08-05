import React from "react";
import { useSelector } from "react-redux";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "light"
    | "dark"
    | "outline"
    | "hi";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const getButtonStyle = (
  variant: string,
  color: string,
  size: string
): React.CSSProperties => {
  let background = color;
  let colorText = "#fff";
  let border = "none";
  if (variant === "secondary") {
    background = "#f3f4f8";
    colorText = color;
    border = `1px solid ${color}`;
  } else if (variant === "danger") {
    background = "#e74c3c";
    colorText = "#fff";
  } else if (variant === "light") {
    background = "#fff";
    colorText = color;
    border = `1px solid ${color}`;
  } else if (variant === "dark") {
    background = "#181A1B";
    colorText = "#fff";
  } else if (variant === "outline") {
    background = "transparent";
    colorText = color;
    border = `1px solid ${color}`;
  } else if (variant === "hi") {
    background = "transparent";
    colorText = color;
  }
  let padding = "8px 20px";
  let fontSize = "1rem";
  if (size === "sm") {
    padding = "4px 12px";
    fontSize = "0.9rem";
  } else if (size === "lg") {
    padding = "12px 28px";
    fontSize = "1.1rem";
  }
  return {
    background,
    color: colorText,
    border,
    borderRadius: 6,
    padding,
    fontSize,
    cursor: "pointer",
    fontWeight: 600,
    transition: "background 0.2s, color 0.2s",
    outline: "none"
  };
};

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  style,
  ...props
}) => {
  const primaryColor = useSelector((state: any) => state.theme.primaryColor);
  return (
    <button
      style={{ ...getButtonStyle(variant, primaryColor, size), ...style }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

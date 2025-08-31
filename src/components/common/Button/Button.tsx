// Em src/components/common/Button/Button.tsx
import React from "react";
import styles from "./Button.module.scss";

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "danger"; // Exemplo de prop opcional com tipos
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
}) => {
  const buttonClass = variant === "danger" ? styles.danger : styles.primary;
  return (
    <button className={`${styles.btn} ${buttonClass}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;

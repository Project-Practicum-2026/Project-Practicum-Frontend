import type { FC, PropsWithChildren } from "react";
import styles from "./Button.module.scss";

interface IButtonProps {
  variant?: "primary" | "success" | "danger";
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string; // Щоб можна було додавати відступи ззовні
}

const Button: FC<PropsWithChildren<IButtonProps>> = ({
  children,
  variant = "primary", // Значення за замовчуванням
  onClick,
  className = "",
}) => {
  // Формуємо рядок з класами. Завжди є базовий .button, і додається модифікатор
  const buttonClass = `${styles.button} ${styles[`button--${variant}`]} ${className}`;

  return (
    <button className={buttonClass} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;

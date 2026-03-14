import type { FC, PropsWithChildren } from "react";
import styles from "./Button.module.scss";

interface IButtonProps {
  variant?: "primary" | "success" | "danger" | "default";
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string; // Щоб можна було додавати відступи ззовні
}

const Button: FC<PropsWithChildren<IButtonProps>> = ({
  children,
  variant = "default", // Значення за замовчуванням
  onClick,
  className = "",
}) => {
  // Якщо варіант 'default', не додаємо жодного додаткового класу-модифікатора
  const modifierClass =
    variant !== "default" ? styles[`button--${variant}`] : "";

  // Збираємо фінальний рядок з класами
  const buttonClass = `${styles.button} ${modifierClass} ${className}`.trim();

  return (
    <button className={buttonClass} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;

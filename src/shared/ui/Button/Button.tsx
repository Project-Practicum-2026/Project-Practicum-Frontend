import type { FC, PropsWithChildren } from "react";
import styles from "./Button.module.scss";
import type { EButtonTypes } from "../../types/button.types";
import { EButtonVariants } from "../../types/button.types";

interface IButtonProps {
  variant?: EButtonVariants;
  type?: EButtonTypes;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const Button: FC<PropsWithChildren<IButtonProps>> = ({
  children,
  variant = EButtonVariants.DEFAULT, // Значення за замовчуванням
  onClick,
  className = "",
  disabled = false,
}) => {
  // Якщо варіант 'default', не додаємо жодного додаткового класу-модифікатора
  const modifierClass =
    variant !== EButtonVariants.DEFAULT ? styles[`button--${variant}`] : "";

  // Збираємо фінальний рядок з класами
  const buttonClass =
    `${styles.button} ${modifierClass} ${disabled && styles["button--disabled"]} ${className}`.trim();

  return (
    <button className={buttonClass} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;

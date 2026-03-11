import type { FC, PropsWithChildren } from "react";

interface IButtonProps {
  variant?: "primary" | "secondary";
  onClick: () => void;
}

const Button: FC<PropsWithChildren & IButtonProps> = ({ children, variant, onClick }) => {
  return (
    <button
      className={variant === "primary" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}
      onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;

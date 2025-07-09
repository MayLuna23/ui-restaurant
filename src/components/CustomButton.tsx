// src/components/CustomButton.tsx
import React from "react";

interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  isPrimary?: boolean;
  onClick?: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  isPrimary = true,
  onClick,
}) => {
  return (
    <button
    style={{fontSize: "20px"}}
      className={`${
        isPrimary ? "primary-button" : "secondary-button"
      } w-60 rounded-b-full`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default CustomButton;

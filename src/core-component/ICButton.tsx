import React, { ButtonHTMLAttributes } from "react";
import { animateSpinIcon } from "../assets/icons/SvgIconList";
// import "./CustomButton.css"; // Import your custom CSS for the button styles

type TCustomButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  ClassName?: string;
  containerClassName?: string;
  loading?: boolean;
};

const ICButton: React.FC<TCustomButtonProps> = ({
  children,
  className,
  containerClassName,
  loading,
  ...rest
}) => {
  return (
    <button
      className={`custom-button typo-btn-primary ${className}`}
      type="submit"
      {...rest}
    >
      {loading ? (
        <div className="flex justify-center">
          <div className="h-5 w-5">{animateSpinIcon}</div>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default ICButton;

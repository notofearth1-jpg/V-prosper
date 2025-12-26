import React, { ChangeEvent, InputHTMLAttributes } from "react";
interface ICustomTextareaProps
  extends InputHTMLAttributes<HTMLTextAreaElement> {
  leading?: JSX.Element;
  trailing?: JSX.Element;
  className?: string;
  rows?: number;
  cols?: number;
  containerClassName?: string;
  errorMessage?: any;
  label?: string;
}

const ICTextArea: React.FC<ICustomTextareaProps> = ({
  leading,
  trailing,
  className,
  rows = 5,
  cols = 50,
  containerClassName,
  errorMessage,
  label,
  required,
  ...inputProps
}) => {
  return (
    <div className="floating-text-area">
      <div
        className={`custom-text-area-container  ${
          errorMessage ? "error-border" : ""
        }${containerClassName}`}
      >
        <div className="flex pb-3 w-full">
          <textarea
            className="custom-text-area typo-input-value"
            rows={rows}
            cols={cols}
            {...inputProps}
          />
          {label && (
            <label className="pl-1 typo-floating-label">
              {label + (required ? "*" : "")}
            </label>
          )}
        </div>
        {trailing && <div className="text-input-trailing ">{trailing}</div>}
      </div>
      {errorMessage && <div className="typo-error">{errorMessage}</div>}
    </div>
  );
};

export default ICTextArea;

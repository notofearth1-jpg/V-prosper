import React, { InputHTMLAttributes } from "react";

export interface ICustomInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  leading?: JSX.Element | string;
  trailing?: JSX.Element | string;
  error?: boolean;
  containerClassName?: string;
  errorMessage?: any;
  label?: string;
}

const ICTextInput: React.FC<ICustomInputProps> = ({
  leading,
  trailing,
  error,
  errorMessage,
  containerClassName,
  label,
  required,
  ...inputProps
}) => {
  return (
    <>
      <div className="floating-input w-full input-box ">
        <div
          className={`custom-text-input-container h-input ${
            errorMessage ? "error-border" : ""
          } ${containerClassName}`}
        >
          {leading && <div className="text-input-leading ">{leading}</div>}
          <div className=" flex w-full ">
            <input
              className="custom-text-input typo-input-placeholder typo-input-value"
              {...inputProps}
              placeholder=""
            />
            <label className=" pl-1 typo-floating-label bg-red-600">
              {label + (required ? "*" : "")}
            </label>
          </div>
          {trailing && <div className="text-input-trailing">{trailing}</div>}
        </div>
      </div>
      {errorMessage && <div className="typo-error">{errorMessage}</div>}
    </>
  );
};

export default ICTextInput;

import React, { InputHTMLAttributes, LegacyRef, ReactNode } from "react";

export interface ICustomInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  containerClassName?: string;
  errorMessage?: any;
  leading?: ReactNode;
  label?: string;
  reference?: LegacyRef<HTMLInputElement>;
  isActive?: boolean;
  borderNone?: boolean;
  textClass?: string;
  borderColor?: boolean;
  customErrorText?: boolean;
}

const ICTextInput: React.FC<ICustomInputProps> = ({
  error,
  errorMessage,
  containerClassName,
  leading,
  label,
  reference,
  isActive,
  borderNone,
  textClass,
  borderColor,
  customErrorText,
  ...inputProps
}) => {
  return (
    <>
      <div
        className={`w-full flex ${
          errorMessage ? "error-border" : ""
        } ${containerClassName}`}
      >
        {leading && <div className="pt-2">{leading}</div>}
        <div className={`${leading ? "ml-5" : ""} w-full`}>
          {label && (
            <p className={`${isActive ? "" : `typo-input-label`}`}>{label}</p>
          )}
          <input
            ref={reference}
            title={inputProps?.placeholder}
            className={`h-input mb-0 pb-0 w-full ${
              isActive ? "!text-white" : ""
            }pt-1 bg-transparent border-b-2 ${
              errorMessage
                ? "error-border"
                : ` ${borderNone ? "" : "border-skin-input-active"} ${
                    borderColor ? "border-color-black" : ""
                  }${!isActive ? `` : "border-skin-input-active"}`
            }  outline-none ${
              isActive
                ? "text-white"
                : `typo-input-placeholder typo-input-value ${
                    borderColor ? "login-placeholder" : ""
                  }`
            } ${textClass} `}
            {...inputProps}
          />
          {errorMessage && (
            <div
              className={`typo-error ${
                customErrorText ? "md:!text-[16px] text-[12px]" : ""
              }`}
            >
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ICTextInput;

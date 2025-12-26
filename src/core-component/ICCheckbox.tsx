import React from "react";

type TICCheckbox = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  className?: string;
  label?: string;
  labelComponent?: JSX.Element;
};

const ICCheckbox: React.FC<TICCheckbox> = ({
  className,
  label,
  labelComponent,
  ...inputProps
}) => {
  return (
    <div className="flex items-center">
      <input
        {...inputProps}
        type="checkbox"
        className={`w-4 h-4 comman-black-text bg-skin-selected-interests border-skin-selected-interests focus:ring-0 dark:focus:ring-0 focus:border-0 checkbox-color ${
          className ? className : ""
        }`}
      />
      <label
        htmlFor={inputProps.id}
        className="ms-2 text-sm font-medium comman-black-text"
      >
        {label || labelComponent}
      </label>
    </div>
  );
};

export default ICCheckbox;

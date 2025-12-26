import React from "react";

interface ICLableProps {
  label: string;
  customFont?: boolean;
}

const ICLable: React.FC<ICLableProps> = ({ label, customFont }) => {
  return (
    <div className="free-service">
      <span
        className={`free-service-label ${customFont ? "!text-[16px]" : ""}`}
      >
        {label}
      </span>
    </div>
  );
};

export default ICLable;

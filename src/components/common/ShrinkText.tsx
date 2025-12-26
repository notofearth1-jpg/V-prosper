import React from "react";

interface ITruncateProps {
  text: string;
  maxLength: number;
  toLowercase?: boolean;
  className?: string;
}

const ShrinkText: React.FC<ITruncateProps> = ({
  text,
  maxLength,
  toLowercase = false,
  className,
}) => {
  const truncatedText = toLowercase ? text.toLowerCase() : text;

  return (
    <span className={`${className ? className : "comman-black-text"}`}>
      {truncatedText && truncatedText.length > maxLength
        ? truncatedText.slice(0, maxLength) + "..."
        : truncatedText}
    </span>
  );
};

export default ShrinkText;

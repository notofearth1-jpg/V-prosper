import React from "react";
import { Line } from "rc-progress";

interface CustomProgressLineProps {
  percent: number;
  strokeWidth: number;
}

const ICProgressLine: React.FC<CustomProgressLineProps> = ({
  percent,
  strokeWidth,
}) => {
  const strokeColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--progress-stroke-color")
    .trim();

  return (
    <Line
      percent={percent}
      strokeWidth={strokeWidth}
      strokeColor={strokeColor}
    />
  );
};

export default ICProgressLine;
